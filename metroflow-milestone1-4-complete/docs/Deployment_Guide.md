# MetroFlow Deployment Guide

## Local run

### Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Open:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Docker Compose run

From project root:

```powershell
docker compose build
docker compose up
```

Open:

```text
Frontend: http://localhost:5173
Backend docs: http://localhost:8000/docs
```

## Cloud deployment plan

The same Docker setup can be deployed to AWS or Azure by using a container service, managed PostgreSQL database, and environment variables.

Recommended production environment variables:

```text
DATABASE_URL
SECRET_KEY
ACCESS_TOKEN_EXPIRE_MINUTES
MAX_IMPORT_ROWS
DATASET_PATH
CORS_ORIGINS
VITE_API_BASE_URL
```
