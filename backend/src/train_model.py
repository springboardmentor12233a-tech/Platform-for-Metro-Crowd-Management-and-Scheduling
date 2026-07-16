import pandas as pd
import os
import joblib

from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split

from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

from sklearn.metrics import accuracy_score, classification_report

# ----------------------------------------
# Load Dataset
# ----------------------------------------
dataset_path = "../data/MetroFlow_Dataset.xlsx"

df = pd.read_excel(dataset_path)

print("=" * 50)
print("DATASET LOADED")
print("=" * 50)

# ----------------------------------------
# Remove Duplicates
# ----------------------------------------
df = df.drop_duplicates()

# ----------------------------------------
# Handle Missing Values
# ----------------------------------------
df = df.ffill()

# ----------------------------------------
# Encode Categorical Columns
# ----------------------------------------
encoders = {}

categorical_columns = df.select_dtypes(include="object").columns

for column in categorical_columns:
    encoder = LabelEncoder()
    df[column] = encoder.fit_transform(df[column].astype(str))
    encoders[column] = encoder

# ----------------------------------------
# Features & Target
# ----------------------------------------
# Important features only
X = df[
    [
        "Passenger_Count",
        "Occupancy_Percent",
        "Delay_Minutes",
        "Number_of_Trips",
        "Train_Frequency_Per_Hour",
        "Train_Speed_kmph"
    ]
]

y = df["Crowd_Level"]
# ----------------------------------------
# Feature Scaling
# ----------------------------------------
scaler = StandardScaler()
X = scaler.fit_transform(X)

# Save Scaler
os.makedirs("../models", exist_ok=True)
joblib.dump(scaler, "../models/scaler.pkl")

# ----------------------------------------
# Train Test Split
# ----------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)

print("Training Shape :", X_train.shape)
print("Testing Shape :", X_test.shape)

# ----------------------------------------
# Models
# ----------------------------------------
models = {
    "Decision Tree": DecisionTreeClassifier(random_state=42),
    "Random Forest": RandomForestClassifier(random_state=42),
    "Logistic Regression": LogisticRegression(max_iter=1000)
}

best_model = None
best_accuracy = 0
best_name = ""

print("\nMODEL RESULTS")
print("=" * 50)

for name, model in models.items():

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    print(f"\n{name}")
    print(f"Accuracy : {accuracy:.4f}")

    print(classification_report(y_test, predictions))

    if accuracy > best_accuracy:
        best_accuracy = accuracy
        best_model = model
        best_name = name

# ----------------------------------------
# Save Best Model
# ----------------------------------------
joblib.dump(best_model, "../models/crowd_model.pkl")

print("=" * 50)
print(f"BEST MODEL : {best_name}")
print(f"BEST ACCURACY : {best_accuracy:.4f}")
print("Model Saved Successfully")
print("=" * 50)