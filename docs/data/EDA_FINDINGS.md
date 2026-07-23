# EDA Findings & Insights

> **Last Updated:** July 7, 2026

---

## 1. Delhi Metro Ticketing Data

**Script:** `eda_delhi_metro.py`  
**Status:** ✅ Analyzed

### Key Findings

#### 1.1 Data Quality
- **150,000 records** spanning Jan 2022 – Dec 2024 (3 full years)
- Very clean dataset: only 1% missing in `Passengers` and `Ticket_Type`
- `Remarks` column has 17% missing — acceptable for an optional context field
- No unusual duplicate issues

#### 1.2 Station Traffic Patterns
- **Rajiv Chowk** is the dominant origin station with 15,593 trips — **3x more** than the 3rd busiest station (New Delhi at 8,173)
- **Noida City Centre** is the 2nd busiest origin (12,049 trips)
- Destinations are far more evenly distributed — Hauz Khas, Kirti Nagar, Janakpuri West all around ~6,300 trips each
- **Implication:** Origin stations have high asymmetry (few stations generate most traffic), while destinations are spread across the network

#### 1.3 Ticket Type Distribution
| Type | Count | Share |
|------|-------|-------|
| Tourist Card | 59,193 | 39.8% |
| Single Journey | 37,341 | 25.1% |
| Smart Card | 37,244 | 25.0% |
| Return | 14,722 | 9.9% |

- Tourist Cards dominate, suggesting significant tourist/casual rider volume
- Smart Card and Single Journey are nearly equal

#### 1.4 Temporal Patterns
- **Day-of-week:** Ridership is remarkably consistent across all 7 days (< 3% variance between Saturday peak and Friday low)
- Saturday is technically the busiest day, which is unusual for a metro system (typically weekdays dominate). This could indicate tourist/leisure-heavy usage patterns

#### 1.5 Context Tags (Remarks)
- Five categories, nearly evenly distributed: `off-peak` (24,859), `festival` (24,812), `maintenance` (24,771), `weekend` (24,710), `peak` (24,591)
- The even distribution suggests this may be a synthesized/augmented field
- Still valuable for training classification models to predict demand under different conditions

#### 1.6 Revenue & Distance
- Average fare: ₹105.12 per trip
- Average distance: 5.49 km
- Fare range: ₹10 – ₹200
- Distance range: 0.5 – 63.03 km
- Average passengers per record: 20 (suggesting group/aggregate records)

### Insights for MetroFlow

| Insight | Action |
|---------|--------|
| Rajiv Chowk & Noida City Centre are major bottlenecks | Prioritize these stations in the Crowd Monitoring module |
| Origin traffic is highly skewed | AI Prediction should weight top stations differently |
| Tourist Cards are dominant | Consider tourist-specific alerts and notifications |
| Day-of-week is flat | Scheduling optimization should focus on hourly patterns rather than daily |
| Context tags exist | Use `Remarks` as a feature for demand prediction model |

---

## 2. MTA Subway Turnstile Usage Data

**Script:** `eda_mta_turnstile.py`  
**Status:** 🟡 Script created, pending full execution

### Preliminary Observations (from raw data inspection)

#### 2.1 Data Structure
- **~11 million rows** — massive dataset
- Each row = one turnstile reading at a 4-hour interval
- Identified by `C/A` (Control Area) + `Unit` + `SCP` (turnstile position)
- Lines are concatenated codes (e.g., `NQR456W` = N, Q, R, 4, 5, 6, W trains)
- Three divisions: BMT, IND, IRT

#### 2.2 Critical Data Handling
- `Entries` and `Exits` are **cumulative counters** (not per-period counts)
- Must compute `diff()` within each turnstile group
- Counter resets produce negative values → must be filtered
- Anomalous spikes > 10,000 per 4-hour window → must be capped/removed

#### 2.3 Expected Analyses (when executed)
- Rush hour identification (7–11 AM, 3–7 PM expected peaks)
- Weekday vs weekend ridership gap (expect 40-60% drop on weekends)
- Top stations by total foot traffic
- Day × Hour heatmap for scheduling optimization
- Monthly trend analysis (post-COVID recovery patterns)
- Line-by-line traffic comparison

---

## 3. Other Datasets (Pending EDA)

### 3a. TfL Entry & Exit Data (#2)
- Multi-year annual counts from 2007–2021 (15 years)
- Includes geodata with lat/lng for map visualizations
- Multiple Excel files per year — need to merge

### 3b. TfL Journeys by Transport (#5)
- Monthly journey counts by transport type (Bus, Underground, DLR, Tram, Overground)
- Apr 2010 – May 2026 — 16 years of data
- Useful for cross-modal comparison and long-term trend analysis

### 3c. Metro Network Dynamics (#6)
- Delhi Metro station topology: IDs, names, GPS coordinates, lines, layout types
- Small dataset (stations only) — useful as a reference/lookup table
- Can be used to build a network graph visualization

### 3d. Transport Delays (#8)
- 24 columns including weather, events, congestion, holidays
- Perfect for training a delay prediction model
- **Synthetic data** — document this limitation in final project

### 3e. Indian Railways (#7)
- GeoJSON format with 8,990 stations and 5,208 trains
- Schedule data is 79 MB — full stop-level timing
- Not metro-specific but schedule structure is adaptable

### 3f. MetroPT-3 Sensor (#10)
- 10-second interval sensor readings (pressure, temperature, motor current)
- For predictive maintenance, not crowd monitoring
- Could be a bonus feature if time permits
