"""
Export preprocessor parameters for TypeScript and XGBoost classifier to ONNX.
"""
from __future__ import annotations

import json
from pathlib import Path

import joblib
import numpy as np
import onnx
import pandas as pd
from onnxmltools import convert_xgboost
from onnxmltools.convert.common.data_types import FloatTensorType as OnnxFloatTensorType

ROOT = Path(__file__).resolve().parent
JOBLIB_PATH = ROOT / "models" / "attrition_v1.joblib"
SCHEMA_PATH = ROOT / "models" / "feature_schema.json"
PREPROCESSOR_CONFIG_PATH = ROOT / "models" / "preprocessor_config.json"
CLASSIFIER_ONNX_PATH = ROOT / "models" / "classifier_v1.onnx"
REPO_PREPROCESSOR_PATH = ROOT.parent / "models" / "preprocessor_config.json"
REPO_CLASSIFIER_ONNX_PATH = ROOT.parent / "models" / "classifier_v1.onnx"


def export() -> None:
    pipeline = joblib.load(JOBLIB_PATH)
    schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
    feature_columns = schema["featureColumns"]
    categorical_cols = schema["categoricalColumns"]
    numerical_cols = schema["numericalColumns"]

    preprocessor = pipeline.named_steps["preprocessor"]
    classifier = pipeline.named_steps["classifier"]

    scaler = preprocessor.named_transformers_["num"]
    encoder = preprocessor.named_transformers_["cat"]

    sample = pd.DataFrame(
        {col: [0.0] for col in feature_columns},
    )
    transformed = preprocessor.transform(sample)
    n_out = int(transformed.shape[1])

    config = {
        "featureColumns": feature_columns,
        "categoricalColumns": categorical_cols,
        "numericalColumns": numerical_cols,
        "scalerMean": scaler.mean_.tolist(),
        "scalerScale": scaler.scale_.tolist(),
        "oneHotCategories": {
            col: cats.tolist()
            for col, cats in zip(categorical_cols, encoder.categories_, strict=True)
        },
        "transformedFeatureCount": n_out,
        "modelVersion": schema.get("modelVersion", "attrition-xgb-v1"),
    }

    PREPROCESSOR_CONFIG_PATH.write_text(
        json.dumps(config, indent=2),
        encoding="utf-8",
    )
    REPO_PREPROCESSOR_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPO_PREPROCESSOR_PATH.write_text(
        json.dumps(config, indent=2),
        encoding="utf-8",
    )

    onnx_clf = convert_xgboost(
        classifier,
        initial_types=[("input", OnnxFloatTensorType([None, n_out]))],
        target_opset=15,
    )

    CLASSIFIER_ONNX_PATH.parent.mkdir(parents=True, exist_ok=True)
    onnx.save_model(onnx_clf, str(CLASSIFIER_ONNX_PATH))
    onnx.save_model(onnx_clf, str(REPO_CLASSIFIER_ONNX_PATH))

    print(f"Preprocessor config: {REPO_PREPROCESSOR_PATH}")
    print(f"Classifier ONNX:     {REPO_CLASSIFIER_ONNX_PATH}")
    print(f"Transformed dims:    {n_out}")


if __name__ == "__main__":
    export()
