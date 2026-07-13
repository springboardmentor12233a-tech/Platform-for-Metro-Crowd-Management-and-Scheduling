import pandas as pd
import os
from datetime import datetime

# ==========================================================
# FILE PATHS
# ==========================================================

dataset_path = "../datasets/processed/delhi_metro_featured.csv"
graphs_folder = "../output/graphs"
report_folder = "../output/reports"

# ==========================================================
# LOAD DATASET
# ==========================================================

df = pd.read_csv(dataset_path)

# ==========================================================
# CALCULATE SUMMARY
# ==========================================================

rows = df.shape[0]
columns = df.shape[1]

missing = df.isnull().sum().sum()
duplicates = df.duplicated().sum()

graph_count = len(
    [file for file in os.listdir(graphs_folder)
     if file.endswith(".png")]
)

report_count = len(
    [file for file in os.listdir(report_folder)
     if file.endswith(".txt")]
)

# Numeric summary
average_fare = df["Fare"].mean()
average_distance = df["Distance_km"].mean()
average_passengers = df["Passengers"].mean()

top_source = df["From_Station"].mode()[0]
top_destination = df["To_Station"].mode()[0]
top_ticket = df["Ticket_Type"].mode()[0]

# ==========================================================
# CREATE SUMMARY
# ==========================================================

summary = f"""
============================================================
                METROFLOW EDA SUMMARY
============================================================

Generated On :
{datetime.now().strftime("%d-%m-%Y %H:%M:%S")}

------------------------------------------------------------
DATASET INFORMATION
------------------------------------------------------------

Dataset Name          : delhi_metro_featured.csv

Rows                  : {rows}

Columns               : {columns}

Missing Values        : {missing}

Duplicate Rows        : {duplicates}

------------------------------------------------------------
FEATURE ENGINEERING
------------------------------------------------------------

New Features Added

✓ Year
✓ Month
✓ Month_Name
✓ Day
✓ Day_Name
✓ Is_Weekend
✓ Route

------------------------------------------------------------
VISUALIZATIONS
------------------------------------------------------------

Graphs Generated      : {graph_count}

Business Reports      : {report_count}

------------------------------------------------------------
KEY BUSINESS INSIGHTS
------------------------------------------------------------

Average Fare          : {average_fare:.2f}

Average Distance      : {average_distance:.2f} km

Average Passengers    : {average_passengers:.2f}

Top Source Station    : {top_source}

Top Destination       : {top_destination}

Most Used Ticket      : {top_ticket}

------------------------------------------------------------
PROJECT STATUS
------------------------------------------------------------

✓ Dataset Profiled

✓ Data Quality Checked

✓ Data Cleaned

✓ Feature Engineering Completed

✓ Visualizations Generated

✓ Business Insights Generated

============================================================
END OF REPORT
============================================================
"""

# ==========================================================
# SAVE
# ==========================================================

os.makedirs(report_folder, exist_ok=True)

summary_path = os.path.join(report_folder, "EDA_Summary.txt")

with open(summary_path, "w", encoding="utf-8") as file:
    file.write(summary)

print("=" * 60)
print("EDA SUMMARY GENERATED SUCCESSFULLY")
print("=" * 60)
print(f"\nSaved to:\n{summary_path}")