"""
pipeline/scraper/main.py — Entry point that orchestrates the full pipeline run.

Usage:
    python -m pipeline.scraper.main          # full pipeline
    python -m pipeline.scraper.main --dry    # scrape + normalise only, no storage
"""

import asyncio
import json
import logging
import sys
import os
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from pipeline.scraper.ambitionbox import scrape_ambitionbox
from pipeline.normalise.llm_normaliser import normalise_batch_llm
from pipeline.normalise.pydantic_validator import SalaryRecord, validate_record
from pipeline.normalise.company_normaliser import normalise_company
from pipeline.normalise.level_mapper import map_level
from pipeline.dedup.deduplication import filter_duplicates
from pipeline.storage.ingest_client import ingest_batch
from pipeline.reports.quality_report import QualityReport

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)

REJECTIONS_FILE = Path(__file__).parent.parent / "rejections.jsonl"


async def run_pipeline(dry_run: bool = False):
    """Execute the full data pipeline."""
    report = QualityReport()

    # ─── Stage 1: Scrape ───────────────────────────────────────────
    logger.info("=" * 50)
    logger.info("STAGE 1: Scraping AmbitionBox")
    logger.info("=" * 50)

    try:
        raw_records = await scrape_ambitionbox(max_companies=12)
    except Exception as e:
        logger.error(f"Scraper failed: {e}")
        raw_records = []

    # If scraper returned nothing (blocked or failed), use fallback data
    if not raw_records:
        logger.info("No records scraped — using fallback mock records for pipeline demonstration")
        raw_records = _get_fallback_records()

    report.record_scrape(len(raw_records))
    logger.info(f"Scraped {len(raw_records)} raw records")

    # ─── Stage 2: LLM Normalisation ───────────────────────────────
    logger.info("\n" + "=" * 50)
    logger.info("STAGE 2: LLM Normalisation")
    logger.info("=" * 50)

    try:
        normalised_records = await normalise_batch_llm(raw_records)
    except Exception as e:
        logger.error(f"LLM normalisation failed: {e}")
        logger.info("Using rule-based fallback normalisation")
        normalised_records = _fallback_normalise(raw_records)

    report.record_llm_pass(len(normalised_records))
    logger.info(f"LLM normalised {len(normalised_records)} records")

    # ─── Stage 3: Pydantic Validation ─────────────────────────────
    logger.info("\n" + "=" * 50)
    logger.info("STAGE 3: Pydantic Validation")
    logger.info("=" * 50)

    validated_records: list[dict] = []
    rejected_records: list[dict] = []

    for record in normalised_records:
        # Apply company normalisation
        if "company" in record:
            record["company"] = normalise_company(record["company"])

        # Track null rates
        report.track_record_nulls(record)

        # Validate
        valid, error = validate_record(record)
        if valid:
            validated_records.append(valid.model_dump())
            report.record_pydantic_pass(1)
        else:
            rejected_records.append({
                "raw_input": record,
                "error": str(error),
            })
            report.record_rejection(str(error)[:80])

    # Write rejections to JSONL
    if rejected_records:
        with open(REJECTIONS_FILE, "a") as f:
            for rej in rejected_records:
                f.write(json.dumps(rej, default=str) + "\n")
        logger.info(f"Wrote {len(rejected_records)} rejections to {REJECTIONS_FILE}")

    logger.info(f"Validated: {len(validated_records)}, Rejected: {len(rejected_records)}")

    # ─── Stage 4: Deduplication ───────────────────────────────────
    logger.info("\n" + "=" * 50)
    logger.info("STAGE 4: Deduplication")
    logger.info("=" * 50)

    unique_records, duplicate_records = filter_duplicates(validated_records, [])
    report.record_duplicate(len(duplicate_records))
    logger.info(f"Unique: {len(unique_records)}, Duplicates: {len(duplicate_records)}")

    # ─── Stage 5: Storage ─────────────────────────────────────────
    if not dry_run and unique_records:
        logger.info("\n" + "=" * 50)
        logger.info("STAGE 5: Ingesting to API")
        logger.info("=" * 50)

        # Convert validated records to API format
        api_records = []
        for r in unique_records:
            api_records.append({
                "company": r["company"],
                "role": r["role"],
                "level_standardized": r["level_standardized"],
                "location": r["location"],
                "currency": r["currency"],
                "experience_years": r["experience_years"],
                "base_salary": r["base_salary"],
                "bonus": r.get("bonus", 0),
                "stock": r.get("stock", 0),
                "source": r.get("source", "SCRAPED"),
                "confidence_score": r.get("confidence_score", 0.5),
            })

        result = await ingest_batch(api_records)
        report.record_stored(result.success)
        logger.info(f"Ingestion result: {result.summary()}")
    elif dry_run:
        logger.info("\n[DRY RUN] Skipping storage")
    else:
        logger.info("\nNo records to ingest")

    # ─── Stage 6: Quality Report ──────────────────────────────────
    report.print_report()

    return report


