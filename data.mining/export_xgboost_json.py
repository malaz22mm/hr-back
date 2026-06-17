"""
Export XGBoost booster to compact JSON for pure TypeScript inference (Vercel-safe).
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path

import joblib

ROOT = Path(__file__).resolve().parent
JOBLIB_PATH = ROOT / "models" / "attrition_v1.joblib"
SCHEMA_PATH = ROOT / "models" / "feature_schema.json"
OUT_LOCAL = ROOT / "models" / "classifier.json"
OUT_REPO = ROOT.parent / "models" / "classifier.json"
OUT_META = ROOT.parent / "models" / "classifier.meta.json"


def export() -> None:
    pipeline = joblib.load(JOBLIB_PATH)
    classifier = pipeline.named_steps["classifier"]
    schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))

    classifier.get_booster().save_model(str(OUT_LOCAL))
    shutil.copy2(OUT_LOCAL, OUT_REPO)

    meta = {
        "modelVersion": schema.get("modelVersion", "attrition-xgb-v1"),
        "transformedFeatureCount": schema.get("transformedFeatureCount"),
        "exportMethod": "xgboost-json",
        "treeCount": classifier.n_estimators,
    }
    OUT_META.write_text(json.dumps(meta, indent=2), encoding="utf-8")

    size_kb = OUT_REPO.stat().st_size / 1024
    print(f"Exported: {OUT_REPO} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    export()
