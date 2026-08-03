import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib

# Step 1: Load dataset
df = pd.read_excel("MetroFlow_Dataset.xlsx")
print("Dataset loaded. Shape:", df.shape)
print(df.head())

# Step 2: Select features and target
features = ["Passenger_Count", "Occupancy_Percent", "Is_Holiday", "Peak_Hour", "Weather"]
target = "Crowd_Level"

data = df[features + [target]].copy()

# Step 3: Encode categorical column (Weather)
le_weather = LabelEncoder()
data["Weather"] = le_weather.fit_transform(data["Weather"])

# Step 4: Encode target (Crowd_Level: Low/Medium/High)
le_crowd = LabelEncoder()
data["Crowd_Level_encoded"] = le_crowd.fit_transform(data[target])

X = data[features]
y = data["Crowd_Level_encoded"]

# Step 5: Split into train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 6: Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Step 7: Evaluate
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"\nModel trained successfully!")
print(f"Accuracy: {accuracy * 100:.2f}%")

# Check which feature is most important
importances = model.feature_importances_
for feature, importance in zip(features, importances):
    print(f"{feature}: {importance:.4f}")
    
# Step 8: Save model and encoders
joblib.dump(model, "crowd_model.pkl")
joblib.dump(le_weather, "weather_encoder.pkl")
joblib.dump(le_crowd, "crowd_encoder.pkl")

print("\nModel saved as crowd_model.pkl")
print("Encoders saved as weather_encoder.pkl and crowd_encoder.pkl")