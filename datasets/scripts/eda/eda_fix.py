import sys, io, json, math, warnings, glob, time
warnings.filterwarnings("ignore")
from pathlib import Path

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

# Resolve paths
try:
    DATASETS_ROOT = Path(__file__).resolve().parents[2]
except NameError:
    DATASETS_ROOT = Path.cwd().resolve().parents[1]

PROCESSED_DIR = DATASETS_ROOT / "processed"
CHARTS_DIR = DATASETS_ROOT / "charts"
REPORTS_DIR = DATASETS_ROOT / "reports"

for d in [CHARTS_DIR, REPORTS_DIR]:
    d.mkdir(parents=True, exist_ok=True)

# Styling
PALETTE = "husl"
sns.set_theme(style="darkgrid", palette=PALETTE, font_scale=1.05)
plt.rcParams.update({
    "figure.dpi": 130, "savefig.bbox": "tight",
    "axes.spines.top": False, "axes.spines.right": False,
})
ACCENT="#7B61FF"; RED="#FF4E50"; GREEN="#43B884"; ORANGE="#FFB347"

def save_fig(name, subdir):
    folder = CHARTS_DIR / subdir
    folder.mkdir(parents=True, exist_ok=True)
    p = folder / f"{name}.png"
    plt.savefig(p, dpi=130, bbox_inches="tight", facecolor="white")
    plt.close("all")
    return str(p)

def md_tbl(df):
    try: return df.to_markdown()
    except: return df.to_string()

