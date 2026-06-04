"""
Two-layer company name normaliser.

Layer 1 — Programmatic:
    lowercase → trim → strip legal suffixes (pvt, ltd, inc, llc, corp,
    private, limited, technologies, india, .com, solutions, services,
    systems, consulting, group, holdings, enterprises, digital)

Layer 2 — Alias lookup:
    Exact match against ``aliases.json`` after programmatic cleaning.
"""

from __future__ import annotations

import json
import logging
import re
from pathlib import Path
from functools import lru_cache

logger = logging.getLogger(__name__)

# Path to the alias mapping file
_ALIASES_PATH = Path(__file__).resolve().parent / "aliases.json"

# Legal / noise suffixes to strip (order matters — longer first)
_SUFFIXES: list[str] = [
    "private limited",
    "pvt ltd",
    "pvt. ltd.",
    "pvt. ltd",
    "pvt ltd.",
    "pvt limited",
    "private ltd",
    "private ltd.",
    "limited",
    "ltd.",
    "ltd",
    "incorporated",
    "inc.",
    "inc",
    "llc",
    "l.l.c.",
    "corporation",
    "corp.",
    "corp",
    "technologies",
    "technology",
    "solutions",
    "services",
    "systems",
    "consulting",
    "consultancy",
    "enterprises",
    "digital",
    "group",
    "holdings",
    "software",
    "india",
    "global",
    ".com",
    "(india)",
    "(p) ltd",
    "(p) ltd.",
    "pvt",
    "private",
]

# Pre-compiled regex patterns for each suffix (word-boundary aware)
_SUFFIX_PATTERNS: list[re.Pattern[str]] = [
    re.compile(r"\s*\b" + re.escape(s) + r"\b\.?\s*", re.IGNORECASE)
    for s in _SUFFIXES
]


@lru_cache(maxsize=1)
def _load_aliases() -> dict[str, str]:
    """Load and cache alias mappings from disk."""
    if not _ALIASES_PATH.exists():
        logger.warning("aliases.json not found at %s — skipping alias layer", _ALIASES_PATH)
        return {}
    with open(_ALIASES_PATH, encoding="utf-8") as fh:
        data: dict[str, str] = json.load(fh)
    logger.info("Loaded %d company aliases", len(data))
    return {k.strip().lower(): v.strip().lower() for k, v in data.items()}


def _strip_suffixes(name: str) -> str:
    """Iteratively strip known legal / noise suffixes."""
    previous = None
    while previous != name:
        previous = name
        for pattern in _SUFFIX_PATTERNS:
            name = pattern.sub(" ", name).strip()
    # Collapse multiple spaces
    name = re.sub(r"\s+", " ", name).strip()
    return name


def normalise_company(raw_name: str | None) -> str:
    """
    Normalise a raw company name to its canonical form.

    Examples
    --------
    >>> normalise_company("Tata Consultancy Services Pvt. Ltd.")
    'tcs'
    >>> normalise_company("  AMAZON WEB SERVICES INC  ")
    'amazon'
    >>> normalise_company("Wipro Technologies Limited")
    'wipro'
    >>> normalise_company("Google India Pvt Ltd")
    'google'
    >>> normalise_company("Freshworks")
    'freshworks'
    """
    if not raw_name or not raw_name.strip():
        return "unknown"

    # Layer 1 — Programmatic
    cleaned = raw_name.strip().lower()
    cleaned = _strip_suffixes(cleaned)

    # Layer 2 — Alias lookup (try cleaned name first, then original lowercase)
    aliases = _load_aliases()
    if cleaned in aliases:
        return aliases[cleaned]

    original_lower = raw_name.strip().lower()
    if original_lower in aliases:
        return aliases[original_lower]

    # Try partial alias matching: if cleaned name starts with an alias key
    for alias_key, canonical in aliases.items():
        if cleaned.startswith(alias_key) or alias_key.startswith(cleaned):
            return canonical

    return cleaned


def normalise_company_batch(names: list[str | None]) -> list[str]:
    """Normalise a batch of company names."""
    return [normalise_company(n) for n in names]
