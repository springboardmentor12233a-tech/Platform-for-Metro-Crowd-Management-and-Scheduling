from __future__ import annotations

import argparse
import importlib
import json
import sys
import time
import traceback
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from preprocess_common import LOGS_DIR, PROCESSED_DIR

PIPELINE = [
    ("ridership", "preprocess_ridership"),
    ("gps", "preprocess_gps"),
    ("occupancy", "preprocess_occupancy"),
    ("delay", "preprocess_delay"),
    ("ticketing", "preprocess_ticketing"),
    ("ac2020_entry_exit", "preprocess_ac2020_entry_exit"),
    ("entry_exit", "preprocess_entry_exit"),
    ("stations", "preprocess_stations"),
    ("trains", "preprocess_trains"),
    ("schedules", "preprocess_schedules"),
    ("sensor", "preprocess_sensor"),
]


def run_pipeline(only: list[str] | None = None, skip: list[str] | None = None) -> dict:
    only_set = set(only or [])
    skip_set = set(skip or [])
    report = {
        "run_started": datetime.now().isoformat(timespec="seconds"),
        "run_finished": None,
        "processed_dir": str(PROCESSED_DIR),
        "logs_dir": str(LOGS_DIR),
        "results": {},
    }

    started = time.time()
    for name, module_name in PIPELINE:
        if only_set and name not in only_set:
            report["results"][name] = {"status": "skipped", "reason": "not selected by --only"}
            continue
        if name in skip_set:
            report["results"][name] = {"status": "skipped", "reason": "selected by --skip"}
            continue

        step_started = time.time()
        try:
            module = importlib.import_module(module_name)
            module.run()
            report["results"][name] = {
                "status": "success",
                "duration_seconds": round(time.time() - step_started, 3),
            }
        except Exception as exc:
            report["results"][name] = {
                "status": "failed",
                "duration_seconds": round(time.time() - step_started, 3),
                "error": str(exc),
                "traceback": traceback.format_exc(),
            }

    report["run_finished"] = datetime.now().isoformat(timespec="seconds")
    report["duration_seconds"] = round(time.time() - started, 3)
    output_path = LOGS_DIR / "preprocessing_master_report.json"
    output_path.write_text(json.dumps(report, indent=2, default=str), encoding="utf-8")
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description="Run metro preprocessing scripts.")
    parser.add_argument("--only", nargs="+", help="Run only these dataset names.")
    parser.add_argument("--skip", nargs="+", help="Skip these dataset names.")
    args = parser.parse_args()
    report = run_pipeline(only=args.only, skip=args.skip)
    failures = [name for name, result in report["results"].items() if result["status"] == "failed"]
    if failures:
        raise SystemExit(f"Preprocessing failed for: {', '.join(failures)}")


if __name__ == "__main__":
    main()
