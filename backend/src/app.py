from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
CORS(app)

# -------------------------------------------------
# LOAD DATASET
# -------------------------------------------------

df = pd.read_excel("../data/MetroFlow_Dataset.xlsx")

encoded_df = df.copy()

label_encoders = {}

categorical_columns = encoded_df.select_dtypes(include=["object", "string"]).columns

for col in categorical_columns:
    encoder = LabelEncoder()
    encoded_df[col] = encoder.fit_transform(encoded_df[col].astype(str))
    label_encoders[col] = encoder

# -------------------------------------------------
# LOAD MODELS
# -------------------------------------------------

crowd_model = joblib.load("../models/crowd_model.pkl")
forecast_model = joblib.load("../models/forecast_model.pkl")
scaler = joblib.load("../models/scaler.pkl")

# -------------------------------------------------
# HOME PAGE
# -------------------------------------------------

@app.route("/")
def home():

    latest = df.iloc[-1]

    total_passengers = int(df["Passenger_Count"].sum())

    average_delay = round(float(df["Delay_Minutes"].mean()), 2)

    html = f"""
    <html>

    <head>

    <title>MetroFlow Backend</title>

    <style>

    body{{
        background:#f4f4f4;
        font-family:Arial;
        margin:30px;
    }}

    h1{{
        color:#0d6efd;
    }}

    .card{{
        background:white;
        padding:20px;
        margin:15px;
        border-radius:10px;
        box-shadow:0px 0px 8px gray;
    }}

    table{{
        width:100%;
        border-collapse:collapse;
    }}

    td,th{{
        border:1px solid gray;
        padding:8px;
        text-align:center;
    }}

    </style>

    </head>

    <body>

    <h1>🚇 MetroFlow Backend Dashboard</h1>

    <div class="card">

    <h2>Current Status</h2>

    <table>

    <tr>
    <th>Station</th>
    <th>Passengers</th>
    <th>Crowd</th>
    <th>Occupancy</th>
    <th>Delay</th>
    </tr>

    <tr>

    <td>{latest["Station"]}</td>

    <td>{latest["Passenger_Count"]}</td>

    <td>{latest["Crowd_Level"]}</td>

    <td>{latest["Occupancy_Percent"]}%</td>

    <td>{latest["Delay_Minutes"]} min</td>

    </tr>

    </table>

    </div>

    <div class="card">

    <h2>Traffic Report</h2>

    <p><b>Total Passengers :</b> {total_passengers}</p>

    <p><b>Average Delay :</b> {average_delay} Minutes</p>

    </div>

    <div class="card">

    <h2>Available APIs</h2>

    <ul>

    <li>/dashboard</li>

    <li>/predict</li>

    <li>/forecast</li>

    <li>/schedule</li>

    <li>/monitor</li>

    <li>/report</li>
    <li>/notifications</li>

    <li>/alerts</li>

    <li>/announcement</li>

    <li>/schedule/update</li>
    <li>/all</li>
    </ul>

    </div>

    </body>

    </html>

    """

    return html

# -------------------------------------------------
# CROWD PREDICTION
# -------------------------------------------------

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.json

        input_df = pd.DataFrame([{

            "Passenger_Count": data["Passenger_Count"],
            "Occupancy_Percent": data["Occupancy_Percent"],
            "Delay_Minutes": data["Delay_Minutes"],
            "Number_of_Trips": data["Number_of_Trips"],
            "Train_Frequency_Per_Hour": data["Train_Frequency_Per_Hour"],
            "Train_Speed_kmph": data["Train_Speed_kmph"]

        }])

        input_scaled = scaler.transform(input_df)

        prediction = crowd_model.predict(input_scaled)[0]

        labels = {
            0: "Low",
            1: "Medium",
            2: "High"
        }

        crowd = labels.get(int(prediction), "Unknown")

        recommendation = {

            "Low": "Normal Operation",

            "Medium": "Increase Monitoring",

            "High": "Increase Train Frequency"

        }

        return jsonify({

            "Crowd_Level": crowd,

            "Recommendation": recommendation[crowd]

        })

    except Exception as e:

        return jsonify({"Error": str(e)})

# -------------------------------------------------
# TRAIN SCHEDULE
# -------------------------------------------------

@app.route("/schedule")
def schedule():

    temp = df.copy()

    # Group all rows by Station
    summary = temp.groupby("Station").agg({

        "Passenger_Count": "mean",

        "Crowd_Level": lambda x: x.mode()[0]

    }).reset_index()

    summary["Passenger_Count"] = summary["Passenger_Count"].astype(int)

    def frequency(passengers):

        if passengers >= 800:
            return "Every 3 Minutes"

        elif passengers >= 600:
            return "Every 5 Minutes"

        elif passengers >= 400:
            return "Every 7 Minutes"

        return "Every 10 Minutes"

    summary["Recommended_Frequency"] = summary["Passenger_Count"].apply(frequency)

    return jsonify(summary.to_dict(orient="records"))
