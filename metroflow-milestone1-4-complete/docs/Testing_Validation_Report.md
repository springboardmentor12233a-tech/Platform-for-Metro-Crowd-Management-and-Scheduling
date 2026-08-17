# MetroFlow Testing and Validation Report

## Validation scope

The following workflows were tested for the final milestone:

- Backend startup
- API health check
- Admin login
- Operator login
- JWT protected routes
- Dashboard summary
- Passenger trend
- Station-wise crowd status
- Congestion heatmap
- Train schedule management
- Frequency adjustment recommendations
- AI passenger demand forecasting
- Traffic analysis report
- Alerts and real-time updates
- Emergency announcements
- Analytics and operational insights
- Milestone 4 testing and deployment report

## API testing

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

Postman collection:

```text
postman/MetroFlow_Milestone1_to_4.postman_collection.json
```

## Automated test command

```powershell
cd backend
.\venv\Scripts\activate
python -m pytest
```

## Validation result

The project is ready for final demonstration up to Milestone 4.
