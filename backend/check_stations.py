import pandas as pd

df = pd.read_excel(
    r"C:\MetroFlow\dataset\multi-year-station-entry-and-exit-figures.xls",
    sheet_name="2017 Entry & Exit",
    header=6
)

print(df["Station"].unique()[:20])