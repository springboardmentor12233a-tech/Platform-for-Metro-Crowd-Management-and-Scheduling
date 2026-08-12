# import os
# import joblib
# import pandas as pd

# from sklearn.preprocessing import LabelEncoder, StandardScaler
# from sklearn.model_selection import train_test_split

# from sklearn.tree import DecisionTreeClassifier
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.linear_model import LogisticRegression

# from sklearn.metrics import (
#     accuracy_score,
#     classification_report,
#     confusion_matrix
# )

# # --------------------------------------------------
# # LOAD DATASET
# # --------------------------------------------------

# dataset_path = "../data/MetroFlow_Dataset.xlsx"

# df = pd.read_excel(dataset_path)

# print("=" * 60)
# print("METROFLOW DATASET LOADED")
# print("=" * 60)

# print("\nDataset Shape:")
# print(df.shape)

# print("\nColumns:")
# print(df.columns.tolist())

# print("\nMissing Values:")
# print(df.isnull().sum())

# # --------------------------------------------------
# # REMOVE DUPLICATES
# # --------------------------------------------------

# df = df.drop_duplicates()

# # --------------------------------------------------
# # HANDLE MISSING VALUES
# # --------------------------------------------------

# df = df.ffill()

# # --------------------------------------------------
# # CROWD LEVEL DISTRIBUTION
# # --------------------------------------------------

# print("\nCrowd Level Distribution")
# print(df["Crowd_Level"].value_counts())

# print("\nCrowd Level Percentage")
# print(df["Crowd_Level"].value_counts(normalize=True) * 100)

# # --------------------------------------------------
# # LABEL ENCODING
# # --------------------------------------------------

# encoders = {}

# categorical_columns = df.select_dtypes(include="object").columns

# for column in categorical_columns:

#     encoder = LabelEncoder()

#     df[column] = encoder.fit_transform(
#         df[column].astype(str)
#     )

#     encoders[column] = encoder

# # Save encoders
# os.makedirs("../models", exist_ok=True)

# joblib.dump(
#     encoders,
#     "../models/label_encoders.pkl"
# )
# print(encoders["Crowd_Level"].classes_)
# # --------------------------------------------------
# # FEATURES & TARGET
# # --------------------------------------------------

# feature_columns = [

#     "Passenger_Count",
#     "Occupancy_Percent",
#     "Delay_Minutes",
#     "Number_of_Trips",
#     "Train_Frequency_Per_Hour",
#     "Train_Speed_kmph"

# ]

# X = df[feature_columns]

# y = df["Crowd_Level"]

# print("\nFeatures Used:")
# print(feature_columns)

# print("\nFeature Shape :", X.shape)
# print("Target Shape :", y.shape)

# # --------------------------------------------------
# # FEATURE SCALING
# # --------------------------------------------------

# scaler = StandardScaler()

# X = scaler.fit_transform(X)

# joblib.dump(
#     scaler,
#     "../models/scaler.pkl"
# )

# # --------------------------------------------------
# # TRAIN TEST SPLIT
# # --------------------------------------------------

# X_train, X_test, y_train, y_test = train_test_split(

#     X,
#     y,
#     test_size=0.20,
#     random_state=42,
#     stratify=y

# )

# print("\nTraining Shape :", X_train.shape)
# print("Testing Shape :", X_test.shape)

# # --------------------------------------------------
# # MODELS
# # --------------------------------------------------

# models = {

#     "Decision Tree":
#         DecisionTreeClassifier(random_state=42),

#     "Random Forest":
#         RandomForestClassifier(
#             n_estimators=200,
#             random_state=42
#         ),

#     "Logistic Regression":
#         LogisticRegression(
#             max_iter=1000
#         )

# }

# best_model = None
# best_accuracy = 0
# best_name = ""

# print("\n")
# print("=" * 60)
# print("MODEL TRAINING RESULTS")
# print("=" * 60)

# for name, model in models.items():

#     print(f"\n{name}")

#     model.fit(X_train, y_train)

#     predictions = model.predict(X_test)

#     accuracy = accuracy_score(
#         y_test,
#         predictions
#     )

#     print(f"Accuracy : {accuracy:.4f}")

#     print("\nClassification Report")

#     print(

#         classification_report(
#             y_test,
#             predictions
#         )

#     )

#     print("Confusion Matrix")

#     print(

#         confusion_matrix(
#             y_test,
#             predictions
#         )

#     )

#     if accuracy > best_accuracy:

#         best_accuracy = accuracy
#         best_model = model
#         best_name = name
#         # ----------------------------------------
# # Models
# # ----------------------------------------

# models = {

#     "Decision Tree": DecisionTreeClassifier(
#         random_state=42,
#         max_depth=8,
#         min_samples_split=10,
#         min_samples_leaf=5
#     ),

#     "Random Forest": RandomForestClassifier(
#         n_estimators=200,
#         max_depth=12,
#         min_samples_split=5,
#         min_samples_leaf=2,
#         random_state=42
#     ),

#     "Logistic Regression": LogisticRegression(
#         max_iter=2000,
#         random_state=42
#     )

