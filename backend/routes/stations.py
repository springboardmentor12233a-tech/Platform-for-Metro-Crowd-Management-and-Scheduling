from flask import Blueprint, request, jsonify, session
from database import query_db, execute_db
import datetime

stations_bp = Blueprint('stations', __name__, url_prefix='/api/stations')

def check_status(density_pct):
    if density_pct >= 80.0:
        return 'Critical'
    elif density_pct >= 65.0:
        return 'High'
    elif density_pct >= 40.0:
        return 'Moderate'
    return 'Low'

@stations_bp.route('', methods=['GET'])
def get_stations():
    stations = query_db('SELECT * FROM stations ORDER BY id ASC')
    
    # Calculate summary metrics
    total_capacity = sum(s['capacity'] for s in stations)
    total_inflow = sum(s['current_inflow'] for s in stations)
    total_outflow = sum(s['current_outflow'] for s in stations)
    avg_density = round(sum(s['current_density'] for s in stations) / len(stations), 1) if stations else 0.0

    return jsonify({
        'stations': stations,
        'summary': {
            'total_stations': len(stations),
            'total_capacity': total_capacity,
            'total_inflow': total_inflow,
            'total_outflow': total_outflow,
            'avg_density': avg_density,
            'critical_count': sum(1 for s in stations if s['status'] == 'Critical'),
            'high_count': sum(1 for s in stations if s['status'] == 'High')
        }
    })

@stations_bp.route('/<int:station_id>', methods=['GET'])
def get_station_detail(station_id):
    station = query_db('SELECT * FROM stations WHERE id = ?', [station_id], one=True)
    if not station:
        return jsonify({'error': 'Station not found'}), 404

    history = query_db('''
        SELECT hour, passenger_count, density_percentage 
        FROM footfall_records 
        WHERE station_id = ? 
        ORDER BY id DESC LIMIT 24
    ''', [station_id])

    return jsonify({
        'station': station,
        'history': list(reversed(history))
    })

@stations_bp.route('/<int:station_id>', methods=['PUT'])
def update_station_crowd(station_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Authentication required'}), 401

    data = request.get_json() or {}
    inflow = data.get('current_inflow')
    outflow = data.get('current_outflow')

    if inflow is None or outflow is None:
        return jsonify({'error': 'Inflow and Outflow parameters required'}), 400

    station = query_db('SELECT * FROM stations WHERE id = ?', [station_id], one=True)
    if not station:
        return jsonify({'error': 'Station not found'}), 404

    capacity = station['capacity']
    density_pct = round((inflow / capacity) * 100, 1)
    status = check_status(density_pct)

    execute_db('''
        UPDATE stations 
        SET current_inflow = ?, current_outflow = ?, current_density = ?, status = ?
        WHERE id = ?
    ''', [inflow, outflow, density_pct, status, station_id])

    now = datetime.datetime.now()
    execute_db('''
        INSERT INTO footfall_records (station_id, hour, day_of_week, passenger_count, density_percentage)
        VALUES (?, ?, ?, ?, ?)
    ''', [station_id, now.hour, now.weekday(), inflow, density_pct])

    # Auto-generate overcrowding alert if density >= 80%
    if density_pct >= 80.0:
        alert_msg = f"AUTOMATED ALERT: {station['name']} passenger density is critical at {density_pct}% ({inflow} passengers)."
        execute_db('''
            INSERT INTO alerts (station_id, alert_type, severity, message, status)
            VALUES (?, 'Overcrowding', 'Critical', ?, 'Active')
        ''', [station_id, alert_msg])

    return jsonify({
        'message': 'Station crowd data updated successfully',
        'station_id': station_id,
        'new_density': density_pct,
        'new_status': status
    })
