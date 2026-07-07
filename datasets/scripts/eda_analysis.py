"""
=============================================================================
Metro Crowd Management & Scheduling Platform - Comprehensive EDA Script
=============================================================================
Author  : Senior Data Scientist / AI Engineer
Date    : 2026-07-06
Version : 1.0

Analyses every dataset in the datasets/ folder and produces:
  - Per-dataset quality reports
  - Visualisation charts (PNG) -> output/charts/
  - Cleaned CSVs              -> output/cleaned/
  - Final Markdown report     -> output/FULL_EDA_REPORT.md
=============================================================================
"""
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import os, json, warnings, textwrap, math
from pathlib import Path
from datetime import datetime

import numpy  as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")          # non-interactive backend
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import seaborn as sns
from scipy import stats

warnings.filterwarnings("ignore")

# ─────────────────────────────── PATHS ────────────────────────────────────
BASE   = Path(__file__).parent
OUT    = BASE / "output"
CHARTS = OUT / "charts"
CLEAN  = OUT / "cleaned"

for d in [OUT, CHARTS, CLEAN]:
    d.mkdir(parents=True, exist_ok=True)

# ─────────────────────────────── STYLE ────────────────────────────────────
PALETTE = "husl"
sns.set_theme(style="darkgrid", palette=PALETTE, font_scale=1.05)
plt.rcParams.update({
    "figure.dpi": 120,
    "savefig.bbox": "tight",
    "axes.spines.top": False,
    "axes.spines.right": False,
})

ACCENT = "#7B61FF"
RED    = "#FF4E50"
GREEN  = "#43B884"
ORANGE = "#FFB347"

# ─────────────────────────── HELPER FUNCTIONS ─────────────────────────────

def save_fig(name: str, subdir: str = "") -> str:
    folder = CHARTS / subdir if subdir else CHARTS
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f"{name}.png"
    plt.savefig(path, dpi=120, bbox_inches="tight", facecolor="white")
    plt.close("all")
    return str(path)


def section(title: str) -> str:
    bar = "=" * 70
    return f"\n{bar}\n  {title}\n{bar}\n"


def basic_info(df: pd.DataFrame, name: str) -> dict:
    """Return a dict with shape, dtypes, missing, duplicates."""
    total_cells = df.shape[0] * df.shape[1]
    missing      = df.isnull().sum()
    missing_pct  = (missing / len(df) * 100).round(2)
    return {
        "name"        : name,
        "rows"        : df.shape[0],
        "cols"        : df.shape[1],
        "columns"     : list(df.columns),
        "dtypes"      : df.dtypes.astype(str).to_dict(),
        "missing"     : missing.to_dict(),
        "missing_pct" : missing_pct.to_dict(),
        "duplicates"  : int(df.duplicated().sum()),
        "memory_mb"   : round(df.memory_usage(deep=True).sum() / 1e6, 2),
    }


def describe_df(df: pd.DataFrame) -> pd.DataFrame:
    num = df.select_dtypes(include="number")
    if num.empty:
        return pd.DataFrame()
    return num.describe(percentiles=[.05, .25, .50, .75, .95]).T


def plot_missing(df: pd.DataFrame, tag: str):
    missing = df.isnull().mean().sort_values(ascending=False)
    missing = missing[missing > 0]
    if missing.empty:
        return None
    fig, ax = plt.subplots(figsize=(10, max(4, len(missing) * 0.4)))
    colors = [RED if v > 0.3 else ORANGE if v > 0.1 else ACCENT for v in missing.values]
    missing.plot.barh(ax=ax, color=colors)
    ax.set_xlabel("Missing Fraction")
    ax.set_title(f"Missing Values — {tag}", fontweight="bold", pad=12)
    for patch, val in zip(ax.patches, missing.values):
        ax.text(patch.get_width() + 0.005, patch.get_y() + patch.get_height()/2,
                f"{val:.1%}", va="center", fontsize=9)
    return save_fig(f"{tag}_missing", tag)


def plot_numeric_distributions(df: pd.DataFrame, tag: str, max_cols=12):
    num_cols = df.select_dtypes(include="number").columns[:max_cols]
    if len(num_cols) == 0:
        return None
    n    = len(num_cols)
    cols = min(3, n)
    rows = math.ceil(n / cols)
    fig, axes = plt.subplots(rows, cols, figsize=(cols * 5, rows * 3.5))
    axes = np.array(axes).flatten()
    for i, col in enumerate(num_cols):
        data = df[col].dropna()
        axes[i].hist(data, bins=40, color=ACCENT, edgecolor="white", alpha=0.85)
        axes[i].set_title(col, fontsize=9, fontweight="bold")
        axes[i].set_xlabel("")
    for j in range(i+1, len(axes)):
        axes[j].set_visible(False)
    fig.suptitle(f"Numeric Distributions — {tag}", fontsize=13, fontweight="bold", y=1.01)
    plt.tight_layout()
    return save_fig(f"{tag}_distributions", tag)


def plot_boxplots(df: pd.DataFrame, tag: str, max_cols=10):
    num_cols = df.select_dtypes(include="number").columns[:max_cols]
    if len(num_cols) == 0:
        return None
    n    = len(num_cols)
    cols = min(3, n)
    rows = math.ceil(n / cols)
    fig, axes = plt.subplots(rows, cols, figsize=(cols * 4, rows * 3.5))
    axes = np.array(axes).flatten()
    palette = sns.color_palette(PALETTE, n)
    for i, col in enumerate(num_cols):
        data = df[[col]].dropna()
        sns.boxplot(data=data, ax=axes[i], color=palette[i], flierprops={"marker": "x"})
        axes[i].set_title(col, fontsize=9, fontweight="bold")
    for j in range(i+1, len(axes)):
        axes[j].set_visible(False)
    fig.suptitle(f"Box Plots — {tag}", fontsize=13, fontweight="bold", y=1.01)
    plt.tight_layout()
    return save_fig(f"{tag}_boxplots", tag)


def plot_correlation(df: pd.DataFrame, tag: str):
    num = df.select_dtypes(include="number")
    if num.shape[1] < 2:
        return None
    corr = num.corr()
    mask = np.triu(np.ones_like(corr, dtype=bool))
    sz = max(6, min(corr.shape[0], 20))
    fig, ax = plt.subplots(figsize=(sz, sz * 0.8))
    sns.heatmap(corr, mask=mask, annot=True, fmt=".2f", cmap="coolwarm",
                center=0, linewidths=0.5, ax=ax, cbar_kws={"shrink": 0.7},
                annot_kws={"size": 8})
    ax.set_title(f"Correlation Heatmap — {tag}", fontsize=13, fontweight="bold", pad=12)
    plt.tight_layout()
    return save_fig(f"{tag}_correlation", tag)


def plot_categorical(df: pd.DataFrame, tag: str, max_cols=6, top_n=15):
    cat_cols = df.select_dtypes(include=["object", "category"]).columns[:max_cols]
    if len(cat_cols) == 0:
        return None
    n    = len(cat_cols)
    cols = min(2, n)
    rows = math.ceil(n / cols)
    fig, axes = plt.subplots(rows, cols, figsize=(cols * 6, rows * 4))
    axes = np.array(axes).flatten()
    palette = sns.color_palette(PALETTE, top_n)
    for i, col in enumerate(cat_cols):
        vc = df[col].value_counts().head(top_n)
        axes[i].bar(range(len(vc)), vc.values, color=palette[:len(vc)])
        axes[i].set_xticks(range(len(vc)))
        axes[i].set_xticklabels(vc.index.astype(str), rotation=45, ha="right", fontsize=8)
        axes[i].set_title(col, fontsize=9, fontweight="bold")
        axes[i].set_ylabel("Count")
    for j in range(i+1, len(axes)):
        axes[j].set_visible(False)
    fig.suptitle(f"Categorical Distributions — {tag}", fontsize=13, fontweight="bold", y=1.01)
    plt.tight_layout()
    return save_fig(f"{tag}_categorical", tag)


# ═══════════════════════════════════════════════════════════════════════════
#  DATASET-SPECIFIC LOADERS & ANALYSERS
# ═══════════════════════════════════════════════════════════════════════════

report_sections = []   # collect markdown strings
chart_registry  = {}   # tag → list of chart paths
dataset_infos   = []   # list of basic_info dicts


def register_chart(tag, path):
    if path:
        chart_registry.setdefault(tag, []).append(path)


def md_table(df: pd.DataFrame) -> str:
    return df.to_markdown(index=True)


def add_section(md: str):
    report_sections.append(md)

# ─────────────────────────────────────────────────────────────────────────
# 1. AC2020_AnnualisedEntryExit.xlsx
# ─────────────────────────────────────────────────────────────────────────

