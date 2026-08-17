def test_copilot_chat(client, admin_token):
    response = client.post(
        "/copilot/chat",
        json={"query": "Which stations are critical right now?"},
        headers=admin_token,
    )
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert data["query"] == "Which stations are critical right now?"


def test_generate_announcement(client, admin_token):
    response = client.post(
        "/copilot/generate-announcement",
        json={
            "station": "Rajiv Chowk",
            "line": "Blue line",
            "incident_type": "Platform Overcrowding",
            "delay_minutes": 5
        },
        headers=admin_token,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["station"] == "Rajiv Chowk"
    assert "announcement_text" in data
    assert "Rajiv Chowk" in data["announcement_text"]


def test_shift_handover(client, admin_token):
    response = client.post(
        "/copilot/shift-handover",
        headers=admin_token,
    )
    assert response.status_code == 200
    data = response.json()
    assert "report_markdown" in data
    assert "Shift Handover" in data["report_markdown"]


def test_parse_schedule(client, admin_token):
    response = client.post(
        "/copilot/parse-schedule",
        json={"prompt": "Schedule 4 trains on Yellow Line from Samaypur Badli starting at 08:00 AM with 3.5 min headway"},
        headers=admin_token,
    )
    assert response.status_code == 200
    data = response.json()
    assert "parsed_schedule" in data
    assert data["parsed_schedule"]["line"] == "Yellow line"
