"""
Two-layer career level mapper.

Layer 1 — Rule-based dictionary for known exact titles.
Layer 2 — LLM fallback for ambiguous titles (via Groq API).

Confidence scoring:
    rule-based  → 0.85 – 0.95
    LLM match   → 0.60 – 0.80
    no match    → 0.40 (returns UNKNOWN)
"""

from __future__ import annotations

import logging
import os
import re
from dataclasses import dataclass

import httpx

logger = logging.getLogger(__name__)

# ── Result container ────────────────────────────────────────────────

@dataclass(frozen=True)
class LevelResult:
    level: str
    confidence: float


# ── Layer 1: Rule-based mapping ─────────────────────────────────────
# Keys are lowered, stripped titles.  Values are (level_enum, confidence).
_RULE_MAP: dict[str, tuple[str, float]] = {
    # Intern / Entry
    "intern": ("INTERN", 0.95),
    "software intern": ("INTERN", 0.95),
    "engineering intern": ("INTERN", 0.95),
    "summer intern": ("INTERN", 0.95),
    "trainee": ("ENTRY", 0.90),
    "graduate trainee": ("ENTRY", 0.90),
    "fresher": ("ENTRY", 0.90),
    "junior software engineer": ("ENTRY", 0.90),
    "junior developer": ("ENTRY", 0.90),
    "associate software engineer": ("ENTRY", 0.90),
    "associate developer": ("ENTRY", 0.90),

    # SDE levels
    "sde": ("SDE_I", 0.85),
    "sde-1": ("SDE_I", 0.95),
    "sde-i": ("SDE_I", 0.95),
    "sde 1": ("SDE_I", 0.95),
    "sde i": ("SDE_I", 0.95),
    "software developer": ("SDE_I", 0.85),
    "software engineer": ("SDE_I", 0.85),
    "software engineer i": ("SDE_I", 0.92),
    "software engineer 1": ("SDE_I", 0.92),
    "sde-2": ("SDE_II", 0.95),
    "sde-ii": ("SDE_II", 0.95),
    "sde 2": ("SDE_II", 0.95),
    "sde ii": ("SDE_II", 0.95),
    "software engineer ii": ("SDE_II", 0.92),
    "software engineer 2": ("SDE_II", 0.92),
    "sde-3": ("SDE_III", 0.95),
    "sde-iii": ("SDE_III", 0.95),
    "sde 3": ("SDE_III", 0.95),
    "sde iii": ("SDE_III", 0.95),
    "software engineer iii": ("SDE_III", 0.92),
    "software engineer 3": ("SDE_III", 0.92),

    # Google-style levels
    "l3": ("L3", 0.95),
    "l4": ("L4", 0.95),
    "l5": ("L5", 0.95),
    "l6": ("L6", 0.95),
    "l7": ("L7", 0.95),

    # Senior
    "senior software engineer": ("L4", 0.90),
    "senior developer": ("SENIOR", 0.90),
    "senior engineer": ("SENIOR", 0.90),
    "senior sde": ("SENIOR", 0.90),
    "sr software engineer": ("SENIOR", 0.90),
    "sr. software engineer": ("SENIOR", 0.90),
    "sr engineer": ("SENIOR", 0.90),
    "lead engineer": ("SENIOR", 0.88),
    "lead developer": ("SENIOR", 0.88),
    "team lead": ("SENIOR", 0.85),
    "tech lead": ("SENIOR", 0.88),
    "technical lead": ("SENIOR", 0.88),

    # Staff+
    "staff engineer": ("STAFF", 0.95),
    "staff software engineer": ("STAFF", 0.95),
    "principal engineer": ("PRINCIPAL", 0.95),
    "principal software engineer": ("PRINCIPAL", 0.95),
    "distinguished engineer": ("DISTINGUISHED", 0.95),
    "fellow": ("FELLOW", 0.95),

    # Management
    "engineering manager": ("MANAGER", 0.92),
    "software engineering manager": ("MANAGER", 0.92),
    "development manager": ("MANAGER", 0.90),
    "manager": ("MANAGER", 0.85),
    "project manager": ("MANAGER", 0.85),
    "senior engineering manager": ("SENIOR_MANAGER", 0.92),
    "senior manager": ("SENIOR_MANAGER", 0.90),
    "director": ("DIRECTOR", 0.90),
    "director of engineering": ("DIRECTOR", 0.92),
    "engineering director": ("DIRECTOR", 0.92),
    "senior director": ("DIRECTOR", 0.90),
    "vice president": ("VP", 0.90),
    "vp": ("VP", 0.90),
    "vp of engineering": ("VP", 0.92),
    "svp": ("SVP", 0.92),
    "senior vice president": ("SVP", 0.92),
    "cto": ("C_LEVEL", 0.95),
    "ceo": ("C_LEVEL", 0.95),
    "coo": ("C_LEVEL", 0.95),
    "cfo": ("C_LEVEL", 0.95),
    "chief technology officer": ("C_LEVEL", 0.95),

    # Analyst / Consultant
    "analyst": ("ENTRY", 0.80),
    "senior analyst": ("SENIOR", 0.80),
    "consultant": ("SDE_I", 0.75),
    "senior consultant": ("SENIOR", 0.80),
    "associate consultant": ("ENTRY", 0.80),

    # Data / ML roles
    "data scientist": ("SDE_I", 0.80),
    "senior data scientist": ("SENIOR", 0.85),
    "data engineer": ("SDE_I", 0.80),
    "senior data engineer": ("SENIOR", 0.85),
    "ml engineer": ("SDE_I", 0.80),
    "machine learning engineer": ("SDE_I", 0.80),
    "senior ml engineer": ("SENIOR", 0.85),

    # DevOps / Infra
    "devops engineer": ("SDE_I", 0.80),
    "senior devops engineer": ("SENIOR", 0.85),
    "site reliability engineer": ("SDE_II", 0.85),
    "sre": ("SDE_II", 0.85),
    "senior sre": ("SENIOR", 0.85),

    # QA / Testing
    "qa engineer": ("SDE_I", 0.80),
    "test engineer": ("SDE_I", 0.80),
    "sdet": ("SDE_I", 0.85),
    "senior qa engineer": ("SENIOR", 0.85),
    "senior sdet": ("SENIOR", 0.85),

    # Product / Design
    "product manager": ("MANAGER", 0.80),
    "senior product manager": ("SENIOR_MANAGER", 0.80),
    "product designer": ("SDE_I", 0.75),
    "ux designer": ("SDE_I", 0.75),
}

