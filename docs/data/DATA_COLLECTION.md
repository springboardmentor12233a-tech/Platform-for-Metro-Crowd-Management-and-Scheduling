# Data Collection Log

> **Last Updated:** July 7, 2026

---

## Data Sources Summary

| # | Dataset Name | Source | Category | Format | Size | License | Downloaded |
|---|---|---|---|---|---|---|---|
| 1 | Delhi Metro Dataset – EDA & Visualization | Kaggle | Ticketing | CSV | 13 MB | CC0-1.0 | ✅ Jul 6 |
| 2 | Transport for London Entry & Exit Dataset | Kaggle | Entry/Exit | XLSX + CSV | 122 MB | CC BY 4.0 | ✅ Jul 6 |
| 3/4 | Delhi Metro Hourly Footfall / Entry-Exit | Delhi Transport Stack | Footfall | Web Portal | — | Govt Open Data | ⏳ Requires browser |
| 5 | Public Transport Journeys by Type (London) | London Datastore | Ridership | CSV | 14 KB | OGL v2 | ✅ Jul 6 |
| 6 | Metro Network Dynamics (Delhi) | Kaggle | Network | CSV | 22 KB | CC0-1.0 | ✅ Jul 6 |
| 7 | Indian Railways Dataset | Kaggle | Schedules | JSON | 95 MB | CC0-1.0 | ✅ Jul 6 |
| 8 | Public Transport Delays with Weather & Events | Kaggle | Delays | CSV | 262 KB | MIT | ✅ Jul 6 |
| 9 | Rail Transport Datasets Collection | Kaggle | Collection | — | — | Various | 🔖 Bookmark only |
| 10 | MetroPT-3 Train Dataset | Kaggle | Sensor | CSV | 209 MB | CC BY 4.0 | ✅ Jul 6 |
| — | MTA Subway Turnstile Usage Data (2022+) | NYC Open Data | Entry/Exit | CSV | 966 MB | Public | ✅ Jul 1 |

**Total Data Collected:** ~1.4 GB across 8 downloadable datasets

---

## Download Links

| # | URL |
|---|-----|
| 1 | https://www.kaggle.com/datasets/nikhilkumar766/delhi-metro-dataset |
| 2 | https://www.kaggle.com/datasets/olisao/transport-for-london-tfl-entry-and-exit-dataset |
| 3/4 | https://delhi.transportstack.in/data-services |
| 5 | https://data.london.gov.uk/dataset/public-transport-journeys-by-type-of-transport-ep8ow |
| 6 | https://www.kaggle.com/datasets/arashnic/metro-network-dynamics |
| 7 | https://www.kaggle.com/datasets/sripaadsrinivasan/indian-railways-dataset |
| 8 | https://www.kaggle.com/datasets/khushikyad001/public-transport-delays-with-weather-and-events |
| 9 | N/A (Bookmark only — Rail Transport Datasets Collection) |
| 10 | https://www.kaggle.com/datasets/anshtanwar/metro-train-dataset |
| MTA | https://data.ny.gov/ (search "MTA Subway Turnstile") |

---

## File Locations

```
data/
├── ticketing/
│   └── delhi_metro_updated.csv           (150,000 rows × 10 cols)
├── entry_exit/
│   ├── MTA_Subway_Turnstile_...csv       (10,963,252 rows × 10 cols)
│   └── TFL Entry and Exit Data/
│       ├── Data/
│       │   ├── TfL_stations.csv
│       │   ├── multi-year-station-entry-and-exit-figures.xlsx
│       │   ├── AnnualisedEntryExit_2017.xlsx
│       │   ├── AnnualisedEntryExit_2018.xlsx
│       │   ├── AnnualisedEntryExit_2019.xlsx
│       │   ├── AC2020_AnnualisedEntryExit.xlsx
│       │   └── AC2021_AnnualisedEntryExit.xlsx
│       ├── Geodata/
│       │   └── Stations_20220221.csv
│       └── Tube maps/                    (PDF maps 2012–2022)
├── ridership/
│   └── tfl-journeys-type.csv             (Apr 2010 – May 2026)
├── network_dynamics/
│   └── Delhi-Metro-Network.csv           (Station network topology)
├── schedules/
│   ├── stations.json                     (8,990 railway stations, GeoJSON)
│   ├── trains.json                       (5,208 trains, GeoJSON)
│   └── schedules.json                    (79 MB, full schedule data)
├── delays/
│   └── public_transport_delays.csv       (Synthetic delay + weather data)
└── sensor/
    └── MetroPT3(AirCompressor).csv       (Sensor readings, 209 MB)
```

---

## Data Quality Notes

| Issue | Dataset | Details |
|-------|---------|---------|
| **Synthetic data** | #8 Delays | Flagged as "synthetic" on Kaggle — simulated, not real-world |
| **Cumulative counters** | MTA Turnstile | Entries/Exits are cumulative — must compute `diff()` per turnstile |
| **Not metro data** | #7 Indian Railways | Long-distance rail, not metro — schedule structure is adaptable |
| **Mechanical sensors** | #10 MetroPT-3 | Pressure/temperature/motor — predictive maintenance, not crowd data |
| **Duplicate URL** | #3 and #4 | Both point to same `delhi.transportstack.in/data-services` |
| **Missing values** | #1 Delhi Metro | 1% missing in Passengers/Ticket_Type, 17% missing in Remarks |
