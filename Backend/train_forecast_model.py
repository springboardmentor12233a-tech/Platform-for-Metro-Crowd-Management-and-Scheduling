import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error
import joblib

# Load dataset
df = pd.read_excel("MetroFlow_Dataset.xlsx")

# Features to predict passenger demand
features = ["Is_Holiday", "Peak_Hour", "Weather", "Train_Frequency_Per_Hour"]
target = "Passenger_Count"

data = df[features + [target]].copy()

# Encode Weather
le_weather_forecast = LabelEncoder()
data["Weather"] = le_weather_forecast.fit_transform(data["Weather"])

X = data[features]
y = data[target]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)

print(f"Demand Forecasting Model trained successfully!")
print(f"Mean Absolute Error: {mae:.2f} passengers")

joblib.dump(model, "demand_model.pkl")
joblib.dump(le_weather_forecast, "weather_encoder_forecast.pkl")

print("Model saved as demand_model.pkl")