"""
Playwright-based scraper for AmbitionBox salary data.

Navigates ambitionbox.com/salaries, handles pagination, extracts raw
salary records with per-record error handling.  Rate-limited with
random delays and user-agent rotation.

NOTE: AmbitionBox may block automated scraping.  The code handles
common blocking scenarios (403, captcha walls, empty pages) gracefully
and logs them rather than crashing.
"""

from __future__ import annotations

import asyncio
import logging
import random
import re
from typing import Any

from playwright.async_api import (
    Browser,
    BrowserContext,
    Page,
    Playwright,
    async_playwright,
    TimeoutError as PlaywrightTimeout,
)

from .user_agents import USER_AGENTS

logger = logging.getLogger(__name__)

# ── Configuration ───────────────────────────────────────────────────

# Target companies for salary data (slug used in AmbitionBox URLs)
TARGET_COMPANIES: list[dict[str, str]] = [
    {"name": "TCS", "slug": "tcs"},
    {"name": "Infosys", "slug": "infosys"},
    {"name": "Wipro", "slug": "wipro"},
    {"name": "Amazon", "slug": "amazon"},
    {"name": "Google", "slug": "google"},
    {"name": "Microsoft", "slug": "microsoft"},
    {"name": "Flipkart", "slug": "flipkart"},
    {"name": "Accenture", "slug": "accenture"},
    {"name": "HCL Technologies", "slug": "hcl-technologies"},
    {"name": "Cognizant", "slug": "cognizant"},
    {"name": "Tech Mahindra", "slug": "tech-mahindra"},
    {"name": "IBM", "slug": "ibm"},
    {"name": "Capgemini", "slug": "capgemini"},
    {"name": "Oracle", "slug": "oracle"},
    {"name": "Adobe", "slug": "adobe"},
    {"name": "Samsung", "slug": "samsung"},
    {"name": "Deloitte", "slug": "deloitte"},
    {"name": "Goldman Sachs", "slug": "goldman-sachs"},
    {"name": "JP Morgan", "slug": "jp-morgan-chase"},
    {"name": "Uber", "slug": "uber"},
]

BASE_URL = "https://www.ambitionbox.com/salaries/{slug}-salaries"
MIN_DELAY = 1.5
MAX_DELAY = 4.0
MAX_PAGES_PER_COMPANY = 3    # Keep it conservative to avoid blocking
PAGE_TIMEOUT_MS = 25_000
MAX_RETRIES = 2


# ── Helpers ─────────────────────────────────────────────────────────

def _random_delay() -> float:
    """Return a random delay between MIN_DELAY and MAX_DELAY seconds."""
    return random.uniform(MIN_DELAY, MAX_DELAY)


def _pick_user_agent() -> str:
    """Pick a random user-agent string."""
    return random.choice(USER_AGENTS)


def _parse_salary_text(text: str) -> dict[str, Any]:
    """
    Parse salary text like '₹ 5.2 Lakhs' or '₹ 12 - 18 Lakhs' into
    a structured dict with currency, min, max, and midpoint.
    """
    result: dict[str, Any] = {"raw": text, "currency": "INR"}

    # Normalise
    cleaned = text.replace(",", "").replace("₹", "").strip()

    # Match range: "5.2 - 8.1 Lakhs" or "12 - 18 LPA"
    range_match = re.search(
        r"([\d.]+)\s*[-–to]+\s*([\d.]+)\s*(lakhs?|lpa|l|cr|crore)?",
        cleaned,
        re.IGNORECASE,
    )
    if range_match:
        low = float(range_match.group(1))
        high = float(range_match.group(2))
        unit = (range_match.group(3) or "lakhs").lower()
        multiplier = 10_000_000 if unit.startswith("cr") else 100_000
        result["min_salary"] = int(low * multiplier)
        result["max_salary"] = int(high * multiplier)
        result["midpoint"] = int((low + high) / 2 * multiplier)
        return result

    # Match single: "5.2 Lakhs"
    single_match = re.search(
        r"([\d.]+)\s*(lakhs?|lpa|l|cr|crore)?",
        cleaned,
        re.IGNORECASE,
    )
    if single_match:
        val = float(single_match.group(1))
        unit = (single_match.group(2) or "lakhs").lower()
        multiplier = 10_000_000 if unit.startswith("cr") else 100_000
        result["midpoint"] = int(val * multiplier)
        return result

    # Fallback: try bare number
    try:
        result["midpoint"] = int(float(cleaned))
    except ValueError:
        result["midpoint"] = None

    return result


