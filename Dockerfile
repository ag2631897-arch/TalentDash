# Use the official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables to prevent Python from writing .pyc files
# and to ensure stdout and stderr are not buffered
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies needed for Playwright/Chromium
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Install pip requirements
COPY pipeline/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright browser
RUN playwright install chromium

# Copy the rest of the application code
# Assuming this Dockerfile is in the root directory (so it copies the whole project or just pipeline)
COPY pipeline/ ./pipeline/

# By default, run the pipeline in continuous mode
# The scraper code looks for a .env file or environment variables
CMD ["python", "-m", "pipeline.scraper.main"]
