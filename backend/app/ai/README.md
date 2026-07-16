# AI Module

Houses all machine learning and AI prediction components for Metro crowd intelligence.

## Purpose

Contains ML model loaders, inference pipelines, and AI-driven prediction services.
This module will integrate with trained models from the `datasets/` preprocessing pipeline.

## Planned Components (Future Milestones)

| File | Description |
|------|-------------|
| `crowd_predictor.py` | LSTM/CNN model for crowd density prediction |
| `anomaly_detector.py` | Isolation Forest for crowd anomaly detection |
| `schedule_optimizer.py` | Reinforcement Learning for dynamic scheduling |
| `passenger_counter.py` | CV-based passenger counting from CCTV feeds |
| `model_loader.py` | Utility to load trained `.pkl` / `.h5` / `.pt` models |
| `feature_engineering.py` | Real-time feature extraction for inference |

## Data Pipeline Integration

```
datasets/processed/   →   feature_engineering.py   →   model_loader.py
                                                              ↓
                                                    crowd_predictor.py
                                                    anomaly_detector.py
                                                    schedule_optimizer.py
```

## Status

**NOT implemented in Milestone 1.** No AI code is present.
Integration begins in Milestone 3 after the database layer (M2) is established.