def _parse_experience(text: str) -> int | None:
    """
    Parse experience text like '3-5 Yrs' or '2 Years' into midpoint int.
    """
    if not text:
        return None

    range_match = re.search(r"(\d+)\s*[-–to]+\s*(\d+)", text)
    if range_match:
        low = int(range_match.group(1))
        high = int(range_match.group(2))
        mid = (low + high) // 2
        return max(mid, 1)

    single_match = re.search(r"(\d+)", text)
    if single_match:
        return max(int(single_match.group(1)), 1)

    return None


# ── Page-level extraction ───────────────────────────────────────────

async def _extract_salary_rows(page: Page, company_name: str) -> list[dict[str, Any]]:
    """
    Extract salary data from the current AmbitionBox salary listing page.

    This function uses multiple CSS selector strategies to handle
    AmbitionBox's evolving DOM structure.
    """
    records: list[dict[str, Any]] = []

    # Strategy 1: Try structured salary cards
    selectors = [
        # Modern layout — card-based
        "div.salary-card",
        "div[class*='salary']",
        # Table-based layout
        "table.salary-table tbody tr",
        "table tbody tr",
        # List-based layout
        "div[class*='SalaryCard']",
        "a[href*='/salaries/']",
    ]

    for selector in selectors:
        try:
            elements = await page.query_selector_all(selector)
            if not elements:
                continue

            logger.debug(
                "Found %d elements with selector '%s' for %s",
                len(elements),
                selector,
                company_name,
            )

            for elem in elements:
                try:
                    text_content = await elem.inner_text()
                    if not text_content or len(text_content.strip()) < 10:
                        continue

                    # Try to extract structured data from the element
                    record = await _parse_salary_element(elem, text_content, company_name)
                    if record and record.get("raw_role"):
                        records.append(record)

                except Exception as exc:
                    logger.debug(
                        "Failed to parse one salary element for %s: %s",
                        company_name,
                        exc,
                    )
                    continue

            if records:
                break  # Found records with this selector, stop trying

        except Exception as exc:
            logger.debug("Selector '%s' failed for %s: %s", selector, company_name, exc)
            continue

    # Strategy 2: Fallback — full-page text mining
    if not records:
        records = await _mine_page_text(page, company_name)

    return records


async def _parse_salary_element(
    elem: Any,
    text: str,
    company_name: str,
) -> dict[str, Any] | None:
    """
    Parse a single salary element (card / row) into a raw record dict.
    """
    lines = [ln.strip() for ln in text.split("\n") if ln.strip()]
    if len(lines) < 2:
        return None

    record: dict[str, Any] = {
        "raw_company": company_name,
        "raw_role": None,
        "raw_salary_text": None,
        "raw_location": None,
        "raw_experience": None,
    }

    # Heuristic parsing from text lines
    for line in lines:
        lower = line.lower()

        # Salary detection
        if any(kw in lower for kw in ["lakh", "lpa", "₹", "inr", "salary", "cr"]):
            if record["raw_salary_text"] is None:
                record["raw_salary_text"] = line

        # Experience detection
        elif any(kw in lower for kw in ["yr", "year", "exp", "experience"]):
            if record["raw_experience"] is None:
                record["raw_experience"] = line

        # Location detection (common Indian cities)
        elif any(
            city in lower
            for city in [
                "bangalore", "bengaluru", "mumbai", "delhi", "hyderabad",
                "pune", "chennai", "kolkata", "gurgaon", "gurugram",
                "noida", "ahmedabad", "jaipur", "kochi", "chandigarh",
                "india", "remote",
            ]
        ):
            if record["raw_location"] is None:
                record["raw_location"] = line

        # Role detection — first line that isn't salary/exp/location
        elif (
            record["raw_role"] is None
            and len(line) > 3
            and not line.startswith("(")
            and not line.isdigit()
        ):
            record["raw_role"] = line

    # If we still don't have a role, use first line
    if record["raw_role"] is None and lines:
        record["raw_role"] = lines[0]

    return record if record["raw_role"] else None


