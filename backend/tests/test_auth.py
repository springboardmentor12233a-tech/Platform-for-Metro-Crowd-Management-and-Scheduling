def test_register_new_user(client):
    response = client.post("/auth/register", json={
        "full_name": "Alice Operator",
        "email": "alice@example.com",
        "password": "securepass1",
        "role": "operator",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "alice@example.com"
    assert data["role"] == "operator"
    assert "password" not in data
    assert "hashed_password" not in data


def test_register_duplicate_email_fails(client):
    client.post("/auth/register", json={
        "full_name": "Bob",
        "email": "bob@example.com",
        "password": "pass12345",
        "role": "operator",
    })
    response = client.post("/auth/register", json={
        "full_name": "Bob Again",
        "email": "bob@example.com",
        "password": "pass12345",
        "role": "operator",
    })
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()


def test_login_with_correct_credentials(client):
    client.post("/auth/register", json={
        "full_name": "Carol",
        "email": "carol@example.com",
        "password": "mypassword",
        "role": "operator",
    })
    response = client.post("/auth/login", json={
        "email": "carol@example.com",
        "password": "mypassword",
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_login_with_wrong_password_fails(client):
    client.post("/auth/register", json={
        "full_name": "Dave",
        "email": "dave@example.com",
        "password": "correctpass",
        "role": "operator",
    })
    response = client.post("/auth/login", json={
        "email": "dave@example.com",
        "password": "wrongpass",
    })
    assert response.status_code == 401


def test_login_with_nonexistent_email_fails(client):
    response = client.post("/auth/login", json={
        "email": "nobody@example.com",
        "password": "whatever",
    })
    assert response.status_code == 401


def test_protected_route_requires_token(client):
    response = client.get("/operators/me")
    assert response.status_code in (401, 403)