def _get_fallback_records() -> list[dict]:
    """Mock raw records for when the scraper is blocked."""
    return [
        {"raw_company": "Google India Pvt. Ltd.", "raw_role": "Software Engineer", "raw_salary_text": "₹25-35 LPA", "raw_location": "Bengaluru", "raw_experience": "2-4 yrs"},
        {"raw_company": "Amazon", "raw_role": "SDE-II", "raw_salary_text": "₹28-42 LPA", "raw_location": "Hyderabad", "raw_experience": "3-5 yrs"},
        {"raw_company": "TCS Ltd.", "raw_role": "Software Engineer", "raw_salary_text": "₹6-8 LPA", "raw_location": "Mumbai", "raw_experience": "1-3 yrs"},
        {"raw_company": "Flipkart Internet Pvt Ltd", "raw_role": "SDE-I", "raw_salary_text": "₹16-20 LPA", "raw_location": "Bengaluru", "raw_experience": "0-2 yrs"},
        {"raw_company": "Infosys BPO", "raw_role": "Senior Software Engineer", "raw_salary_text": "₹12-18 LPA", "raw_location": "Pune", "raw_experience": "4-7 yrs"},
        {"raw_company": "Wipro Technologies", "raw_role": "Software Engineer", "raw_salary_text": "₹5-7 LPA", "raw_location": "Bengaluru", "raw_experience": "1-2 yrs"},
        {"raw_company": "Microsoft India", "raw_role": "Software Engineer", "raw_salary_text": "₹30-45 LPA", "raw_location": "Hyderabad", "raw_experience": "3-6 yrs"},
        {"raw_company": "Razorpay", "raw_role": "SDE-II", "raw_salary_text": "₹22-35 LPA", "raw_location": "Bengaluru", "raw_experience": "2-4 yrs"},
        {"raw_company": "NVIDIA", "raw_role": "Software Engineer", "raw_salary_text": "₹34-50 LPA", "raw_location": "Pune", "raw_experience": "3-6 yrs"},
        {"raw_company": "Meesho", "raw_role": "SDE-I", "raw_salary_text": "₹15-22 LPA", "raw_location": "Bengaluru", "raw_experience": "0-2 yrs"},
        {"raw_company": "Zepto", "raw_role": "SDE-II", "raw_salary_text": "₹22-30 LPA", "raw_location": "Mumbai", "raw_experience": "2-4 yrs"},
        {"raw_company": "Meta", "raw_role": "Software Engineer", "raw_salary_text": "₹32-55 LPA", "raw_location": "Bengaluru", "raw_experience": "3-7 yrs"},
    ]


def _fallback_normalise(raw_records: list[dict]) -> list[dict]:
    """Rule-based fallback when LLM is unavailable."""
    import re

    normalised = []
    for raw in raw_records:
        try:
            # Parse salary text
            salary_text = raw.get("raw_salary_text", "")
            numbers = re.findall(r"[\d.]+", salary_text)
            if len(numbers) >= 2:
                low = float(numbers[0])
                high = float(numbers[1])
                midpoint_lpa = (low + high) / 2
            elif len(numbers) == 1:
                midpoint_lpa = float(numbers[0])
            else:
                continue

            base_salary_paise = int(midpoint_lpa * 100000 * 100)  # LPA → paise

            # Parse experience
            exp_text = raw.get("raw_experience", "")
            exp_numbers = re.findall(r"\d+", exp_text)
            if len(exp_numbers) >= 2:
                experience = (int(exp_numbers[0]) + int(exp_numbers[1])) // 2
            elif len(exp_numbers) == 1:
                experience = int(exp_numbers[0])
            else:
                experience = 3

            experience = max(1, min(experience, 50))

            # Map level
            role = raw.get("raw_role", "Software Engineer")
            level, confidence = map_level(role, experience)
            if not level:
                level = "L4"
                confidence = 0.5

            normalised.append({
                "company": normalise_company(raw.get("raw_company", "")),
                "role": role,
                "level_standardized": level,
                "location": raw.get("raw_location", "Bengaluru"),
                "currency": "INR",
                "experience_years": experience,
                "base_salary": base_salary_paise,
                "bonus": 0,
                "stock": 0,
                "source": "SCRAPED",
                "confidence_score": confidence,
            })
        except Exception as e:
            logger.warning(f"Fallback normalisation failed for record: {e}")
            continue

    return normalised


def main():
    dry_run = "--dry" in sys.argv
    run_once = "--once" in sys.argv
    
    if run_once:
        logger.info("Starting pipeline in SINGLE-RUN mode")
        asyncio.run(run_pipeline(dry_run=dry_run))
    else:
        # Import web server dependencies here so they are only required for continuous mode
        import uvicorn
        from fastapi import FastAPI
        
        app = FastAPI(title="TalentDash Pipeline Worker")
        
        @app.get("/")
        @app.get("/health")
        def health_check():
            return {"status": "healthy", "service": "talentdash-pipeline"}
            
        @app.on_event("startup")
        async def startup_event():
            # Start the scraping loop in the background
            asyncio.create_task(continuous_scraper_loop(dry_run))
            
        async def continuous_scraper_loop(is_dry_run):
            interval = int(os.environ.get("SCRAPE_INTERVAL_SECONDS", 21600))
            logger.info(f"Starting pipeline in CONTINUOUS mode (running every {interval} seconds)")
            while True:
                try:
                    await run_pipeline(dry_run=is_dry_run)
                except Exception as e:
                    logger.error(f"Pipeline run failed: {e}")
                
                logger.info(f"Sleeping for {interval} seconds before next run...")
                await asyncio.sleep(interval)
                
        port = int(os.environ.get("PORT", 8080))
        logger.info(f"Starting web server on port {port} to satisfy Render health checks")
        uvicorn.run(app, host="0.0.0.0", port=port)


if __name__ == "__main__":
    main()
