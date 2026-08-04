FROM python:3.11-slim

WORKDIR /app

# Install system dependencies needed for compiling certain packages (e.g. psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]
