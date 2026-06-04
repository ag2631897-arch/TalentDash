"""
Pydantic model enforcing the TalentDash salary integration contract.

Validates every record before it enters the data store.  Invalid records
are written to ``rejections.jsonl`` with the reason for rejection so
that operators can audit data-quality issues.
"""

from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Literal, Optional, Tuple

from pydantic import BaseModel, Field, ValidationError, field_validator, model_validator

logger = logging.getLogger(__name__)

# ── Canonical level enum ────────────────────────────────────────────
VALID_LEVELS = (
    "INTERN",
    "ENTRY",
    "SDE_I",
    "SDE_II",
    "SDE_III",
    "L3",
    "L4",
    "L5",
    "L6",
    "L7",
    "SENIOR",
    "STAFF",
    "PRINCIPAL",
    "DISTINGUISHED",
    "FELLOW",
    "MANAGER",
    "SENIOR_MANAGER",
    "DIRECTOR",
    "VP",
    "SVP",
    "C_LEVEL",
    "UNKNOWN",
)

LevelLiteral = Literal[
    "INTERN",
    "ENTRY",
    "SDE_I",
    "SDE_II",
    "SDE_III",
    "L3",
    "L4",
    "L5",
    "L6",
    "L7",
    "SENIOR",
    "STAFF",
    "PRINCIPAL",
    "DISTINGUISHED",
    "FELLOW",
    "MANAGER",
    "SENIOR_MANAGER",
    "DIRECTOR",
    "VP",
    "SVP",
    "C_LEVEL",
    "UNKNOWN",
]

SourceLiteral = Literal["CONTRIBUTOR", "SCRAPED", "AI_INFERRED"]
CurrencyLiteral = Literal["INR", "USD", "GBP", "EUR"]


class SalaryRecord(BaseModel):
    """Strict Pydantic model matching the TalentDash integration contract."""

    company: str = Field(..., min_length=2, description="Canonical company name")
    role: str = Field(..., min_length=1, description="Job title / role")
    level_standardized: LevelLiteral = Field(..., description="Standardised level enum")
    location: str = Field(..., min_length=1, description="City or region")
    currency: CurrencyLiteral = Field(default="INR", description="ISO currency code")
    experience_years: int = Field(..., gt=0, lt=51, description="Total years of experience")
    base_salary: int = Field(..., gt=0, description="Annual base salary in currency smallest unit")
    bonus: int = Field(default=0, ge=0, description="Annual bonus")
    stock: int = Field(default=0, ge=0, description="Annual stock / RSU value")
    source: SourceLiteral = Field(default="SCRAPED", description="Data provenance")
    confidence_score: float = Field(
        ..., ge=0.0, le=1.0, description="Normalisation confidence"
    )

    # ── Field-level validators ───────────────────────────────────────
    @field_validator("company", "role", "location", mode="before")
    @classmethod
    def strip_whitespace(cls, v: Any) -> str:
        if isinstance(v, str):
            return v.strip()
        return v

    @field_validator("level_standardized", mode="before")
    @classmethod
    def coerce_level(cls, v: Any) -> str:
        """Accept lowercase / mixed-case level strings."""
        if isinstance(v, str):
            upper = v.strip().upper().replace("-", "_").replace(" ", "_")
            if upper in VALID_LEVELS:
                return upper
        return v  # let Pydantic raise the error if invalid

    @field_validator("currency", mode="before")
    @classmethod
    def coerce_currency(cls, v: Any) -> str:
        """Ensure currency is uppercase."""
        if isinstance(v, str):
            return v.strip().upper()
        return v

    @field_validator("base_salary", "bonus", "stock", mode="before")
    @classmethod
    def coerce_numeric(cls, v: Any) -> int:
        """Accept string numbers like '1200000'."""
        if isinstance(v, str):
            v = v.replace(",", "").replace(" ", "")
            return int(float(v))
        if isinstance(v, float):
            return int(v)
        return v

    @field_validator("experience_years", mode="before")
    @classmethod
    def coerce_experience(cls, v: Any) -> int:
        if isinstance(v, str):
            v = v.replace("+", "").replace(" ", "").replace("years", "").replace("yrs", "")
            return int(float(v))
        if isinstance(v, float):
            return int(v)
        return v

    @field_validator("confidence_score", mode="before")
    @classmethod
    def coerce_confidence(cls, v: Any) -> float:
        if isinstance(v, str):
            return float(v)
        return v

    # ── Model-level validator ────────────────────────────────────────
    @model_validator(mode="after")
    def salary_sanity_check(self) -> "SalaryRecord":
        """Bonus + stock should not wildly exceed base salary."""
        total_comp = self.base_salary + self.bonus + self.stock
        if total_comp > self.base_salary * 10:
            logger.warning(
                "Total comp (₹%s) is >10× base (₹%s) for %s @ %s – may be data error",
                total_comp,
                self.base_salary,
                self.role,
                self.company,
            )
        return self


# ── Rejection log path ──────────────────────────────────────────────
REJECTIONS_DIR = Path(__file__).resolve().parent.parent / "logs"
REJECTIONS_FILE = REJECTIONS_DIR / "rejections.jsonl"


def _ensure_log_dir() -> None:
    REJECTIONS_DIR.mkdir(parents=True, exist_ok=True)


def _write_rejection(raw_record: dict[str, Any], error: ValidationError) -> None:
    """Append a failed record + error details to the rejections log."""
    _ensure_log_dir()
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "raw_record": raw_record,
        "errors": error.errors(),
    }
    with open(REJECTIONS_FILE, "a", encoding="utf-8") as fh:
        fh.write(json.dumps(entry, default=str) + "\n")
    logger.debug("Rejection logged: %s", entry)


# ── Public helpers ──────────────────────────────────────────────────
def validate_record(
    raw: dict[str, Any],
) -> Tuple[Optional[SalaryRecord], Optional[ValidationError]]:
    """
    Attempt to validate *raw* against the integration contract.

    Returns
    -------
    (SalaryRecord, None)   on success
    (None, ValidationError) on failure — also writes to rejections.jsonl
    """
    try:
        record = SalaryRecord(**raw)
        return record, None
    except ValidationError as exc:
        _write_rejection(raw, exc)
        return None, exc


def validate_batch(
    records: list[dict[str, Any]],
) -> Tuple[list[SalaryRecord], list[dict[str, Any]]]:
    """
    Validate a list of raw dicts.

    Returns
    -------
    (valid_records, rejected_records_with_errors)
    """
    valid: list[SalaryRecord] = []
    rejected: list[dict[str, Any]] = []
    for raw in records:
        record, error = validate_record(raw)
        if record is not None:
            valid.append(record)
        else:
            rejected.append({"raw": raw, "error": str(error)})
    logger.info(
        "Validation complete: %d passed, %d rejected", len(valid), len(rejected)
    )
    return valid, rejected
