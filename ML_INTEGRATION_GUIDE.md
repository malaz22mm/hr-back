# ML Integration Guide

This project runs **attrition prediction** inside the NestJS backend using **ONNX** (no external HTTP ML API).

## Architecture

```
Frontend  →  NestJS (Vercel)  →  PostgreSQL (features)
                    ↓
            onnxruntime-node (same process)
                    ↓
            classifier_v1.onnx + preprocessor_config.json
```

For **local development**, set `ML_BACKEND=python` to use `data.mining/predict.py` via `child_process` instead of ONNX.

## Model artifacts

| File | Purpose |
|------|---------|
| `models/preprocessor_config.json` | Scaler + one-hot parameters (TypeScript preprocessing) |
| `models/classifier_v1.onnx` | XGBoost classifier |
| `data.mining/models/attrition_v1.joblib` | Full Python pipeline (local / retraining) |
| `data.mining/models/feature_schema.json` | Input column order |

## API endpoint

```http
GET /employees/:id/predictions/attrition
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "employeeId": 0,
  "employeeName": "John Martinez",
  "predictedAttrition": true,
  "attritionProbability": 0.541742,
  "riskLevel": "Medium",
  "suggestedAttritionRiskClassId": 2,
  "modelVersion": "attrition-xgb-v1",
  "computedAt": "2026-06-16T12:00:00.000Z"
}
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ML_BACKEND` | `onnx` | `onnx` (Vercel/production) or `python` (local) |
| `PYTHON_PATH` | `python` | Python executable when `ML_BACKEND=python` |

## Column mapping (DB → model)

PostgreSQL `Employees` columns map directly (snake_case). NestJS computes six extra fields:

- `over_time_hours_last_month` — from `Attendance_Logs` + `WorkShift`
- `late_arrivals_last_month`
- `absence_days_last_month`
- `absence_ratio`
- `accepted_vacations` — `Vacation_Request` where `approval_status = 1`
- `rejected_vacations` — `approval_status = 2`

Booleans `gender` and `over_time` are sent to the model as `0` / `1`.

**Not sent to model:** `id`, `name`, `name_code`, `attrition_risk_class_id`

## Retraining (offline only)

```bash
cd data.mining
pip install -r requirements.txt
python export_model.py
python convert_to_onnx.py
```

Then commit updated files under `models/` and `data.mining/models/`.

## Local testing

```bash
# Terminal 1 — ONNX (default)
npm run start:dev

# Terminal 2 — sign in and call prediction
curl -H "Authorization: Bearer <token>" http://localhost:3000/employees/0/predictions/attrition
```

Python backend locally:

```bash
set ML_BACKEND=python
npm run start:dev
```

## Vercel deployment

`vercel.json` includes `models/**` in serverless function files. Push to GitHub; Vercel redeploys automatically.

**250 MB limit:** `onnxruntime-node` bundles all OS binaries (~254 MB). The `vercel-build` script runs `scripts/prune-onnx-for-vercel.js` on Vercel to keep only `linux/x64` (~38 MB). Do not remove that step.

If the build still fails size checks, set `VERCEL_ANALYZE_BUILD_OUTPUT=1` in Vercel env vars and inspect the build report.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ML model is not loaded` | Ensure `models/classifier_v1.onnx` exists and is deployed |
| Probability differs from notebook | Re-run `export_model.py` + `convert_to_onnx.py` |
| Python backend fails on Vercel | Use `ML_BACKEND=onnx` (Python does not run on Vercel) |