# -------------------------------------------------
# FORECAST API
# -------------------------------------------------

@app.route("/forecast")
def forecast():

    latest_original = df.iloc[-1]

    latest_encoded = encoded_df.iloc[[-1]].drop(
        "Passenger_Count",
        axis=1
    )

    prediction = forecast_model.predict(latest_encoded)[0]

    return jsonify({

        "Station": str(latest_original["Station"]),

        "Predicted_Passenger_Count":
        int(round(float(prediction))),

        "Recommendation":
        "Increase Train Frequency"
        if prediction > 700
        else "Normal Operation"

    })


# -------------------------------------------------
# MONITORING API
# -------------------------------------------------

@app.route("/monitor")
def monitor():

    latest = df.iloc[-1]

    return jsonify({

        "Date": str(latest["Date"]),

        "Time": str(latest["Time"]),

        "Station": str(latest["Station"]),

        "Passenger_Count": int(latest["Passenger_Count"]),

        "Passenger_Entries": int(latest["Passenger_Entries"]),

        "Passenger_Exits": int(latest["Passenger_Exits"]),

        "Occupancy_Percent":
        float(latest["Occupancy_Percent"]),

        "Crowd_Level":
        str(latest["Crowd_Level"]),

        "Delay_Minutes":
        int(latest["Delay_Minutes"]),

        "Trips":
        int(latest["Number_of_Trips"])

    })


# -------------------------------------------------
# REPORT API
# -------------------------------------------------

@app.route("/report")
def report():

    report = {

        "Total_Passengers":
        int(df["Passenger_Count"].sum()),

        "Average_Passenger_Count":
        round(float(df["Passenger_Count"].mean()),2),

        "Average_Delay":
        round(float(df["Delay_Minutes"].mean()),2),

        "Maximum_Occupancy":
        float(df["Occupancy_Percent"].max()),

        "Peak_Hour":
        str(
            df.groupby("Peak_Hour")["Passenger_Count"]
            .mean()
            .idxmax()
        ),

        "Most_Crowded_Station":
        str(
            df.groupby("Station")["Passenger_Count"]
            .mean()
            .idxmax()
        )

    }

    return jsonify(report)


# -------------------------------------------------
# DASHBOARD API
# -------------------------------------------------

@app.route("/dashboard")
def dashboard():

    latest = df.iloc[-1]

    # Crowd Distribution

    crowd_counts = (
        df["Crowd_Level"]
        .value_counts()
        .reset_index()
    )

    crowd_counts.columns = [
        "Crowd_Level",
        "Count"
    ]

    crowd_chart = []

    for _, row in crowd_counts.iterrows():

        crowd_chart.append({

            "name":
            str(row["Crowd_Level"]),

            "value":
            int(row["Count"])

        })


    # Top Stations

    station_chart = []

    top = (

        df.groupby("Station")["Passenger_Count"]

        .mean()

        .sort_values(ascending=False)

        .head(5)

    )

    for station, value in top.items():

        station_chart.append({

            "station":
            str(station),

            "passengers":
            int(value)

        })


    # Peak Hour

    peak_chart=[]

    peak=(
        df.groupby("Peak_Hour")["Passenger_Count"]
        .mean()
        .reset_index()
    )

    for _,row in peak.iterrows():

        peak_chart.append({

            "hour":
            str(row["Peak_Hour"]),

            "passengers":
            int(row["Passenger_Count"])

        })


    prediction = int(round(float(

        forecast_model.predict(

            encoded_df.iloc[[-1]]

            .drop(
                "Passenger_Count",
                axis=1
            )

        )[0]

    )))


    return jsonify({

        "Project":"MetroFlow",

        "Current_Status":{

            "Station":
            str(latest["Station"]),

            "Passenger_Count":
            int(latest["Passenger_Count"]),

            "Crowd_Level":
            str(latest["Crowd_Level"]),

            "Occupancy":
            float(latest["Occupancy_Percent"]),

            "Delay_Minutes":
            int(latest["Delay_Minutes"])

        },

        "Forecast":{

            "Predicted_Passenger_Count":
            prediction

        },

        "Traffic_Report":{

            "Total_Passengers":
            int(df["Passenger_Count"].sum()),

            "Average_Delay":
            round(float(df["Delay_Minutes"].mean()),2)

        },

        "Analytics":{

            "Crowd_Distribution":
            crowd_chart,

            "Top_Stations":
            station_chart,

            "Peak_Hour":
            peak_chart

        }

    })
# -------------------------------------------------
# ALERTS API
# -------------------------------------------------

