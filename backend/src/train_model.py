import pandas as pd

# Load preprocessed dataset
df = pd.read_csv("outputs/preprocessed_data.csv")

print("=" * 60)
print("FEATURE SELECTION")
print("=" * 60)

# Select input features
X = df.drop(
    columns=[
        "Crowd_Level",
        "Congestion_Level",
        "AI_Recommendation"
    ]
)

# Select target
y = df["Crowd_Level"]

print("\nInput Features (X)")
print(X.columns)

print("\nTarget Column (y)")
print(y.name)

print("\nShape of X:", X.shape)
print("Shape of y:", y.shape)
from sklearn.model_selection import train_test_split

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\n")
print("=" * 60)
print("TRAIN TEST SPLIT")
print("=" * 60)

print("Training Features :", X_train.shape)
print("Testing Features  :", X_test.shape)

print("Training Labels   :", y_train.shape)
print("Testing Labels    :", y_test.shape)
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier

# Create models
decision_tree = DecisionTreeClassifier(random_state=42)

random_forest = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

logistic = LogisticRegression(max_iter=1000)

knn = KNeighborsClassifier(n_neighbors=5)

print("\nTraining Decision Tree...")
decision_tree.fit(X_train, y_train)

print("Training Random Forest...")
random_forest.fit(X_train, y_train)

print("Training Logistic Regression...")
logistic.fit(X_train, y_train)

print("Training KNN...")
knn.fit(X_train, y_train)

print("\nAll models trained successfully.")
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import os

# -------------------------------
# Predictions
# -------------------------------

dt_pred = decision_tree.predict(X_test)
rf_pred = random_forest.predict(X_test)
lr_pred = logistic.predict(X_test)
knn_pred = knn.predict(X_test)

# -------------------------------
# Accuracy
# -------------------------------

dt_acc = accuracy_score(y_test, dt_pred)
rf_acc = accuracy_score(y_test, rf_pred)
lr_acc = accuracy_score(y_test, lr_pred)
knn_acc = accuracy_score(y_test, knn_pred)

print("\n" + "="*60)
print("MODEL ACCURACY")
print("="*60)

print(f"Decision Tree       : {dt_acc:.4f}")
print(f"Random Forest      : {rf_acc:.4f}")
print(f"Logistic Regression: {lr_acc:.4f}")
print(f"KNN                : {knn_acc:.4f}")

# -------------------------------
# Best Model Selection
# -------------------------------

models = {
    "Decision Tree": (decision_tree, dt_acc),
    "Random Forest": (random_forest, rf_acc),
    "Logistic Regression": (logistic, lr_acc),
    "KNN": (knn, knn_acc)
}

best_model_name = max(models, key=lambda x: models[x][1])
best_model = models[best_model_name][0]
best_accuracy = models[best_model_name][1]

print("\n" + "="*60)
print("BEST MODEL")
print("="*60)

print("Model :", best_model_name)
print("Accuracy :", round(best_accuracy * 100, 2), "%")

# -------------------------------
# Classification Report
# -------------------------------

print("\nClassification Report\n")

best_pred = best_model.predict(X_test)

print(classification_report(y_test, best_pred))

# -------------------------------
# Confusion Matrix
# -------------------------------

print("Confusion Matrix\n")

print(confusion_matrix(y_test, best_pred))

# -------------------------------
# Save Best Model
# -------------------------------

os.makedirs("models", exist_ok=True)

joblib.dump(best_model, "models/metro_model.pkl")

print("\nBest model saved successfully!")
print("Location : models/metro_model.pkl")