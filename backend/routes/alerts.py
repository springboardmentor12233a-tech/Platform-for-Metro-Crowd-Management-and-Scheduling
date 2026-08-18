from flask import Blueprint, request, jsonify, session
from database import query_db, execute_db

alerts_bp = Blueprint('alerts', __name__, url_prefix='/api/alerts')

@alerts_bp.route('', methods=['GET'])
def get_alerts():
    status_filter = request.args.get('status', 'Active')
    if status_filter == 'all':
        alerts = query_db('''
            SELECT a.*, s.name as station_name, s.line as station_line 
            FROM alerts a
            LEFT JOIN stations s ON a.station_id = s.id
            ORDER BY a.created_at DESC
        ''')
    else:
        alerts = query_db('''
            SELECT a.*, s.name as station_name, s.line as station_line 
            FROM alerts a
            LEFT JOIN stations s ON a.station_id = s.id
            WHERE a.status = ?
            ORDER BY a.created_at DESC
        ''', [status_filter])

    return jsonify({
        'alerts': alerts,
        'active_count': sum(1 for a in alerts if a['status'] == 'Active'),
        'critical_count': sum(1 for a in alerts if a['severity'] == 'Critical' and a['status'] == 'Active')
    })

@alerts_bp.route('/<int:alert_id>/status', methods=['PUT'])
def update_alert_status(alert_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Authentication required'}), 401

    data = request.get_json() or {}
    new_status = data.get('status', 'Acknowledged')

    if new_status not in ['Active', 'Acknowledged', 'Resolved']:
        return jsonify({'error': 'Invalid status value'}), 400

    execute_db('UPDATE alerts SET status = ? WHERE id = ?', [new_status, alert_id])
    return jsonify({'message': 'Alert status updated successfully', 'id': alert_id, 'status': new_status})

@alerts_bp.route('', methods=['POST'])
def create_alert():
    if 'user_id' not in session:
        return jsonify({'error': 'Authentication required'}), 401

    data = request.get_json() or {}
    station_id = data.get('station_id')
    alert_type = data.get('alert_type', 'Manual Warning')
    severity = data.get('severity', 'Medium')
    message = data.get('message')

    if not message:
        return jsonify({'error': 'Alert message content required'}), 400

    new_id = execute_db('''
        INSERT INTO alerts (station_id, alert_type, severity, message, status)
        VALUES (?, ?, ?, ?, 'Active')
    ''', [station_id, alert_type, severity, message])

    return jsonify({'message': 'Alert created successfully', 'id': new_id}), 201
