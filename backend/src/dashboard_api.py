from flask import Blueprint, jsonify
import pandas as pd

dashboard = Blueprint("dashboard", __name__)

df = pd.read_excel("data/MetroFlow_Dataset.xlsx")

@dashboard.route("/dashboard", methods=["GET"])
def dashboard_data():

    response = {

        "stations": df["Station"].nunique(),

        "passengers": int(df["Passenger_Count"].sum()),

        "peak_hour": "8:00 AM",

        "predictions": len(df)

    }

    return jsonify(response)