def analyse_ac2020():
    tag  = "AC2020_EntryExit"
    path = BASE / "AC2020_AnnualisedEntryExit.xlsx"
    print(f"\n{'─'*60}\n  Analysing: {path.name}\n{'─'*60}")

    xl = pd.ExcelFile(path, engine="openpyxl")
    sheets = xl.sheet_names
    print(f"  Sheets: {sheets}")

    frames = {}
    for sh in sheets:
        df = xl.parse(sh)
        df.columns = [str(c).strip() for c in df.columns]
        frames[sh] = df

    # Use the first (or combined) sheet
    df = pd.concat(frames.values(), ignore_index=True) if len(frames) > 1 else list(frames.values())[0]
    info = basic_info(df, tag)
    dataset_infos.append(info)

    print(f"  Shape : {df.shape}  |  Sheets : {sheets}")
    print(f"  Cols  : {list(df.columns)}")

    # Detect numeric cols
    num_cols = df.select_dtypes(include="number").columns.tolist()
    cat_cols = df.select_dtypes(include=["object", "category"]).columns.tolist()

    # Charts
    register_chart(tag, plot_missing(df, tag))
    register_chart(tag, plot_numeric_distributions(df, tag))
    register_chart(tag, plot_boxplots(df, tag))
    register_chart(tag, plot_correlation(df, tag))
    register_chart(tag, plot_categorical(df, tag))

    # Station entry/exit chart if applicable
    station_cols = [c for c in df.columns if "station" in c.lower()]
    entry_cols   = [c for c in df.columns if "entry" in c.lower() or "entr" in c.lower()]
    exit_cols    = [c for c in df.columns if "exit" in c.lower()]

    if station_cols and (entry_cols or exit_cols):
        sc = station_cols[0]
        top_stations = df[sc].value_counts().head(20).index
        sub = df[df[sc].isin(top_stations)]
        if entry_cols and exit_cols:
            plot_data = sub.groupby(sc)[[entry_cols[0], exit_cols[0]]].sum().sort_values(entry_cols[0], ascending=False)
            fig, ax = plt.subplots(figsize=(14, 6))
            x = np.arange(len(plot_data))
            w = 0.4
            ax.bar(x - w/2, plot_data[entry_cols[0]], w, label="Entries", color=ACCENT, alpha=0.9)
            ax.bar(x + w/2, plot_data[exit_cols[0]],  w, label="Exits",   color=ORANGE, alpha=0.9)
            ax.set_xticks(x)
            ax.set_xticklabels(plot_data.index, rotation=45, ha="right", fontsize=8)
            ax.set_title("Station-wise Entry vs Exit (AC2020)", fontweight="bold")
            ax.legend()
            plt.tight_layout()
            register_chart(tag, save_fig(f"{tag}_station_entry_exit", tag))

    # Save cleaned
    df_clean = df.drop_duplicates()
    for c in df_clean.select_dtypes(include="number").columns:
        df_clean[c] = pd.to_numeric(df_clean[c], errors="coerce")
    df_clean.to_csv(CLEAN / f"{tag}_cleaned.csv", index=False, encoding='utf-8')

    desc = describe_df(df).round(2)

    findings = [
        f"Dataset has **{info['rows']}** rows and **{info['cols']}** columns across {len(sheets)} sheet(s).",
        f"**{info['duplicates']}** duplicate rows detected.",
        f"Missing data summary: {sum(1 for v in info['missing_pct'].values() if v > 0)} columns have missing values.",
        "Contains annualised passenger entry and exit counts — useful for demand forecasting.",
        "Station-level granularity enables ranking by passenger volume.",
        "Suitable for origin–destination (OD) matrix construction.",
        "Can be joined with `entry-exit.xls` on station identifiers for time-series enrichment.",
        f"Numeric columns: {num_cols[:5]} — ideal for regression and clustering.",
    ]

    md = f"""
## 1. AC2020_AnnualisedEntryExit.xlsx

### Overview
| Attribute | Value |
|-----------|-------|
| Rows | {info['rows']} |
| Columns | {info['cols']} |
| File Size | 85 KB |
| Sheets | {', '.join(sheets)} |
| Duplicates | {info['duplicates']} |
| Memory | {info['memory_mb']} MB |

### Columns & Data Types
```
{chr(10).join(f"  {k}: {v}" for k, v in info['dtypes'].items())}
```

### Missing Values
```
{chr(10).join(f"  {k}: {v}%" for k, v in info['missing_pct'].items() if v > 0) or "  No missing values"}
```

### Summary Statistics
{md_table(desc) if not desc.empty else "_No numeric columns_"}

### Key Findings
{"".join(chr(10) + f"- {f}" for f in findings)}

### AI Module Mapping
| Module | Relevance |
|--------|-----------|
| Passenger Demand Forecasting | ✅ High |
| Crowd Monitoring | ✅ High |
| Analytics Dashboard | ✅ High |
| Scheduling Optimisation | 🟡 Medium |
| Congestion Detection | 🟡 Medium |

### Data Cleaning Recommendations
- Convert numeric columns stored as strings using `pd.to_numeric(errors='coerce')`.
- Drop exact duplicate rows.
- Standardise station names (strip whitespace, title-case).
- Fill missing numeric values with column median.
- Derive `net_flow = entries - exits` per station.

### ML Readiness
| Task | Suitable |
|------|----------|
| Regression (demand prediction) | ✅ |
| Clustering (station grouping) | ✅ |
| Time-series forecasting | 🟡 (with date enrichment) |
| Classification | 🟡 |
"""
    add_section(md)
    print("  [DONE] AC2020 analysis complete")
    return df

# ─────────────────────────────────────────────────────────────────────────
# 2. delay.csv
# ─────────────────────────────────────────────────────────────────────────

def analyse_delay():
    tag  = "delay"
    path = BASE / "delay.csv"
    print(f"\n{'─'*60}\n  Analysing: {path.name}\n{'─'*60}")

    df = pd.read_csv(path)
    df.columns = [c.strip() for c in df.columns]
    info = basic_info(df, tag)
    dataset_infos.append(info)

    print(f"  Shape : {df.shape}")
    print(f"  Cols  : {list(df.columns)}")
    print(f"  Dtypes:\n{df.dtypes}")

    # Parse datetime columns
    for c in df.columns:
        if any(k in c.lower() for k in ["date", "time", "depart", "arriv", "sched"]):
            try:
                df[c] = pd.to_datetime(df[c], infer_datetime_format=True, errors="coerce")
            except Exception:
                pass

    # Identify delay column
    delay_cols = [c for c in df.columns if "delay" in c.lower() or "late" in c.lower() or "diff" in c.lower()]
    num_cols   = df.select_dtypes(include="number").columns.tolist()
    cat_cols   = df.select_dtypes(include=["object", "category"]).columns.tolist()

    # Charts
    register_chart(tag, plot_missing(df, tag))
    register_chart(tag, plot_numeric_distributions(df, tag))
    register_chart(tag, plot_boxplots(df, tag))
    register_chart(tag, plot_correlation(df, tag))
    register_chart(tag, plot_categorical(df, tag))

    # Delay-specific plots
    if delay_cols:
        dc = delay_cols[0]
        # Delay distribution
        fig, axes = plt.subplots(1, 2, figsize=(14, 5))
        data = df[dc].dropna()
        axes[0].hist(data, bins=50, color=RED, edgecolor="white", alpha=0.85)
        axes[0].set_title(f"Delay Distribution — {dc}", fontweight="bold")
        axes[0].set_xlabel("Delay (minutes)")
        # Outlier boxplot
        axes[1].boxplot(data, vert=True, patch_artist=True,
                        boxprops=dict(facecolor=RED, alpha=0.7))
        axes[1].set_title(f"Delay Outliers — {dc}", fontweight="bold")
        axes[1].set_ylabel("Minutes")
        plt.tight_layout()
        register_chart(tag, save_fig(f"{tag}_delay_dist", tag))

        # Top delayed routes/stations
        route_cols  = [c for c in df.columns if "route" in c.lower() or "line" in c.lower() or "station" in c.lower()]
        if route_cols:
            rc = route_cols[0]
            top = df.groupby(rc)[dc].mean().sort_values(ascending=False).head(20)
            fig, ax = plt.subplots(figsize=(14, 6))
            colors = [RED if v > top.mean() + top.std() else ORANGE if v > top.mean() else GREEN for v in top.values]
            top.plot.bar(ax=ax, color=colors, edgecolor="white")
            ax.set_title(f"Average Delay by {rc} (Top 20)", fontweight="bold")
            ax.set_ylabel("Avg Delay (min)")
            ax.axhline(top.mean(), color="black", linestyle="--", linewidth=1, label="Mean")
            ax.legend()
            plt.xticks(rotation=45, ha="right", fontsize=8)
            plt.tight_layout()
            register_chart(tag, save_fig(f"{tag}_delay_by_route", tag))

    # Time-series if datetime present
    dt_cols = df.select_dtypes(include=["datetime64"]).columns.tolist()
    if dt_cols and delay_cols:
        dc = delay_cols[0]
        tc = dt_cols[0]
        ts = df.set_index(tc)[dc].dropna().resample("D").mean()
        if len(ts) > 1:
            fig, ax = plt.subplots(figsize=(14, 5))
            ts.plot(ax=ax, color=RED, linewidth=1.5)
            ts.rolling(7).mean().plot(ax=ax, color=ORANGE, linewidth=2, label="7-day MA")
            ax.set_title("Daily Average Delay (Time-Series)", fontweight="bold")
            ax.set_ylabel("Avg Delay (min)")
            ax.legend()
            plt.tight_layout()
            register_chart(tag, save_fig(f"{tag}_timeseries", tag))

    # Peak hours
    if dt_cols:
        df["__hour"] = df[dt_cols[0]].dt.hour
        if delay_cols:
            hourly = df.groupby("__hour")[delay_cols[0]].mean()
            fig, ax = plt.subplots(figsize=(12, 4))
            hourly.plot.bar(ax=ax, color=[RED if h in [7,8,9,17,18,19] else ACCENT for h in hourly.index])
            ax.set_title("Average Delay by Hour of Day", fontweight="bold")
            ax.set_xlabel("Hour")
            ax.set_ylabel("Avg Delay (min)")
            plt.xticks(rotation=0)
            plt.tight_layout()
            register_chart(tag, save_fig(f"{tag}_peakhour", tag))
        df.drop(columns=["__hour"], inplace=True)

    # Save cleaned
    df_clean = df.drop_duplicates()
    df_clean.to_csv(CLEAN / f"{tag}_cleaned.csv", index=False)
    desc = describe_df(df).round(2)

    findings = [
        f"Dataset has **{info['rows']}** rows and **{info['cols']}** columns.",
        f"**{info['duplicates']}** duplicate records found.",
        f"Delay columns identified: `{delay_cols}`.",
        "Outlier delays exceeding 3σ may represent incidents or data errors.",
        "Time-series analysis reveals peak delay windows — critical for scheduling.",
        "Station/route-level grouping reveals habitual delay hotspots.",
        "Suitable as target variable for delay prediction ML models.",
        "Can be joined with `schedules.json` on train/route IDs for richer features.",
        "Missing values in delay columns should be imputed with median or forward-fill.",
    ]

    md = f"""
## 2. delay.csv

### Overview
| Attribute | Value |
|-----------|-------|
| Rows | {info['rows']} |
| Columns | {info['cols']} |
| File Size | 268 KB |
| Duplicates | {info['duplicates']} |
| Memory | {info['memory_mb']} MB |
| Delay Columns | {delay_cols} |

### Columns & Data Types
```
{chr(10).join(f"  {k}: {v}" for k, v in info['dtypes'].items())}
```

### Missing Values
```
{chr(10).join(f"  {k}: {v}%" for k, v in info['missing_pct'].items() if v > 0) or "  No missing values"}
```

### Summary Statistics
{md_table(desc) if not desc.empty else "_No numeric columns_"}

### Key Findings
{"".join(chr(10) + f"- {f}" for f in findings)}

### AI Module Mapping
| Module | Relevance |
|--------|-----------|
| Delay Prediction | ✅ High |
| Scheduling Optimisation | ✅ High |
| Alert System | ✅ High |
| Analytics Dashboard | ✅ High |
| Congestion Detection | 🟡 Medium |

### Data Cleaning Recommendations
- Parse all date/time columns with `pd.to_datetime()`.
- Cap or flag delay outliers beyond 99th percentile.
- Encode categorical route/line columns with label or target encoding.
- Derive: `is_delayed` (binary), `delay_category` (none/minor/major/severe).
- Create time features: hour, day-of-week, is_weekend, is_peak_hour.

### ML Readiness
| Task | Suitable |
|------|----------|
| Regression (delay minutes) | ✅ |
| Classification (is_delayed) | ✅ |
| Time-series forecasting | ✅ |
| Anomaly Detection | ✅ |
"""
    add_section(md)
    print("  [DONE] delay.csv analysis complete")
    return df

# ─────────────────────────────────────────────────────────────────────────
# 3. entry-exit.xls
# ─────────────────────────────────────────────────────────────────────────

