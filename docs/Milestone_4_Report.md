# MetroFlow: AI Platform for Metro Crowd Management and Scheduling

# Milestone 4 Report

Submitted by: Muni Pujitha Punugoti

| Item | Details |
|---|---|
| Branch Name | muni-pujitha |
| Frontend | React |
| Backend | Python FastAPI |
| Authentication | JWT with admin and operator roles |
| Dataset | Delhi Metro Dataset - EDA & Data Visualization |
| Deployment | Docker Compose with frontend, backend, and PostgreSQL |

## 1. Project Overview

MetroFlow is a metro crowd management and scheduling platform designed to help metro authorities monitor passenger flow, manage train scheduling, predict passenger demand, and generate operational alerts. Milestone 4 focuses on testing, validation, deployment preparation, UI improvement, final documentation, and end-to-end demonstration readiness.

## 2. Milestone 4 Objective

Milestone 4 completes the final project phase by validating all workflows developed in earlier milestones and preparing the platform for demonstration. The focus is on application testing, workflow validation, UI responsiveness, Docker based deployment setup, final documentation, and presentation preparation.

## 3. Testing and Workflow Validation

The following workflows were validated:

| Validation Area | Status | Description |
|---|---|---|
| Backend startup | Completed | FastAPI application starts successfully and loads the dataset. |
| Authentication | Completed | Admin and operator users can login using JWT authentication. |
| Crowd monitoring | Completed | Passenger trend, ticket split, congestion heatmap, and station table are working. |
| Scheduling workflow | Completed | Train schedule records, delay status, and frequency recommendations are working. |
| AI prediction | Completed | Passenger demand forecasting and station risk prediction are working. |
| Alerts and notifications | Completed | Crowd alerts, delay updates, and emergency announcements are working. |
| Analytics dashboard | Completed | Station performance, operational insights, and predicted peak values are displayed. |
| Milestone 4 validation | Completed | Testing report, deployment readiness report, and final demo report APIs are added. |

## 4. Deployment Setup

Deployment preparation was added using Docker and Docker Compose.

| Deployment Component | Purpose |
|---|---|
| backend/Dockerfile | Builds the FastAPI backend container. |
| frontend/Dockerfile | Builds the React frontend and serves it using Nginx. |
| docker-compose.yml | Runs PostgreSQL, backend, and frontend services together. |
| backend/.env.example | Provides backend environment configuration. |
| frontend/.env.example | Provides frontend API base URL configuration. |
| PostgreSQL service | Supports production-like database setup through Docker Compose. |

## 5. UI Responsiveness and Optimization

The dashboard was organized to support a complete demonstration from Milestone 1 to Milestone 4. The UI includes responsive cards, charts, tables, heatmaps, and validation panels. Admin and operator users can view role-aware dashboard messages. The Milestone 4 section summarizes testing status, deployment readiness, final demo flow, and completed outcomes.

## 6. Milestone 4 API Endpoints Implemented

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /health | Backend health check endpoint. |
| GET | /api/milestone4/testing-report | Returns testing and workflow validation status. |
| GET | /api/milestone4/deployment-readiness | Returns Docker and deployment readiness status. |
| GET | /api/milestone4/final-demo-report | Returns final demonstration plan and outcomes. |
| GET | /api/milestone4/report | Returns complete Milestone 4 dashboard data. |

## 7. Final Demonstration Flow

The final demo can be shown in this order:

1. Open the GitHub branch `muni-pujitha`.
2. Open FastAPI backend and verify Swagger UI.
3. Login as admin.
4. Show dashboard summary cards.
5. Show Milestone 1 crowd monitoring sections.
6. Show Milestone 2 traffic, scheduling, frequency, and AI forecasting sections.
7. Show Milestone 3 alerts, announcements, heatmap, analytics, and station table.
8. Show Milestone 4 testing, deployment readiness, and final demo flow.
9. Login as operator and show role-based monitoring view.
10. Show documentation, Postman collection, and screenshots.

## 8. Milestone 4 Outcomes Completed

- Application testing and workflow validation completed.
- Health check endpoint added.
- Milestone 4 validation APIs added.
- Dockerfiles added for backend and frontend.
- Docker Compose updated with frontend, backend, and PostgreSQL services.
- Final documentation and deployment guide prepared.
- Postman collection updated.
- Screenshot guide prepared.
- Final dashboard demonstration flow completed.

## 9. Final Project Status

The MetroFlow project is completed up to Milestone 4. It includes crowd monitoring, train scheduling, AI prediction, alerts, analytics, testing validation, deployment readiness, documentation, and final demonstration support.

Submitted by

Muni Pujitha Punugoti
