# Dockerfile for Python App
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN python -m venv .venv && \
    . .venv/bin/activate && \
    pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy application code
COPY . .

# Activate virtualenv and run the app
CMD [".venv/bin/python", "main.py"]  # Adjust to your actual main file