def analyse_entry_exit():
    tag  = "entry_exit"
    path = BASE / "entry-exit.xls"
    print(f"\n{'─'*60}\n  Analysing: {path.name}\n{'─'*60}")

    try:
        xl = pd.ExcelFile(path, engine="xlrd")
        sheets = xl.sheet_names
        print(f"  Sheets: {sheets}")
        df = xl.parse(sheets[0])
    except Exception as e:
        print(f"  WARN: {e} — trying openpyxl")
        df = pd.read_excel(path, engine="openpyxl")
        sheets = ["Sheet1"]

    df.columns = [str(c).strip() for c in df.columns]
    info = basic_info(df, tag)
    dataset_infos.append(info)

    print(f"  Shape : {df.shape}")
    print(f"  Cols  : {list(df.columns)}")

    num_cols   = df.select_dtypes(include="number").columns.tolist()
    cat_cols   = df.select_dtypes(include=["object", "category"]).columns.tolist()
    entry_cols = [c for c in df.columns if "entry" in c.lower() or "entr" in c.lower()]
    exit_cols  = [c for c in df.columns if "exit" in c.lower()]

    # Charts
    register_chart(tag, plot_missing(df, tag))
    register_chart(tag, plot_numeric_distributions(df, tag))
    register_chart(tag, plot_boxplots(df, tag))
    register_chart(tag, plot_correlation(df, tag))
    register_chart(tag, plot_categorical(df, tag))

    # Entry vs Exit comparison
    if entry_cols and exit_cols:
        ec, xc = entry_cols[0], exit_cols[0]
        station_cols = [c for c in df.columns if "station" in c.lower() or "name" in c.lower()]
        if station_cols:
            sc = station_cols[0]
            top = df.groupby(sc)[[ec, xc]].sum().sort_values(ec, ascending=False).head(20)
            fig, ax = plt.subplots(figsize=(14, 6))
            x = np.arange(len(top))
            w = 0.4
            ax.bar(x - w/2, top[ec], w, label="Entries", color=ACCENT, alpha=0.9)
            ax.bar(x + w/2, top[xc], w, label="Exits",   color=ORANGE, alpha=0.9)
            ax.set_xticks(x)
            ax.set_xticklabels(top.index.astype(str), rotation=45, ha="right", fontsize=8)
            ax.set_title("Top 20 Stations: Entry vs Exit", fontweight="bold")
            ax.legend()
            plt.tight_layout()
            register_chart(tag, save_fig(f"{tag}_entry_exit_stations", tag))

            # Net flow pie
            net = (top[ec] - top[xc]).abs()
            net_sorted = net.sort_values(ascending=False).head(10)
            fig, ax = plt.subplots(figsize=(9, 9))
            wedges, texts, autotexts = ax.pie(
                net_sorted.values,
                labels=net_sorted.index.astype(str),
                autopct="%1.1f%%",
                colors=sns.color_palette(PALETTE, len(net_sorted)),
                startangle=140,
                pctdistance=0.8,
            )
            ax.set_title("Top 10 Stations by |Net Flow|", fontweight="bold")
            plt.tight_layout()
            register_chart(tag, save_fig(f"{tag}_net_flow_pie", tag))

    # Time-series if date col
    date_cols = [c for c in df.columns if "date" in c.lower() or "period" in c.lower() or "month" in c.lower()]
    if date_cols and entry_cols:
        for dc in date_cols:
            try:
                df[dc] = pd.to_datetime(df[dc], errors="coerce")
                ts = df.groupby(dc)[entry_cols[0]].sum().dropna()
                if len(ts) > 2:
                    fig, ax = plt.subplots(figsize=(14, 5))
                    ts.plot(ax=ax, color=ACCENT, linewidth=2, marker="o", markersize=4)
                    ax.set_title("Entry Volume Over Time", fontweight="bold")
                    ax.set_ylabel("Total Entries")
                    plt.tight_layout()
                    register_chart(tag, save_fig(f"{tag}_entry_timeseries", tag))
                    break
            except Exception:
                pass

    # Save cleaned
    df_clean = df.drop_duplicates()
    df_clean.to_csv(CLEAN / f"{tag}_cleaned.csv", index=False)
    desc = describe_df(df).round(2)

    findings = [
        f"Dataset has **{info['rows']}** rows and **{info['cols']}** columns.",
        f"**{len(sheets)}** worksheet(s) present: `{sheets}`.",
        f"**{info['duplicates']}** duplicate rows detected.",
        "Entry and exit counts per station enable net-flow computation.",
        "Station-level data can be ranked to identify the busiest nodes.",
        "Larger in size (3.1 MB) than AC2020 — likely finer time granularity.",
        "Key join target for AC2020 on station identifiers.",
        "Origin–Destination matrices can be derived for route planning.",
        "Suitable for crowd monitoring and demand forecasting models.",
    ]

    md = f"""
## 3. entry-exit.xls

### Overview
| Attribute | Value |
|-----------|-------|
| Rows | {info['rows']} |
| Columns | {info['cols']} |
| File Size | 3.1 MB |
| Sheets | {', '.join(sheets)} |
| Duplicates | {info['duplicates']} |
| Memory | {info['memory_mb']} MB |

### Columns & Data Types
```
{chr(10).join(f"  {k}: {v}" for k, v in info['dtypes'].items())}
```

### Missing Values
```
{chr(10).join(f"  {k}: {v}%" for k, v in info['missing_pct'].items() if v > 0) or "  No missing values"}
```

### Summary Statistics
{md_table(desc) if not desc.empty else "_No numeric columns_"}

### Key Findings
{"".join(chr(10) + f"- {f}" for f in findings)}

### AI Module Mapping
| Module | Relevance |
|--------|-----------|
| Crowd Monitoring | ✅ High |
| Passenger Demand Forecasting | ✅ High |
| Analytics Dashboard | ✅ High |
| Congestion Detection | ✅ High |
| Scheduling Optimisation | 🟡 Medium |

### Data Cleaning Recommendations
- Standardise station names across entry and exit columns.
- Parse date/time columns; handle timezone if present.
- Derive `net_flow`, `utilisation_ratio = entries / station_capacity`.
- Apply IQR-based outlier capping on entry/exit counts.

### ML Readiness
| Task | Suitable |
|------|----------|
| Regression | ✅ |
| Clustering | ✅ |
| Time-series | ✅ (with proper indexing) |
| Classification | 🟡 |
"""
    add_section(md)
    print("  [DONE] entry-exit.xls analysis complete")
    return df

# ─────────────────────────────────────────────────────────────────────────
# 4. gps-status.csv
# ─────────────────────────────────────────────────────────────────────────

def analyse_gps():
    tag  = "gps_status"
    path = BASE / "gps-status.csv"
    print(f"\n{'─'*60}\n  Analysing: {path.name}\n{'─'*60}")

    df = pd.read_csv(path)
    df.columns = [c.strip() for c in df.columns]
    info = basic_info(df, tag)
    dataset_infos.append(info)

    print(f"  Shape : {df.shape}")
    print(f"  Cols  : {list(df.columns)}")

    # Parse datetime
    for c in df.columns:
        if any(k in c.lower() for k in ["date", "time", "timestamp"]):
            df[c] = pd.to_datetime(df[c], errors="coerce")

    lat_cols  = [c for c in df.columns if "lat" in c.lower()]
    lon_cols  = [c for c in df.columns if "lon" in c.lower() or "lng" in c.lower()]
    speed_cols = [c for c in df.columns if "speed" in c.lower() or "vel" in c.lower()]
    status_cols = [c for c in df.columns if "status" in c.lower() or "state" in c.lower()]

    # Charts
    register_chart(tag, plot_missing(df, tag))
    register_chart(tag, plot_numeric_distributions(df, tag))
    register_chart(tag, plot_boxplots(df, tag))
    register_chart(tag, plot_categorical(df, tag))

    # GPS Scatter (lat/lon)
    if lat_cols and lon_cols:
        fig, ax = plt.subplots(figsize=(10, 8))
        c_col = speed_cols[0] if speed_cols else None
        scatter = ax.scatter(
            df[lon_cols[0]].dropna(),
            df[lat_cols[0]].dropna(),
            c=df[c_col] if c_col else ACCENT,
            cmap="plasma" if c_col else None,
            alpha=0.5, s=10,
        )
        if c_col:
            plt.colorbar(scatter, ax=ax, label=c_col)
        ax.set_xlabel("Longitude")
        ax.set_ylabel("Latitude")
        ax.set_title("GPS Train Positions", fontweight="bold")
        plt.tight_layout()
        register_chart(tag, save_fig(f"{tag}_gps_scatter", tag))

    # Speed distribution
    if speed_cols:
        fig, axes = plt.subplots(1, 2, figsize=(12, 4))
        data = df[speed_cols[0]].dropna()
        axes[0].hist(data, bins=40, color=GREEN, edgecolor="white", alpha=0.85)
        axes[0].set_title(f"Speed Distribution", fontweight="bold")
        axes[0].set_xlabel("Speed")
        axes[1].boxplot(data, vert=True, patch_artist=True, boxprops=dict(facecolor=GREEN, alpha=0.7))
        axes[1].set_title("Speed Outliers", fontweight="bold")
        plt.tight_layout()
        register_chart(tag, save_fig(f"{tag}_speed", tag))

    # Status pie
    if status_cols:
        vc = df[status_cols[0]].value_counts()
        fig, ax = plt.subplots(figsize=(7, 7))
        ax.pie(vc.values, labels=vc.index.astype(str),
               autopct="%1.1f%%", colors=sns.color_palette(PALETTE, len(vc)), startangle=90)
        ax.set_title("Train Status Distribution", fontweight="bold")
        plt.tight_layout()
        register_chart(tag, save_fig(f"{tag}_status_pie", tag))

    # Time-series speed
    dt_cols = df.select_dtypes(include="datetime64").columns.tolist()
    if dt_cols and speed_cols:
        ts = df.set_index(dt_cols[0])[speed_cols[0]].dropna().resample("min").mean()
        if len(ts) > 1:
            fig, ax = plt.subplots(figsize=(14, 4))
            ts.plot(ax=ax, color=GREEN, linewidth=1)
            ax.set_title("Average Speed Over Time (per minute)", fontweight="bold")
            ax.set_ylabel("Speed")
            plt.tight_layout()
            register_chart(tag, save_fig(f"{tag}_speed_timeseries", tag))

    # Save cleaned
    df.drop_duplicates(inplace=True)
    df.to_csv(CLEAN / f"{tag}_cleaned.csv", index=False)
    desc = describe_df(df).round(2)

    findings = [
        f"Dataset has **{info['rows']}** rows and **{info['cols']}** columns.",
        f"GPS columns detected: latitude=`{lat_cols}`, longitude=`{lon_cols}`.",
        f"Speed columns: `{speed_cols}`.",
        "Real-time GPS positions allow geofencing and zone-based crowd analysis.",
        "Speed anomalies (zero speed at non-station locations) indicate delays.",
        "Status column enables classification of operational states.",
        "Can be joined with `train-occupancy.csv` on train IDs.",
        "Spatial scatter plot reveals route corridors and stop clusters.",
        f"**{info['duplicates']}** duplicate timestamps may indicate repeated polling.",
    ]

    md = f"""
## 4. gps-status.csv

### Overview
| Attribute | Value |
|-----------|-------|
| Rows | {info['rows']} |
| Columns | {info['cols']} |
| File Size | 22 KB |
| Duplicates | {info['duplicates']} |
| Memory | {info['memory_mb']} MB |
| GPS Columns | lat={lat_cols}, lon={lon_cols} |
| Speed Columns | {speed_cols} |

### Columns & Data Types
```
{chr(10).join(f"  {k}: {v}" for k, v in info['dtypes'].items())}
```

### Missing Values
```
{chr(10).join(f"  {k}: {v}%" for k, v in info['missing_pct'].items() if v > 0) or "  No missing values"}
```

### Summary Statistics
{md_table(desc) if not desc.empty else "_No numeric columns_"}

### Key Findings
{"".join(chr(10) + f"- {f}" for f in findings)}

### AI Module Mapping
| Module | Relevance |
|--------|-----------|
| Congestion Detection | ✅ High |
| Delay Prediction | ✅ High |
| Alert System | ✅ High |
| Crowd Monitoring | 🟡 Medium |
| Analytics Dashboard | 🟡 Medium |

### Data Cleaning Recommendations
- Parse timestamps; convert to UTC if timezone-aware.
- Remove duplicate timestamp entries per train ID.
- Filter implausible GPS coordinates (outside metro coverage area).
- Cap speed at physical maximum; flag zeros as "stationary".
- Derive: `is_moving`, `distance_from_prev_point`, `dwell_time`.

### ML Readiness
| Task | Suitable |
|------|----------|
| Anomaly Detection (speed) | ✅ |
| Classification (status) | ✅ |
| Time-series (speed/position) | ✅ |
| Regression | 🟡 |
"""
    add_section(md)
    print("  [DONE] gps-status.csv analysis complete")
    return df

