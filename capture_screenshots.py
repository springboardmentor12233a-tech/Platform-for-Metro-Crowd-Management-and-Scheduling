import os
import time
import subprocess
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

SCREENSHOTS_DIR = os.path.join(os.path.dirname(__file__), "screenshots")
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

def capture_ui_screenshots():
    # Start backend
    backend_proc = subprocess.Popen(
        ["uvicorn", "main:app", "--port", "8000"],
        cwd=os.path.join(os.path.dirname(__file__), "backend"),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    # Start frontend
    frontend_proc = subprocess.Popen(
        ["python", "-m", "http.server", "3000"],
        cwd=os.path.join(os.path.dirname(__file__), "frontend"),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    print("Waiting for servers to start...")
    time.sleep(3)

    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1440,920")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    
    driver = webdriver.Chrome(options=options)
    
    try:
        # 1. Login Screen
        driver.get("http://localhost:3000")
        time.sleep(1.5)
        path1 = os.path.join(SCREENSHOTS_DIR, "01_login_portal.png")
        driver.save_screenshot(path1)
        print("Captured:", path1)

        # Trigger login via JS execute
        driver.execute_script("quickLogin();")
        time.sleep(2)

        # 2. Crowd Monitoring Tab
        path2 = os.path.join(SCREENSHOTS_DIR, "02_crowd_monitoring.png")
        driver.save_screenshot(path2)
        print("Captured:", path2)

        # Scroll to Congestion Heatmap
        driver.execute_script("window.scrollTo(0, 500);")
        time.sleep(1)
        path2_heat = os.path.join(SCREENSHOTS_DIR, "03_congestion_heatmap.png")
        driver.save_screenshot(path2_heat)
        print("Captured:", path2_heat)

        # 3. Scheduling & Frequency Tab
        driver.execute_script("window.scrollTo(0, 0); switchTab('scheduling');")
        time.sleep(2)
        path3 = os.path.join(SCREENSHOTS_DIR, "04_scheduling_frequency.png")
        driver.save_screenshot(path3)
        print("Captured:", path3)

        # 4. AI Prediction Studio Tab
        driver.execute_script("switchTab('ai');")
        time.sleep(2)
        path4 = os.path.join(SCREENSHOTS_DIR, "05_ai_prediction_studio.png")
        driver.save_screenshot(path4)
        print("Captured:", path4)

        # 5. Emergency & Alerts Tab
        driver.execute_script("switchTab('alerts');")
        time.sleep(2)
        path5 = os.path.join(SCREENSHOTS_DIR, "06_emergency_alerts.png")
        driver.save_screenshot(path5)
        print("Captured:", path5)

        # 6. Traffic Analysis Reports Tab
        driver.execute_script("switchTab('reports');")
        time.sleep(2)
        path6 = os.path.join(SCREENSHOTS_DIR, "07_traffic_analysis_reports.png")
        driver.save_screenshot(path6)
        print("Captured:", path6)

        print("\nSUCCESS: All 7 UI Screenshots captured!")

    finally:
        driver.quit()
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    capture_ui_screenshots()