# }

# best_model = None
# best_accuracy = 0
# best_name = ""

# print("\n" + "="*60)
# print("MODEL TRAINING RESULTS")
# print("="*60)

# for name, model in models.items():

#     print(f"\nTraining {name}...")

#     model.fit(X_train, y_train)

#     train_predictions = model.predict(X_train)
#     test_predictions = model.predict(X_test)

#     train_accuracy = accuracy_score(y_train, train_predictions)
#     test_accuracy = accuracy_score(y_test, test_predictions)

#     print(f"Training Accuracy : {train_accuracy:.4f}")
#     print(f"Testing Accuracy  : {test_accuracy:.4f}")

#     print("\nClassification Report")
#     print(classification_report(y_test, test_predictions))

#     if test_accuracy > best_accuracy:

#         best_accuracy = test_accuracy
#         best_model = model
#         best_name = name

# print("\n" + "="*60)
# print("BEST MODEL SELECTED")
# print("="*60)
# print("Model :", best_name)
# print("Accuracy :", round(best_accuracy*100,2), "%")

# joblib.dump(best_model, "../models/crowd_model.pkl")

# print("\nCrowd Prediction Model Saved Successfully")
# # ----------------------------------------
# # Train Models
# # ----------------------------------------

# models = {

#     "Decision Tree": DecisionTreeClassifier(
#         random_state=42
#     ),

#     "Random Forest": RandomForestClassifier(
#         n_estimators=200,
#         random_state=42
#     ),

#     "Logistic Regression": LogisticRegression(
#         max_iter=1000
#     )

# }

# best_model = None
# best_accuracy = 0
# best_name = ""

# print("\n" + "=" * 60)
# print("MODEL COMPARISON")
# print("=" * 60)

# for name, model in models.items():

#     model.fit(X_train, y_train)

#     predictions = model.predict(X_test)

#     accuracy = accuracy_score(y_test, predictions)

#     print(f"\n{name}")
#     print("-" * 40)
#     print(f"Accuracy : {accuracy:.4f}")

#     print(classification_report(
#         y_test,
#         predictions
#     ))

#     if accuracy > best_accuracy:

#         best_accuracy = accuracy
#         best_model = model
#         best_name = name

# # ----------------------------------------
# # Save Best Model
# # ----------------------------------------

# joblib.dump(best_model, "../models/crowd_model.pkl")

# print("\n" + "=" * 60)
# print("TRAINING COMPLETED")
# print("=" * 60)
# print(f"Best Model      : {best_name}")
# print(f"Best Accuracy   : {best_accuracy:.4f}")
# print("crowd_model.pkl saved successfully.")
# print("scaler.pkl saved successfully.")
# print("=" * 60)
import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report


# ============================================================
# 1. LOAD DATASET
# ============================================================

dataset_path = "../data/MetroFlow_Dataset.xlsx"

df = pd.read_excel(dataset_path)

print("=" * 70)
print("METROFLOW ROUTE-BASED AI MODEL TRAINING")
print("=" * 70)

print("\nDataset Shape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())


# ============================================================
# 2. REMOVE DUPLICATES
# ============================================================

df = df.drop_duplicates()

print("\nDataset Shape After Removing Duplicates:")
print(df.shape)


# ============================================================
# 3. HANDLE MISSING VALUES
# ============================================================

print("\nMissing Values Before:")
print(df.isnull().sum())

df = df.ffill()

print("\nMissing Values After:")
print(df.isnull().sum())


# ============================================================
# 4. CHECK REQUIRED COLUMNS
# ============================================================

required_columns = [
    "From_Station",
    "To_Station",
    "Passenger_Count",
    "Occupancy_Percent",
    "Delay_Minutes",
    "Number_of_Trips",
    "Train_Frequency_Per_Hour",
    "Train_Speed_kmph",
    "Crowd_Level"
]

missing_columns = [
    column for column in required_columns
    if column not in df.columns
]

if missing_columns:

    print("\nERROR: Missing columns:")
    print(missing_columns)

    raise ValueError(
        f"Required columns missing from dataset: {missing_columns}"
    )


# ============================================================
# 5. DISPLAY ROUTES
# ============================================================

print("\nAvailable From Stations:")
print(sorted(df["From_Station"].astype(str).unique()))

print("\nAvailable To Stations:")
print(sorted(df["To_Station"].astype(str).unique()))

print("\nTotal Unique Routes:")

routes = (
    df[["From_Station", "To_Station"]]
    .drop_duplicates()
)

print(len(routes))

print("\nSample Routes:")
print(routes.head(20))


# ============================================================
# 6. PREPARE FEATURES
# ============================================================

feature_columns = [
    "From_Station",
    "To_Station",
    "Passenger_Count",
    "Occupancy_Percent",
    "Delay_Minutes",
    "Number_of_Trips",
    "Train_Frequency_Per_Hour",
    "Train_Speed_kmph"
]

X = df[feature_columns].copy()

y = df["Crowd_Level"].astype(str)


# ============================================================
# 7. ENCODE FROM STATION AND TO STATION
# ============================================================

from_encoder = LabelEncoder()
to_encoder = LabelEncoder()
crowd_encoder = LabelEncoder()


X["From_Station"] = from_encoder.fit_transform(
    X["From_Station"].astype(str)
)

X["To_Station"] = to_encoder.fit_transform(
    X["To_Station"].astype(str)
)


y = crowd_encoder.fit_transform(y)


print("\nFrom Station Encoding:")
for value, encoded in zip(
    from_encoder.classes_,
    from_encoder.transform(from_encoder.classes_)
):
    print(value, "=", encoded)


print("\nTo Station Encoding:")
for value, encoded in zip(
    to_encoder.classes_,
    to_encoder.transform(to_encoder.classes_)
):
    print(value, "=", encoded)


print("\nCrowd Level Encoding:")
for value, encoded in zip(
    crowd_encoder.classes_,
    crowd_encoder.transform(crowd_encoder.classes_)
):
    print(value, "=", encoded)


# ============================================================
# 8. SAVE ENCODERS
# ============================================================

os.makedirs("../models", exist_ok=True)

encoders = {
    "From_Station": from_encoder,
    "To_Station": to_encoder,
    "Crowd_Level": crowd_encoder
}

joblib.dump(
    encoders,
    "../models/route_label_encoders.pkl"
)

print("\nRoute Label Encoders Saved.")


# ============================================================
# 9. SCALE NUMERICAL FEATURES
# ============================================================

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)

