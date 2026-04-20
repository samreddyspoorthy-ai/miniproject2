# EcoVision AI Nexus

EcoVision AI Nexus is a production-style smart waste classification app with a FastAPI backend and a React + Tailwind frontend. It supports image upload and live webcam capture, classifies waste into `Recyclable`, `Non-recyclable`, `Organic`, and `Hazardous`, and shows material-specific guidance such as `plastic`, `glass`, `food`, or `battery`.

## What changed

- Rebuilt the frontend into an app-like interface with modules for upload, webcam, results, and recycling suggestions
- Added deterministic webcam capture and stable result rendering
- Simplified the backend into a focused waste-classification API
- Fixed inference preprocessing with:
  - RGB conversion
  - fixed `224x224` resize
  - MobileNetV2-style normalization to `[-1, 1]`
  - no augmentation during inference
  - stable label mapping and top-3 output
- Added result guidance with recycling suggestions, awareness tips, and system-goal messaging

## Tech stack

- Frontend: React, Vite, Tailwind CSS
- Backend: FastAPI
- Model runtime: MobileNetV2 TFLite when available
- Fallback: deterministic classifier that keeps outputs stable when no trained model file is bundled

## Run locally

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd ecovision-ai-nexus/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Optional MobileNetV2 model

Place a trained MobileNetV2 TFLite file here:

```bash
ecovision-ai-nexus/models/mobilenet_v2_waste.tflite
```

Optional labels file:

```bash
ecovision-ai-nexus/models/labels.txt
```

If the model is missing, EcoVision still runs with deterministic fallback inference so upload and webcam flows remain stable during development.
