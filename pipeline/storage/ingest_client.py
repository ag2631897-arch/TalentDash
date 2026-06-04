"""
pipeline/storage/ingest_client.py — POSTs validated records to /api/ingest-salary
"""

import asyncio
import logging
from typing import Optional

import httpx
from dotenv import load_dotenv
import os

load_dotenv()

logger = logging.getLogger(__name__)

BASE_URL = os.getenv("TALENTDASH_API_URL", "http://localhost:3000")
INGEST_ENDPOINT = f"{BASE_URL}/api/ingest-salary"


class IngestResult:
    """Tracks results of batch ingestion."""

    def __init__(self):
        self.success: int = 0
        self.validation_errors: int = 0
        self.duplicates: int = 0
        self.server_errors: int = 0
        self.failed_records: list[dict] = []

    @property
    def total_attempted(self) -> int:
        return self.success + self.validation_errors + self.duplicates + self.server_errors

    def summary(self) -> dict:
        return {
            "total_attempted": self.total_attempted,
            "success": self.success,
            "validation_errors": self.validation_errors,
            "duplicates": self.duplicates,
            "server_errors": self.server_errors,
        }


async def ingest_single(
    client: httpx.AsyncClient,
    record: dict,
    result: IngestResult,
) -> Optional[dict]:
    """POST a single record to the ingest endpoint."""
    try:
        response = await client.post(
            INGEST_ENDPOINT,
            json=record,
            timeout=10.0,
        )

        if response.status_code == 201:
            result.success += 1
            data = response.json()
            logger.info(f"✓ Ingested: {record.get('company', '?')} / {record.get('role', '?')}")
            return data.get("data")

        elif response.status_code == 400:
            result.validation_errors += 1
            error = response.json()
            logger.warning(
                f"✗ Validation error for {record.get('company', '?')}: "
                f"{error.get('field', '?')} — {error.get('message', '?')}"
            )
            result.failed_records.append({"record": record, "error": error, "status": 400})

        elif response.status_code == 409:
            result.duplicates += 1
            logger.info(f"~ Duplicate skipped: {record.get('company', '?')} / {record.get('role', '?')}")

        else:
            result.server_errors += 1
            logger.error(f"✗ Server error ({response.status_code}) for {record.get('company', '?')}")
            result.failed_records.append({"record": record, "status": response.status_code})

    except httpx.TimeoutException:
        result.server_errors += 1
        logger.error(f"✗ Timeout for {record.get('company', '?')} / {record.get('role', '?')}")
        result.failed_records.append({"record": record, "error": "timeout"})

    except Exception as e:
        result.server_errors += 1
        logger.error(f"✗ Exception for {record.get('company', '?')}: {e}")
        result.failed_records.append({"record": record, "error": str(e)})

    return None


async def ingest_batch(records: list[dict], concurrency: int = 5) -> IngestResult:
    """Ingest a batch of records with bounded concurrency."""
    result = IngestResult()
    semaphore = asyncio.Semaphore(concurrency)

    async with httpx.AsyncClient() as client:
        async def ingest_with_semaphore(record: dict):
            async with semaphore:
                await ingest_single(client, record, result)

        tasks = [ingest_with_semaphore(record) for record in records]
        await asyncio.gather(*tasks)

    return result


def ingest_records_sync(records: list[dict]) -> IngestResult:
    """Synchronous wrapper for batch ingestion."""
    return asyncio.run(ingest_batch(records))


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(message)s")

    # Test with a sample record
    test_record = {
        "company": "Test Company",
        "role": "Software Engineer",
        "level_standardized": "L4",
        "location": "Bengaluru",
        "currency": "INR",
        "experience_years": 4,
        "base_salary": 300000000,
        "bonus": 50000000,
        "stock": 100000000,
        "source": "CONTRIBUTOR",
        "confidence_score": 0.85,
    }

    result = ingest_records_sync([test_record])
    print(f"\nIngestion result: {result.summary()}")