joblib.dump(
    scaler,
    "../models/route_scaler.pkl"
)

print("Route Scaler Saved.")


# ============================================================
# 10. TRAIN TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining Shape:")
print(X_train.shape)

print("\nTesting Shape:")
print(X_test.shape)


# ============================================================
# 11. MODELS
# ============================================================

models = {

    "Decision Tree": DecisionTreeClassifier(
        random_state=42,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2
    ),

    "Random Forest": RandomForestClassifier(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    ),

    "Logistic Regression": LogisticRegression(
        max_iter=2000,
        random_state=42
    )
}


# ============================================================
# 12. TRAIN MODELS
# ============================================================

best_model = None
best_accuracy = 0
best_name = ""


print("\n")
print("=" * 70)
print("MODEL TRAINING RESULTS")
print("=" * 70)


for name, model in models.items():

    print("\n" + "-" * 60)
    print("Training:", name)
    print("-" * 60)

    model.fit(
        X_train,
        y_train
    )

    train_predictions = model.predict(
        X_train
    )

    test_predictions = model.predict(
        X_test
    )

    train_accuracy = accuracy_score(
        y_train,
        train_predictions
    )

    test_accuracy = accuracy_score(
        y_test,
        test_predictions
    )

    print(
        f"Training Accuracy : {train_accuracy:.4f}"
    )

    print(
        f"Testing Accuracy  : {test_accuracy:.4f}"
    )

    print("\nClassification Report:")

    print(
        classification_report(
            y_test,
            test_predictions,
            target_names=crowd_encoder.classes_
        )
    )

    if test_accuracy > best_accuracy:

        best_accuracy = test_accuracy

        best_model = model

        best_name = name


# ============================================================
# 13. SAVE BEST MODEL
# ============================================================

print("\n")
print("=" * 70)
print("BEST ROUTE-BASED MODEL")
print("=" * 70)

print("Model :", best_name)

print(
    "Testing Accuracy :",
    round(best_accuracy * 100, 2),
    "%"
)


joblib.dump(
    best_model,
    "../models/route_crowd_model.pkl"
)


# ============================================================
# 14. SAVE ROUTE INFORMATION
# ============================================================

route_data = (
    df[
        [
            "From_Station",
            "To_Station"
        ]
    ]
    .drop_duplicates()
    .sort_values(
        [
            "From_Station",
            "To_Station"
        ]
    )
)

route_data.to_csv(
    "../models/routes.csv",
    index=False
)


# ============================================================
# 15. SAVE AVAILABLE STATIONS
# ============================================================

stations = sorted(
    set(
        df["From_Station"].astype(str)
    ).union(
        set(
            df["To_Station"].astype(str)
        )
    )
)

joblib.dump(
    stations,
    "../models/stations.pkl"
)


# ============================================================
# 16. COMPLETION
# ============================================================

print("\n")
print("=" * 70)
print("ROUTE-BASED TRAINING COMPLETED SUCCESSFULLY")
print("=" * 70)

print(
    "Best Model       :",
    best_name
)

print(
    "Best Accuracy    :",
    round(best_accuracy * 100, 2),
    "%"
)

print(
    "Model Saved      :",
    "../models/route_crowd_model.pkl"
)

print(
    "Scaler Saved     :",
    "../models/route_scaler.pkl"
)

print(
    "Encoders Saved   :",
    "../models/route_label_encoders.pkl"
)

print(
    "Stations Saved   :",
    "../models/stations.pkl"
)

print(
    "Routes Saved     :",
    "../models/routes.csv"
)

print("=" * 70)