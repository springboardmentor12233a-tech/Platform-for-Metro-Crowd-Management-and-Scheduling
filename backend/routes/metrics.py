from flask import Blueprint, jsonify, request
from ml.evaluator import evaluator

metrics_bp = Blueprint('metrics', __name__, url_prefix='/api/metrics')

@metrics_bp.route('', methods=['GET'])
@metrics_bp.route('/summary', methods=['GET'])
def get_metrics_summary():
    """
    Returns full evaluation report and summary KPIs for the Evaluation Metrics dashboard.
    """
    force_refresh = request.args.get('refresh', 'false').lower() == 'true'
    try:
        data = evaluator.get_full_evaluation(force_refresh=force_refresh)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': f"Failed to compute evaluation metrics: {str(e)}"}), 500

@metrics_bp.route('/ai-prediction', methods=['GET'])
def get_ai_prediction_metrics():
    """
    Returns Scikit-Learn regression diagnostics (MAE, RMSE, R2, MAPE, accuracy within tolerances, baseline comparisons).
    """
    try:
        full_data = evaluator.get_full_evaluation()
        return jsonify({
            'status': 'success',
            'ai_prediction': full_data['ai_prediction'],
            'summary': full_data['summary_kpis']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@metrics_bp.route('/crowd-monitoring', methods=['GET'])
def get_crowd_monitoring_metrics():
    """
    Returns congestion classification performance (Accuracy, Precision, Recall, F1, Confusion Matrix, Station-wise metrics).
    """
    try:
        full_data = evaluator.get_full_evaluation()
        return jsonify({
            'status': 'success',
            'crowd_monitoring': full_data['crowd_monitoring']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@metrics_bp.route('/demand-forecasting', methods=['GET'])
def get_demand_forecasting_metrics():
    """
    Returns 24-hour diurnal demand profiles (actual vs predicted), peak vs off-peak splits, and MAPE metrics.
    """
    try:
        full_data = evaluator.get_full_evaluation()
        return jsonify({
            'status': 'success',
            'demand_forecasting': full_data['demand_forecasting']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@metrics_bp.route('/scheduling', methods=['GET'])
def get_scheduling_metrics():
    """
    Returns train scheduling optimization simulation metrics (Delay reduction, Wait time reduction, Headway comparison).
    """
    try:
        full_data = evaluator.get_full_evaluation()
        return jsonify({
            'status': 'success',
            'scheduling_simulation': full_data['scheduling_simulation']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@metrics_bp.route('/system-performance', methods=['GET'])
def get_system_performance_metrics():
    """
    Returns live measured database latencies, ML inference times, processed record volumes, and server uptime.
    """
    try:
        live_perf = evaluator.measure_live_system_performance()
        return jsonify({
            'status': 'success',
            'system_performance': live_perf
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@metrics_bp.route('/benchmark', methods=['POST'])
def run_live_benchmark():
    """
    Triggers an immediate live re-benchmark of system latencies and ML metrics.
    """
    try:
        fresh_data = evaluator.get_full_evaluation(force_refresh=True)
        return jsonify({
            'status': 'success',
            'message': 'Live system benchmark and metric evaluation executed successfully.',
            'data': fresh_data
        })
    except Exception as e:
        return jsonify({'error': f"Benchmark execution failed: {str(e)}"}), 500
