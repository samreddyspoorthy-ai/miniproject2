# EcoVision AI Nexus Backend

FastAPI backend for waste classification, bounding-box localization, recycling guidance, and Open-Meteo environmental context.

## Run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## MobileNetV2 model

Place a trained TensorFlow Lite model at:

```bash
backend/models/mobilenet_v2_waste.tflite
```

If no model is present, the API still runs using a heuristic fallback classifier so the full demo works end-to-end.
