"""
Single-shot attrition inference for local / VPS use.

Usage:
  echo '{"features": {...}}' | python predict.py

Stdout:
  {"predictedAttrition": false, "attritionProbability": 0.23, "modelVersion": "attrition-xgb-v1"}
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import joblib
import pandas as pd

ROOT = Path(__file__).resolve().parent
JOBLIB_PATH = ROOT / "models" / "attrition_v1.joblib"
SCHEMA_PATH = ROOT / "models" / "feature_schema.json"

_pipeline = None
_schema = None


def _load_assets():
    global _pipeline, _schema
    if _pipeline is None:
        _pipeline = joblib.load(JOBLIB_PATH)
    if _schema is None:
        _schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
    return _pipeline, _schema


def predict(features: dict) -> dict:
    pipeline, schema = _load_assets()
    columns = schema["featureColumns"]
    row = pd.DataFrame([{col: features[col] for col in columns}])
    proba = float(pipeline.predict_proba(row)[0, 1])
    predicted = bool(proba >= 0.5)
    return {
        "predictedAttrition": predicted,
        "attritionProbability": round(proba, 6),
        "modelVersion": schema.get("modelVersion", "attrition-xgb-v1"),
    }


def main() -> int:
    try:
        raw = sys.stdin.read().strip()
        if not raw:
            raise ValueError("Expected JSON on stdin")
        payload = json.loads(raw)
        features = payload.get("features")
        if not isinstance(features, dict):
            raise ValueError("Missing 'features' object")
        result = predict(features)
        sys.stdout.write(json.dumps(result))
        sys.stdout.flush()
        return 0
    except Exception as exc:  # noqa: BLE001
        sys.stderr.write(str(exc))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
