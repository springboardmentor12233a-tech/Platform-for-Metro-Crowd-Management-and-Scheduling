import time

from app.database.session import SessionLocal
from etl.logger import logger

from etl.mapper import Mapper
from etl.load_infrastructure import load_infrastructure
from etl.load_schedules import load_schedules
from etl.load_delays import load_delays
from etl.load_trips import load_trips
from etl.load_telemetry import load_telemetry
from etl.load_tickets import load_tickets
from etl.load_occupancy import load_occupancy
from etl.load_crowd_history import load_crowd_history
from etl.load_crowd_prediction import load_crowd_prediction
from etl.load_passenger_journeys import load_passenger_journeys


def run_all():
    db = SessionLocal()

    try:
        mapper = Mapper(db)

        loaders = [
            ("Infrastructure (Trains)", load_infrastructure),
            ("Schedules", load_schedules),
            ("Trips", load_trips),
            ("Delays", load_delays),
            ("Sensor Telemetry", load_telemetry),
            ("Tickets", load_tickets),
            ("Occupancy", load_occupancy),
            ("Crowd History", load_crowd_history),
            ("Crowd Prediction", load_crowd_prediction),
            ("Passenger Journeys", load_passenger_journeys),
        ]

        total_loaded = 0
        total_inserted = 0
        total_skipped = 0
        total_errors = 0

        t0 = time.time()

        logger.info("Starting new ETL Pipeline run...")

        for name, func in loaders:
            logger.info(f"--- Running {name} ---")

            try:
                stats = func(db, mapper)

                logger.info(f"{name} Results: {stats}")

                total_loaded += stats.get("loaded", 0)
                total_inserted += stats.get("inserted", 0)
                total_skipped += stats.get("skipped", 0)
                total_errors += stats.get("errors", 0)

            except Exception as e:
                db.rollback()
                logger.error(f"Failed to run {name}: {e}", exc_info=True)
                total_errors += 1

        t1 = time.time()

        logger.info("========================================")
        logger.info("ETL Execution Summary")
        logger.info(f"Datasets Loaded   : {len(loaders)}")
        logger.info(f"Records Processed : {total_loaded}")
        logger.info(f"Records Inserted  : {total_inserted}")
        logger.info(f"Records Skipped   : {total_skipped}")
        logger.info(f"Errors            : {total_errors}")
        logger.info(f"Execution Time    : {t1 - t0:.2f} seconds")
        logger.info("========================================")

    finally:
        db.close()


if __name__ == "__main__":
    run_all()