def run_eda(filepath):
    start_time = time.time()
    path = Path(filepath)
    dataset_name = path.stem.replace("_preprocessed", "").replace("_data", "")
    print(f"\n{'='*60}\nProcessing Dataset: {path.name}\n{'='*60}")
    
    try:
        df = pd.read_csv(path)
    except Exception as e:
        print(f"Error reading {path.name}: {e}")
        return False, 0, 1

    charts_generated = 0
    warnings_count = 0

    print("\n# Dataset Overview")
    print(f"- Shape: {df.shape}")
    print(f"- Number of Rows: {df.shape[0]:,}")
    print(f"- Number of Columns: {df.shape[1]}")
    print(f"- Memory Usage: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
    print(f"- Duplicate Records: {df.duplicated().sum():,}")
    
    print("\n# Data Types")
    print(df.dtypes.to_string())

    print("\n# Missing Values")
    miss = df.isnull().sum()
    miss = miss[miss > 0]
    if not miss.empty:
        print(miss.to_string())
    else:
        print("No missing values.")

    print("\n# Null Percentage")
    miss_pct = (df.isnull().mean() * 100).round(2)
    miss_pct = miss_pct[miss_pct > 0]
    if not miss_pct.empty:
        print(miss_pct.to_string())
    else:
        print("No missing values.")

    num_cols = df.select_dtypes(include="number").columns.tolist()
    cat_cols = df.select_dtypes(include=["object", "category"]).columns.tolist()
    dt_cols = []
    
    # Try parsing datetimes
    for c in cat_cols:
        if any(k in c.lower() for k in ["time", "date", "timestamp"]):
            try:
                df[c] = pd.to_datetime(df[c], errors="coerce")
                if df[c].notna().mean() > 0.5:
                    dt_cols.append(c)
            except:
                pass
    cat_cols = [c for c in cat_cols if c not in dt_cols]

    print("\n# Numerical Summary")
    if num_cols:
        print(md_tbl(df[num_cols].describe().T.round(2)))
    else:
        print("No numerical columns.")

    print("\n# Categorical Summary")
    if cat_cols:
        print(md_tbl(df[cat_cols].describe().T))
    else:
        print("No categorical columns.")

    print("\n# Unique Value Counts")
    uniq = df.nunique()
    print(uniq.to_string())
    
    print("\n# Visualizations")
    
    # 1. Missing Value Heatmap
    if not miss.empty:
        try:
            plt.figure(figsize=(10, 6))
            sns.heatmap(df.isnull(), yticklabels=False, cbar=False, cmap="viridis")
            plt.title(f"Missing Values Heatmap - {dataset_name}")
            save_fig("missing_values_heatmap", dataset_name)
            charts_generated += 1
            print("- Missing value heatmap generated.")
        except Exception as e:
            print(f"Warning: Missing value heatmap failed - {e}")
            warnings_count += 1

    # 2. Numerical Distributions (Histograms)
    if num_cols:
        try:
            n = min(len(num_cols), 12)
            cols = min(3, n)
            rows = math.ceil(n / cols)
            fig, axes = plt.subplots(rows, cols, figsize=(cols*5, rows*4))
            axes = np.array(axes).flatten()
            for i, c in enumerate(num_cols[:n]):
                data = df[c].dropna()
                axes[i].hist(data, bins=40, color=ACCENT, edgecolor="white", alpha=0.85)
                axes[i].set_title(f"Distribution of {c}", fontsize=10)
            for j in range(i+1, len(axes)): axes[j].set_visible(False)
            plt.tight_layout()
            save_fig("numerical_distributions", dataset_name)
            charts_generated += 1
            print("- Numerical distributions generated.")
        except Exception as e:
            print(f"Warning: Numerical distributions failed - {e}")
            warnings_count += 1

    # 3. Box Plots (Outlier Detection)
    if num_cols:
        try:
            n = min(len(num_cols), 8)
            cols = min(4, n)
            rows = math.ceil(n / cols)
            fig, axes = plt.subplots(rows, cols, figsize=(cols*4, rows*4))
            axes = np.array(axes).flatten()
            for i, c in enumerate(num_cols[:n]):
                sns.boxplot(y=df[c].dropna(), ax=axes[i], color=ORANGE)
                axes[i].set_title(f"Outliers in {c}", fontsize=10)
            for j in range(i+1, len(axes)): axes[j].set_visible(False)
            plt.tight_layout()
            save_fig("outlier_boxplots", dataset_name)
            charts_generated += 1
            print("- Outlier box plots generated.")
        except Exception as e:
            print(f"Warning: Box plots failed - {e}")
            warnings_count += 1

    # 4. Correlation Matrix
    if len(num_cols) > 1:
        try:
            plt.figure(figsize=(max(8, len(num_cols)*0.8), max(6, len(num_cols)*0.6)))
            corr = df[num_cols].corr()
            sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", center=0, cbar_kws={"shrink":0.8})
            plt.title(f"Correlation Matrix - {dataset_name}")
            plt.tight_layout()
            save_fig("correlation_matrix", dataset_name)
            charts_generated += 1
            print("- Correlation matrix generated.")
        except Exception as e:
            print(f"Warning: Correlation matrix failed - {e}")
            warnings_count += 1

    # 5. Categorical Count Plots
    if cat_cols:
        try:
            low_card_cols = [c for c in cat_cols if df[c].nunique() <= 20]
            if low_card_cols:
                n = min(len(low_card_cols), 6)
                cols = min(2, n)
                rows = math.ceil(n / cols)
                fig, axes = plt.subplots(rows, cols, figsize=(cols*6, rows*4))
                axes = np.array(axes).flatten()
                for i, c in enumerate(low_card_cols[:n]):
                    val_counts = df[c].value_counts().head(20)
                    sns.barplot(x=val_counts.index, y=val_counts.values, ax=axes[i], palette="Set2")
                    axes[i].set_title(f"Counts: {c}", fontsize=10)
                    axes[i].tick_params(axis='x', rotation=45)
                for j in range(i+1, len(axes)): axes[j].set_visible(False)
                plt.tight_layout()
                save_fig("categorical_counts", dataset_name)
                charts_generated += 1
                print("- Categorical count plots generated.")
        except Exception as e:
            print(f"Warning: Categorical plots failed - {e}")
            warnings_count += 1

    # 6. Specific Keyword-based Visualizations
    columns_lower = [c.lower() for c in df.columns]
    
    # Station-wise analysis
    station_col = next((c for c in df.columns if "station" in c.lower()), None)
    if station_col:
        try:
            top_stations = df[station_col].value_counts().head(20)
            plt.figure(figsize=(12, 6))
            sns.barplot(x=top_stations.index, y=top_stations.values, palette="rocket")
            plt.title("Top 20 Stations by Frequency")
            plt.xticks(rotation=45, ha="right")
            plt.ylabel("Frequency")
            plt.tight_layout()
            save_fig("station_wise_analysis", dataset_name)
            charts_generated += 1
            print("- Station-wise analysis generated.")
        except Exception as e:
            print(f"Warning: Station analysis failed - {e}")
            warnings_count += 1

    # Daily Trends / Time-Series
    if dt_cols:
        try:
            tc = dt_cols[0]
            df_ts = df.set_index(tc).sort_index()
            # Plot count of records per day
            daily_counts = df_ts.resample("D").size()
            if len(daily_counts) > 1:
                plt.figure(figsize=(14, 5))
                daily_counts.plot(color=ACCENT, lw=2)
                plt.title(f"Daily Trends ({tc})")
                plt.ylabel("Record Count")
                plt.tight_layout()
                save_fig("daily_trends", dataset_name)
                charts_generated += 1
                print("- Daily trends generated.")
        except Exception as e:
            print(f"Warning: Daily trends failed - {e}")
            warnings_count += 1

    # Delay Analysis
    delay_col = next((c for c in df.columns if "delay" in c.lower() or "late" in c.lower()), None)
    if delay_col:
        try:
            plt.figure(figsize=(10, 5))
            sns.histplot(df[delay_col].dropna(), bins=50, kde=True, color=RED)
            plt.title(f"Delay Distribution ({delay_col})")
            plt.xlabel("Delay (minutes)")
            plt.tight_layout()
            save_fig("delay_analysis", dataset_name)
            charts_generated += 1
            print("- Delay analysis generated.")
        except Exception as e:
            print(f"Warning: Delay analysis failed - {e}")
            warnings_count += 1

    # Occupancy / Crowd Level
    occ_col = next((c for c in df.columns if "occupancy" in c.lower() or "crowd" in c.lower()), None)
    if occ_col and occ_col in num_cols:
        try:
            plt.figure(figsize=(10, 5))
            sns.histplot(df[occ_col].dropna(), bins=40, kde=True, color=GREEN)
            plt.title(f"Occupancy / Crowd Distribution ({occ_col})")
            plt.tight_layout()
            save_fig("occupancy_analysis", dataset_name)
            charts_generated += 1
            print("- Occupancy analysis generated.")
        except Exception as e:
            print(f"Warning: Occupancy analysis failed - {e}")
            warnings_count += 1

    # Revenue / Fare
    fare_col = next((c for c in df.columns if "fare" in c.lower() or "revenue" in c.lower()), None)
    if fare_col and fare_col in num_cols:
        try:
            plt.figure(figsize=(10, 5))
            sns.histplot(df[fare_col].dropna(), bins=50, color=GOLD)
            plt.title(f"Revenue/Fare Distribution ({fare_col})")
            plt.tight_layout()
            save_fig("revenue_analysis", dataset_name)
            charts_generated += 1
            print("- Revenue analysis generated.")
        except Exception as e:
            print(f"Warning: Revenue analysis failed - {e}")
            warnings_count += 1
            
    print("\n# Data Quality Issues & Recommendations")
    if not miss.empty:
        print("- Missing values found. Recommendation: Impute or drop depending on the column significance.")
    if df.duplicated().sum() > 0:
        print("- Duplicate records found. Recommendation: Remove duplicates before modeling.")
    if len(num_cols) == 0:
        print("- No numerical columns found. Limited quantitative analysis possible.")

    print("\n# Final Observations")
    print(f"- Processed {df.shape[0]} rows and {df.shape[1]} columns successfully.")
    print(f"- Elapsed time: {time.time() - start_time:.2f} seconds.")

    return True, charts_generated, warnings_count

def main():
    csv_files = glob.glob(str(PROCESSED_DIR / "*.csv"))
    if not csv_files:
        print("No CSV files found in processed directory!")
        return

    print(f"Found {len(csv_files)} datasets to process.")
    
    total_datasets = 0
    total_charts = 0
    total_warnings = 0
    total_errors = 0
    t0 = time.time()
    
    for fp in csv_files:
        success, charts, warns = run_eda(fp)
        if success:
            total_datasets += 1
            total_charts += charts
            total_warnings += warns
        else:
            total_errors += 1

    t1 = time.time()
    print("\n" + "="*40)
    print("EDA Completed Successfully")
    print(f"Datasets Processed : {total_datasets}")
    print(f"Charts Generated   : {total_charts}")
    print(f"Warnings           : {total_warnings}")
    print(f"Errors             : {total_errors}")
    print(f"Execution Time     : {t1 - t0:.2f} seconds")
    print("="*40 + "\n")

if __name__ == "__main__":
    main()