async def _mine_page_text(page: Page, company_name: str) -> list[dict[str, Any]]:
    """
    Last-resort: mine the full page text for salary-like patterns.
    """
    records: list[dict[str, Any]] = []
    try:
        body_text = await page.inner_text("body")
        # Look for patterns like "Software Engineer  ₹ 5 - 8 Lakhs"
        pattern = re.compile(
            r"([A-Z][A-Za-z\s\-/]+?)\s+"          # role title
            r"(₹[\s\d.,\-–toLakshCrpPA]+)",       # salary
            re.MULTILINE,
        )
        for match in pattern.finditer(body_text):
            role = match.group(1).strip()
            salary = match.group(2).strip()
            if len(role) > 3 and len(role) < 80:
                records.append({
                    "raw_company": company_name,
                    "raw_role": role,
                    "raw_salary_text": salary,
                    "raw_location": None,
                    "raw_experience": None,
                })
    except Exception as exc:
        logger.debug("Page text mining failed for %s: %s", company_name, exc)

    return records


# ── Company-level scraping ──────────────────────────────────────────

async def _scrape_company(
    context: BrowserContext,
    company: dict[str, str],
) -> list[dict[str, Any]]:
    """
    Scrape salary data for a single company across multiple pages.
    """
    all_records: list[dict[str, Any]] = []
    company_name = company["name"]
    company_slug = company["slug"]

    for page_num in range(1, MAX_PAGES_PER_COMPANY + 1):
        url = BASE_URL.format(slug=company_slug)
        if page_num > 1:
            url += f"?page={page_num}"

        page: Page | None = None
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                page = await context.new_page()

                logger.info(
                    "Scraping %s page %d (attempt %d): %s",
                    company_name, page_num, attempt, url,
                )

                response = await page.goto(url, timeout=PAGE_TIMEOUT_MS, wait_until="domcontentloaded")

                if response is None:
                    logger.warning("No response for %s page %d", company_name, page_num)
                    await page.close()
                    continue

                status = response.status
                if status == 403:
                    logger.warning(
                        "🚫 Blocked (403) scraping %s page %d — skipping company",
                        company_name,
                        page_num,
                    )
                    await page.close()
                    return all_records

                if status == 429:
                    logger.warning(
                        "⏳ Rate limited (429) on %s page %d — backing off",
                        company_name,
                        page_num,
                    )
                    await page.close()
                    await asyncio.sleep(_random_delay() * 3)
                    continue

                if status >= 400:
                    logger.warning(
                        "HTTP %d for %s page %d — skipping",
                        status,
                        company_name,
                        page_num,
                    )
                    await page.close()
                    break

                # Wait for content to render
                await asyncio.sleep(1.5)

                # Check for captcha / block page
                page_text = await page.inner_text("body")
                if any(
                    kw in page_text.lower()
                    for kw in ["captcha", "are you a robot", "access denied", "blocked"]
                ):
                    logger.warning(
                        "🤖 Captcha/block detected on %s page %d — skipping",
                        company_name,
                        page_num,
                    )
                    await page.close()
                    return all_records

                # Extract salary rows
                page_records = await _extract_salary_rows(page, company_name)

                if not page_records:
                    logger.info(
                        "No records found on %s page %d — end of pagination",
                        company_name,
                        page_num,
                    )
                    await page.close()
                    break  # No more pages

                all_records.extend(page_records)
                logger.info(
                    "✅ Extracted %d records from %s page %d (total: %d)",
                    len(page_records),
                    company_name,
                    page_num,
                    len(all_records),
                )

                await page.close()
                # Rate limiting delay before next page
                await asyncio.sleep(_random_delay())
                break  # success, move to next page

            except PlaywrightTimeout:
                logger.warning(
                    "⏱ Timeout on %s page %d attempt %d",
                    company_name,
                    page_num,
                    attempt,
                )
                if page:
                    await page.close()
                if attempt < MAX_RETRIES:
                    await asyncio.sleep(_random_delay() * 2)
                continue

            except Exception as exc:
                logger.error(
                    "Unexpected error scraping %s page %d: %s",
                    company_name,
                    page_num,
                    exc,
                )
                if page:
                    try:
                        await page.close()
                    except Exception:
                        pass
                if attempt < MAX_RETRIES:
                    await asyncio.sleep(_random_delay())
                continue

    logger.info(
        "Finished %s: %d total records",
        company_name,
        len(all_records),
    )
    return all_records


