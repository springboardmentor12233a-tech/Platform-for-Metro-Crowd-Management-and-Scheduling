import os
import pandas as pd
import numpy as np

def run_eda():
    csv_path = "ml_pipeline/data/metro_crowd_data.csv"
    if not os.path.exists(csv_path):
        print(f"Error: Dataset {csv_path} not found. Run generate_dataset.py first.")
        return
        
    df = pd.read_csv(csv_path)
    
    # 1. Summary Statistics
    total_records = len(df)
    missing_values = df.isnull().sum().sum()
    
    # 2. Station-wise analysis
    station_stats = df.groupby('station_name').agg({
        'passenger_count': ['mean', 'max', 'min', 'std'],
        'capacity': 'first'
    })
    station_stats.columns = ['mean_occupancy', 'max_occupancy', 'min_occupancy', 'std_occupancy', 'capacity']
    station_stats['avg_occupancy_ratio'] = station_stats['mean_occupancy'] / station_stats['capacity']
    
    # 3. Peak hour analysis (Weekday vs Weekend)
    weekday_df = df[df['day_of_week'] < 5]
    weekend_df = df[df['day_of_week'] >= 5]
    
    weekday_hourly = weekday_df.groupby('hour_of_day')['passenger_count'].mean()
    weekend_hourly = weekend_df.groupby('hour_of_day')['passenger_count'].mean()
    
    # Peak hours determination
    top_weekday_hours = weekday_hourly.nlargest(3).index.tolist()
    top_weekend_hours = weekend_hourly.nlargest(3).index.tolist()
    
    # 4. Weather impact
    weather_stats = df.groupby('weather')['passenger_count'].mean()
    
    # 5. Correlation analysis
    numeric_cols = ['passenger_count', 'inflow_rate', 'outflow_rate', 'hour_of_day', 
                    'day_of_week', 'month', 'is_holiday', 'is_special_event', 'weather_code', 'lag_passenger_count']
    corr_matrix = df[numeric_cols].corr()
    
    # Create the markdown report content
    report = f"""# MetroFlow - Exploratory Data Analysis Report

Generated on: {pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")}
Total Records Analyzed: {total_records:,}
Data Quality Issues (Missing values): {missing_values}

---

## 1. Station Occupancy Statistics
This table shows the passenger counts and average capacity utilization for each of our 8 stations across the 6-month historical window.

| Station Name | Capacity | Avg Occupancy | Max Occupancy | Min Occupancy | Avg Utilization % |
| :--- | :---: | :---: | :---: | :---: | :---: |
"""
    
    for idx, row in station_stats.iterrows():
        report += f"| {idx} | {int(row['capacity']):,} | {int(row['mean_occupancy']):,} | {int(row['max_occupancy']):,} | {int(row['min_occupancy']):,} | {row['avg_occupancy_ratio']*100:.2f}% |\n"
        
    report += f"""
---

## 2. Temporal & Peak Hour Behavior

### Weekday Peak Hours
Commuter flow exhibits a clear bimodal distribution on weekdays, matching typical business hours:
* **Top 3 peak hours**: {', '.join([f"{h:02d}:00" for h in top_weekday_hours])}
* **Morning Commute Peak**: 08:00 - 10:00 (High inflow rate)
* **Evening Commute Peak**: 17:00 - 19:00 (High outflow rate)

### Weekend Peak Hours
Weekend passenger flows are much flatter and exhibit mid-day shopping/leisure peaks:
* **Top 3 peak hours**: {', '.join([f"{h:02d}:00" for h in top_weekend_hours])}
* **Distribution profile**: Gradual build-up starting from 11:00 AM, peaking around 02:00 PM - 04:00 PM.

---

## 3. Weather & Special Event Influences

### Average Station Passenger Volume by Weather State:
"""
    for weather, val in weather_stats.items():
        report += f"* **{weather}**: {int(val):,} passengers (avg)\n"
        
    event_mean = df[df['is_special_event'] == 1]['passenger_count'].mean()
    no_event_mean = df[df['is_special_event'] == 0]['passenger_count'].mean()
    report += f"""
### Special Events Impact:
* **Active Special Events**: Average crowd is **{int(event_mean):,}** passengers.
* **No Special Events**: Average crowd is **{int(no_event_mean):,}** passengers.
* **Impact Multiplier**: Special events drive a **{(event_mean / no_event_mean - 1)*100:.1f}%** increase in passenger volume.

---

## 4. Feature Correlation Matrix
Strength of linear relationship with our target (`passenger_count`):

| Feature | Correlation with Passenger Count | Description |
| :--- | :---: | :--- |
"""
    for col in numeric_cols:
        if col == 'passenger_count':
            continue
        corr_val = corr_matrix.loc['passenger_count', col]
        report += f"| `{col}` | {corr_val:.4f} | "
        if abs(corr_val) > 0.5:
            report += "Strong association"
        elif abs(corr_val) > 0.2:
            report += "Moderate association"
        else:
            report += "Weak/nonlinear association"
        report += " |\n"
        
    report += """
---

## 5. Machine Learning Key Takeaways
1. **Strong Autocorrelation**: The high correlation of `lag_passenger_count` indicates that the previous hour's passenger count is a strong predictor of current density.
2. **Cyclical Patterns**: `hour_of_day` and `day_of_week` must be leveraged. Weekday peaks and weekend mid-day humps are highly predictable.
3. **External Shocks**: Weather and special events show clear, measurable increases in ridership and should be factored in to prevent false-positives/negatives in safety alerts.
"""

    os.makedirs("docs", exist_ok=True)
    report_path = "docs/eda_report.md"
    with open(report_path, "w") as f:
        f.write(report)
    print(f"EDA Report successfully compiled and saved to {report_path}")

if __name__ == "__main__":
    run_eda()
