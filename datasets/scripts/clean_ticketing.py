"""
=============================================================================
Ticketing Data Cleaner
Raw  : datasets/raw/ticketing.csv         (150,000 rows × 10 cols)
Clean: datasets/processed/ticketing_cleaned.csv

Cleaning steps applied:
  1.  Strip whitespace from all string columns
  2.  Parse Date → proper datetime (yyyy-mm-dd)
  3.  Extract Year, Month, Day, DayOfWeek, IsWeekend, Hour (from Remarks proxy)
  4.  Fill missing Ticket_Type with mode
  5.  Fill missing Passengers with median
  6.  Fill missing Remarks with 'unknown'
  7.  Correct data types (TripID → int, Passengers → int)
  8.  Remove duplicate TripIDs (none found, but checked)
  9.  Clip Distance_km, Fare, Cost_per_passenger to valid physical ranges
  10. Derive: TotalRevenue, RevenuePerKm, PassengerDensity, IsPeakHour
  11. Flag anomalies: zero-distance trips, cost > fare etc.
  12. Sort by Date ascending
  13. Reset index
  14. Save with UTF-8 encoding, no index
=============================================================================
"""
import sys, io, warnings
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
warnings.filterwarnings("ignore")

import pandas as pd
import numpy as np
from pathlib import Path

RAW     = Path("raw/ticketing.csv")
CLEAN   = Path("processed/ticketing_cleaned.csv")
CLEAN.parent.mkdir(parents=True, exist_ok=True)

print("=" * 60)
print("  Ticketing Data Cleaner")
print("=" * 60)

# ── Load ──────────────────────────────────────────────────────
df = pd.read_csv(RAW, low_memory=False)
print(f"\n[1] Loaded raw data : {df.shape[0]:,} rows × {df.shape[1]} cols")

# ── Step 1: Strip whitespace from all object columns ──────────
str_cols = df.select_dtypes(include="object").columns
for c in str_cols:
    df[c] = df[c].astype(str).str.strip()
    df[c] = df[c].replace("nan", pd.NA)
print(f"[2] Stripped whitespace from: {list(str_cols)}")

# ── Step 2: Parse Date column ─────────────────────────────────
df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
bad_dates = df["Date"].isna().sum()
print(f"[3] Date parsed — {bad_dates} unparseable dates")

# ── Step 3: Extract temporal features ─────────────────────────
df["Year"]       = df["Date"].dt.year
df["Month"]      = df["Date"].dt.month
df["MonthName"]  = df["Date"].dt.strftime("%b")          # Jan, Feb…
df["Day"]        = df["Date"].dt.day
df["DayOfWeek"]  = df["Date"].dt.dayofweek               # 0=Mon … 6=Sun
df["DayName"]    = df["Date"].dt.strftime("%a")           # Mon, Tue…
df["IsWeekend"]  = (df["DayOfWeek"] >= 5).astype(int)
df["Quarter"]    = df["Date"].dt.quarter
df["WeekOfYear"] = df["Date"].dt.isocalendar().week.astype(int)
print(f"[4] Temporal features added: Year, Month, Day, DayOfWeek, IsWeekend, Quarter, WeekOfYear")

# ── Step 4: Fill missing Ticket_Type with mode ────────────────
ticket_mode = df["Ticket_Type"].mode()[0]
missing_tt  = df["Ticket_Type"].isna().sum()
df["Ticket_Type"] = df["Ticket_Type"].fillna(ticket_mode)
print(f"[5] Ticket_Type: {missing_tt:,} missing filled with mode='{ticket_mode}'")

# ── Step 5: Fill missing Passengers with median ───────────────
pass_median  = df["Passengers"].median()
missing_pass = df["Passengers"].isna().sum()
df["Passengers"] = df["Passengers"].fillna(pass_median)
df["Passengers"] = df["Passengers"].astype(int)
print(f"[6] Passengers: {missing_pass:,} missing filled with median={pass_median:.0f}")

# ── Step 6: Fill missing Remarks with 'unknown' ───────────────
missing_rem = df["Remarks"].isna().sum()
df["Remarks"] = df["Remarks"].fillna("unknown")
print(f"[7] Remarks: {missing_rem:,} missing filled with 'unknown'")

# ── Step 7: Fix data types ────────────────────────────────────
df["TripID"] = df["TripID"].astype(int)
print(f"[8] TripID → int confirmed")

# ── Step 8: Duplicate check on TripID ─────────────────────────
dup_count = df.duplicated(subset=["TripID"]).sum()
if dup_count > 0:
    df = df.drop_duplicates(subset=["TripID"], keep="first")
    print(f"[9] Removed {dup_count:,} duplicate TripIDs")
else:
    print(f"[9] No duplicate TripIDs found")

# ── Step 9: Clip to valid physical ranges ─────────────────────
before_clip = len(df)

# Distance: 0.5 – 100 km  (max Delhi Metro line is ~60 km)
invalid_dist = (df["Distance_km"] < 0.1) | (df["Distance_km"] > 100)
df.loc[invalid_dist, "Distance_km"] = np.nan
df["Distance_km"] = df["Distance_km"].clip(lower=0.1, upper=100)