# ── Experience-based heuristics ─────────────────────────────────────

def _experience_boost(base_level: str, confidence: float, exp_years: int | None) -> LevelResult:
    """
    Adjust level prediction based on experience when the role title is
    generic (e.g. 'software engineer' with 8 years experience → SENIOR).
    """
    if exp_years is None or confidence >= 0.90:
        return LevelResult(level=base_level, confidence=confidence)

    if base_level in ("SDE_I", "ENTRY") and exp_years >= 7:
        return LevelResult(level="SENIOR", confidence=min(confidence + 0.05, 0.90))
    if base_level in ("SDE_I", "ENTRY") and exp_years >= 4:
        return LevelResult(level="SDE_II", confidence=min(confidence + 0.05, 0.90))
    if base_level == "SDE_II" and exp_years >= 8:
        return LevelResult(level="SENIOR", confidence=min(confidence + 0.05, 0.90))

    return LevelResult(level=base_level, confidence=confidence)


# ── Layer 1: rule-based lookup ──────────────────────────────────────

def _clean_title(raw_title: str) -> str:
    """Lowercase, collapse whitespace, strip punctuation noise."""
    t = raw_title.strip().lower()
    t = re.sub(r"[^\w\s\-.]", "", t)       # keep hyphens & dots
    t = re.sub(r"\s+", " ", t).strip()
    return t


def map_level_rule(raw_title: str, experience_years: int | None = None) -> LevelResult | None:
    """
    Attempt rule-based level mapping.  Returns *None* if no rule matches.
    """
    cleaned = _clean_title(raw_title)
    if cleaned in _RULE_MAP:
        level, conf = _RULE_MAP[cleaned]
        return _experience_boost(level, conf, experience_years)
    # Try prefix matching for titles with extra words
    for key, (level, conf) in _RULE_MAP.items():
        if cleaned.startswith(key) or key.startswith(cleaned):
            return _experience_boost(level, max(conf - 0.05, 0.60), experience_years)
    return None


