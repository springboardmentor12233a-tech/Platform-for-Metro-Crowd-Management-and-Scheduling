def test_create_train_as_admin(client, admin_token):
    response = client.post("/scheduling/trains", json={
        "train_code": "TEST-101",
        "line": "Blue line",
        "capacity": 300,
    }, headers=admin_token)
    assert response.status_code == 200
    data = response.json()
    assert data["train_code"] == "TEST-101"
    assert data["capacity"] == 300


def test_create_duplicate_train_code_fails(client, admin_token):
    client.post("/scheduling/trains", json={
        "train_code": "TEST-DUP",
        "line": "Red line",
        "capacity": 250,
    }, headers=admin_token)
    response = client.post("/scheduling/trains", json={
        "train_code": "TEST-DUP",
        "line": "Yellow line",
        "capacity": 250,
    }, headers=admin_token)
    assert response.status_code == 400


def test_create_train_without_admin_fails(client):
    client.post("/auth/register", json={
        "full_name": "Op User",
        "email": "opuser@example.com",
        "password": "pass12345",
        "role": "operator",
    })
    login = client.post("/auth/login", json={
        "email": "opuser@example.com",
        "password": "pass12345",
    })
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post("/scheduling/trains", json={
        "train_code": "TEST-FORBIDDEN",
        "line": "Blue line",
        "capacity": 300,
    }, headers=headers)
    assert response.status_code == 403


def test_create_and_list_schedule(client, admin_token):
    train_response = client.post("/scheduling/trains", json={
        "train_code": "TEST-SCHED-1",
        "line": "Blue line",
        "capacity": 300,
    }, headers=admin_token)
    train_id = train_response.json()["id"]

    schedule_response = client.post("/scheduling/schedules", json={
        "train_id": train_id,
        "from_station": "Rajiv Chowk",
        "to_station": "Dwarka Sector 21",
        "departure_time": "08:00",
        "arrival_time": "08:35",
        "frequency_minutes": 10,
        "period": "off_peak",
    }, headers=admin_token)
    assert schedule_response.status_code == 200
    schedule_id = schedule_response.json()["id"]

    list_response = client.get("/scheduling/schedules", headers=admin_token)
    assert list_response.status_code == 200
    assert any(s["id"] == schedule_id for s in list_response.json())


def test_frequency_adjustment_high_density(client, admin_token):
    train_response = client.post("/scheduling/trains", json={
        "train_code": "TEST-FREQ-1",
        "line": "Blue line",
        "capacity": 300,
    }, headers=admin_token)
    train_id = train_response.json()["id"]

    schedule_response = client.post("/scheduling/schedules", json={
        "train_id": train_id,
        "from_station": "A",
        "to_station": "B",
        "departure_time": "08:00",
        "arrival_time": "08:35",
        "frequency_minutes": 10,
        "period": "off_peak",
    }, headers=admin_token)
    schedule_id = schedule_response.json()["id"]

    response = client.patch(
        f"/scheduling/schedules/{schedule_id}/adjust-frequency",
        params={"current_density_percent": 85},
        headers=admin_token,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["frequency_minutes"] == 3
    assert data["period"] == "peak"


def test_frequency_adjustment_low_density(client, admin_token):
    train_response = client.post("/scheduling/trains", json={
        "train_code": "TEST-FREQ-2",
        "line": "Blue line",
        "capacity": 300,
    }, headers=admin_token)
    train_id = train_response.json()["id"]

    schedule_response = client.post("/scheduling/schedules", json={
        "train_id": train_id,
        "from_station": "A",
        "to_station": "B",
        "departure_time": "08:00",
        "arrival_time": "08:35",
        "frequency_minutes": 10,
        "period": "off_peak",
    }, headers=admin_token)
    schedule_id = schedule_response.json()["id"]

    response = client.patch(
        f"/scheduling/schedules/{schedule_id}/adjust-frequency",
        params={"current_density_percent": 30},
        headers=admin_token,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["frequency_minutes"] == 8
    assert data["period"] == "off_peak"