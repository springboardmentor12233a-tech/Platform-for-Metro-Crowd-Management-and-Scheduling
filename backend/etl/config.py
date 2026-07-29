from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = BASE_DIR / "datasets" / "processed"

TRAINS_CSV = DATASET_DIR / "trains_preprocessed.csv"
TRIPS_CSV = DATASET_DIR / "trips_preprocessed.csv"
SCHEDULES_CSV = DATASET_DIR / "schedules_preprocessed.csv"
DELAY_CSV = DATASET_DIR / "delay_preprocessed.csv"
SENSOR_CSV = DATASET_DIR / "sensor_preprocessed.csv"
TICKETING_CSV = DATASET_DIR / "ticketing_preprocessed.csv"
OCCUPANCY_CSV = DATASET_DIR / "occupancy_preprocessed.csv"
CROWD_HISTORY_CSV = DATASET_DIR / "crowd_history_preprocessed.csv"
CROWD_PREDICTION_CSV = DATASET_DIR / "crowd_prediction_preprocessed.csv"
PASSENGER_CSV = DATASET_DIR / "passenger_entry_exit_data.csv"

CHUNK_SIZE = 5000
