# AI MetroFlow --- Master Requirements & Antigravity Build Specification

## Mission
Complete the EXISTING repository for MetroFlow: AI Platform for MetroCrowd Management and Scheduling. Do not create a new project or rewrite working modules. Inspect the whole repository first, preserve current architecture/API contracts/database configuration, and extend only what is missing.

## Source Requirements
The platform must monitor passenger flow, passenger density, station congestion, train occupancy/operations and peak-hour demand; predict crowd density and passenger demand; optimize scheduling/frequency; generate alerts; provide operational analytics; and be Docker/cloud-ready.

Required modules:
1. User Management
2. Crowd Monitoring
3. Scheduling Management
4. AI Prediction
5. Alert & Notification
6. Analytics Dashboard

**IMPORTANT:** Do NOT add computer-vision/CCTV image processing. The specification requires transportation/ridership/operational datasets instead.

## Existing Work to Preserve
Audit and preserve existing FastAPI, PostgreSQL, MongoDB, SQLAlchemy, JWT, Swagger, RBAC (admin/manager/user), authentication, stations, routes/trains/schedules/passenger APIs where present, crowd prediction, prediction history, analytics, recommendation and alert services, plus existing model artifacts under `backend/ai/models`.

Do not duplicate existing files or endpoints. Fix/complete them.

## Backend
Use FastAPI layered architecture: api, schemas, models, repositories, services, middleware, database, core/utils. Complete CRUD and validation for stations, routes, trains, schedules and passenger/operational records. Add meaningful errors, transaction rollback, pagination/filtering where useful, Swagger response schemas and RBAC.

RBAC:
- **admin**: full access and destructive/master-data operations
- **manager**: operational read/monitor/scheduling/analytics/alerts as appropriate
- **user**: read-only passenger-facing information/profile
Never permit privilege escalation.

## Crowd Monitoring
Implement station-wise passenger density, inflow/outflow, current/latest crowd, history, congestion status, peak station/hour, configurable Low/Medium/High/Very High-or-Critical severity, trends, and a heatmap API returning station name/id, coordinates, passenger density/count, crowd level/intensity and timestamp.

If no physical realtime feed exists, use latest DB data or dataset replay and label it as simulation/demo rather than pretending it is live sensor data.

## Machine Learning
ML is mandatory and must NOT be replaced by the LLM. Inspect `datasets/` and `EDA/` before training. Build reproducible preprocessing/training/evaluation pipelines with missing-value handling, categorical encoding, feature engineering, leakage prevention, train/validation/test strategy, reproducible random seeds and persisted artifacts. Preserve existing `crowd_prediction.pkl`/`label_encoders.pkl` if valid.

### Model A --- Crowd/Passenger Count Prediction
Use available inputs such as hour, day, month, holiday, weather, origin, destination, distance, ticket type and interchange. Keep the existing `/predict` contract compatible. Compare a baseline and appropriate tree ensembles (Linear Regression, Random Forest, GradientBoosting/HistGradientBoosting; XGBoost only if safely available). Evaluate MAE, RMSE and R². Select based on measured results.

### Model B --- Passenger Demand Forecasting
Forecast next-hour/upcoming-hours and daily/peak demand where data supports it. Use timestamp/lag/time features. Compare a sensible baseline and tree-based approach. Use LSTM only if the dataset genuinely supports sequential deep learning and time allows.

### Model C --- Congestion / Peak-Hour Classification
Derive defensible labels from operational/density thresholds and predict congestion and/or peak status. Evaluate accuracy, precision, recall, F1 and confusion matrix.

### Model D --- Scheduling/Frequency Recommendation
Use demand prediction + capacity + congestion + schedule/delay information. If labeled recommendation data is unavailable, implement an explainable rule/score-based optimizer rather than fabricating a supervised ML model. Output frequency/headway/train-allocation recommendations and distinguish predictions from rules.

Never fabricate metrics. Save actual evaluation JSON/artifacts and expose useful metrics in the UI.

## Scheduling
Implement train schedule management, peak-hour optimization, frequency adjustment, delay handling, train/route allocation, schedule recommendations and real-time/latest schedule updates. Consume ML demand/crowd output where appropriate.

## Alerts
Implement overcrowding alerts, delay notifications, emergency announcements, schedule updates, severity/status/history and notification UI. Admin/manager permissions must follow RBAC. Use WebSockets/realtime push if reliable; otherwise polling is acceptable.