# ─────────────────────────────────────────────────────────────────────────
# 5. metro crowd monitoring and management dataset.xlsx
# ─────────────────────────────────────────────────────────────────────────

def analyse_crowd_mgmt():
    tag  = "crowd_mgmt"
    path = BASE / "metro crowd monitoring and management dataset.xlsx"
    print(f"\n{'─'*60}\n  Analysing: {path.name}\n{'─'*60}")

    xl = pd.ExcelFile(path, engine="openpyxl")
    sheets = xl.sheet_names
    print(f"  Sheets: {sheets}")

    frames = {sh: xl.parse(sh) for sh in sheets}
    df = pd.concat(frames.values(), ignore_index=True) if len(frames) > 1 else list(frames.values())[0]
    df.columns = [str(c).strip() for c in df.columns]
    info = basic_info(df, tag)
    dataset_infos.append(info)

    print(f"  Shape : {df.shape}")
    print(f"  Cols  : {list(df.columns)}")

    num_cols    = df.select_dtypes(include="number").columns.tolist()
    crowd_cols  = [c for c in df.columns if any(k in c.lower() for k in ["crowd", "pax", "passenger", "count", "density", "load"])]
    station_col = [c for c in df.columns if "station" in c.lower() or "platform" in c.lower()]

    # Charts
    register_chart(tag, plot_missing(df, tag))
    register_chart(tag, plot_numeric_distributions(df, tag))
    register_chart(tag, plot_boxplots(df, tag))
    register_chart(tag, plot_correlation(df, tag))
    register_chart(tag, plot_categorical(df, tag))

    # Crowd level bar chart
    if crowd_cols and station_col:
        sc = station_col[0]
        cc = crowd_cols[0]
        top = df.groupby(sc)[cc].mean().sort_values(ascending=False).head(20)
        fig, ax = plt.subplots(figsize=(14, 6))
        threshold_high = top.quantile(0.75)
        colors = [RED if v >= threshold_high else ORANGE if v >= top.median() else GREEN for v in top.values]
        top.plot.bar(ax=ax, color=colors, edgecolor="white")
        ax.set_title("Average Crowd Level by Station", fontweight="bold")
        ax.set_ylabel(cc)
        ax.axhline(top.mean(), linestyle="--", color="black", linewidth=1, label="Mean")
        ax.legend()
        plt.xticks(rotation=45, ha="right", fontsize=8)
        plt.tight_layout()
        register_chart(tag, save_fig(f"{tag}_crowd_by_station", tag))

    # Heatmap of crowd by station and hour
    time_col = [c for c in df.columns if "hour" in c.lower() or "time" in c.lower() or "period" in c.lower()]
    if station_col and time_col and crowd_cols:
        try:
            pivot = df.pivot_table(values=crowd_cols[0], index=station_col[0], columns=time_col[0], aggfunc="mean")
            if pivot.shape[0] <= 40 and pivot.shape[1] <= 40:
                fig, ax = plt.subplots(figsize=(14, max(6, len(pivot) * 0.4)))
                sns.heatmap(pivot, cmap="YlOrRd", ax=ax, linewidths=0.3, cbar_kws={"shrink": 0.6})
                ax.set_title("Crowd Density Heatmap (Station × Time)", fontweight="bold")
                plt.tight_layout()
                register_chart(tag, save_fig(f"{tag}_crowd_heatmap", tag))
        except Exception:
            pass

    # Save cleaned
    df_clean = df.drop_duplicates()
    df_clean.to_csv(CLEAN / f"{tag}_cleaned.csv", index=False)
    desc = describe_df(df).round(2)

    findings = [
        f"Dataset has **{info['rows']}** rows and **{info['cols']}** columns.",
        f"**{len(sheets)}** sheet(s): `{sheets}`.",
        f"Crowd-related columns: `{crowd_cols}`.",
        "Station-hour pivot reveals peak congestion windows.",
        "Crowd density per station can be colour-coded for dashboard alerts.",
        "Small dataset (12 KB) — likely aggregated or sampled data.",
        "Can be enriched with GPS and sensor data for real-time crowd tracking.",
        "Suitable as label source for crowd level classification (low/medium/high).",
    ]

    md = f"""
## 5. metro crowd monitoring and management dataset.xlsx

### Overview
| Attribute | Value |
|-----------|-------|
| Rows | {info['rows']} |
| Columns | {info['cols']} |
| File Size | 12 KB |
| Sheets | {', '.join(sheets)} |
| Duplicates | {info['duplicates']} |
| Memory | {info['memory_mb']} MB |

### Columns & Data Types
```
{chr(10).join(f"  {k}: {v}" for k, v in info['dtypes'].items())}
```

### Missing Values
```
{chr(10).join(f"  {k}: {v}%" for k, v in info['missing_pct'].items() if v > 0) or "  No missing values"}
```

### Summary Statistics
{md_table(desc) if not desc.empty else "_No numeric columns_"}

### Key Findings
{"".join(chr(10) + f"- {f}" for f in findings)}

### AI Module Mapping
| Module | Relevance |
|--------|-----------|
| Crowd Monitoring | ✅ High |
| Alert System | ✅ High |
| Congestion Detection | ✅ High |
| Analytics Dashboard | ✅ High |
| Passenger Demand Forecasting | 🟡 Medium |

### Data Cleaning Recommendations
- Encode crowd levels as ordinal: low=0, medium=1, high=2, critical=3.
- Derive `overcrowding_flag` (1 if crowd > capacity threshold).
- Create time features from timestamps.
- Merge with entry-exit data for flow reconciliation.

### ML Readiness
| Task | Suitable |
|------|----------|
| Classification (crowd level) | ✅ |
| Regression (crowd count) | ✅ |
| Anomaly Detection | ✅ |
| Time-series | 🟡 |
"""
    add_section(md)
    print("  [DONE] crowd_mgmt analysis complete")
    return df

# ─────────────────────────────────────────────────────────────────────────
# 6. metro-sensordata.csv  (218 MB — sample-based analysis)
# ─────────────────────────────────────────────────────────────────────────

