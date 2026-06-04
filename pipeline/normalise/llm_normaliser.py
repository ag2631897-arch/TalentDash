"""
Async batch LLM normaliser using Groq API.

Groups raw scraped records into batches of 10, sends them to the Groq
LLM (LLaMA 3.1 / Mixtral) for structured normalisation, and returns
records matching the TalentDash integration contract.

Edge cases handled:
  - Salary ranges → midpoint
  - Ambiguous levels → most likely enum + lower confidence
  - Missing fields → null
  - Per-record error isolation
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
from typing import Any

import httpx

from .company_normaliser import normalise_company
from .level_mapper import map_level, LevelResult

logger = logging.getLogger(__name__)

# ── Configuration ───────────────────────────────────────────────────

BATCH_SIZE = 10
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.1-8b-instant"
GROQ_TIMEOUT = 60.0
MAX_RETRIES = 2

# ── LLM Prompt ──────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are a salary data normaliser for the TalentDash career intelligence platform.

Your job is to take raw scraped salary data and return a clean, structured JSON array of records.

For EACH input record, produce an output record with EXACTLY these fields:
{
  "company": "<canonical company name, lowercase, no legal suffixes>",
  "role": "<clean job title>",
  "level_standardized": "<one of: INTERN, ENTRY, SDE_I, SDE_II, SDE_III, L3, L4, L5, L6, L7, SENIOR, STAFF, PRINCIPAL, DISTINGUISHED, FELLOW, MANAGER, SENIOR_MANAGER, DIRECTOR, VP, SVP, C_LEVEL, UNKNOWN>",
  "location": "<city name, cleaned>",
  "currency": "<INR, USD, GBP, or EUR>",
  "experience_years": <integer 1-50, or null if unknown>,
  "base_salary": <integer annual salary in the currency unit, or null>,
  "bonus": <integer annual bonus, or 0>,
  "stock": <integer annual stock/RSU value, or 0>,
  "source": "SCRAPED",
  "confidence_score": <float 0.0-1.0 based on data quality>
}

Rules:
1. Salary ranges (e.g. "5-8 Lakhs"): compute midpoint and convert to absolute number (1 Lakh = 100,000 INR).
2. "LPA" means Lakhs Per Annum. "Cr" means Crore = 10,000,000.
3. If experience is a range (e.g. "3-5 yrs"), use the midpoint rounded down.
4. If a field is missing or unparseable, set it to null (for strings/integers) or 0 (for bonus/stock).
5. For level_standardized, map the title to the closest level. If ambiguous, pick the most likely and lower the confidence_score.
6. confidence_score: 0.8+ if all fields are clear, 0.6-0.8 if some inference needed, 0.4-0.6 if significant guessing.
7. Always return a JSON array, even for a single record.

Return ONLY valid JSON. No markdown fences, no explanations.
"""


def _build_user_prompt(batch: list[dict[str, Any]]) -> str:
    """Build the user prompt with batch data."""
    serialised = json.dumps(batch, indent=2, default=str)
    return f"""Normalise the following {len(batch)} raw salary records into the structured format.

Raw records:
{serialised}

Return a JSON array of {len(batch)} normalised records."""


# ── API call ────────────────────────────────────────────────────────

async def _call_groq(
    client: httpx.AsyncClient,
    batch: list[dict[str, Any]],
    api_key: str,
) -> list[dict[str, Any]]:
    """
    Send a batch of raw records to Groq LLM and parse the response.
    """
    user_prompt = _build_user_prompt(batch)

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = await client.post(
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": GROQ_MODEL,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_prompt},
                    ],
                    "temperature": 0.1,
                    "max_tokens": 4096,
                },
                timeout=GROQ_TIMEOUT,
            )
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"].strip()

            # Strip markdown code fences if present
            if content.startswith("```"):
                lines = content.split("\n")
                # Remove first and last line (fences)
                lines = [ln for ln in lines if not ln.strip().startswith("```")]
                content = "\n".join(lines).strip()

            # Remove leading 'json' if present
            if content.lower().startswith("json"):
                content = content[4:].strip()

            parsed = json.loads(content)

            if isinstance(parsed, dict):
                # Sometimes LLM wraps in {"records": [...]}
                for key in ("records", "data", "results"):
                    if key in parsed and isinstance(parsed[key], list):
                        parsed = parsed[key]
                        break
                else:
                    parsed = [parsed]

            if not isinstance(parsed, list):
                logger.error("LLM returned non-list type: %s", type(parsed))
                return []

            logger.info(
                "Groq returned %d normalised records (attempt %d)",
                len(parsed),
                attempt,
            )
            return parsed

        except httpx.HTTPStatusError as exc:
            if exc.response.status_code == 429:
                wait = 2 ** attempt * 2
                logger.warning("Groq rate limit hit, waiting %ds", wait)
                await asyncio.sleep(wait)
                continue
            logger.error("Groq HTTP error (attempt %d): %s", attempt, exc)
            if attempt == MAX_RETRIES:
                return []

        except json.JSONDecodeError as exc:
            logger.error(
                "Failed to parse LLM JSON (attempt %d): %s\nContent: %s",
                attempt,
                exc,
                content[:500] if 'content' in dir() else "N/A",
            )
            if attempt == MAX_RETRIES:
                return []

        except Exception as exc:
            logger.error("Unexpected error calling Groq (attempt %d): %s", attempt, exc)
            if attempt == MAX_RETRIES:
                return []

    return []


# ── Hybrid normalisation (programmatic + LLM) ──────────────────────

