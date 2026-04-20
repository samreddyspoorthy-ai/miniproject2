from __future__ import annotations

import json
import logging
from datetime import datetime
from uuid import uuid4

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import ANALYSIS_CACHE_DIR, CACHE_DIR
from app.schemas import (
    AnalysisResponse,
    ChatRequest,
    ChatResponse,
    OrganizationResponse,
    PredictionDebug,
    PredictionItem,
    ScheduleRequest,
    ScheduleResponse,
)
from app.services.chatbot import answer_question
from app.services.classifier import WasteClassifier
from app.services.intelligence import (
    CITY_STATISTICS,
    GOVERNMENT_INITIATIVES,
    build_community_impact,
    build_education_module,
    build_environmental_metrics,
    build_gamification,
    build_item_counts,
    build_lifecycle,
    build_nearby_centers,
    build_risk_assessment,
    build_schedule_options,
    build_weight_estimate,
)
from app.services.organizations import list_organizations
from app.services.recycling import get_awareness_tip, get_recycling_suggestion
from app.utils.image_ops import file_hash, load_image, normalized_image_hash, save_cached_image


logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("ecovision.api")

app = FastAPI(title="EcoVision AI Nexus API", version="4.0.0")
classifier = WasteClassifier()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/cache", StaticFiles(directory=CACHE_DIR), name="cache")


def _cache_path(cache_key: str) -> str:
    return str(ANALYSIS_CACHE_DIR / f"{cache_key}.json")


def _read_cached_response(cache_key: str) -> AnalysisResponse | None:
    try:
        with open(_cache_path(cache_key), "r", encoding="utf-8") as handle:
            return AnalysisResponse.model_validate(json.load(handle))
    except FileNotFoundError:
        return None
    except Exception:
        logger.warning("Failed to read cached response for key=%s", cache_key, exc_info=True)
        return None


def _write_cached_response(cache_key: str, response: AnalysisResponse) -> None:
    with open(_cache_path(cache_key), "w", encoding="utf-8") as handle:
        json.dump(response.model_dump(), handle, indent=2)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/organizations", response_model=OrganizationResponse)
def get_organizations(category: str | None = None, material: str | None = None) -> OrganizationResponse:
    return OrganizationResponse(organizations=list_organizations(category=category, material=material))


@app.post("/api/chat", response_model=ChatResponse)
def chat_with_assistant(payload: ChatRequest) -> ChatResponse:
    return answer_question(payload.message, payload.context_category)


@app.post("/api/schedule", response_model=ScheduleResponse)
def schedule_collection(payload: ScheduleRequest) -> ScheduleResponse:
    confirmation_id = f"ECO-{uuid4().hex[:10].upper()}"
    return ScheduleResponse(
        confirmation_id=confirmation_id,
        status="confirmed",
        scheduled_for=payload.preferred_slot,
        message=f"{payload.service_type} scheduled for the {payload.category} stream. Reference {confirmation_id}.",
    )


@app.get("/api/platform-overview")
def get_platform_overview() -> dict:
    return {
        "aqi": {
            "value": 146,
            "level": "Moderate",
            "primary_pollutant": "PM2.5",
            "burning_waste_impact": "Open burning of mixed waste can sharply worsen AQI and increase toxic particulate exposure.",
        },
        "weather_interaction": {
            "temperature_c": 34,
            "condition": "Hot and dry",
            "rain_warning": "Rain can push plastic waste into storm drains and increase urban clogging risk.",
            "heat_warning": "Heat accelerates odor formation and methane release from unmanaged organic waste.",
        },
        "smart_bin": {
            "fill_level_percent": 78,
            "pickup_prediction": "Pickup recommended within 9 hours",
            "status": "Approaching overflow",
            "ai_note": "Prediction is based on fill trend, waste composition, and recent inflow simulation.",
        },
        "predictive_analytics": {
            "monthly_trend": [
                {"month": "Jan", "waste_tons": 18, "recycled_tons": 11},
                {"month": "Feb", "waste_tons": 20, "recycled_tons": 12},
                {"month": "Mar", "waste_tons": 24, "recycled_tons": 15},
                {"month": "Apr", "waste_tons": 27, "recycled_tons": 17},
                {"month": "May", "waste_tons": 31, "recycled_tons": 19},
                {"month": "Jun", "waste_tons": 29, "recycled_tons": 18},
            ],
            "seasonal_patterns": [
                {"season": "Summer", "organic": 34, "plastic": 29, "hazardous": 10},
                {"season": "Monsoon", "organic": 28, "plastic": 36, "hazardous": 9},
                {"season": "Festival", "organic": 31, "plastic": 41, "hazardous": 12},
            ],
            "pickup_forecast": [
                {"day": "Mon", "fill": 64},
                {"day": "Tue", "fill": 71},
                {"day": "Wed", "fill": 78},
                {"day": "Thu", "fill": 86},
                {"day": "Fri", "fill": 92},
            ],
        },
        "e_waste_module": {
            "priority_items": ["Chargers", "Batteries", "Old mobile phones", "Adapters"],
            "certified_recyclers": ["Attero", "E-Parisaraa", "TES-AMM Hyderabad"],
        },
        "admin_dashboard": {
            "active_users": 1240,
            "today_pickups": 86,
            "open_dump_reports": 12,
            "ngo_partners": 18,
        },
        "model_comparison": [
            {"model": "MobileNetV2", "accuracy": 88, "latency_ms": 42, "size_mb": 14},
            {"model": "EfficientNet-B0", "accuracy": 91, "latency_ms": 65, "size_mb": 21},
            {"model": "ResNet50", "accuracy": 93, "latency_ms": 109, "size_mb": 98},
        ],
        "federated_learning": {
            "cities": ["Hyderabad", "Delhi", "Mumbai", "Bengaluru"],
            "rounds_completed": 6,
            "privacy_note": "Each city shares model updates instead of raw waste images, preserving local data privacy.",
        },
        "blockchain_tracking": [
            {"stage": "Citizen Upload", "owner": "Resident", "status": "logged"},
            {"stage": "Collector Pickup", "owner": "Ward Vehicle", "status": "verified"},
            {"stage": "Recycler Intake", "owner": "Authorized Recycler", "status": "tokenized"},
            {"stage": "Material Recovery", "owner": "Manufacturer", "status": "auditable"},
        ],
        "municipal_dashboard": {
            "ward_coverage": 42,
            "recycling_rate_percent": 63,
            "complaint_resolution_percent": 87,
            "officer_note": "Plastic-heavy wards need faster pickup during rain weeks.",
        },
        "language_support": ["English", "Hindi"],
        "voice_mode": {"enabled": True, "hint": "Voice prompts can guide users hands-free during sorting."},
        "ar_mode": {"enabled": True, "hint": "AR scanning mode can overlay detection labels on live camera frames."},
        "qr_tracking": {"enabled": True, "hint": "QR codes can track waste batches from source to recycler."},
    }


