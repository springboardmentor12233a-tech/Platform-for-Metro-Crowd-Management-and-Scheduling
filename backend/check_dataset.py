import os
import pandas as pd

# Path to your cleaned dataset
csv_path = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "EDA",
        "cleaned_data",
        "delhi_metro_updated_clean.csv"
    )
)

print("Reading:", csv_path)

df = pd.read_csv(csv_path)

print("\nColumns:")
print(df.columns.tolist())

print("\nFirst 5 Rows:")
print(df.head())