# ── Layer 2: LLM fallback ──────────────────────────────────────────

_LLM_PROMPT_TEMPLATE = """You are a career-level classifier. Given a job title and years of experience, return EXACTLY one JSON object with keys "level" and "confidence".

Valid levels: INTERN, ENTRY, SDE_I, SDE_II, SDE_III, L3, L4, L5, L6, L7, SENIOR, STAFF, PRINCIPAL, DISTINGUISHED, FELLOW, MANAGER, SENIOR_MANAGER, DIRECTOR, VP, SVP, C_LEVEL, UNKNOWN

Job title: "{title}"
Experience: {experience} years

Rules:
- Map the title to the closest matching level from the valid levels list.
- If the title strongly indicates a specific level, confidence should be 0.70-0.80.
- If the title is ambiguous, confidence should be 0.60-0.70.
- If you genuinely cannot determine the level, use "UNKNOWN" with confidence 0.40.

Return ONLY a JSON object like: {{"level": "SDE_II", "confidence": 0.72}}
No explanation, no markdown, no extra text.
"""


async def map_level_llm(
    raw_title: str,
    experience_years: int | None = None,
) -> LevelResult:
    """
    Call Groq LLM to classify an ambiguous title.  Returns LevelResult
    with confidence in the 0.6–0.8 range.
    """
    import json as _json

    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key:
        logger.warning("GROQ_API_KEY not set — returning UNKNOWN for '%s'", raw_title)
        return LevelResult(level="UNKNOWN", confidence=0.40)

    exp = experience_years if experience_years is not None else 0
    prompt = _LLM_PROMPT_TEMPLATE.format(title=raw_title, experience=exp)

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "llama-3.1-8b-instant",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.1,
                    "max_tokens": 80,
                },
            )
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"].strip()

            # Parse JSON from LLM response
            # Handle possible markdown code fences
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
                content = content.strip()

            parsed = _json.loads(content)
            level = str(parsed.get("level", "UNKNOWN")).upper().replace("-", "_").replace(" ", "_")
            confidence = float(parsed.get("confidence", 0.65))

            from .pydantic_validator import VALID_LEVELS
            if level not in VALID_LEVELS:
                level = "UNKNOWN"
                confidence = 0.40

            # Clamp LLM confidence to expected range
            confidence = max(0.40, min(confidence, 0.80))

            logger.info("LLM mapped '%s' → %s (%.2f)", raw_title, level, confidence)
            return LevelResult(level=level, confidence=confidence)

    except (httpx.HTTPStatusError, _json.JSONDecodeError, KeyError, ValueError) as exc:
        logger.error("LLM level mapping failed for '%s': %s", raw_title, exc)
        return LevelResult(level="UNKNOWN", confidence=0.40)


# ── Public API ──────────────────────────────────────────────────────

async def map_level(
    raw_title: str | None,
    experience_years: int | None = None,
) -> LevelResult:
    """
    Map a raw job title to a standardised level enum.

    Uses rule-based matching first, then falls back to LLM.

    Parameters
    ----------
    raw_title : str
        The raw job title / designation.
    experience_years : int, optional
        Years of experience for disambiguation.

    Returns
    -------
    LevelResult
        Named tuple with ``level`` and ``confidence``.

    Examples
    --------
    >>> import asyncio
    >>> asyncio.run(map_level("SDE-I"))
    LevelResult(level='SDE_I', confidence=0.95)
    >>> asyncio.run(map_level("Senior Software Engineer"))
    LevelResult(level='L4', confidence=0.9)
    """
    if not raw_title or not raw_title.strip():
        return LevelResult(level="UNKNOWN", confidence=0.40)

    # Layer 1: rules
    result = map_level_rule(raw_title, experience_years)
    if result is not None:
        return result

    # Layer 2: LLM fallback
    return await map_level_llm(raw_title, experience_years)
