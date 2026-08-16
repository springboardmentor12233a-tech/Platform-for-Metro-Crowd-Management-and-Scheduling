import time

from app.database.session import SessionLocal

from etl.logger import logger
from etl.mapper import Mapper

from etl.load_stations import load_stations
from etl.load_infrastructure import load_infrastructure
from etl.load_schedules import load_schedules
from etl.load_trips import load_trips
from etl.load_delays import load_delays
from etl.load_telemetry import load_telemetry
from etl.load_tickets import load_tickets
from etl.load_occupancy import load_occupancy
from etl.load_crowd_history import load_crowd_history
from etl.load_crowd_prediction import load_crowd_prediction
from etl.load_passenger_journeys import (
    load_passenger_journeys
)


def run_all():

    db = SessionLocal()

    try:

        total_loaded = 0
        total_inserted = 0
        total_skipped = 0
        total_errors = 0

        start = time.time()

        logger.info(
            "========================================"
        )

        logger.info(
            "Starting MetroFlow ETL Pipeline"
        )

        logger.info(
            "========================================"
        )

        # =====================================================
        # 1. STATIONS
        # =====================================================

        logger.info(
            "--- Loading Stations ---"
        )

        stats = load_stations(db)

        logger.info(
            f"Stations Results: {stats}"
        )

        total_loaded += stats.get(
            "loaded", 0
        )

        total_inserted += stats.get(
            "inserted", 0
        )

        total_skipped += stats.get(
            "skipped", 0
        )

        total_errors += stats.get(
            "errors", 0
        )

        if stats.get("errors", 0) > 0:

            logger.error(
                "Station loading failed. "
                "Stopping ETL."
            )

            return

        # =====================================================
        # CREATE MAPPER AFTER STATIONS
        # =====================================================

        mapper = Mapper(db)

        # =====================================================
        # 2. TRAINS
        # =====================================================

        loaders = [

            (
                "Infrastructure / Trains",
                load_infrastructure
            ),

            (
                "Schedules",
                load_schedules
            ),

            (
                "Trips",
                load_trips
            ),

            (
                "Delays",
                load_delays
            ),

            (
                "Sensor Telemetry",
                load_telemetry
            ),

            (
                "Tickets",
                load_tickets
            ),

            (
                "Occupancy",
                load_occupancy
            ),

            (
                "Crowd History",
                load_crowd_history
            ),

            (
                "Crowd Prediction",
                load_crowd_prediction
            ),

            (
                "Passenger Journeys",
                load_passenger_journeys
            ),
        ]

        # =====================================================
        # RUN LOADERS
        # =====================================================

        for name, loader in loaders:

            logger.info(
                f"--- Running {name} ---"
            )

            try:

                stats = loader(
                    db,
                    mapper
                )

                logger.info(
                    f"{name} Results: {stats}"
                )

                total_loaded += stats.get(
                    "loaded", 0
                )

                total_inserted += stats.get(
                    "inserted", 0
                )

                total_skipped += stats.get(
                    "skipped", 0
                )

                total_errors += stats.get(
                    "errors", 0
                )

            except Exception as e:

                db.rollback()

                logger.error(
                    f"{name} failed: {e}",
                    exc_info=True
                )

                total_errors += 1

        # =====================================================
        # SUMMARY
        # =====================================================

        elapsed = (
            time.time() - start
        )

        logger.info(
            "========================================"
        )

        logger.info(
            "MetroFlow ETL Summary"
        )

        logger.info(
            "========================================"
        )

        logger.info(
            f"Datasets processed : "
            f"{len(loaders) + 1}"
        )

        logger.info(
            f"Records loaded    : "
            f"{total_loaded}"
        )

        logger.info(
            f"Records inserted   : "
            f"{total_inserted}"
        )

        logger.info(
            f"Records skipped    : "
            f"{total_skipped}"
        )

        logger.info(
            f"Errors             : "
            f"{total_errors}"
        )

        logger.info(
            f"Execution time     : "
            f"{elapsed:.2f} seconds"
        )

        logger.info(
            "========================================"
        )

    finally:

        db.close()


if __name__ == "__main__":
    run_all()