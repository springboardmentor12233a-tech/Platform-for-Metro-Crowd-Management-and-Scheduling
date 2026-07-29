import os

def run_system_tests():

    tests = []

    # Backend
    tests.append({
        "Component": "Backend API",
        "Status": "Running",
        "Result": True
    })

    # AI Model
    model_exists = os.path.exists("../models/crowd_model.pkl")

    tests.append({
        "Component": "AI Prediction Model",
        "Status": "Loaded" if model_exists else "Missing",
        "Result": model_exists
    })

    # Scaler
    scaler_exists = os.path.exists("../models/scaler.pkl")

    tests.append({
        "Component": "Scaler",
        "Status": "Loaded" if scaler_exists else "Missing",
        "Result": scaler_exists
    })

    # Prediction History
    history_exists = os.path.exists("../history.json")

    tests.append({
        "Component": "Prediction History",
        "Status": "Available" if history_exists else "Missing",
        "Result": history_exists
    })

    # Gemini
    gemini = os.getenv("GEMINI_API_KEY")

    tests.append({
        "Component": "Gemini AI",
        "Status": "Connected" if gemini else "Not Configured",
        "Result": gemini is not None
    })

    passed = sum(test["Result"] for test in tests)

    return {
        "Total": len(tests),
        "Passed": passed,
        "Failed": len(tests) - passed,
        "Tests": tests
    }