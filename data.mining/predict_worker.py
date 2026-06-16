"""
Persistent stdin/stdout worker for NestJS child_process integration (local/VPS).

Each input line: {"features": {...}}
Each output line: {"predictedAttrition": ..., "attritionProbability": ...}
"""
from __future__ import annotations

import json
import sys

from predict import predict


def main() -> int:
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            payload = json.loads(line)
            features = payload["features"]
            result = predict(features)
            sys.stdout.write(json.dumps(result) + "\n")
            sys.stdout.flush()
        except Exception as exc:  # noqa: BLE001
            err = {"error": str(exc)}
            sys.stdout.write(json.dumps(err) + "\n")
            sys.stdout.flush()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