@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_waste(image: UploadFile = File(...)) -> AnalysisResponse:
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload a valid image file.")

    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded image was empty.")

    incoming_file_hash = file_hash(image_bytes)

    try:
        pil_image = load_image(image_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    normalized_hash = normalized_image_hash(pil_image)
    cache_key = f"{normalized_hash}-{classifier.model_fingerprint()}"
    cached = _read_cached_response(cache_key)
    if cached is not None:
        logger.info("Returning cached deterministic response for %s", normalized_hash)
        return cached

    prediction = classifier.classify(pil_image)
    detections = classifier.detect_objects(pil_image)
    total_detected_items = len(detections)
    item_counts = build_item_counts(detections)
    weight_estimate = build_weight_estimate(detections)
    environmental_metrics = build_environmental_metrics(prediction.predicted_class, detections)
    risk_assessment = build_risk_assessment(prediction.waste_category.lower(), detections)
    lifecycle = build_lifecycle()
    nearby_centers = build_nearby_centers(17.3850, 78.4867)
    collection_schedule_options = build_schedule_options(prediction.waste_category.lower())
    gamification = build_gamification(environmental_metrics, total_detected_items)
    community_impact = build_community_impact(weight_estimate, environmental_metrics)
    education_module = build_education_module(prediction.predicted_class, prediction.waste_category.lower(), environmental_metrics)
    image_id = save_cached_image(pil_image, normalized_hash)
    response = AnalysisResponse(
        image_id=image_id,
        cached_image_url=f"/cache/{image_id}",
        predicted_class=prediction.predicted_class,
        waste_category=prediction.waste_category,
        confidence_score=prediction.confidence_score,
        confidence_label=prediction.confidence_label,
        top_3_predictions=[
            PredictionItem(
                label=item.label,
                score=item.score,
                category=item.category,
                class_index=item.class_index,
            )
            for item in prediction.top_3_predictions
        ],
        detections=detections,
        total_detected_items=total_detected_items,
        item_counts=item_counts,
        weight_estimate=weight_estimate,
        environmental_metrics=environmental_metrics,
        risk_assessment=risk_assessment,
        recycling_suggestion=get_recycling_suggestion(prediction.predicted_class, prediction.waste_category),
        awareness_tip=get_awareness_tip(prediction.waste_category),
        lifecycle=lifecycle,
        government_initiatives=GOVERNMENT_INITIATIVES,
        city_statistics=CITY_STATISTICS,
        nearby_centers=nearby_centers,
        collection_schedule_options=collection_schedule_options,
        gamification=gamification,
        community_impact=community_impact,
        education_module=education_module,
        system_goal=(
            "Reduce human effort in waste segregation while providing recycling guidance and awareness "
            "for smarter sustainable waste management."
        ),
        model_name=prediction.model_name,
        model_status=prediction.model_status,
        model_source=prediction.model_source,
        confidence_note=prediction.confidence_note,
        debug=PredictionDebug(
            file_name=image.filename or "uploaded-image",
            file_hash=incoming_file_hash,
            normalized_image_hash=normalized_hash,
            model_fingerprint=classifier.model_fingerprint(),
            image_mode=prediction.image_mode,
            original_size=[prediction.original_size[0], prediction.original_size[1]],
            processed_size=[prediction.processed_size[0], prediction.processed_size[1]],
            normalization_mode=prediction.normalization_mode,
            deterministic=True,
            augmentation_used=False,
            rgb_converted=True,
            class_to_index=prediction.class_to_index,
            raw_probabilities=prediction.raw_probabilities,
        ),
    )
    _write_cached_response(cache_key, response)
    logger.info(
        "Analysis completed file=%s predicted=%s category=%s confidence=%.2f",
        image.filename,
        response.predicted_class,
        response.waste_category,
        response.confidence_score,
    )
    return response
