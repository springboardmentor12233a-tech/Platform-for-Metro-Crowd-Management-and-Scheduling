# MetroFlow AI: API testing & Verification Guide

FastAPI exposes an interactive Swagger document schema at `http://localhost:5000/docs` to test all active endpoints.

---

## 🧪 Running Automated Tests

To execute our backend unit and integration test suite:

```bash
cd backend
# Run test suite
venv\Scripts\python -m pytest tests -vv
```

---

## 🛰️ Core API Endpoints Reference

### 1. Authentication (`/auth`)
- **`POST /auth/register`**: Register a new system operator.
- **`POST /auth/login`**: Authenticate credentials, returns a JWT token.
- **`GET /auth/profile`**: Returns the current authenticated operator's details. Enforces JWT headers.
- **`GET /auth/users`**: List all registered users (Admin only).
- **`PATCH /auth/change-role`**: Promote or demote operator roles (Admin only).

### 2. Live Telemetry (`/stations`, `/routes`, `/trains`, `/train-schedules`)
- CRUD operations for all metro assets.
- **`PUT /trains/{id}`**: Update train status. Can toggle a train's status to `Delayed` to simulate scheduling adjustments.

### 3. Analytics (`/analytics`)
- **`GET /analytics/summary`**: Returns total stations, active trains, delayed train lists, passenger totals, and active emergency alerts count.
- **`GET /analytics/station-performance`**: Returns top stations by flow volume.
- **`GET /analytics/route-performance`**: Returns passenger flow per transit route.
- **`GET /analytics/trends`**: Returns daily transit ridership counts.

### 4. AI Inferences (`/predict`)
- **`POST /predict/`**: Evaluates Models A, B, C, and D for a specific travel segment.
  - **Request Body**:
    ```json
    {
      "hour": 9,
      "day_name": "Monday",
      "month": 7,
      "is_holiday": false,
      "weather": "Clear",
      "from_station": "Rajiv Chowk",
      "to_station": "Kashmere Gate",
      "distance_km": 4.5,
      "ticket_type": "Smart Card",
      "is_interchange": true
    }
    ```

### 5. Copilot Assistant (`/ai/chat`)
- **`POST /ai/chat`**: Grounded chat connection calling xAI Grok.
  - **Request Body**:
    ```json
    {
      "message": "Is there any delayed train on the Yellow Line?",
      "history": []
    }
    ```
