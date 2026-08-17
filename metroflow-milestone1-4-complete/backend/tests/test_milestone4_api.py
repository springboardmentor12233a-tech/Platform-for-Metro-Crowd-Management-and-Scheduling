from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def auth_headers():
    response = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_milestone4_report_endpoint():
    response = client.get("/api/milestone4/report", headers=auth_headers())
    assert response.status_code == 200
    body = response.json()
    assert body["project_status"] == "Milestone 1 to Milestone 4 completed"
    assert len(body["testing"]["validation_checks"]) >= 6
    assert len(body["deployment"]["deployment_items"]) >= 6
