import subprocess
import os

print("=" * 70)
print("        METROFLOW COMPLETE EDA PIPELINE")
print("=" * 70)

scripts = [
    "01_dataset_profiler.py",
    "02_data_quality.py",
    "03_data_cleaning.py",
    "04_feature_engineering.py",
    "05_visualizations.py",
    "06_business_insights.py"
]

src_folder = "src"

for script in scripts:

    print("\n" + "=" * 70)
    print(f"Running: {script}")
    print("=" * 70)

    subprocess.run(
        ["python", script],
        cwd=src_folder
    )

print("\n" + "=" * 70)
print("ALL STEPS COMPLETED SUCCESSFULLY")
print("=" * 70)

print("\nOutputs Generated:")
print("✓ Clean Dataset")
print("✓ Feature Engineered Dataset")
print("✓ Graphs")
print("✓ Business Insight Report")