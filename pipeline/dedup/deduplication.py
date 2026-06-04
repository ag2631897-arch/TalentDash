"""
pipeline/dedup/deduplication.py — Pre-storage deduplication and database cleanup
"""

import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

logger = logging.getLogger(__name__)


def is_duplicate_pre_storage(
    new_record: dict,
    existing_records: list[dict],
    base_salary_threshold: float = 0.10,
    time_window_hours: int = 48,
) -> bool:
    """
    Check if a new record is a duplicate of any existing record.

    A record is a duplicate if:
    - Same company + role + level + location
    - base_salary within threshold (default 10%)
    - Submitted within time_window_hours (default 48h)
    """
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(hours=time_window_hours)

    for existing in existing_records:
        # Check field match
        if (
            existing.get("company") != new_record.get("company")
            or existing.get("role") != new_record.get("role")
            or existing.get("level_standardized") != new_record.get("level_standardized")
            or existing.get("location") != new_record.get("location")
        ):
            continue

        # Check time window
        submitted_at_str = existing.get("submitted_at", "")
        if submitted_at_str:
            try:
                submitted_at = datetime.fromisoformat(submitted_at_str.replace("Z", "+00:00"))
                if submitted_at < cutoff:
                    continue
            except (ValueError, TypeError):
                continue

        # Check base_salary proximity
        existing_base = existing.get("base_salary", 0)
        new_base = new_record.get("base_salary", 0)
        if existing_base > 0 and new_base > 0:
            ratio = abs(existing_base - new_base) / existing_base
            if ratio < base_salary_threshold:
                logger.info(
                    f"~ Duplicate detected: {new_record.get('company')} / "
                    f"{new_record.get('role')} / {new_record.get('level_standardized')} "
                    f"(base diff: {ratio:.1%})"
                )
                return True

    return False


def deduplicate_existing_records(
    records: list[dict],
    base_salary_threshold: float = 0.05,
) -> tuple[list[dict], list[dict]]:
    """
    Find and flag duplicate records in a full dataset.

    For groups with identical company + role + level + location + base within threshold:
    - Keep the most recent record (is_verified stays unchanged)
    - Flag all others with is_verified = False

    Returns:
        (kept_records, flagged_records)
    """
    from collections import defaultdict

    # Group by key fields
    groups: dict[str, list[dict]] = defaultdict(list)
    for record in records:
        key = (
            f"{record.get('company', '').lower()}|"
            f"{record.get('role', '').lower()}|"
            f"{record.get('level_standardized', '')}|"
            f"{record.get('location', '').lower()}"
        )
        groups[key].append(record)

    kept: list[dict] = []
    flagged: list[dict] = []

    for key, group in groups.items():
        if len(group) <= 1:
            kept.extend(group)
            continue

        # Sort by submitted_at descending (most recent first)
        sorted_group = sorted(
            group,
            key=lambda r: r.get("submitted_at", ""),
            reverse=True,
        )

        # Keep the most recent, check others for base salary similarity
        most_recent = sorted_group[0]
        kept.append(most_recent)

        for other in sorted_group[1:]:
            most_recent_base = most_recent.get("base_salary", 0)
            other_base = other.get("base_salary", 0)

            if most_recent_base > 0 and other_base > 0:
                ratio = abs(most_recent_base - other_base) / most_recent_base
                if ratio < base_salary_threshold:
                    other["is_verified"] = False
                    flagged.append(other)
                    logger.info(
                        f"Flagged duplicate: {other.get('company')} / "
                        f"{other.get('role')} (base diff: {ratio:.1%})"
                    )
                    continue

            kept.append(other)

    logger.info(f"Dedup complete: {len(kept)} kept, {len(flagged)} flagged")
    return kept, flagged


def filter_duplicates(
    new_records: list[dict],
    existing_records: list[dict],
) -> tuple[list[dict], list[dict]]:
    """
    Filter a batch of new records against existing records.

    Returns:
        (unique_records, duplicate_records)
    """
    unique: list[dict] = []
    duplicates: list[dict] = []

    # Also check within the new batch itself
    seen: list[dict] = list(existing_records)

    for record in new_records:
        if is_duplicate_pre_storage(record, seen):
            duplicates.append(record)
        else:
            unique.append(record)
            seen.append(record)

    logger.info(f"Filtered: {len(unique)} unique, {len(duplicates)} duplicates")
    return unique, duplicates
