import requests

url = "http://127.0.0.1:5000/predict"

data = {
    "Date": 0,
    "Time": 20,
    "Day": 4,
    "Is_Holiday": -0.403473,
    "Weather": 1,
    "Station": 5,
    "From_Station": 3,
    "To_Station": 7,
    "Passenger_Entries": 0.6,
    "Passenger_Exits": 0.5,
    "Passenger_Count": 0.55,
    "Occupancy_Percent": 0.4,
    "Train_Speed_kmph": 0.3,
    "Number_of_Trips": 0.2,
    "Delay_Minutes": 0.1,
    "Peak_Hour": -0.706258,
    "Train_Frequency_Per_Hour": 1.45
}

response = requests.post(url, json=data)

print(response.status_code)
print(response.json())