import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# -----------------------------
# Load Dataset
# -----------------------------
df = pd.read_csv(r"C:\MetroFlow\dataset\delhi_metro_updated.csv")

print("Dataset Loaded Successfully!")
print(df.head())

# -----------------------------
# Remove Missing Values
# -----------------------------
df = df.dropna()

# -----------------------------
# Create Crowd Level using Quantiles
# -----------------------------
df["Crowd_Level"] = pd.qcut(
    df["Passengers"],
    q=3,
    labels=["Low", "Medium", "High"]
)

print("\nCrowd Level Distribution:")
print(df["Crowd_Level"].value_counts())

# -----------------------------
# Feature Selection
# -----------------------------
features = [
    "From_Station",
    "To_Station",
    "Distance_km",
    "Fare",
    "Ticket_Type"
]

X = df[features]
y = df["Crowd_Level"]

# -----------------------------
# Encode Categorical Features
# -----------------------------
from_station_encoder = LabelEncoder()
to_station_encoder = LabelEncoder()
ticket_encoder = LabelEncoder()

X["From_Station"] = from_station_encoder.fit_transform(X["From_Station"])
X["To_Station"] = to_station_encoder.fit_transform(X["To_Station"])
X["Ticket_Type"] = ticket_encoder.fit_transform(X["Ticket_Type"])

target_encoder = LabelEncoder()
y = target_encoder.fit_transform(y)

# -----------------------------
# Train-Test Split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# -----------------------------
# Train Model
# -----------------------------
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# -----------------------------
# Predictions
# -----------------------------
y_pred = model.predict(X_test)

# -----------------------------
# Evaluation
# -----------------------------
accuracy = accuracy_score(y_test, y_pred)

print("\n==============================")
print("Model Accuracy:", round(accuracy * 100, 2), "%")
print("==============================\n")

print(classification_report(
    y_test,
    y_pred,
    target_names=target_encoder.classes_
))

# -----------------------------
# Save Model
# -----------------------------
joblib.dump(model, "crowd_model.pkl")
joblib.dump(from_station_encoder, "from_station_encoder.pkl")
joblib.dump(to_station_encoder, "to_station_encoder.pkl")
joblib.dump(ticket_encoder, "ticket_encoder.pkl")
joblib.dump(target_encoder, "target_encoder.pkl")

print("\nModel Saved Successfully!")

print("Files Created:")
print("crowd_model.pkl")
print("from_station_encoder.pkl")
print("to_station_encoder.pkl")
print("ticket_encoder.pkl")
print("target_encoder.pkl")