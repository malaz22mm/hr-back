# ML Integration Guide

This project runs **attrition prediction** inside the NestJS backend using **pure TypeScript** (no external HTTP ML API, no native ML binaries).

## Architecture

```
Frontend  →  NestJS (Vercel)  →  PostgreSQL (features)
                    ↓
            XGBoost JSON tree traversal (same process)
                    ↓
            classifier.json + preprocessor_config.json
```

For **local development**, set `ML_BACKEND=python` to use `data.mining/predict.py` via `child_process` instead of the JS predictor.

## Model artifacts

| File | Purpose |
|------|---------|
| `models/preprocessor_config.json` | Scaler + one-hot parameters (TypeScript preprocessing) |
| `models/classifier.json` | XGBoost booster (~230 KB, JSON tree format) |
| `models/classifier.meta.json` | Model version metadata |
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
| `ML_BACKEND` | `js` | `js` (Vercel/production) or `python` (local) |
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
python export_xgboost_json.py
```

Then commit updated files under `models/` and `data.mining/models/`.

## Local testing

```bash
# Terminal 1 — JS predictor (default)
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

Inference uses only small JSON model files (~230 KB) — no `onnxruntime-node` or other large native binaries, so the function stays well under Vercel’s 250 MB limit.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ML model is not loaded` | Ensure `models/classifier.json` exists and is deployed |
| Probability differs from notebook | Re-run `export_model.py` + `export_xgboost_json.py` |
| Python backend fails on Vercel | Use default `ML_BACKEND=js` (Python does not run on Vercel) |
