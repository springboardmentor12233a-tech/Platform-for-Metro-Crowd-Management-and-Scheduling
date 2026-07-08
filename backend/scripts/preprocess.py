import os
import pandas as pd

# MetroFlow Dataset Preprocessing Script

RAW_FOLDER = "datasets/raw"
PROCESSED_FOLDER = "datasets/processed"

os.makedirs(PROCESSED_FOLDER, exist_ok=True)

# Generic Cleaning Function

def clean_dataset(df, dataset_name):
    print("\n" + "=" * 60)
    print(f"Processing : {dataset_name}")
    print("=" * 60)

    print(f"Rows    : {df.shape[0]}")
    print(f"Columns : {df.shape[1]}")

    print("\nMissing Values")
    print(df.isnull().sum())

    print("\nDuplicate Rows")
    print(df.duplicated().sum())

    # Remove duplicate rows

    df = df.drop_duplicates()

    # Clean column names

    df.columns = df.columns.str.strip()

    # Clean text columns

    text_columns = df.select_dtypes(include=["object", "string"]).columns

    for col in text_columns:
        df[col] = (
            df[col]
            .fillna("Unknown")
            .astype(str)
            .str.strip()
        )

    # Fill numeric columns

    numeric_columns = df.select_dtypes(include="number").columns

    df[numeric_columns] = df[numeric_columns].fillna(0)

    # Convert Date Columns

    for column in df.columns:
        if "date" in column.lower():
            df[column] = pd.to_datetime(
                df[column],
                errors="coerce"
            )

    # Convert Fare Columns

    for column in df.columns:

        if "fare" in column.lower():

            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            ).fillna(0)

    # Convert Passenger Columns

    for column in df.columns:

        if "passenger" in column.lower():

            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            ).fillna(0)

    print("\nCleaning Completed")

    print(f"Rows Remaining : {len(df)}")

    return df

# Dataset 1 : Passenger Dataset

PASSENGER_FILE = os.path.join(
    RAW_FOLDER,
    "delhi_metro_updated.csv"
)

if os.path.exists(PASSENGER_FILE):

    passenger_df = pd.read_csv(PASSENGER_FILE)

    passenger_df = clean_dataset(
        passenger_df,
        "Passenger Dataset"
    )

    passenger_output = os.path.join(
        PROCESSED_FOLDER,
        "cleaned_metro_data.csv"
    )

    passenger_df.to_csv(
        passenger_output,
        index=False
    )

    print(f"\nSaved -> {passenger_output}")

else:

    print("\nPassenger dataset not found!")


# Dataset 2 : Metro Network Dataset
NETWORK_FILE = os.path.join(
    RAW_FOLDER,
    "Delhi-Metro-Network.csv"
)

if os.path.exists(NETWORK_FILE):

    network_df = pd.read_csv(NETWORK_FILE)

    network_df = clean_dataset(
        network_df,
        "Metro Network Dataset"
    )

    network_output = os.path.join(
        PROCESSED_FOLDER,
        "cleaned_metro_network.csv"
    )

    network_df.to_csv(
        network_output,
        index=False
    )

    print(f"\nSaved -> {network_output}")

else:

    print("\nMetro Network dataset not found!")

# Finished

print("\n" + "=" * 60)
print("MetroFlow Dataset Preprocessing Completed Successfully")
print("=" * 60)

print("\nProcessed Files:")

print("cleaned_metro_data.csv")

print("cleaned_metro_network.csv")

print("\nLocation:")

print(PROCESSED_FOLDER)