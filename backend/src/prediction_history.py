import json
import os
from datetime import datetime

# Path to history.json
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HISTORY_FILE = os.path.join(BASE_DIR, "history.json")


def save_prediction(data):
    """
    Save every prediction into history.json
    """

    record = {
        "Timestamp": datetime.now().strftime("%d-%m-%Y %H:%M:%S"),
        "Passenger_Count": data["Passenger_Count"],
        "Occupancy_Percent": data["Occupancy_Percent"],
        "Delay_Minutes": data["Delay_Minutes"],
        "Number_of_Trips": data["Number_of_Trips"],
        "Train_Frequency_Per_Hour": data["Train_Frequency_Per_Hour"],
        "Train_Speed_kmph": data["Train_Speed_kmph"],
        "Crowd_Level": data["Crowd_Level"],
        "Recommendation": data["Recommendation"]
    }

    # Create file if missing
    if not os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "w") as f:
            json.dump([], f)

    with open(HISTORY_FILE, "r") as f:
        history = json.load(f)

    history.insert(0, record)

    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=4)


def get_prediction_history():

    if not os.path.exists(HISTORY_FILE):
        return []

    with open(HISTORY_FILE, "r") as f:
        return json.load(f)