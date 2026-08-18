import os
import sys

# Ensure backend directory is in python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from flask import Flask, send_from_directory
from flask_cors import CORS

from routes.auth import auth_bp
from routes.stations import stations_bp
from routes.schedules import schedules_bp
from routes.predict import predict_bp
from routes.alerts import alerts_bp
from routes.metrics import metrics_bp

FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))

app = Flask(__name__, static_folder=FRONTEND_DIR)
app.secret_key = os.environ.get('SECRET_KEY', 'metroflow_super_secret_key_2026_safe')

CORS(app, supports_credentials=True)

# Register API blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(stations_bp)
app.register_blueprint(schedules_bp)
app.register_blueprint(predict_bp)
app.register_blueprint(alerts_bp)
app.register_blueprint(metrics_bp)

# Frontend static routing
@app.route('/')
def serve_index():
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(FRONTEND_DIR, path)):
        return send_from_directory(FRONTEND_DIR, path)
    # Default fallback for clean HTML routing
    if os.path.exists(os.path.join(FRONTEND_DIR, f"{path}.html")):
        return send_from_directory(FRONTEND_DIR, f"{path}.html")
    return send_from_directory(FRONTEND_DIR, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5050))
    print(f"[MetroFlow Server] Starting server on http://127.0.0.1:{port} ...")
    app.run(host='127.0.0.1', port=port, debug=True)