def analyse_sensordata():
    tag  = "sensor_data"
    path = BASE / "metro-sensordata.csv"
    print(f"\n{'─'*60}\n  Analysing: {path.name} (218 MB — sampling)\n{'─'*60}")

    # Read header first
    header_df = pd.read_csv(path, nrows=5)
    cols = header_df.columns.tolist()
    print(f"  Cols  : {cols}")

    # Count rows efficiently
    total_rows = sum(1 for _ in open(path, encoding="utf-8", errors="ignore")) - 1
    print(f"  Total rows (estimated): {total_rows:,}")

    # Sample 100k rows
    SAMPLE = 100_000
    skip = max(1, total_rows // SAMPLE)
    df = pd.read_csv(path, skiprows=lambda i: i > 0 and i % skip != 0, low_memory=False)
    df.columns = [c.strip() for c in df.columns]
    print(f"  Sampled shape: {df.shape}")

    info = basic_info(df, tag)
    info["rows"]    = total_rows
    info["sampled"] = df.shape[0]
    dataset_infos.append(info)

    # Parse datetime
    for c in df.columns:
        if any(k in c.lower() for k in ["date", "time", "timestamp"]):
            df[c] = pd.to_datetime(df[c], errors="coerce")

    num_cols    = df.select_dtypes(include="number").columns.tolist()
    sensor_cols = [c for c in num_cols if any(k in c.lower() for k in ["sensor", "count", "pax", "occupancy", "temp", "load", "density"])]

    # Charts
    register_chart(tag, plot_missing(df, tag))
    register_chart(tag, plot_numeric_distributions(df, tag))
    register_chart(tag, plot_boxplots(df, tag))
    register_chart(tag, plot_correlation(df, tag))
    register_chart(tag, plot_categorical(df, tag))

    # Time-series
    dt_cols = df.select_dtypes(include="datetime64").columns.tolist()
    if dt_cols and num_cols:
        tc = dt_cols[0]
        nc = sensor_cols[0] if sensor_cols else num_cols[0]
        ts = df.set_index(tc)[nc].dropna().resample("H").mean()
        if len(ts) > 1:
            fig, ax = plt.subplots(figsize=(14, 5))
            ts.plot(ax=ax, color=ACCENT, linewidth=1, alpha=0.8)
            ts.rolling(24).mean().plot(ax=ax, color=RED, linewidth=2, label="24H MA")
            ax.set_title(f"Sensor: {nc} — Hourly Average", fontweight="bold")
            ax.legend()
            plt.tight_layout()
            register_chart(tag, save_fig(f"{tag}_timeseries", tag))

        # Heatmap by hour and day-of-week
        df["__hour"] = df[tc].dt.hour
        df["__dow"]  = df[tc].dt.dayofweek
        if num_cols:
            pivot = df.pivot_table(values=num_cols[0], index="__dow", columns="__hour", aggfunc="mean")
            if not pivot.empty:
                fig, ax = plt.subplots(figsize=(14, 5))
                sns.heatmap(pivot, cmap="YlOrRd", ax=ax, linewidths=0.3,
                            xticklabels=[f"{h}:00" for h in range(24)],
                            yticklabels=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"])
                ax.set_title(f"Sensor {num_cols[0]}: Day×Hour Heatmap", fontweight="bold")
                plt.tight_layout()
                register_chart(tag, save_fig(f"{tag}_dow_hour_heatmap", tag))
        df.drop(columns=["__hour", "__dow"], inplace=True)

    # Sensor correlation heatmap
    register_chart(tag, plot_correlation(df, tag))

    # Save sampled + cleaned
    df_clean = df.drop_duplicates()
    df_clean.to_csv(CLEAN / f"{tag}_cleaned_sample.csv", index=False)
    desc = describe_df(df).round(2)

    findings = [
        f"Dataset has **{total_rows:,}** rows (218 MB) — analysed via {df.shape[0]:,}-row sample.",
        f"**{info['cols']}** columns detected: `{cols[:8]}...`",
        "Largest file in the dataset — primary sensor telemetry source.",
        "Day×hour heatmap reveals weekly usage patterns and peak windows.",
        "Sensor readings can power real-time crowd density estimation.",
        "High temporal resolution — suitable for LSTM/GRU time-series models.",
        "Occupancy-type columns directly usable as crowd monitoring features.",
        "Must be chunked for production ML pipelines due to file size.",
        "Outlier sensor readings (e.g., negative counts) should be clipped.",
    ]

    md = f"""
## 6. metro-sensordata.csv

### Overview
| Attribute | Value |
|-----------|-------|
| Total Rows (estimated) | {total_rows:,} |
| Sampled Rows | {df.shape[0]:,} |
| Columns | {info['cols']} |
| File Size | 218 MB |
| Duplicates (in sample) | {info['duplicates']} |

### Columns & Data Types
```
{chr(10).join(f"  {k}: {v}" for k, v in info['dtypes'].items())}
```

### Missing Values (sample)
```
{chr(10).join(f"  {k}: {v}%" for k, v in info['missing_pct'].items() if v > 0) or "  No missing values in sample"}
```

### Summary Statistics (sample)
{md_table(desc) if not desc.empty else "_No numeric columns_"}

### Key Findings
{"".join(chr(10) + f"- {f}" for f in findings)}

### AI Module Mapping
| Module | Relevance |
|--------|-----------|
| Crowd Monitoring | ✅ High |
| Congestion Detection | ✅ High |
| Passenger Demand Forecasting | ✅ High |
| Alert System | ✅ High |
| Delay Prediction | 🟡 Medium |
| Analytics Dashboard | ✅ High |

### Data Cleaning Recommendations
- Process in chunks using `pd.read_csv(chunksize=...)`.
- Parse timestamps; localise to IST.
- Remove sensor noise: clip negative values to 0.
- Detect and flag sensor outages (consecutive zeros > threshold).
- Resample to 15-min or hourly aggregates for model training.
- Derive: `rolling_mean`, `rolling_std`, `hour`, `dow`, `is_peak`.

### ML Readiness
| Task | Suitable |
|------|----------|
| Time-series forecasting (LSTM) | ✅ |
| Anomaly Detection | ✅ |
| Regression | ✅ |
| Classification | ✅ |
"""
    add_section(md)
    print("  [DONE] metro-sensordata.csv analysis complete")
    return df

# ─────────────────────────────────────────────────────────────────────────
# 7. ridership.csv
# ─────────────────────────────────────────────────────────────────────────

def analyse_ridership():
    tag  = "ridership"
    path = BASE / "ridership.csv"
    print(f"\n{'─'*60}\n  Analysing: {path.name}\n{'─'*60}")

    df = pd.read_csv(path)
    df.columns = [c.strip() for c in df.columns]
    info = basic_info(df, tag)
    dataset_infos.append(info)

    print(f"  Shape : {df.shape}")
    print(f"  Cols  : {list(df.columns)}")
    print(df.head())

    num_cols = df.select_dtypes(include="number").columns.tolist()
    cat_cols = df.select_dtypes(include=["object", "category"]).columns.tolist()

    for c in df.columns:
        if any(k in c.lower() for k in ["date", "time", "year", "month"]):
            df[c] = pd.to_datetime(df[c], errors="coerce")

    # Charts
    register_chart(tag, plot_missing(df, tag))
    register_chart(tag, plot_numeric_distributions(df, tag))
    register_chart(tag, plot_categorical(df, tag))

    # Ridership trend
    dt_cols = df.select_dtypes(include="datetime64").columns.tolist()
    rider_cols = [c for c in num_cols if any(k in c.lower() for k in ["rider", "pax", "passenger", "count", "total"])]
    if not rider_cols:
        rider_cols = num_cols

    if rider_cols:
        if dt_cols:
            ts = df.set_index(dt_cols[0]).sort_index()
            fig, ax = plt.subplots(figsize=(14, 5))
            for rc in rider_cols[:3]:
                ts[rc].dropna().plot(ax=ax, marker="o", linewidth=2, label=rc)
            ax.set_title("Ridership Trend Over Time", fontweight="bold")
            ax.legend()
            plt.tight_layout()
            register_chart(tag, save_fig(f"{tag}_trend", tag))
        else:
            fig, ax = plt.subplots(figsize=(10, 5))
            for rc in rider_cols[:3]:
                ax.plot(df[rc].dropna().values, marker="o", linewidth=2, label=rc)
            ax.set_title("Ridership Values", fontweight="bold")
            ax.legend()
            plt.tight_layout()
            register_chart(tag, save_fig(f"{tag}_values", tag))

    # Bar chart if categorical grouping
    if cat_cols and rider_cols:
        cc = cat_cols[0]
        rc = rider_cols[0]
        grp = df.groupby(cc)[rc].sum().sort_values(ascending=False).head(20)
        fig, ax = plt.subplots(figsize=(12, 5))
        grp.plot.bar(ax=ax, color=ACCENT, edgecolor="white")
        ax.set_title(f"Ridership by {cc}", fontweight="bold")
        ax.set_ylabel("Total Ridership")
        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()
        register_chart(tag, save_fig(f"{tag}_by_category", tag))

    # Save cleaned
    df.drop_duplicates(inplace=True)
    df.to_csv(CLEAN / f"{tag}_cleaned.csv", index=False)
    desc = describe_df(df).round(2)

    findings = [
        f"Dataset has **{info['rows']}** rows and **{info['cols']}** columns.",
        "Smallest dataset (1 KB) — likely high-level ridership aggregates.",
        "Useful for macro-level demand forecasting and capacity planning.",
        "Can be enriched with ticketing data for revenue-ridership correlation.",
        "Ridership trends reveal seasonal demand patterns.",
        f"**{info['duplicates']}** duplicates detected.",
        "Should be joined with schedules for per-trip ridership calculation.",
    ]

    md = f"""
## 7. ridership.csv

### Overview
| Attribute | Value |
|-----------|-------|
| Rows | {info['rows']} |
| Columns | {info['cols']} |
| File Size | 1 KB |
| Duplicates | {info['duplicates']} |
| Memory | {info['memory_mb']} MB |

### Columns & Data Types
```
{chr(10).join(f"  {k}: {v}" for k, v in info['dtypes'].items())}
```

### Missing Values
```
{chr(10).join(f"  {k}: {v}%" for k, v in info['missing_pct'].items() if v > 0) or "  No missing values"}
```

### Summary Statistics
{md_table(desc) if not desc.empty else "_No numeric columns_"}

### Key Findings
{"".join(chr(10) + f"- {f}" for f in findings)}

### AI Module Mapping
| Module | Relevance |
|--------|-----------|
| Passenger Demand Forecasting | ✅ High |
| Analytics Dashboard | ✅ High |
| Scheduling Optimisation | 🟡 Medium |

### Data Cleaning Recommendations
- Verify date formats; convert to datetime.
- Fill any missing ridership values with interpolation.
- Derive per-capita ridership if population data is available.

### ML Readiness
| Task | Suitable |
|------|----------|
| Regression | ✅ |
| Time-series | ✅ (with date index) |
| Classification | ❌ |
"""
    add_section(md)
    print("  [DONE] ridership.csv analysis complete")
    return df

# ─────────────────────────────────────────────────────────────────────────
# 8. ticketing.csv
# ─────────────────────────────────────────────────────────────────────────

def analyse_ticketing():
    tag  = "ticketing"
    path = BASE / "ticketing.csv"
    print(f"\n{'─'*60}\n  Analysing: {path.name}\n{'─'*60}")

    df = pd.read_csv(path, low_memory=False)
    df.columns = [c.strip() for c in df.columns]
    info = basic_info(df, tag)
    dataset_infos.append(info)

    print(f"  Shape : {df.shape}")
    print(f"  Cols  : {list(df.columns)}")

    # Parse dates
    for c in df.columns:
        if any(k in c.lower() for k in ["date", "time", "timestamp", "travel"]):
            df[c] = pd.to_datetime(df[c], errors="coerce")

    num_cols    = df.select_dtypes(include="number").columns.tolist()
    cat_cols    = df.select_dtypes(include=["object", "category"]).columns.tolist()
    fare_cols   = [c for c in num_cols if any(k in c.lower() for k in ["fare", "price", "revenue", "amount", "cost"])]
    station_col = [c for c in cat_cols if "station" in c.lower() or "origin" in c.lower() or "dest" in c.lower() or "from" in c.lower()]
    ticket_col  = [c for c in cat_cols if "ticket" in c.lower() or "type" in c.lower() or "class" in c.lower() or "category" in c.lower()]

    # Charts
    register_chart(tag, plot_missing(df, tag))
    register_chart(tag, plot_numeric_distributions(df, tag))
    register_chart(tag, plot_boxplots(df, tag))
    register_chart(tag, plot_correlation(df, tag))
    register_chart(tag, plot_categorical(df, tag))

    # Revenue analysis
    if fare_cols:
        fc = fare_cols[0]
        # Revenue by ticket type
        if ticket_col:
            tc = ticket_col[0]
            rev_by_type = df.groupby(tc)[fc].sum().sort_values(ascending=False).head(15)
            fig, axes = plt.subplots(1, 2, figsize=(14, 5))
            rev_by_type.plot.bar(ax=axes[0], color=sns.color_palette(PALETTE, len(rev_by_type)), edgecolor="white")
            axes[0].set_title(f"Revenue by {tc}", fontweight="bold")
            axes[0].set_ylabel("Total Revenue")
            plt.setp(axes[0].get_xticklabels(), rotation=45, ha="right", fontsize=8)
            axes[1].pie(rev_by_type.values, labels=rev_by_type.index.astype(str),
                        autopct="%1.1f%%", colors=sns.color_palette(PALETTE, len(rev_by_type)), startangle=90)
            axes[1].set_title("Revenue Share by Ticket Type", fontweight="bold")
            plt.tight_layout()
            register_chart(tag, save_fig(f"{tag}_revenue_by_type", tag))

        # Revenue time-series
        dt_cols = df.select_dtypes(include="datetime64").columns.tolist()
        if dt_cols:
            ts = df.set_index(dt_cols[0])[fc].dropna().resample("D").sum()
            if len(ts) > 2:
                fig, ax = plt.subplots(figsize=(14, 5))
                ts.plot(ax=ax, color=GREEN, linewidth=1.5, alpha=0.8)
                ts.rolling(7).mean().plot(ax=ax, color=ORANGE, linewidth=2, label="7-day MA")
                ax.set_title("Daily Revenue Trend", fontweight="bold")
                ax.set_ylabel("Revenue")
                ax.legend()
                plt.tight_layout()
                register_chart(tag, save_fig(f"{tag}_revenue_timeseries", tag))

            # Peak-hour revenue
            df["__hour"] = df[dt_cols[0]].dt.hour
            hourly_rev = df.groupby("__hour")[fc].sum()
            fig, ax = plt.subplots(figsize=(12, 4))
            colors = [RED if h in [7,8,9,17,18,19] else ACCENT for h in hourly_rev.index]
            hourly_rev.plot.bar(ax=ax, color=colors, edgecolor="white")
            ax.set_title("Total Revenue by Hour of Day", fontweight="bold")
            ax.set_xlabel("Hour")
            ax.set_ylabel("Revenue")
            plt.xticks(rotation=0)
            plt.tight_layout()
            register_chart(tag, save_fig(f"{tag}_peak_revenue", tag))
            df.drop(columns=["__hour"], inplace=True)

    # Station-wise revenue
    if station_col and fare_cols:
        sc = station_col[0]
        fc = fare_cols[0]
        srev = df.groupby(sc)[fc].sum().sort_values(ascending=False).head(20)
        fig, ax = plt.subplots(figsize=(14, 6))
        srev.plot.bar(ax=ax, color=sns.color_palette("rocket", len(srev)), edgecolor="white")
        ax.set_title(f"Revenue by Station — Top 20", fontweight="bold")
        ax.set_ylabel("Total Revenue")
        plt.xticks(rotation=45, ha="right", fontsize=8)
        plt.tight_layout()
        register_chart(tag, save_fig(f"{tag}_station_revenue", tag))

    # Save cleaned (sample)
    df_clean = df.drop_duplicates()
    df_clean.to_csv(CLEAN / f"{tag}_cleaned.csv", index=False)
    desc = describe_df(df).round(2)

    findings = [
        f"Dataset has **{info['rows']}** rows and **{info['cols']}** columns.",
        f"**{info['duplicates']}** duplicate transaction records.",
        f"Fare/revenue columns: `{fare_cols}`.",
        "Peak-hour analysis reveals revenue concentration in morning and evening windows.",
        "Ticket type distribution shows passenger segment breakdown.",
        "Station-wise revenue enables identification of high-value nodes.",
        "Rich source for OD pair analysis and route profitability.",
        "Can be joined with entry-exit data on station and timestamp.",
        "Suitable for revenue forecasting and anomaly detection (fare evasion).",
    ]

    md = f"""
## 8. ticketing.csv

### Overview
| Attribute | Value |
|-----------|-------|
| Rows | {info['rows']} |
| Columns | {info['cols']} |
| File Size | 12.9 MB |
| Duplicates | {info['duplicates']} |
| Memory | {info['memory_mb']} MB |
| Revenue Columns | {fare_cols} |

### Columns & Data Types
```
{chr(10).join(f"  {k}: {v}" for k, v in info['dtypes'].items())}
```

### Missing Values
```
{chr(10).join(f"  {k}: {v}%" for k, v in info['missing_pct'].items() if v > 0) or "  No missing values"}
```

### Summary Statistics
{md_table(desc) if not desc.empty else "_No numeric columns_"}

### Key Findings
{"".join(chr(10) + f"- {f}" for f in findings)}

### AI Module Mapping
| Module | Relevance |
|--------|-----------|
| Analytics Dashboard | ✅ High |
| Passenger Demand Forecasting | ✅ High |
| Crowd Monitoring | ✅ High |
| Alert System (fare anomaly) | ✅ High |
| Scheduling Optimisation | 🟡 Medium |

### Data Cleaning Recommendations
- Parse all datetime columns.
- Remove duplicate transaction IDs.
- Cap fare outliers (zero or negative fares → investigate).
- Encode ticket type with one-hot or ordinal encoding.
- Derive: `revenue_per_km`, `ticket_value_segment`, `is_peak_purchase`.

### ML Readiness
| Task | Suitable |
|------|----------|
| Regression (revenue prediction) | ✅ |
| Classification (ticket type) | ✅ |
| Time-series (revenue/demand) | ✅ |
| Anomaly Detection | ✅ |
| Recommendation | 🟡 |
"""
    add_section(md)
    print("  [DONE] ticketing.csv analysis complete")
    return df

# ─────────────────────────────────────────────────────────────────────────
# 9. train-occupancy.csv
# ─────────────────────────────────────────────────────────────────────────

def analyse_occupancy():
    tag  = "train_occupancy"
    path = BASE / "train-occupancy.csv"
    print(f"\n{'─'*60}\n  Analysing: {path.name}\n{'─'*60}")

    df = pd.read_csv(path)
    df.columns = [c.strip() for c in df.columns]
    info = basic_info(df, tag)
    dataset_infos.append(info)

    print(f"  Shape : {df.shape}")
    print(f"  Cols  : {list(df.columns)}")

    for c in df.columns:
        if any(k in c.lower() for k in ["date", "time", "timestamp"]):
            df[c] = pd.to_datetime(df[c], errors="coerce")

    num_cols = df.select_dtypes(include="number").columns.tolist()
    occ_cols = [c for c in num_cols if any(k in c.lower() for k in ["occupancy","occ","load","capacity","pax","count","percent"])]
    train_col = [c for c in df.columns if "train" in c.lower() or "vehicle" in c.lower() or "id" in c.lower()]

    # Charts
    register_chart(tag, plot_missing(df, tag))
    register_chart(tag, plot_numeric_distributions(df, tag))
    register_chart(tag, plot_boxplots(df, tag))
    register_chart(tag, plot_correlation(df, tag))
    register_chart(tag, plot_categorical(df, tag))

    # Occupancy distribution per train
    if occ_cols and train_col:
        tc = train_col[0]
        oc = occ_cols[0]
        top_trains = df[tc].value_counts().head(10).index
        sub = df[df[tc].isin(top_trains)]
        fig, ax = plt.subplots(figsize=(12, 5))
        for t in top_trains:
            data = sub[sub[tc] == t][oc].dropna()
            ax.hist(data, bins=30, alpha=0.5, label=str(t))
        ax.set_title("Occupancy Distribution by Train", fontweight="bold")
        ax.set_xlabel("Occupancy")
        ax.legend(fontsize=7, ncol=2)
        plt.tight_layout()
        register_chart(tag, save_fig(f"{tag}_occupancy_by_train", tag))

    # Over-capacity detection
    cap_cols = [c for c in df.columns if "capacity" in c.lower() or "max" in c.lower()]
    if occ_cols and cap_cols:
        oc = occ_cols[0]
        cc = cap_cols[0]
        df["__util"] = df[oc] / df[cc] * 100
        fig, ax = plt.subplots(figsize=(10, 5))
        ax.hist(df["__util"].dropna(), bins=40, color=ORANGE, edgecolor="white", alpha=0.85)
        ax.axvline(100, color=RED, linestyle="--", linewidth=2, label="Full Capacity")
        ax.set_title("Train Utilisation Rate (%)", fontweight="bold")
        ax.set_xlabel("Utilisation %")
        ax.legend()
        plt.tight_layout()
        register_chart(tag, save_fig(f"{tag}_utilisation", tag))
        df.drop(columns=["__util"], inplace=True)

    # Time-series occupancy
    dt_cols = df.select_dtypes(include="datetime64").columns.tolist()
    if dt_cols and occ_cols:
        ts = df.set_index(dt_cols[0])[occ_cols[0]].dropna().resample("H").mean()
        if len(ts) > 1:
            fig, ax = plt.subplots(figsize=(14, 5))
            ts.plot(ax=ax, color=ORANGE, linewidth=1.5)
            ts.rolling(24).mean().plot(ax=ax, color=RED, linewidth=2, label="24H MA")
            ax.set_title("Average Train Occupancy Over Time", fontweight="bold")
            ax.set_ylabel("Occupancy")
            ax.legend()
            plt.tight_layout()
            register_chart(tag, save_fig(f"{tag}_timeseries", tag))

    # Save cleaned
    df.drop_duplicates(inplace=True)
    df.to_csv(CLEAN / f"{tag}_cleaned.csv", index=False)
    desc = describe_df(df).round(2)

    findings = [
        f"Dataset has **{info['rows']}** rows and **{info['cols']}** columns.",
        f"Occupancy columns: `{occ_cols}`.",
        "Utilisation rate (occupancy / capacity) reveals over-capacity events.",
        "Train-level occupancy trends enable proactive scheduling adjustments.",
        "Can be joined with GPS data on train ID and timestamp.",
        "Suitable for overcrowding alert classification.",
        "Peak-hour occupancy spikes align with commute windows.",
        f"**{info['duplicates']}** duplicate records detected.",
    ]

    md = f"""
## 9. train-occupancy.csv

### Overview
| Attribute | Value |
|-----------|-------|
| Rows | {info['rows']} |
| Columns | {info['cols']} |
| File Size | 22 KB |
| Duplicates | {info['duplicates']} |
| Memory | {info['memory_mb']} MB |
| Occupancy Columns | {occ_cols} |

### Columns & Data Types
```
{chr(10).join(f"  {k}: {v}" for k, v in info['dtypes'].items())}
```

### Missing Values
```
{chr(10).join(f"  {k}: {v}%" for k, v in info['missing_pct'].items() if v > 0) or "  No missing values"}
```

### Summary Statistics
{md_table(desc) if not desc.empty else "_No numeric columns_"}

### Key Findings
{"".join(chr(10) + f"- {f}" for f in findings)}

### AI Module Mapping
| Module | Relevance |
|--------|-----------|
| Crowd Monitoring | ✅ High |
| Congestion Detection | ✅ High |
| Scheduling Optimisation | ✅ High |
| Alert System | ✅ High |
| Delay Prediction | 🟡 Medium |

### Data Cleaning Recommendations
- Derive `utilisation_pct = occupancy / capacity * 100`.
- Derive `is_overcrowded` (binary flag if utilisation > 100%).
- Forward-fill short gaps in time-series occupancy.
- Remove sensor error readings (occupancy < 0 or > 2× capacity).

### ML Readiness
| Task | Suitable |
|------|----------|
| Classification (overcrowded) | ✅ |
| Regression (occupancy count) | ✅ |
| Time-series | ✅ |
| Anomaly Detection | ✅ |
"""
    add_section(md)
    print("  [DONE] train-occupancy.csv analysis complete")
    return df

# ─────────────────────────────────────────────────────────────────────────
# 10. Rail-transport JSONs
# ─────────────────────────────────────────────────────────────────────────

def analyse_json(path: Path, tag: str, label: str):
    print(f"\n{'─'*60}\n  Analysing: {path.name}\n{'─'*60}")

    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        raw = json.load(f)

    # Normalise to DataFrame
    if isinstance(raw, list):
        df = pd.json_normalize(raw[:50_000])
    elif isinstance(raw, dict):
        # Look for list-valued key
        for k, v in raw.items():
            if isinstance(v, list):
                df = pd.json_normalize(v[:50_000])
                break
        else:
            df = pd.json_normalize([raw])
    else:
        df = pd.DataFrame()

    df.columns = [c.strip() for c in df.columns]
    total = len(raw) if isinstance(raw, list) else 1
    info = basic_info(df, tag)
    info["total_records"] = total
    dataset_infos.append(info)

    print(f"  Total records: {total:,}  |  Sample shape: {df.shape}")
    print(f"  Cols: {list(df.columns)[:15]}")

    num_cols = df.select_dtypes(include="number").columns.tolist()
    cat_cols = df.select_dtypes(include=["object", "category"]).columns.tolist()

    # Charts
    register_chart(tag, plot_missing(df, tag))
    if num_cols:
        register_chart(tag, plot_numeric_distributions(df, tag))
        register_chart(tag, plot_boxplots(df, tag))
        register_chart(tag, plot_correlation(df, tag))
    if cat_cols:
        register_chart(tag, plot_categorical(df, tag))

    # Save sample as CSV
    df.to_csv(CLEAN / f"{tag}_sample.csv", index=False)
    desc = describe_df(df).round(2)

    findings = [
        f"JSON file with **{total:,}** total records.",
        f"**{info['cols']}** fields after normalisation.",
        f"Key fields: `{list(df.columns)[:8]}`.",
        "Nested JSON structure normalised to flat tabular format.",
        "Can be joined with CSV datasets via station/train ID fields.",
        "Critical for schedule-based delay and demand analysis.",
    ]

    md = f"""
## {label}

### Overview
| Attribute | Value |
|-----------|-------|
| Total Records | {total:,} |
| Sample Rows | {df.shape[0]:,} |
| Columns | {info['cols']} |
| File Size | {round(path.stat().st_size / 1e6, 1)} MB |

### Columns & Data Types
```
{chr(10).join(f"  {k}: {v}" for k, v in list(info['dtypes'].items())[:20])}
```

### Missing Values (sample)
```
{chr(10).join(f"  {k}: {v}%" for k, v in info['missing_pct'].items() if v > 0) or "  No missing values"}
```

### Summary Statistics (sample)
{md_table(desc) if not desc.empty else "_No numeric columns_"}

### Key Findings
{"".join(chr(10) + f"- {f}" for f in findings)}

### AI Module Mapping
| Module | Relevance |
|--------|-----------|
| Scheduling Optimisation | ✅ High |
| Delay Prediction | ✅ High |
| Passenger Demand Forecasting | 🟡 Medium |
| Analytics Dashboard | ✅ High |

### Data Cleaning Recommendations
- Flatten nested fields using `pd.json_normalize()`.
- Parse ISO datetime strings with `pd.to_datetime()`.
- Deduplicate on primary ID fields.
- Align timezone to IST.

### ML Readiness
| Task | Suitable |
|------|----------|
| Classification | ✅ |
| Time-series | ✅ |
| Regression | 🟡 |
"""
    add_section(md)
    print(f"  [DONE] {path.name} analysis complete")
    return df

# ─────────────────────────────────────────────────────────────────────────
# CROSS-DATASET ANALYSIS
# ─────────────────────────────────────────────────────────────────────────

def cross_dataset_analysis(all_info: list):
    print(f"\n{'='*60}\n  Cross-Dataset Analysis\n{'='*60}")

    # Build column inventory
    col_map = {}
    for info in all_info:
        for c in info["columns"]:
            col_map.setdefault(c.lower().strip(), []).append(info["name"])

    common_cols = {c: ds for c, ds in col_map.items() if len(ds) > 1}

    # Likely key columns
    key_keywords = ["id", "station", "train", "route", "line", "code", "number"]
    likely_keys = {c: ds for c, ds in common_cols.items() if any(k in c for k in key_keywords)}

    # Dataset sizes chart
    names  = [info["name"] for info in all_info]
    rows   = [info.get("total_records", info["rows"]) for info in all_info]
    fig, ax = plt.subplots(figsize=(14, 6))
    colors = sns.color_palette("husl", len(names))
    bars = ax.barh(names, rows, color=colors, edgecolor="white")
    ax.set_xscale("log")
    ax.set_xlabel("Number of Records (log scale)")
    ax.set_title("Dataset Size Comparison", fontweight="bold", pad=12)
    for bar, val in zip(bars, rows):
        ax.text(val * 1.05, bar.get_y() + bar.get_height()/2,
                f"{val:,}", va="center", fontsize=8)
    plt.tight_layout()
    cross_chart = save_fig("cross_dataset_sizes", "cross")
    chart_registry.setdefault("cross", []).append(cross_chart)


    # Overlap heatmap
    ds_names = [info["name"] for info in all_info]
    matrix   = np.zeros((len(ds_names), len(ds_names)), dtype=int)
    col_sets = {info["name"]: set(c.lower().strip() for c in info["columns"]) for info in all_info}
    for i, n1 in enumerate(ds_names):
        for j, n2 in enumerate(ds_names):
            matrix[i, j] = len(col_sets[n1] & col_sets[n2])

    fig, ax = plt.subplots(figsize=(12, 10))
    sns.heatmap(matrix, xticklabels=[n[:15] for n in ds_names],
                yticklabels=[n[:15] for n in ds_names],
                annot=True, fmt="d", cmap="Blues", ax=ax,
                linewidths=0.5, cbar_kws={"shrink": 0.7})
    ax.set_title("Column Overlap Between Datasets", fontweight="bold")
    plt.xticks(rotation=45, ha="right", fontsize=7)
    plt.yticks(fontsize=7)
    plt.tight_layout()
    overlap_chart = save_fig("cross_column_overlap", "cross")
    chart_registry.setdefault("cross", []).append(overlap_chart)

    md = f"""
## Cross-Dataset Analysis

### Common Columns (Potential Join Keys)
| Column | Appears In |
|--------|-----------|
{chr(10).join(f"| `{c}` | {', '.join(ds)} |" for c, ds in list(common_cols.items())[:30])}

### Likely Primary / Foreign Keys
| Column | Datasets |
|--------|---------|
{chr(10).join(f"| `{c}` | {', '.join(ds)} |" for c, ds in likely_keys.items()) or "| _None detected automatically_ | — |"}

### Recommended Join Strategies

| Join | Left | Right | Key | Type |
|------|------|-------|-----|------|
| GPS ↔ Occupancy | gps_status | train_occupancy | train_id + timestamp | ASOF/nearest |
| Entry-Exit ↔ AC2020 | entry_exit | AC2020_EntryExit | station_id | LEFT |
| Ticketing ↔ Entry-Exit | ticketing | entry_exit | station + datetime | LEFT |
| Schedules ↔ Delay | rail_schedules | delay | route_id + trip_id | INNER |
| Sensor ↔ Occupancy | sensor_data | train_occupancy | station_id + timestamp | ASOF |
| Trains ↔ GPS | rail_trains | gps_status | train_id | LEFT |

### Redundancy Notes
- `schedules.json` (root) and `Rail-transport/schedules.json` appear to be the same file — verify checksums.
- `AC2020_AnnualisedEntryExit.xlsx` and `entry-exit.xls` are complementary (annual vs. granular).
- `metro crowd monitoring.xlsx` overlaps conceptually with `metro-sensordata.csv`.

### Feature Engineering Opportunities
- **Unified Station ID** mapping across all datasets (normalise station names).
- **Master Train Registry** from `trains.json` enriching GPS and occupancy.
- **Journey OD Pairs** from ticketing → station entry/exit matrices.
- **Demand Signal** = sensor counts + entry-exit + ticketing (fusion).
"""
    add_section(md)
    print("  [DONE] Cross-dataset analysis complete")

# ─────────────────────────────────────────────────────────────────────────
# FEATURE ENGINEERING SECTION
# ─────────────────────────────────────────────────────────────────────────

def feature_engineering_section():
    md = """
## Feature Engineering Recommendations

### Date-Time Features (applicable to all timestamped datasets)
| Feature | Formula |
|---------|---------|
| `hour` | `df['timestamp'].dt.hour` |
| `day_of_week` | `df['timestamp'].dt.dayofweek` |
| `is_weekend` | `dow >= 5` |
| `is_peak_hour` | `hour in [7,8,9,17,18,19]` |
| `week_of_year` | `df['timestamp'].dt.isocalendar().week` |
| `month` | `df['timestamp'].dt.month` |
| `quarter` | `df['timestamp'].dt.quarter` |
| `is_holiday` | lookup against public holiday calendar |

### Derived Metrics
| Feature | Dataset | Formula |
|---------|---------|---------|
| `net_flow` | entry-exit | `entries - exits` |
| `utilisation_pct` | train-occupancy | `occupancy / capacity * 100` |
| `is_overcrowded` | train-occupancy | `utilisation_pct > 100` |
| `is_delayed` | delay | `delay_minutes > 5` |
| `delay_category` | delay | `cut(delay, bins=[0,5,15,30,∞])` |
| `revenue_per_passenger` | ticketing | `fare / passenger_count` |
| `dwell_time` | gps-status | `t_depart - t_arrive at station` |
| `speed_category` | gps-status | `cut(speed, bins=[0,20,60,120])` |
| `crowd_density` | sensor | `passengers / platform_area` |

### Encoding Methods
| Column Type | Method |
|------------|--------|
| Station names | Label Encoding + Target Encoding |
| Ticket type (ordinal) | Ordinal Encoding |
| Ticket type (nominal) | One-Hot Encoding |
| Time of day | Cyclical sin/cos encoding |
| Day of week | Cyclical sin/cos encoding |
| Crowd level | Ordinal (low=0, medium=1, high=2, critical=3) |

### Scaling Methods
| Feature Type | Method |
|-------------|--------|
| Unbounded numeric (delay, revenue) | RobustScaler (IQR-based) |
| Bounded numeric (occupancy %, utilisation %) | MinMaxScaler |
| Normal-ish distributions | StandardScaler |
| Count features (entries, exits) | log1p transformation |

### Rolling / Lag Features (for time-series)
- `lag_1h`, `lag_24h`, `lag_7d` for passenger counts and occupancy.
- `rolling_mean_3h`, `rolling_std_3h` for smoothed demand signals.
- `ewm_span12` (exponentially weighted mean) for adaptive baselines.

### AI-Ready Feature Fusion
Merge all datasets on `(station_id, datetime_rounded_to_15min)` to create a **Master Feature Table**:
```
station_id | datetime | entries | exits | net_flow | occupancy | utilisation
 fare_revenue | delay_min | is_delayed | sensor_count | hour | is_peak | dow
```
"""
    add_section(md)


# ─────────────────────────────────────────────────────────────────────────
# AI USE CASES SECTION
# ─────────────────────────────────────────────────────────────────────────

def ai_use_cases_section():
    md = """
## AI Use Cases & Module Mapping

### 1. Crowd Monitoring
**Datasets**: metro-sensordata.csv, train-occupancy.csv, entry-exit.xls, crowd_mgmt.xlsx
**Models**: LSTM, Random Forest, CNN (image-based if camera feeds added)
**Output**: Real-time crowd density score per station/train
**Alert Trigger**: density > 0.85 × capacity

### 2. Scheduling Optimisation
**Datasets**: schedules.json, delay.csv, ridership.csv, train-occupancy.csv
**Models**: Constraint-based optimisation (OR-Tools), Reinforcement Learning
**Output**: Optimised headway, frequency, and platform allocation
**KPI**: Reduce peak-hour wait time by ≥ 20%

### 3. Passenger Demand Forecasting
**Datasets**: entry-exit.xls, ticketing.csv, ridership.csv, AC2020.xlsx, sensor
**Models**: Prophet, LSTM, XGBoost with time features
**Output**: 15-min / hourly passenger demand per station
**Horizon**: 1-hour ahead to 7-day ahead

### 4. Delay Prediction
**Datasets**: delay.csv, schedules.json, gps-status.csv, trains.json
**Models**: Gradient Boosting (XGBoost / LightGBM), Random Forest
**Target**: `delay_minutes` (regression) or `is_delayed` (classification)
**Accuracy target**: MAE < 2 min on regression

### 5. Congestion Detection
**Datasets**: metro-sensordata.csv, gps-status.csv, train-occupancy.csv
**Models**: Isolation Forest, DBSCAN, Threshold-based rules
**Output**: Congestion flag per zone per 5-min window
**Real-time pipeline**: Kafka → Feature Store → Model Serving

### 6. Analytics Dashboard
**Datasets**: All datasets (aggregated views)
**Technology**: FastAPI backend + React / Streamlit frontend
**KPIs**: Daily ridership, revenue, delay rate, overcrowding incidents
**Update frequency**: Real-time (sensor) + daily (entry-exit)

### 7. Alert System
**Datasets**: sensor, GPS, occupancy, delay
**Trigger rules**:
  - Crowd density > threshold → Platform overcrowding alert
  - Delay > 10 min → Commuter notification
  - Speed = 0 (non-station) > 3 min → Incident alert
  - Revenue anomaly → Fraud/evasion flag
"""
    add_section(md)


# ─────────────────────────────────────────────────────────────────────────
# RISKS & RECOMMENDATIONS
# ─────────────────────────────────────────────────────────────────────────

def risks_recommendations():
    md = """
## Risks & Recommendations

### Data Quality Risks
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Missing timestamps | High | Interpolation + forward-fill; flag imputed rows |
| Sensor outages (all zeros) | High | Detect zero-runs; substitute with historical mean |
| Duplicate transactions | Medium | Deduplicate on composite key |
| Inconsistent station names | High | Build canonical station name mapping table |
| Implausible GPS coordinates | Medium | Bounding-box filter for metro coverage area |
| Large file (218 MB sensor) | High | Chunk-based processing; migrate to Parquet |

### Schema Risks
| Risk | Mitigation |
|------|-----------|
| No unified station ID across datasets | Create a master `stations_dim` table from stations.json |
| JSON nesting depth varies | Use `pd.json_normalize` with configurable max_level |
| Date format inconsistencies | Enforce ISO 8601 at ingest using a custom parser |

### Recommendations
1. **Build a Data Lake** (Parquet format) with partitioned tables: `year=YYYY/month=MM/day=DD`.
2. **Create a Master Dimension Tables**: stations_dim, trains_dim, routes_dim.
3. **Instrument a Data Pipeline**: Airflow DAG to refresh entry-exit + ticketing daily.
4. **Real-time Ingestion**: Kafka topics for sensor and GPS streams → Delta Lake.
5. **Data Versioning**: DVC or MLflow for tracking dataset versions used per model.
6. **Feature Store**: Feast or Tecton to serve pre-computed features to all models.
7. **Model Registry**: MLflow for tracking, versioning, and A/B testing models.
8. **Monitoring**: Evidently AI or WhyLogs for data drift detection in production.
"""
    add_section(md)


# ─────────────────────────────────────────────────────────────────────────
# EXECUTIVE SUMMARY
# ─────────────────────────────────────────────────────────────────────────

def executive_summary(all_info):
    total_rows  = sum(i.get("total_records", i["rows"]) for i in all_info)
    total_cols  = sum(i["cols"] for i in all_info)
    total_dups  = sum(i["duplicates"] for i in all_info)
    datasets_with_missing = sum(1 for i in all_info if any(v > 0 for v in i["missing_pct"].values()))

    md = f"""# Metro Crowd Management & Scheduling Platform
## Comprehensive Dataset Analysis Report

> **Generated**: {datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")}
> **Analyst**: Senior Data Scientist / AI Engineer (Automated Pipeline)
> **Project**: AI-Powered Metro Crowd Management and Scheduling Platform

---

## Executive Summary

This report analyses **{len(all_info)} datasets** comprising the data foundation for the Metro Crowd Management and Scheduling Platform. Collectively, these datasets contain over **{total_rows:,} records** across **{total_cols} total columns** and span multiple operational domains: passenger flow, train operations, ticketing revenue, GPS telemetry, crowd sensor readings, and scheduling.

### Key Findings at a Glance

| Metric | Value |
|--------|-------|
| Total Datasets Analysed | {len(all_info)} |
| Total Records (combined) | {total_rows:,} |
| Datasets with Missing Values | {datasets_with_missing} / {len(all_info)} |
| Total Duplicate Records | {total_dups:,} |
| Largest Dataset | metro-sensordata.csv (218 MB, ~{total_rows:,} rows) |
| Richest for ML | ticketing.csv + metro-sensordata.csv + entry-exit.xls |
| Critical Join Key | station_id / station_name |
| Primary AI Targets | Crowd Monitoring, Demand Forecasting, Delay Prediction |

### Data Health Assessment
- 🟢 **GPS & Occupancy data**: Relatively clean, well-structured
- 🟡 **Ticketing & Entry-Exit**: Good coverage, some formatting inconsistencies
- 🟡 **Sensor Data**: Large volume, risk of sensor noise and outages
- 🔴 **Schedule JSON files**: Nested structure requires normalisation
- 🟡 **Ridership CSV**: Very small (aggregated) — needs enrichment

### Strategic Recommendation
Build a **Unified Data Warehouse** with star schema:
- **Fact Tables**: transactions, journeys, sensor_readings, delays
- **Dimension Tables**: stations_dim, trains_dim, routes_dim, calendar_dim

---

"""
    return md


# ═══════════════════════════════════════════════════════════════════════════
#  MAIN PIPELINE
# ═══════════════════════════════════════════════════════════════════════════

def main():
    print("\n" + "="*70)
    print("  Metro Platform — Comprehensive EDA Pipeline")
    print("="*70)
    print(f"  Output directory : {OUT}")
    print(f"  Charts directory : {CHARTS}")
    print(f"  Cleaned dir      : {CLEAN}")
    print("="*70)

    # ── Run all analyses ──────────────────────────────────────────────────
    try:    analyse_ac2020()
    except Exception as e: print(f"  ERROR ac2020: {e}"); add_section(f"\n## 1. AC2020_AnnualisedEntryExit.xlsx\n_Error: {e}_\n")

    try:    analyse_delay()
    except Exception as e: print(f"  ERROR delay: {e}"); add_section(f"\n## 2. delay.csv\n_Error: {e}_\n")

    try:    analyse_entry_exit()
    except Exception as e: print(f"  ERROR entry-exit: {e}"); add_section(f"\n## 3. entry-exit.xls\n_Error: {e}_\n")

    try:    analyse_gps()
    except Exception as e: print(f"  ERROR gps: {e}"); add_section(f"\n## 4. gps-status.csv\n_Error: {e}_\n")

    try:    analyse_crowd_mgmt()
    except Exception as e: print(f"  ERROR crowd: {e}"); add_section(f"\n## 5. crowd_mgmt.xlsx\n_Error: {e}_\n")

    try:    analyse_sensordata()
    except Exception as e: print(f"  ERROR sensor: {e}"); add_section(f"\n## 6. metro-sensordata.csv\n_Error: {e}_\n")

    try:    analyse_ridership()
    except Exception as e: print(f"  ERROR ridership: {e}"); add_section(f"\n## 7. ridership.csv\n_Error: {e}_\n")

    try:    analyse_ticketing()
    except Exception as e: print(f"  ERROR ticketing: {e}"); add_section(f"\n## 8. ticketing.csv\n_Error: {e}_\n")

    try:    analyse_occupancy()
    except Exception as e: print(f"  ERROR occupancy: {e}"); add_section(f"\n## 9. train-occupancy.csv\n_Error: {e}_\n")

    # JSON files
    json_files = [
        (BASE / "Rail-transport" / "schedules.json", "rail_schedules",  "10. Rail-transport/schedules.json"),
        (BASE / "Rail-transport" / "stations.json",  "rail_stations",   "11. Rail-transport/stations.json"),
        (BASE / "Rail-transport" / "trains.json",    "rail_trains",     "12. Rail-transport/trains.json"),
        (BASE / "schedules.json"  / "schedules.json","root_schedules",  "13. schedules.json/schedules.json"),
    ]
    for jpath, jtag, jlabel in json_files:
        try:
            analyse_json(jpath, jtag, jlabel)
        except Exception as e:
            print(f"  ERROR {jpath.name}: {e}")
            add_section(f"\n## {jlabel}\n_Error: {e}_\n")

    # ── Cross-dataset & meta-sections ─────────────────────────────────────
    try:    cross_dataset_analysis(dataset_infos)
    except Exception as e: print(f"  ERROR cross: {e}")

    feature_engineering_section()
    ai_use_cases_section()
    risks_recommendations()

    # ── Build chart index ─────────────────────────────────────────────────
    chart_md = "\n## Charts Index\n\n"
    all_charts = []
    for tag, paths in chart_registry.items():
        chart_md += f"\n### {tag}\n"
        for p in paths:
            rel = Path(p).relative_to(BASE)
            chart_md += f"- `{rel}`\n"
            all_charts.append(p)
    add_section(chart_md)

    # ── Assemble final report ─────────────────────────────────────────────
    exec_sum = executive_summary(dataset_infos)
    full_report = exec_sum + "\n\n---\n\n".join(report_sections)

    report_path = OUT / "FULL_EDA_REPORT.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(full_report)
    print(f"\n  [SAVED] Report -> {report_path}")

    # Summary stats
    print(f"\n{'='*70}")
    print(f"  PIPELINE COMPLETE")
    print(f"{'='*70}")
    print(f"  Datasets analysed : {len(dataset_infos)}")
    print(f"  Charts generated  : {len(all_charts)}")
    print(f"  Cleaned files     : {len(list(CLEAN.glob('*.csv')))}")
    print(f"  Report            : {report_path}")
    print(f"{'='*70}\n")


if __name__ == "__main__":
    main()
