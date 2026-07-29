import joblib

model = joblib.load("model/crowd_prediction_model.pkl")
preprocessor = joblib.load("model/preprocessor.pkl")