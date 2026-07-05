import pandas as pd
import numpy as np

# Step 1 & 6: Load dataset
df = pd.read_csv("Employees_Dataset_Final_With_Shifts.csv")

# Ensure reproducibility for the synthetic generation
np.random.seed(42)

# Step 2: Normalize features to [0, 1] to prevent magnitude domination
def min_max_scale(series):
    return (series - series.min()) / (series.max() - series.min())

age_scaled = min_max_scale(df['age'])
absence_scaled = min_max_scale(df['absence_days_last_month'])
workload_scaled = min_max_scale(df['workload_pressure_index'])
distance_scaled = min_max_scale(df['distance_from_home'])
wl_balance_scaled = min_max_scale(df['work_life_balance_id'])
overtime_binary = df['over_time'].astype(int)

# Create interaction term: Workload exacerbated by Overtime
stress_interaction = workload_scaled * overtime_binary

# Calculate base deterministic score
base_score = (
    0.40 * age_scaled + 
    0.35 * absence_scaled + 
    0.15 * stress_interaction + 
    0.05 * distance_scaled - 
    0.05 * wl_balance_scaled
)

# Introduce Stochastic Noise (Normal distribution) for realism/overlap
# Standard deviation of 0.15 provides significant but constrained variation
noise = np.random.normal(0, 0.15, size=len(df))
raw_latent_score = base_score + noise

# Scale to final 0-100 range
health_risk_score = min_max_scale(raw_latent_score) * 100

# Step 3 & 4: Generate Categories using empirical percentiles
# Target split: 60% Healthy, 25% Minor, 10% Moderate, 5% Serious
bins = [
    -np.inf, 
    np.percentile(health_risk_score, 60), 
    np.percentile(health_risk_score, 85), 
    np.percentile(health_risk_score, 95), 
    np.inf
]

# Fixed: Removed the trailing comma and corrected the comment syntax
labels = [0, 1, 2, 3] # 0: Healthy, 1: Minor Chronic Condition, 2: Moderate Health Issues, 3: Serious Health Issues

# Fixed: Changed column name to 'health_state_id' and cast to int
df['health_state_id'] = pd.cut(health_risk_score, bins=bins, labels=labels).astype(int)

# Step 5: Validation Report
print("--- SYNTHETIC DATA VALIDATION REPORT ---")
print("\n1. Category Distribution (Target: 60/25/10/5):")
print((df['health_state_id'].value_counts(normalize=True) * 100).round(2).to_string())

print("\n2. Average Age per Category (Should increase progressively):")
print(df.groupby('health_state_id', observed=True)['age'].mean().round(1).to_string())

print("\n3. Average Absenteeism per Category (Should increase progressively):")
print(df.groupby('health_state_id', observed=True)['absence_days_last_month'].mean().round(1).to_string())

print("\n4. Overlap Check (Age Range per Category - min to max):")
print(df.groupby('health_state_id', observed=True)['age'].agg(['min', 'max']).to_string())

# Step 6: Output
output_filename = "Employees_Dataset_With_Synthetic_Health.csv"
df.to_csv(output_filename, index=False)
print(f"\nSuccess: Dataset saved as '{output_filename}' without modifying original features.")