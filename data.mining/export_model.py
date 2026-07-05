"""
Train the attrition model (same logic as main.ipynb cell 11) and export
an inference-only pipeline (preprocessor + XGBClassifier, no SMOTE).
"""
from __future__ import annotations

import json
from pathlib import Path

import joblib
import pandas as pd
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import GridSearchCV, StratifiedKFold, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from xgboost import XGBClassifier

ROOT = Path(__file__).resolve().parent
# Updated to reference the new dataset
DATA_PATH = ROOT / "Employees_Dataset_With_Synthetic_Health.csv"
MODELS_DIR = ROOT / "models"
JOBLIB_PATH = MODELS_DIR / "attrition_v1.joblib"
SCHEMA_PATH = MODELS_DIR / "feature_schema.json"

# Added health_state_id to categorical columns
CATEGORICAL_COLS = [
    "marital_status_id",
    "job_role_id",
    "business_travel_id",
    "department_id",
    "education_id",
    "environment_satisfaction_id",
    "job_involvement_id",
    "job_satisfaction_id",
    "performance_rating_id",
    "relationship_satisfaction_id",
    "work_life_balance_id",
    "work_shift_id",
    "health_state_id", 
]

COLS_TO_DROP = ["id", "name", "name_code", "attrition_risk_class_id"]


def load_training_frame(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path)
    df = df.drop(columns=[c for c in COLS_TO_DROP if c in df.columns])
    for col in df.select_dtypes(include=["bool"]).columns:
        df[col] = df[col].astype(int)
    return df


def train_and_export() -> None:
    df = load_training_frame(DATA_PATH)
    x = df.drop(columns=["attrition"])
    y = df["attrition"].astype(int)

    feature_names = list(x.columns)
    numerical_cols = [c for c in feature_names if c not in CATEGORICAL_COLS]

    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.2, random_state=42, stratify=y
    )

    preprocessor = ColumnTransformer(
        [
            ("num", StandardScaler(), numerical_cols),
            (
                "cat",
                OneHotEncoder(drop="first", handle_unknown="ignore"),
                CATEGORICAL_COLS,
            ),
        ]
    )

    training_pipeline = ImbPipeline(
        [
            ("preprocessor", preprocessor),
            ("smote", SMOTE(random_state=42)),
            (
                "classifier",
                XGBClassifier(eval_metric="logloss", random_state=42),
            ),
        ]
    )

    param_grid = {
        "classifier__max_depth": [3, 5],
        "classifier__learning_rate": [0.05, 0.1],
        "classifier__n_estimators": [100, 200],
    }

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    grid_search = GridSearchCV(
        training_pipeline,
        param_grid,
        cv=cv,
        scoring="f1",
        return_train_score=True,
        n_jobs=-1,
    )
    grid_search.fit(x_train, y_train)

    best = grid_search.best_estimator_
    inference_pipeline = Pipeline(
        [
            ("preprocessor", best.named_steps["preprocessor"]),
            ("classifier", best.named_steps["classifier"]),
        ]
    )

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(inference_pipeline, JOBLIB_PATH)

    schema = {
        "modelVersion": "attrition-xgb-v1",
        "featureColumns": feature_names,
        "categoricalColumns": CATEGORICAL_COLS,
        "numericalColumns": numerical_cols,
        "targetColumn": "attrition",
        "bestParams": grid_search.best_params_,
    }
    SCHEMA_PATH.write_text(json.dumps(schema, indent=2), encoding="utf-8")

    y_proba = inference_pipeline.predict_proba(x_test)[:, 1]
    y_pred = inference_pipeline.predict(x_test)
    accuracy = (y_pred == y_test).mean()
    print(f"Best params: {grid_search.best_params_}")
    print(f"Holdout accuracy: {accuracy:.4f}")
    print(f"Exported: {JOBLIB_PATH}")
    print(f"Schema:   {SCHEMA_PATH}")


if __name__ == "__main__":
    train_and_export()