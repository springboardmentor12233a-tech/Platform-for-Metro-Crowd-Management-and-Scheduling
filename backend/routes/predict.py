import os
import joblib
import pandas as pd
import numpy as np
from flask import Blueprint, request, jsonify
from database import query_db

predict_bp = Blueprint('predict', __name__, url_prefix='/api/predict')

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'ml', 'metro_model.pkl')
_model = None

def get_ml_model():
    global _model
    if _model is None:
        if os.path.exists(MODEL_PATH):
            _model = joblib.load(MODEL_PATH)
        else:
            raise FileNotFoundError("ML Model file not found. Please run init_db.py first.")
    return _model

@predict_bp.route('', methods=['POST'])
def predict_crowd():
    try:
        model = get_ml_model()
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    data = request.get_json() or {}
    station_id = int(data.get('station_id', 1))
    hour = int(data.get('hour', 8))
    day_of_week = int(data.get('day_of_week', 1))  # 0=Mon, 6=Sun
    lag_1h_footfall = float(data.get('lag_1h_footfall', 500))

    station = query_db('SELECT * FROM stations WHERE id = ?', [station_id], one=True)
    if not station:
        return jsonify({'error': 'Station not found'}), 404

    is_weekend = 1 if day_of_week >= 5 else 0
    is_peak = 1 if (8 <= hour <= 9 or 17 <= hour <= 19) and not is_weekend else 0

    features = pd.DataFrame([{
        'station_id': station_id,
        'hour': hour,
        'day_of_week': day_of_week,
        'is_weekend': is_weekend,
        'is_peak': is_peak,
        'lag_1h_footfall': lag_1h_footfall
    }])

    predicted_count = int(model.predict(features)[0])
    capacity = station['capacity']
    predicted_density = round((predicted_count / capacity) * 100, 1)

    if predicted_density >= 80.0:
        predicted_status = 'Critical'
    elif predicted_density >= 65.0:
        predicted_status = 'High'
    elif predicted_density >= 40.0:
        predicted_status = 'Moderate'
    else:
        predicted_status = 'Low'

    return jsonify({
        'station': station,
        'input': {
            'hour': hour,
            'day_of_week': day_of_week,
            'is_weekend': bool(is_weekend),
            'is_peak_hour': bool(is_peak),
            'lag_1h_footfall': lag_1h_footfall
        },
        'prediction': {
            'predicted_passenger_count': predicted_count,
            'capacity': capacity,
            'predicted_density_percentage': predicted_density,
            'predicted_status': predicted_status,
            'model_name': 'Scikit-Learn Random Forest Regressor'
        }
    })

@predict_bp.route('/all', methods=['GET'])
def predict_all_stations():
    try:
        model = get_ml_model()
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    target_hour = int(request.args.get('hour', 8))
    target_day = int(request.args.get('day_of_week', 1))

    stations = query_db('SELECT * FROM stations ORDER BY id ASC')
    results = []

    is_weekend = 1 if target_day >= 5 else 0
    is_peak = 1 if (8 <= target_hour <= 9 or 17 <= target_hour <= 19) and not is_weekend else 0

    for st in stations:
        lag_val = st['current_inflow']
        df_feat = pd.DataFrame([{
            'station_id': st['id'],
            'hour': target_hour,
            'day_of_week': target_day,
            'is_weekend': is_weekend,
            'is_peak': is_peak,
            'lag_1h_footfall': lag_val
        }])

        pred_count = int(model.predict(df_feat)[0])
        capacity = st['capacity']
        pred_density = round((pred_count / capacity) * 100, 1)

        if pred_density >= 80.0:
            status = 'Critical'
        elif pred_density >= 65.0:
            status = 'High'
        elif pred_density >= 40.0:
            status = 'Moderate'
        else:
            status = 'Low'

        results.append({
            'station_id': st['id'],
            'station_code': st['station_code'],
            'station_name': st['name'],
            'line': st['line'],
            'capacity': capacity,
            'predicted_count': pred_count,
            'predicted_density': pred_density,
            'predicted_status': status
        })

    return jsonify({
        'target_hour': target_hour,
        'target_day': target_day,
        'is_peak_hour': bool(is_peak),
        'predictions': results
    })
