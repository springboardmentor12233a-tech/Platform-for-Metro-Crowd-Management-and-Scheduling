from pathlib import Path

import pandas as pd


class ScheduleCSVService:

    @staticmethod
    def get_all_schedules(
        skip: int = 0,
        limit: int = 100,
    ):

        # ---------------------------------------------------------
        # DATASET PATH
        # ---------------------------------------------------------

        BASE_DIR = Path(__file__).resolve().parents[2]

        CSV_PATH = (
            BASE_DIR
            / "datasets"
            / "schedules_preprocessed.csv"
        )

        # ---------------------------------------------------------
        # CHECK FILE
        # ---------------------------------------------------------

        if not CSV_PATH.exists():

            raise FileNotFoundError(
                f"Schedule dataset not found: {CSV_PATH}"
            )

        # ---------------------------------------------------------
        # LOAD DATASET
        # ---------------------------------------------------------

        df = pd.read_csv(CSV_PATH)

        df = df.fillna("")

        # ---------------------------------------------------------
        # GLOBAL DATASET INFORMATION
        # IMPORTANT:
        # These are calculated BEFORE pagination.
        # ---------------------------------------------------------

        total_schedules = len(df)

        total_trains = (
            df["train_id"]
            .astype(str)
            .nunique()
        )

        total_stations = (
            df["station_name"]
            .astype(str)
            .nunique()
        )

        all_trains = sorted(
            df["train_id"]
            .astype(str)
            .unique()
            .tolist()
        )

        all_day_types = sorted(
            df["day_type"]
            .astype(str)
            .unique()
            .tolist()
        )

        # ---------------------------------------------------------
        # PAGINATION
        # ---------------------------------------------------------

        page_df = df.iloc[
            skip:skip + limit
        ]

        # ---------------------------------------------------------
        # CONVERT PAGE DATA
        # ---------------------------------------------------------

        schedules = []

        for _, row in page_df.iterrows():

            schedules.append(
                {
                    "id": str(row["id"]),

                    "train_id": str(
                        row["train_id"]
                    ),

                    "station_name": str(
                        row["station_name"]
                    ),

                    "arrival_time": str(
                        row["arrival_time"]
                    ),

                    "departure_time": str(
                        row["departure_time"]
                    ),

                    "stop_sequence": int(
                        row["stop_sequence"]
                    ),

                    "day_type": str(
                        row["day_type"]
                    ),

                    "platform": int(
                        row["platform"]
                    ),
                }
            )

        # ---------------------------------------------------------
        # RESPONSE
        # ---------------------------------------------------------

        return {
            "schedules": schedules,

            "total": total_schedules,

            "total_trains": total_trains,

            "total_stations": total_stations,

            "trains": all_trains,

            "day_types": all_day_types,
        }