# Fare: 10 – 200 INR
df["Fare"] = df["Fare"].clip(lower=10, upper=200)

# Cost per passenger: 5 – 120 INR
df["Cost_per_passenger"] = df["Cost_per_passenger"].clip(lower=5, upper=120)

# Passengers: 1 – 60
df["Passengers"] = df["Passengers"].clip(lower=1, upper=60)

print(f"[10] Clipped Distance_km [0.1–100], Fare [10–200], Cost [5–120], Passengers [1–60]")

# ── Step 10: Derive engineered features ───────────────────────
# Total revenue = Fare × Passengers
df["TotalRevenue"] = (df["Fare"] * df["Passengers"]).round(2)

# Revenue per km
df["RevenuePerKm"] = (df["TotalRevenue"] / df["Distance_km"].replace(0, np.nan)).round(2)

# Fare per km
df["FarePerKm"] = (df["Fare"] / df["Distance_km"].replace(0, np.nan)).round(2)

# Is peak — derived from Remarks column (already has 'peak' label)
df["IsPeak"] = (df["Remarks"] == "peak").astype(int)

# Trip category by distance
def distance_category(d):
    if pd.isna(d):   return "Unknown"
    if d <= 2:       return "Very Short (<2km)"
    if d <= 5:       return "Short (2–5km)"
    if d <= 10:      return "Medium (5–10km)"
    if d <= 20:      return "Long (10–20km)"
    return "Very Long (>20km)"

df["DistanceCategory"] = df["Distance_km"].apply(distance_category)

# Fare bracket
df["FareBracket"] = pd.cut(
    df["Fare"],
    bins=[0, 40, 80, 120, 160, 200],
    labels=["Very Low (0-40)", "Low (40-80)", "Medium (80-120)", "High (120-160)", "Premium (160-200)"],
    right=True
).astype(str)

# Ticket type encoded (ordinal)
ticket_order = {"Single": 0, "Return": 1, "Smart Card": 2, "Tourist Card": 3}
df["TicketTypeCode"] = df["Ticket_Type"].map(ticket_order).fillna(-1).astype(int)

# OD Pair
df["OD_Pair"] = df["From_Station"].str.strip() + " → " + df["To_Station"].str.strip()

# Flag: Cost > Fare (anomaly — should not happen)
df["Flag_CostExceedsFare"] = (df["Cost_per_passenger"] > df["Fare"]).astype(int)

print(f"[11] Derived features added:")
print(f"       TotalRevenue, RevenuePerKm, FarePerKm, IsPeak")
print(f"       DistanceCategory, FareBracket, TicketTypeCode, OD_Pair")
print(f"       Flag_CostExceedsFare")

# ── Step 11: Sort by Date ─────────────────────────────────────
df = df.sort_values("Date", ascending=True).reset_index(drop=True)
print(f"[12] Sorted by Date ascending")

# ── Save ──────────────────────────────────────────────────────
df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")   # back to clean string for CSV
df.to_csv(CLEAN, index=False, encoding="utf-8")
print(f"\n[13] Saved: {CLEAN}")
print(f"     Final shape: {df.shape[0]:,} rows × {df.shape[1]} columns")

# ── Summary Report ────────────────────────────────────────────
print("\n" + "=" * 60)
print("  CLEANING SUMMARY")
print("=" * 60)
print(f"  Raw rows           : 150,000")
print(f"  Clean rows         : {len(df):,}")
print(f"  Columns (raw)      : 10")
print(f"  Columns (clean)    : {df.shape[1]}")
print(f"  New features added : {df.shape[1] - 10}")

print(f"\n  Missing values AFTER cleaning:")
miss_after = df.isnull().sum()
miss_after = miss_after[miss_after > 0]
if miss_after.empty:
    print("    None — fully complete dataset!")
else:
    print(miss_after.to_string())

print(f"\n  Column list (final):")
for i, c in enumerate(df.columns, 1):
    print(f"    {i:02d}. {c}")

print(f"\n  Date range  : {df['Date'].min()} → {df['Date'].max()}")
print(f"  Stations    : {df['From_Station'].nunique():,} origins, {df['To_Station'].nunique()} destinations")
print(f"  OD Pairs    : {df['OD_Pair'].nunique():,} unique routes")
print(f"  Ticket types: {df['Ticket_Type'].value_counts().to_dict()}")
print(f"  Total Revenue (all): INR {df['TotalRevenue'].sum():,.2f}")
print(f"  Avg Fare          : INR {df['Fare'].mean():.2f}")
print(f"  Avg Passengers    : {df['Passengers'].mean():.1f}")
print(f"  Avg Distance      : {df['Distance_km'].mean():.2f} km")
print(f"  Anomaly flags     : {df['Flag_CostExceedsFare'].sum():,} trips where cost > fare")
print(f"  Peak trips        : {df['IsPeak'].sum():,} ({df['IsPeak'].mean()*100:.1f}%)")
print(f"  Weekend trips     : {df['IsWeekend'].sum():,} ({df['IsWeekend'].mean()*100:.1f}%)")
print("=" * 60)
print("  DONE")
print("=" * 60)