async def _apply_programmatic_normalisation(
    records: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Apply programmatic normalisations (company name, level) on top of
    LLM output to ensure consistency.
    """
    normalised: list[dict[str, Any]] = []

    for rec in records:
        try:
            # Company normalisation (programmatic always overrides)
            raw_company = rec.get("company") or rec.get("raw_company", "")
            rec["company"] = normalise_company(raw_company)

            # Level normalisation (use rule-based if available, keep LLM otherwise)
            raw_role = rec.get("role", "")
            exp_years = rec.get("experience_years")
            level_result: LevelResult = await map_level(raw_role, exp_years)

            # If rule-based gave a higher confidence, prefer it
            llm_level = rec.get("level_standardized", "UNKNOWN")
            llm_conf = rec.get("confidence_score", 0.5)

            if level_result.confidence > llm_conf:
                rec["level_standardized"] = level_result.level
                rec["confidence_score"] = level_result.confidence
            elif llm_level and llm_level != "UNKNOWN":
                rec["level_standardized"] = llm_level
                # Keep LLM confidence but cap it
                rec["confidence_score"] = min(float(llm_conf), 0.80)

            # Ensure source is set
            rec["source"] = rec.get("source", "SCRAPED")

            # Ensure bonus/stock defaults
            rec.setdefault("bonus", 0)
            rec.setdefault("stock", 0)

            normalised.append(rec)

        except Exception as exc:
            logger.warning("Programmatic normalisation failed for record: %s — %s", rec, exc)
            rec.setdefault("level_standardized", "UNKNOWN")
            rec.setdefault("confidence_score", 0.40)
            rec.setdefault("source", "SCRAPED")
            normalised.append(rec)

    return normalised


# ── Public API ──────────────────────────────────────────────────────

async def normalise_batch_llm(
    raw_records: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Normalise raw scraped records via LLM + programmatic post-processing.

    Splits into batches of BATCH_SIZE, sends to Groq, then applies
    programmatic company & level normalisation on top.

    Parameters
    ----------
    raw_records : list[dict]
        Raw records from the scraper.

    Returns
    -------
    list[dict]
        Normalised records ready for Pydantic validation.
    """
    api_key = os.getenv("GROQ_API_KEY", "")

    if not api_key:
        logger.warning(
            "GROQ_API_KEY not set — falling back to programmatic-only normalisation"
        )
        return await _fallback_programmatic_only(raw_records)

    # Split into batches
    batches = [
        raw_records[i : i + BATCH_SIZE]
        for i in range(0, len(raw_records), BATCH_SIZE)
    ]

    logger.info(
        "Normalising %d records in %d batches via Groq LLM",
        len(raw_records),
        len(batches),
    )

    all_normalised: list[dict[str, Any]] = []

    async with httpx.AsyncClient() as client:
        for batch_idx, batch in enumerate(batches):
            logger.info("Processing batch %d/%d (%d records)", batch_idx + 1, len(batches), len(batch))

            llm_results = await _call_groq(client, batch, api_key)

            if llm_results:
                # Apply programmatic normalisations on top of LLM output
                normalised = await _apply_programmatic_normalisation(llm_results)
                all_normalised.extend(normalised)
            else:
                # LLM failed — fall back to programmatic for this batch
                logger.warning(
                    "LLM failed for batch %d — using programmatic fallback",
                    batch_idx + 1,
                )
                fallback = await _fallback_programmatic_only(batch)
                all_normalised.extend(fallback)

            # Delay between batches to respect rate limits
            if batch_idx < len(batches) - 1:
                await asyncio.sleep(1.0)

    logger.info("LLM normalisation complete: %d records output", len(all_normalised))
    return all_normalised


async def _fallback_programmatic_only(
    records: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Programmatic-only normalisation when LLM is unavailable.
    Maps raw scraper output to the integration contract shape.
    """
    results: list[dict[str, Any]] = []

    for rec in records:
        try:
            company = normalise_company(rec.get("raw_company") or rec.get("company", ""))
            role = rec.get("raw_role") or rec.get("role", "Unknown")
            exp = rec.get("experience_years") or rec.get("raw_experience")

            # Parse experience if string
            if isinstance(exp, str):
                import re
                nums = re.findall(r"\d+", exp)
                if nums:
                    exp = int(nums[0])
                else:
                    exp = None
            exp = int(exp) if exp else None

            # Level mapping
            level_result = await map_level(role, exp)

            # Salary
            base_salary = rec.get("base_salary")
            if base_salary is None and rec.get("raw_salary_text"):
                # Use scraper's salary parser
                from pipeline.scraper.ambitionbox import _parse_salary_text as parse_sal
                salary_info = parse_sal(rec["raw_salary_text"])
                base_salary = salary_info.get("midpoint")

            location = rec.get("raw_location") or rec.get("location", "India")

            results.append({
                "company": company,
                "role": role,
                "level_standardized": level_result.level,
                "location": location if location else "India",
                "currency": rec.get("currency", "INR"),
                "experience_years": max(exp, 1) if exp else 1,
                "base_salary": base_salary if base_salary and base_salary > 0 else None,
                "bonus": rec.get("bonus", 0) or 0,
                "stock": rec.get("stock", 0) or 0,
                "source": "SCRAPED",
                "confidence_score": level_result.confidence * 0.8,  # lower for fallback
            })

        except Exception as exc:
            logger.warning("Programmatic fallback failed for record: %s — %s", rec, exc)
            continue

    return results
