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

# Copy entire project (backend + frontend)
COPY backend /app/backend
COPY frontend /app/frontend

WORKDIR /app/backend

# Expose backend API and frontend static server ports
EXPOSE 8000 3000

# Entrypoint script to start backend & frontend concurrently
CMD ["sh", "-c", "python init_db.py && python train_model.py && uvicorn main:app --host 0.0.0.0 --port 8000 & cd /app/frontend && python -m http.server 3000"]
