"""
Data Preparation for LSTM Training
Converts CSV data into sequences for neural network training
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import pickle

print("=" * 80)
print("📊 Data Preparation for ML Training")
print("=" * 80)
print()

# ============================================================================
# STEP 1: Load Data
# ============================================================================
print("Step 1: Loading forecast data...")

forecast_df = pd.read_csv('data/PassengerDemandForecast.csv')
print(f"   ✅ Loaded {len(forecast_df):,} records")
print(f"   Columns: {list(forecast_df.columns)}")
print()

# ============================================================================
# STEP 2: Prepare Features
# ============================================================================
print("Step 2: Preparing features...")

# Sort by date and hour
forecast_df['forecast_date'] = pd.to_datetime(forecast_df['forecast_date'])
forecast_df = forecast_df.sort_values(['station_id', 'forecast_date', 'forecast_hour'])

# Get one station's data (we'll generalize later)
station_1_data = forecast_df[forecast_df['station_id'] == 1].copy()
print(f"   ✅ Using {len(station_1_data):,} records from Station 1")
print()

# ============================================================================
# STEP 3: Create Training Data
# ============================================================================
print("Step 3: Creating sequences for LSTM...")

# Get passenger counts
data = station_1_data[['predicted_passengers']].values
print(f"   Data shape: {data.shape}")

# Normalize data (0-1 range)
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(data)

# Create sequences (use past 24 hours to predict next hour)
sequence_length = 24
X, y = [], []

for i in range(len(scaled_data) - sequence_length):
    X.append(scaled_data[i:i+sequence_length])
    y.append(scaled_data[i+sequence_length])

X = np.array(X)
y = np.array(y)

print(f"   ✅ Created {len(X):,} sequences")
print(f"   X shape: {X.shape} (samples, time_steps, features)")
print(f"   y shape: {y.shape}")
print()

# ============================================================================
# STEP 4: Split Train/Test
# ============================================================================
print("Step 4: Splitting into train/test...")

split_index = int(len(X) * 0.8)  # 80% train, 20% test
X_train = X[:split_index]
y_train = y[:split_index]
X_test = X[split_index:]
y_test = y[split_index:]

print(f"   ✅ Training samples: {len(X_train):,}")
print(f"   ✅ Testing samples: {len(X_test):,}")
print()

# ============================================================================
# STEP 5: Save for Training
# ============================================================================
print("Step 5: Saving prepared data...")

# Save training data
np.save('data/X_train.npy', X_train)
np.save('data/y_train.npy', y_train)
np.save('data/X_test.npy', X_test)
np.save('data/y_test.npy', y_test)

# Save scaler (needed to inverse-transform predictions)
with open('models/scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

print(f"   ✅ Saved X_train.npy ({X_train.nbytes / 1e6:.1f} MB)")
print(f"   ✅ Saved y_train.npy ({y_train.nbytes / 1e6:.1f} MB)")
print(f"   ✅ Saved X_test.npy ({X_test.nbytes / 1e6:.1f} MB)")
print(f"   ✅ Saved y_test.npy ({y_test.nbytes / 1e6:.1f} MB)")
print(f"   ✅ Saved scaler.pkl")
print()

print("=" * 80)
print("✅ DATA PREPARATION COMPLETE!")
print("=" * 80)
print()
print("Next: Train LSTM model using this data")
print("Command: python backend/train_lstm.py")