# ── Main entry point ────────────────────────────────────────────────

async def scrape_ambitionbox(
    max_companies: int | None = None,
) -> list[dict[str, Any]]:
    """
    Scrape salary data from AmbitionBox for target companies.

    Parameters
    ----------
    max_companies : int, optional
        Limit the number of companies to scrape (useful for testing).

    Returns
    -------
    list[dict]
        List of raw salary records with keys:
        raw_company, raw_role, raw_salary_text, raw_location, raw_experience
    """
    companies = TARGET_COMPANIES[:max_companies] if max_companies else TARGET_COMPANIES
    all_records: list[dict[str, Any]] = []

    logger.info("Starting AmbitionBox scrape for %d companies", len(companies))

    async with async_playwright() as pw:
        browser: Browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-http2",
            ],
        )

        try:
            for i, company in enumerate(companies):
                ua = _pick_user_agent()
                context: BrowserContext = await browser.new_context(
                    user_agent=ua,
                    viewport={"width": 1920, "height": 1080},
                    locale="en-IN",
                    timezone_id="Asia/Kolkata",
                    ignore_https_errors=True,
                    bypass_csp=True,
                    extra_http_headers={
                        "Accept-Language": "en-IN,en;q=0.9",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    },
                )

                try:
                    company_records = await _scrape_company(context, company)
                    all_records.extend(company_records)
                except Exception as exc:
                    logger.error(
                        "Fatal error scraping %s: %s — continuing to next company",
                        company["name"],
                        exc,
                    )
                finally:
                    await context.close()

                # Inter-company delay
                if i < len(companies) - 1:
                    delay = _random_delay() * 1.5
                    logger.debug("Waiting %.1fs before next company", delay)
                    await asyncio.sleep(delay)

        finally:
            await browser.close()

    logger.info(
        "🏁 Scraping complete: %d total raw records from %d companies",
        len(all_records),
        len(companies),
    )
    return all_records


# ── Salary post-processing helper ───────────────────────────────────

def enrich_raw_records(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """
    Post-process raw records: parse salary text into numeric values,
    parse experience ranges into midpoints.
    """
    enriched: list[dict[str, Any]] = []
    for rec in records:
        try:
            enriched_rec = {**rec}

            # Parse salary
            if rec.get("raw_salary_text"):
                salary_info = _parse_salary_text(rec["raw_salary_text"])
                enriched_rec["parsed_salary"] = salary_info
                enriched_rec["base_salary"] = salary_info.get("midpoint")
                enriched_rec["currency"] = salary_info.get("currency", "INR")
            else:
                enriched_rec["base_salary"] = None
                enriched_rec["currency"] = "INR"

            # Parse experience
            enriched_rec["experience_years"] = _parse_experience(
                rec.get("raw_experience", "")
            )

            enriched.append(enriched_rec)

        except Exception as exc:
            logger.warning("Failed to enrich record: %s — %s", rec, exc)
            enriched.append(rec)

    return enriched