## Operational Monitoring
Provide active trains, delayed trains, congested stations, occupancy where supported, system status, latest alerts, current/predicted passenger load and schedule health.

## Analytics
Implement station-wise analytics, passenger inflow/outflow, traffic trends, congestion trends, peak-hour analytics, route analytics, station performance, prediction insights, operational reports and daily/weekly/monthly summaries. Charts must use backend data, not hardcoded fake values.

Create/complete a dashboard summary API with total stations/routes/trains, passenger totals, current crowd, congested stations, peak station/hour, active/delayed trains, average occupancy where supported, latest alerts and latest predictions.

## External LLM --- Grok/xAI
Integrate Grok server-side using environment variables such as `XAI_API_KEY` and `XAI_MODEL`. Never expose/hardcode the key. Create a provider abstraction.

The LLM is a copilot, not the forecasting engine. It should:
- explain predictions
- explain congestion using supplied MetroFlow data
- summarize dashboard/operations
- summarize analytics
- explain metrics
- explain scheduling recommendations
- suggest operational actions
- generate daily/weekly summaries
- answer role-appropriate MetroFlow questions
- provide passenger travel/crowd guidance

Ground it using current backend data. Instruct it not to invent missing station status/counts. Add `POST /ai/chat` (and summary/insight endpoints if useful), timeout/error handling, bounded output, graceful provider failure, rate limiting where practical and optional chat history.

## Frontend
Build/finish an attractive responsive frontend using the existing framework; prefer Next.js + TypeScript + Tailwind if incomplete. Compatible additions may include shadcn/ui, Framer Motion, Recharts, React Leaflet, TanStack Query, React Hook Form and Zod.

Design: premium AI Smart City Metro Operations Command Center. Dark-first with optional light mode, navy/slate surfaces, cyan/blue/violet accents, restrained gradients/glass effects, excellent typography, meaningful status colors, micro-interactions, skeleton loaders, polished errors/empty states, responsive sidebar/topbar and accessible contrast. Avoid a generic admin template or excessive neon.

Required functional pages: Landing, Login, Register, Dashboard, Crowd Monitoring, Crowd Heatmap, Stations/Detail, Routes/Detail, Trains/Detail, Scheduling, AI Predictions, Prediction History, Demand Forecast, Analytics, Alerts, AI Assistant, Profile, Admin/Role Management, Settings.

Dashboard should include KPI cards, passenger-flow/crowd charts, congestion distribution, station ranking, map/heatmap preview, train status, prediction, demand forecast, alerts and AI insight. Every required widget must use backend data or clearly labeled demo data derived from repository datasets.

Use React Leaflet/OpenStreetMap for station/crowd maps unless an existing map works. Centralize frontend API calls; attach JWT automatically; handle 401s/errors/loading. Use `NEXT_PUBLIC_API_URL`. Never require manual token copying in normal UI.

## Databases / Redis
Preserve current DB responsibilities. PostgreSQL for structured operational data; MongoDB for existing users and flexible logs/analytics/chat where appropriate. Add Redis where useful for cache/rate limiting/realtime state and make local degradation graceful when possible.

## Security
Preserve password hashing, JWT expiry/verification, RBAC, safe CORS, validation and `.env` secrets. Add `.env.example` without secrets. Grok key remains backend-only. Do not risk breaking working auth merely to add optional auth complexity.

## Testing
Add practical tests/smoke checks for login/profile/JWT/RBAC, stations, prediction, history, crowd monitoring, scheduling recommendation, alerts, analytics and mocked Grok behavior. Run backend and frontend builds and fix reproducible failures.

## Docker & Deployment
Create/fix backend Dockerfile, frontend Dockerfile, docker-compose.yml, PostgreSQL, MongoDB and Redis services, environment templates and health checks where practical. Make it AWS/Azure-ready. Kubernetes can be documented as optional; do not make it mandatory for today's local submission.

## Documentation
Create/update `README.md` plus `API_TESTING.md`, `ML_MODELS.md`, `DEPLOYMENT.md`, `DEMO_GUIDE.md` and `.env.example`. Include setup, architecture, features, RBAC matrix, ML training/evaluation, Grok configuration, Docker commands, exact run commands, demo flow, metrics and known limitations.

## Required End-to-End Demo
Login → dashboard → station crowd monitoring → congestion heatmap → ML crowd/demand prediction → severity → scheduling/frequency recommendation → alert → analytics → Grok explanation/recommendation → role-appropriate operational action → history retained.
