import os
import joblib
import pandas as pd

from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split

from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

# --------------------------------------------------
# LOAD DATASET
# --------------------------------------------------

dataset_path = "../data/MetroFlow_Dataset.xlsx"

df = pd.read_excel(dataset_path)

print("=" * 60)
print("METROFLOW DATASET LOADED")
print("=" * 60)

print("\nDataset Shape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nMissing Values:")
print(df.isnull().sum())

# --------------------------------------------------
# REMOVE DUPLICATES
# --------------------------------------------------

df = df.drop_duplicates()

# --------------------------------------------------
# HANDLE MISSING VALUES
# --------------------------------------------------

df = df.ffill()

# --------------------------------------------------
# CROWD LEVEL DISTRIBUTION
# --------------------------------------------------

print("\nCrowd Level Distribution")
print(df["Crowd_Level"].value_counts())

print("\nCrowd Level Percentage")
print(df["Crowd_Level"].value_counts(normalize=True) * 100)

# --------------------------------------------------
# LABEL ENCODING
# --------------------------------------------------

encoders = {}

categorical_columns = df.select_dtypes(include="object").columns

for column in categorical_columns:

    encoder = LabelEncoder()

    df[column] = encoder.fit_transform(
        df[column].astype(str)
    )

    encoders[column] = encoder

# Save encoders
os.makedirs("../models", exist_ok=True)

joblib.dump(
    encoders,
    "../models/label_encoders.pkl"
)
print(encoders["Crowd_Level"].classes_)
# --------------------------------------------------
# FEATURES & TARGET
# --------------------------------------------------

feature_columns = [

    "Passenger_Count",
    "Occupancy_Percent",
    "Delay_Minutes",
    "Number_of_Trips",
    "Train_Frequency_Per_Hour",
    "Train_Speed_kmph"

]

X = df[feature_columns]

y = df["Crowd_Level"]

print("\nFeatures Used:")
print(feature_columns)

print("\nFeature Shape :", X.shape)
print("Target Shape :", y.shape)

# --------------------------------------------------
# FEATURE SCALING
# --------------------------------------------------

scaler = StandardScaler()

X = scaler.fit_transform(X)

joblib.dump(
    scaler,
    "../models/scaler.pkl"
)

# --------------------------------------------------
# TRAIN TEST SPLIT
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y

)

print("\nTraining Shape :", X_train.shape)
print("Testing Shape :", X_test.shape)

# --------------------------------------------------
# MODELS
# --------------------------------------------------

models = {

    "Decision Tree":
        DecisionTreeClassifier(random_state=42),

    "Random Forest":
        RandomForestClassifier(
            n_estimators=200,
            random_state=42
        ),

    "Logistic Regression":
        LogisticRegression(
            max_iter=1000
        )

}

best_model = None
best_accuracy = 0
best_name = ""

print("\n")
print("=" * 60)
print("MODEL TRAINING RESULTS")
print("=" * 60)

for name, model in models.items():

    print(f"\n{name}")

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    print(f"Accuracy : {accuracy:.4f}")

    print("\nClassification Report")

    print(

        classification_report(
            y_test,
            predictions
        )

    )

    print("Confusion Matrix")

    print(

        confusion_matrix(
            y_test,
            predictions
        )

    )

    if accuracy > best_accuracy:

        best_accuracy = accuracy
        best_model = model
        best_name = name
        # ----------------------------------------
# Models
# ----------------------------------------

models = {

    "Decision Tree": DecisionTreeClassifier(
        random_state=42,
        max_depth=8,
        min_samples_split=10,
        min_samples_leaf=5
    ),

    "Random Forest": RandomForestClassifier(
        n_estimators=200,
        max_depth=12,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    ),

    "Logistic Regression": LogisticRegression(
        max_iter=2000,
        random_state=42
    )

}

best_model = None
best_accuracy = 0
best_name = ""

print("\n" + "="*60)
print("MODEL TRAINING RESULTS")
print("="*60)

for name, model in models.items():

    print(f"\nTraining {name}...")

    model.fit(X_train, y_train)

    train_predictions = model.predict(X_train)
    test_predictions = model.predict(X_test)

    train_accuracy = accuracy_score(y_train, train_predictions)
    test_accuracy = accuracy_score(y_test, test_predictions)

    print(f"Training Accuracy : {train_accuracy:.4f}")
    print(f"Testing Accuracy  : {test_accuracy:.4f}")

    print("\nClassification Report")
    print(classification_report(y_test, test_predictions))

    if test_accuracy > best_accuracy:

        best_accuracy = test_accuracy
        best_model = model
        best_name = name

print("\n" + "="*60)
print("BEST MODEL SELECTED")
print("="*60)
print("Model :", best_name)
print("Accuracy :", round(best_accuracy*100,2), "%")

joblib.dump(best_model, "../models/crowd_model.pkl")

print("\nCrowd Prediction Model Saved Successfully")
# ----------------------------------------
# Train Models
# ----------------------------------------

models = {

    "Decision Tree": DecisionTreeClassifier(
        random_state=42
    ),

    "Random Forest": RandomForestClassifier(
        n_estimators=200,
        random_state=42
    ),

    "Logistic Regression": LogisticRegression(
        max_iter=1000
    )

}

best_model = None
best_accuracy = 0
best_name = ""

print("\n" + "=" * 60)
print("MODEL COMPARISON")
print("=" * 60)

for name, model in models.items():

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    print(f"\n{name}")
    print("-" * 40)
    print(f"Accuracy : {accuracy:.4f}")

    print(classification_report(
        y_test,
        predictions
    ))

    if accuracy > best_accuracy:

        best_accuracy = accuracy
        best_model = model
        best_name = name

# ----------------------------------------
# Save Best Model
# ----------------------------------------

joblib.dump(best_model, "../models/crowd_model.pkl")

print("\n" + "=" * 60)
print("TRAINING COMPLETED")
print("=" * 60)
print(f"Best Model      : {best_name}")
print(f"Best Accuracy   : {best_accuracy:.4f}")
print("crowd_model.pkl saved successfully.")
print("scaler.pkl saved successfully.")
print("=" * 60)