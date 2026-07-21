def test_create_alert_as_admin(client, admin_token):
    response = client.post("/alerts/", json={
        "alert_type": "delay",
        "severity": "medium",
        "station": "Rajiv Chowk",
        "message": "Test delay alert",
    }, headers=admin_token)
    assert response.status_code == 200
    data = response.json()
    assert data["alert_type"] == "delay"
    assert data["is_active"] is True


def test_list_alerts_shows_active_only_by_default(client, admin_token):
    create_response = client.post("/alerts/", json={
        "alert_type": "delay",
        "severity": "low",
        "station": "Test Station",
        "message": "Alert to be resolved",
    }, headers=admin_token)
    alert_id = create_response.json()["id"]

    client.patch(f"/alerts/{alert_id}/resolve", headers=admin_token)

    list_response = client.get("/alerts/", headers=admin_token)
    assert list_response.status_code == 200
    active_ids = [a["id"] for a in list_response.json()]
    assert alert_id not in active_ids


def test_resolve_nonexistent_alert_returns_404(client, admin_token):
    response = client.patch("/alerts/99999/resolve", headers=admin_token)
    assert response.status_code == 404


def test_broadcast_emergency(client, admin_token):
    response = client.post(
        "/alerts/emergency",
        params={"message": "Test emergency broadcast"},
        headers=admin_token,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["alert_type"] == "emergency"
    assert data["severity"] == "critical"
    assert data["station"] is None