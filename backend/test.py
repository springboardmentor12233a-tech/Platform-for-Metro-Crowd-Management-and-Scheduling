from pathlib import Path
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent

DATASETS = {
    "GPS": BASE_DIR / "datasets" / "gps_preprocessed.csv",
    "SENSOR": BASE_DIR / "datasets" / "sensor_preprocessed.csv",
}


for name, path in DATASETS.items():

    print("\n")
    print("=" * 80)
    print(f"{name} DATASET")
    print("=" * 80)

    if not path.exists():
        print(f"FILE NOT FOUND:")
        print(path)
        continue

    df = pd.read_csv(path)

    print(f"\nFile       : {path.name}")
    print(f"Rows       : {len(df)}")
    print(f"Columns    : {len(df.columns)}")

    print("\nCOLUMN NAMES")
    print("-" * 80)

    for column in df.columns:
        print(column)

    print("\nDATA TYPES")
    print("-" * 80)

    print(df.dtypes.to_string())

    print("\nFIRST 5 ROWS")
    print("-" * 80)

    print(df.head().to_string())

    print("\nMISSING VALUES")
    print("-" * 80)

    missing = df.isnull().sum()

    print(
        missing[
            missing > 0
        ].to_string()
        if missing.sum() > 0
        else "No missing values"
    )

    print("\nUNIQUE VALUES SAMPLE")
    print("-" * 80)

    for column in df.columns:

        if df[column].dtype == "object":

            values = (
                df[column]
                .dropna()
                .astype(str)
                .unique()
            )

            print(
                f"{column}: "
                f"{values[:10]}"
            )