@app.route("/alerts")
def alerts():

    latest = df.iloc[-1]

    crowd = str(latest["Crowd_Level"])

    if crowd == "High":

        priority = "High"

        alert = "Heavy crowd detected! Increase train frequency immediately."

    elif crowd == "Medium":

        priority = "Medium"

        alert = "Moderate crowd detected. Increase monitoring."

    else:

        priority = "Low"

        alert = "Metro services are operating normally."

    return jsonify({

        "Station": str(latest["Station"]),

        "Crowd_Level": crowd,

        "Priority": priority,

        "Alert": alert

    })


# -------------------------------------------------
# EMERGENCY ANNOUNCEMENT API
# -------------------------------------------------

@app.route("/announcement")
def announcement():

    latest = df.iloc[-1]

    crowd = str(latest["Crowd_Level"])

    if crowd == "High":

        message = (
            "Attention Passengers! Heavy crowd detected. "
            "Additional trains have been scheduled. "
            "Please follow station staff instructions."
        )

    elif crowd == "Medium":

        message = (
            "Passenger traffic is moderate. "
            "Please allow passengers to exit before boarding."
        )

    else:

        message = (
            "Metro services are operating normally. "
            "Have a safe journey."
        )

    return jsonify({

        "Station": str(latest["Station"]),

        "Announcement": message

    })


# -------------------------------------------------
# REAL-TIME SCHEDULE UPDATE API
# -------------------------------------------------

@app.route("/schedule/update")
def schedule_update():

    latest = df.iloc[-1]

    passengers = int(latest["Passenger_Count"])

    if passengers >= 800:

        frequency = "Every 3 Minutes"

        reason = "Very High Passenger Demand"

    elif passengers >= 600:

        frequency = "Every 5 Minutes"

        reason = "High Passenger Demand"

    elif passengers >= 400:

        frequency = "Every 7 Minutes"

        reason = "Moderate Passenger Demand"

    else:

        frequency = "Every 10 Minutes"

        reason = "Normal Passenger Flow"

    return jsonify({

        "Station": str(latest["Station"]),

        "Passenger_Count": passengers,

        "Updated_Frequency": frequency,

        "Reason": reason

    })


# -------------------------------------------------
# COMPLETE BACKEND SUMMARY API
# -------------------------------------------------

@app.route("/all")
def all_data():

    latest = df.iloc[-1]

    prediction = int(round(float(

        forecast_model.predict(

            encoded_df.iloc[[-1]].drop(
                "Passenger_Count",
                axis=1
            )

        )[0]

    )))

    return jsonify({

        "Project": "MetroFlow",

        "Current_Status": {

            "Station": str(latest["Station"]),

            "Passenger_Count": int(latest["Passenger_Count"]),

            "Crowd_Level": str(latest["Crowd_Level"]),

            "Occupancy": float(latest["Occupancy_Percent"]),

            "Delay": int(latest["Delay_Minutes"])

        },

        "Forecast": {

            "Predicted_Passenger_Count": prediction

        },

        "Monitoring": {

            "Entries": int(latest["Passenger_Entries"]),

            "Exits": int(latest["Passenger_Exits"]),

            "Trips": int(latest["Number_of_Trips"])

        },

        "Traffic_Report": {

            "Total_Passengers":
            int(df["Passenger_Count"].sum()),

            "Average_Delay":
            round(float(df["Delay_Minutes"].mean()),2)

        },

        "Alerts": {

            "Priority":
            "High" if latest["Crowd_Level"]=="High"
            else "Medium" if latest["Crowd_Level"]=="Medium"
            else "Low"

        }

    })


# -------------------------------------------------
# RUN APPLICATION
# -------------------------------------------------
# ----------------------------
#------------------------------------------------------
# Notifications API
# ----------------------------
@app.route("/notifications")
def notifications():

    latest = pd.read_excel("../data/MetroFlow_Dataset.xlsx").iloc[-1]

    alerts = []

    passenger = int(latest["Passenger_Count"])
    crowd = latest["Crowd_Level"]
    delay = int(latest["Delay_Minutes"])
    station = latest["Station"]

    if crowd == "High":
        alerts.append({
            "type": "danger",
            "message": f"High crowd detected at {station}. Increase train frequency."
        })

    elif crowd == "Medium":
        alerts.append({
            "type": "warning",
            "message": f"Moderate crowd at {station}. Monitor passenger flow."
        })

    else:
        alerts.append({
            "type": "success",
            "message": f"Passenger flow is normal at {station}."
        })

    if delay > 5:
        alerts.append({
            "type": "warning",
            "message": f"Train delay of {delay} minutes detected."
        })

    if passenger > 700:
        alerts.append({
            "type": "info",
            "message": "Passenger demand is increasing."
        })

    alerts.append({
        "type": "primary",
        "message": "MetroFlow system is running normally."
    })

    return jsonify(alerts)
if __name__ == "__main__":

    app.run(debug=True)