import unittest
from fastapi.testclient import TestClient
import sys
import os

# Ensure backend path is on sys.path
sys.path.insert(0, os.path.dirname(__file__))

from main import app

class TestMetroFlowPlatform(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        # Login to obtain token
        login_res = cls.client.post("/auth/login", json={
            "username": "admin",
            "password": "adminpassword"
        })
        assert login_res.status_code == 200, "Admin login failed during test setup"
        cls.token = login_res.json().get("token")
        cls.headers = {"Authorization": f"Bearer {cls.token}"}

    # -------------------------------------------------------------
    # 1. System Health & User Management Tests (Milestone 1)
    # -------------------------------------------------------------
    def test_01_root_health(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json().get("status"), "Healthy")

    def test_02_auth_admin_login(self):
        res = self.client.post("/auth/login", json={
            "username": "admin",
            "password": "adminpassword"
        })
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["user"]["role"], "admin")

    def test_03_auth_operator_login(self):
        res = self.client.post("/auth/login", json={
            "username": "operator",
            "password": "operatorpassword"
        })
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["user"]["role"], "operator")

    def test_04_auth_invalid_login(self):
        res = self.client.post("/auth/login", json={
            "username": "invalid_user",
            "password": "wrong_password"
        })
        self.assertEqual(res.status_code, 401)

    def test_05_admin_get_users(self):
        res = self.client.get("/admin/users", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        self.assertGreaterEqual(len(res.json().get("users", [])), 2)

    # -------------------------------------------------------------
    # 2. Crowd Monitoring & Density Tests (Milestone 1 & 2)
    # -------------------------------------------------------------
    def test_06_crowd_summary(self):
        res = self.client.get("/crowd/summary")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("metrics", data)
        self.assertIn("total_entries", data["metrics"])
        self.assertGreater(len(data.get("live_records", [])), 0)

    def test_07_crowd_alerts(self):
        res = self.client.get("/crowd/alerts")
        self.assertEqual(res.status_code, 200)
        self.assertIn("alerts", res.json())

    def test_08_crowd_occupancy(self):
        res = self.client.get("/crowd/occupancy")
        self.assertEqual(res.status_code, 200)
        self.assertIn("trains", res.json())

    def test_09_crowd_heatmap(self):
        res = self.client.get("/crowd/heatmap")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("stations", data)
        self.assertGreater(len(data["stations"]), 0)
        # Verify heatmap payload fields
        sample = data["stations"][0]
        self.assertIn("station", sample)
        self.assertIn("intensity_percent", sample)
        self.assertIn("congestion_level", sample)

    # -------------------------------------------------------------
    # 3. Train Scheduling & Frequency Tests (Milestone 2)
    # -------------------------------------------------------------
    def test_10_get_schedules(self):
        res = self.client.get("/scheduling/schedules")
        self.assertEqual(res.status_code, 200)
        self.assertGreater(len(res.json().get("schedules", [])), 0)

    def test_11_get_schedules_filtered(self):
        res = self.client.get("/scheduling/schedules?line=Yellow%20Line")
        self.assertEqual(res.status_code, 200)
        for item in res.json().get("schedules", []):
            self.assertEqual(item["line"], "Yellow Line")

    def test_12_frequency_recommendations(self):
        res = self.client.get("/scheduling/frequency-recommendations")
        self.assertEqual(res.status_code, 200)
        self.assertIn("recommendations", res.json())
        self.assertGreater(len(res.json()["recommendations"]), 0)

    def test_13_adjust_frequency(self):
        res = self.client.post("/scheduling/adjust-frequency", json={
            "line": "Yellow Line",
            "new_frequency": 14,
            "reason": "Automated peak surge compensation",
            "operator_username": "admin"
        })
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["new_frequency"], 14)

    # -------------------------------------------------------------
    # 4. Delay Logging & Alerts Workflows (Milestone 3)
    # -------------------------------------------------------------
    def test_14_log_delay(self):
        res = self.client.post("/scheduling/log-delay", json={
            "train_id": "TRN-UNITTEST",
            "line": "Blue Line",
            "station": "Rajiv Chowk",
            "delay_minutes": 8,
            "cause": "Automated Unit Test Delay",
            "operator_username": "admin"
        })
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["delay_minutes"], 8)

    def test_15_get_delay_logs(self):
        res = self.client.get("/scheduling/delays")
        self.assertEqual(res.status_code, 200)
        self.assertGreater(len(res.json().get("delays", [])), 0)

    def test_16_resolve_congestion_alert(self):
        res = self.client.post("/operator/resolve-alert", json={
            "alert_id": "ALERT-UNITTEST-01",
            "username": "admin",
            "notes": "De-escalated via platform marshals."
        })
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "success")

    # -------------------------------------------------------------
    # 5. Emergency Announcements (Milestone 3)
    # -------------------------------------------------------------
    def test_17_broadcast_announcement(self):
        res = self.client.post("/notifications/announcement", json={
            "title": "Automated Test Emergency Broadcast",
            "message": "Platform maintenance underway on Yellow Line.",
            "line": "Yellow Line",
            "station": "Rajiv Chowk",
            "severity": "CRITICAL",
            "broadcast_by": "admin"
        })
        self.assertEqual(res.status_code, 200)

    def test_18_get_active_announcements(self):
        res = self.client.get("/notifications/active")
        self.assertEqual(res.status_code, 200)
        self.assertIn("announcements", res.json())
        self.assertGreater(len(res.json()["announcements"]), 0)

    # -------------------------------------------------------------
    # 6. AI Forecasting & Inference (Milestone 2 & 3)
    # -------------------------------------------------------------
    def test_19_ai_demand_prediction(self):
        res = self.client.post("/ai/predict-demand", json={
            "station": "Rajiv Chowk",
            "line": "Yellow Line",
            "hour": 9,
            "weather": "Clear",
            "day": "Monday"
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("prediction", res.json())

    def test_20_ai_crowd_classification(self):
        res = self.client.post("/ai/predict-crowd", json={
            "passenger_count": 420,
            "occupancy_percent": 91.5,
            "line": "Yellow Line"
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("prediction", res.json())

    def test_21_ai_metrics(self):
        res = self.client.get("/ai/model-metrics")
        self.assertEqual(res.status_code, 200)
        self.assertIn("metrics", res.json())

    # -------------------------------------------------------------
    # 7. Operational Analytics & Export Reports (Milestone 3)
    # -------------------------------------------------------------
    def test_22_traffic_report(self):
        res = self.client.get("/ai/traffic-report")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("report", data)
        self.assertIn("system_summary", data["report"])
        self.assertIn("line_performance", data["report"])

    def test_23_export_excel(self):
        res = self.client.get("/analytics/export/excel")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.headers.get("content-type"), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        self.assertGreater(len(res.content), 100)

    def test_24_export_pdf(self):
        res = self.client.get("/analytics/export/pdf")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.headers.get("content-type"), "application/pdf")
        self.assertGreater(len(res.content), 100)

if __name__ == "__main__":
    unittest.main()
