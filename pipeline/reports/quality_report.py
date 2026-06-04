"""
pipeline/reports/quality_report.py — Pipeline quality report generator
"""

import logging
from typing import Any

logger = logging.getLogger(__name__)


class QualityReport:
    """Tracks metrics across the full pipeline run."""

    def __init__(self):
        self.total_scraped: int = 0
        self.passed_llm: int = 0
        self.passed_pydantic: int = 0
        self.rejected_count: int = 0
        self.rejection_reasons: dict[str, int] = {}
        self.stored_count: int = 0
        self.duplicate_count: int = 0
        self.null_counts: dict[str, int] = {}
        self.field_totals: dict[str, int] = {}

    def record_scrape(self, count: int):
        self.total_scraped += count

    def record_llm_pass(self, count: int):
        self.passed_llm += count

    def record_pydantic_pass(self, count: int):
        self.passed_pydantic += count

    def record_rejection(self, reason: str, count: int = 1):
        self.rejected_count += count
        self.rejection_reasons[reason] = self.rejection_reasons.get(reason, 0) + count

    def record_stored(self, count: int):
        self.stored_count += count

    def record_duplicate(self, count: int):
        self.duplicate_count += count

    def track_null_field(self, field: str, is_null: bool):
        self.field_totals[field] = self.field_totals.get(field, 0) + 1
        if is_null:
            self.null_counts[field] = self.null_counts.get(field, 0) + 1

    def track_record_nulls(self, record: dict):
        """Track null rates for all fields in a record."""
        fields = [
            "company", "role", "level_standardized", "location",
            "currency", "experience_years", "base_salary",
            "bonus", "stock", "source", "confidence_score",
        ]
        for field in fields:
            value = record.get(field)
            is_null = value is None or value == "" or value == 0
            # bonus and stock being 0 is valid, not null
            if field in ("bonus", "stock"):
                is_null = value is None
            self.track_null_field(field, is_null)

    def null_rate(self, field: str) -> float:
        total = self.field_totals.get(field, 0)
        if total == 0:
            return 0.0
        return self.null_counts.get(field, 0) / total

    def print_report(self):
        """Print the full quality report to stdout."""
        print("\n" + "=" * 60)
        print("  TALENTDASH PIPELINE — QUALITY REPORT")
        print("=" * 60)

        print(f"\n  📥 Total records scraped:          {self.total_scraped}")
        print(f"  🤖 Passed LLM normalisation:       {self.passed_llm}")
        print(f"  ✅ Passed Pydantic validation:      {self.passed_pydantic}")
        print(f"  ❌ Rejected:                        {self.rejected_count}")

        if self.rejection_reasons:
            print("\n  Rejection breakdown:")
            for reason, count in sorted(self.rejection_reasons.items(), key=lambda x: -x[1]):
                print(f"    • {reason}: {count}")

        print(f"\n  🔁 Duplicates skipped:              {self.duplicate_count}")
        print(f"  💾 Records stored successfully:     {self.stored_count}")

        # Conversion rates
        if self.total_scraped > 0:
            llm_rate = (self.passed_llm / self.total_scraped) * 100
            pydantic_rate = (self.passed_pydantic / self.total_scraped) * 100
            store_rate = (self.stored_count / self.total_scraped) * 100
            print(f"\n  📊 LLM pass rate:                   {llm_rate:.1f}%")
            print(f"  📊 Pydantic pass rate:              {pydantic_rate:.1f}%")
            print(f"  📊 Store rate:                      {store_rate:.1f}%")

        # Null rates
        if self.field_totals:
            print("\n  Null rate per field:")
            for field in sorted(self.field_totals.keys()):
                rate = self.null_rate(field)
                indicator = "⚠️" if rate > 0.1 else "✓"
                print(f"    {indicator} {field}: {rate:.1%} ({self.null_counts.get(field, 0)}/{self.field_totals[field]})")

        print("\n" + "=" * 60 + "\n")

    def to_dict(self) -> dict[str, Any]:
        """Return the report as a dictionary."""
        return {
            "total_scraped": self.total_scraped,
            "passed_llm": self.passed_llm,
            "passed_pydantic": self.passed_pydantic,
            "rejected": self.rejected_count,
            "rejection_reasons": self.rejection_reasons,
            "duplicates": self.duplicate_count,
            "stored": self.stored_count,
            "null_rates": {
                field: self.null_rate(field)
                for field in self.field_totals
            },
        }
