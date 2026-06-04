# TalentDash AI Data Pipeline

## Overview

The pipeline scrapes salary data from public sources, normalises it using a combination of rule-based logic and LLM inference, validates with Pydantic, deduplicates, and ingests into the TalentDash backend API.

## Architecture

```
Scrape → LLM Normalise → Pydantic Validate → Dedup → Ingest → Report
```

## Setup

```bash
cd pipeline
pip install -r requirements.txt
playwright install chromium
```

Set environment variables in `.env`:
```
GROQ_API_KEY=your_groq_api_key
TALENTDASH_API_URL=http://localhost:3000
```

## Usage

```bash
# Full pipeline (scrape + normalise + validate + dedup + ingest)
python -m pipeline.scraper.main

# Dry run (scrape + normalise only, no storage)
python -m pipeline.scraper.main --dry
```

## Company Normalisation Examples

| Raw Input | Normalised Output |
|---|---|
| `"Google India Pvt. Ltd."` | `"google"` |
| `"GOOGLE"` | `"google"` |
| `"Tata Consultancy Services"` | `"tcs"` |
| `"TCS Ltd."` | `"tcs"` |
| `"amazon.com"` | `"amazon"` |
| `"Infosys BPO"` | `"infosys"` |
| `"Flipkart Internet Pvt Ltd"` | `"flipkart"` |
| `"Wipro Technologies"` | `"wipro"` |

## Raw → Normalised Side-by-Side

### Record 1
**Raw:**
```json
{
  "raw_company": "Google India Pvt. Ltd.",
  "raw_role": "Software Engineer",
  "raw_salary_text": "₹25-35 LPA",
  "raw_location": "Bengaluru",
  "raw_experience": "2-4 yrs"
}
```
**Normalised:**
```json
{
  "company": "google",
  "role": "Software Engineer",
  "level_standardized": "L4",
  "location": "Bengaluru",
  "currency": "INR",
  "experience_years": 3,
  "base_salary": 300000000,
  "bonus": 0,
  "stock": 0,
  "source": "SCRAPED",
  "confidence_score": 0.65
}
```

### Record 2
**Raw:**
```json
{
  "raw_company": "TCS Ltd.",
  "raw_role": "Software Engineer",
  "raw_salary_text": "₹6-8 LPA",
  "raw_location": "Mumbai",
  "raw_experience": "1-3 yrs"
}
```
**Normalised:**
```json
{
  "company": "tcs",
  "role": "Software Engineer",
  "level_standardized": "L3",
  "location": "Mumbai",
  "currency": "INR",
  "experience_years": 2,
  "base_salary": 70000000,
  "bonus": 0,
  "stock": 0,
  "source": "SCRAPED",
  "confidence_score": 0.85
}
```

### Record 3
**Raw:**
```json
{
  "raw_company": "Flipkart Internet Pvt Ltd",
  "raw_role": "SDE-I",
  "raw_salary_text": "₹16-20 LPA",
  "raw_location": "Bengaluru",
  "raw_experience": "0-2 yrs"
}
```
**Normalised:**
```json
{
  "company": "flipkart",
  "role": "SDE-I",
  "level_standardized": "SDE_I",
  "location": "Bengaluru",
  "currency": "INR",
  "experience_years": 1,
  "base_salary": 180000000,
  "bonus": 0,
  "stock": 0,
  "source": "SCRAPED",
  "confidence_score": 0.90
}
```

## Rejected Records Examples

### Rejection 1: Invalid experience
```json
{
  "raw_input": { "company": "test", "role": "Engineer", "experience_years": -1 },
  "error": "experience_years: Value must be greater than 0"
}
```

### Rejection 2: Invalid level
```json
{
  "raw_input": { "company": "google", "role": "Senior Software Engineer", "level_standardized": "Senior" },
  "error": "level_standardized: Value must be one of: L3, L4, L5, L6, SDE_I, SDE_II, SDE_III, STAFF, PRINCIPAL, IC4, IC5"
}
```

## LLM Prompt

The normalisation prompt instructs the LLM to return a pure JSON array (no markdown fences):

```
System: You are a salary data normalisation engine. Return ONLY a valid JSON array.
        No preamble, no markdown fences, no explanation.

User: Normalise the following raw salary records into the TalentDash
      integration contract format. Return a JSON array of objects.

      Fields: company, role, level_standardized (enum), location, currency,
      experience_years (int), base_salary (paise), bonus (int), stock (int),
      source ("SCRAPED"), confidence_score (0.0-1.0)

      Edge case rules:
        - Salary range '18-22 LPA' → midpoint in paise: 2000000000
        - Ambiguous level → best guess enum + confidence 0.5-0.65
        - Missing field → null or best inference
```

## Quality Report (Sample)

```
============================================================
  TALENTDASH PIPELINE — QUALITY REPORT
============================================================

  📥 Total records scraped:          12
  🤖 Passed LLM normalisation:       11
  ✅ Passed Pydantic validation:      10
  ❌ Rejected:                        1

  Rejection breakdown:
    • experience_years: must be > 0: 1

  🔁 Duplicates skipped:              0
  💾 Records stored successfully:     10

  📊 LLM pass rate:                   91.7%
  📊 Pydantic pass rate:              83.3%
  📊 Store rate:                      83.3%
============================================================
```

## If Blocked by AmbitionBox

If the scraper encounters bot detection (Cloudflare, CAPTCHA, 403 responses):

1. **Detection method**: Cloudflare JS challenge or HTTP 403 with challenge page
2. **Fallback**: The pipeline automatically falls back to mock raw records
3. **Solution for production**: Use residential proxies, browser fingerprint randomisation, or a commercial scraping API

The pipeline is designed to be resilient — a scraper failure does not crash the normalisation or validation stages.
