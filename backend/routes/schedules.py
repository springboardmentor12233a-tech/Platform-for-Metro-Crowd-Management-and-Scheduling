from flask import Blueprint, request, jsonify, session
from database import query_db, execute_db

schedules_bp = Blueprint('schedules', __name__, url_prefix='/api/schedules')

@schedules_bp.route('', methods=['GET'])
def get_schedules():
    line_filter = request.args.get('line')
    if line_filter:
        schedules = query_db('SELECT * FROM train_schedules WHERE line = ? ORDER BY departure_time ASC', [line_filter])
    else:
        schedules = query_db('SELECT * FROM train_schedules ORDER BY line ASC, departure_time ASC')
    return jsonify({'schedules': schedules})

@schedules_bp.route('', methods=['POST'])
def create_schedule():
    if session.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized: Admin privilege required'}), 403

    data = request.get_json() or {}
    train_code = data.get('train_code')
    line = data.get('line')
    origin = data.get('origin_station')
    destination = data.get('destination_station')
    departure = data.get('departure_time')
    arrival = data.get('arrival_time')
    frequency = data.get('frequency_mins', 10)
    status = data.get('status', 'On Time')

    if not all([train_code, line, origin, destination, departure, arrival]):
        return jsonify({'error': 'Missing required schedule fields'}), 400

    try:
        new_id = execute_db('''
            INSERT INTO train_schedules (train_code, line, origin_station, destination_station, departure_time, arrival_time, frequency_mins, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', [train_code, line, origin, destination, departure, arrival, frequency, status])
        return jsonify({'message': 'Train schedule created successfully', 'id': new_id}), 201
    except Exception as e:
        return jsonify({'error': f'Failed to create schedule: {str(e)}'}), 400

@schedules_bp.route('/<int:schedule_id>', methods=['PUT'])
def update_schedule(schedule_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Authentication required'}), 401

    data = request.get_json() or {}
    status = data.get('status')
    frequency = data.get('frequency_mins')

    if not status and frequency is None:
        return jsonify({'error': 'No update fields provided'}), 400

    existing = query_db('SELECT * FROM train_schedules WHERE id = ?', [schedule_id], one=True)
    if not existing:
        return jsonify({'error': 'Schedule record not found'}), 404

    new_status = status if status else existing['status']
    new_freq = frequency if frequency is not None else existing['frequency_mins']

    execute_db('''
        UPDATE train_schedules 
        SET status = ?, frequency_mins = ? 
        WHERE id = ?
    ''', [new_status, new_freq, schedule_id])

    return jsonify({'message': 'Schedule updated successfully', 'id': schedule_id})

@schedules_bp.route('/<int:schedule_id>', methods=['DELETE'])
def delete_schedule(schedule_id):
    if session.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized: Admin privilege required'}), 403

    execute_db('DELETE FROM train_schedules WHERE id = ?', [schedule_id])
    return jsonify({'message': 'Schedule deleted successfully'})

@schedules_bp.route('/recommendations', methods=['GET'])
def get_recommendations():
    """
    AI-driven Train Frequency Recommendation Engine based on station crowd density.
    Computes optimum train headway for each metro line.
    """
    stations = query_db('SELECT * FROM stations')
    schedules = query_db('SELECT * FROM train_schedules')

    lines = list(set(s['line'] for s in stations))
    recommendations = []

    for line in lines:
        line_stations = [s for s in stations if s['line'] == line]
        if not line_stations:
            continue

        max_density = max(s['current_density'] for s in line_stations)
        busiest_station = max(line_stations, key=lambda s: s['current_density'])

        # Rule-based optimization logic driven by predicted/current density
        if max_density >= 80.0:
            rec_freq = 3  # High frequency peak dispatch
            action = 'URGENT: Increase Frequency'
            reason = f"Critical overcrowding detected at {busiest_station['name']} ({max_density}% capacity)."
        elif max_density >= 65.0:
            rec_freq = 5  # Peak frequency
            action = 'Increase Frequency'
            reason = f"High passenger volume at {busiest_station['name']} ({max_density}% capacity)."
        elif max_density >= 40.0:
            rec_freq = 8  # Normal frequency
            action = 'Maintain Regular Schedule'
            reason = f"Moderate traffic flow across {line}."
        else:
            rec_freq = 12  # Low frequency off-peak
            action = 'Reduce Frequency / Save Energy'
            reason = f"Low footfall across {line} (Peak density: {max_density}%)."

        current_line_schedules = [sch for sch in schedules if sch['line'] == line]
        avg_current_freq = sum(sch['frequency_mins'] for sch in current_line_schedules) / len(current_line_schedules) if current_line_schedules else 10

        recommendations.append({
            'line': line,
            'busiest_station': busiest_station['name'],
            'current_max_density': max_density,
            'current_avg_frequency': round(avg_current_freq, 1),
            'recommended_frequency': rec_freq,
            'action': action,
            'reason': reason
        })

    return jsonify({'recommendations': recommendations})
