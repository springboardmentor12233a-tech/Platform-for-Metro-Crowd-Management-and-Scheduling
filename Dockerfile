FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend /app/backend

WORKDIR /app/backend

# Expose port
EXPOSE 8000

# Command to initialize DB, train models, and run server
CMD ["sh", "-c", "python init_db.py && python train_model.py && uvicorn main:app --host 0.0.0.0 --port 8000"]
