from __future__ import annotations

from collections import Counter
from math import asin, cos, radians, sin, sqrt

from app.schemas import (
    CollectionScheduleOption,
    CommunityImpact,
    Detection,
    EducationModule,
    EnvironmentalMetrics,
    GamificationSnapshot,
    InitiativeStat,
    ItemCount,
    LifecycleStage,
    NearbyCenter,
    RiskAssessment,
    WeightEstimate,
    AwarenessQuiz,
)


ITEM_PROFILES = {
    "plastic": {
        "category": "recyclable",
        "density_g_per_l": 24,
        "base_volume_ml": 600,
        "decomposition_time": "450 years",
        "carbon_factor": 0.19,
        "recycled_saving": 0.14,
        "damage_score": 82,
        "risk_score": 40,
        "methane_risk": "Low",
        "tip": "Rinse and send to PET or dry recyclables stream.",
        "color": "#14b8a6",
    },
    "metal": {
        "category": "recyclable",
        "density_g_per_l": 90,
        "base_volume_ml": 330,
        "decomposition_time": "50-200 years",
        "carbon_factor": 0.23,
        "recycled_saving": 0.18,
        "damage_score": 54,
        "risk_score": 36,
        "methane_risk": "Low",
        "tip": "Crush lightly and place in metals or dry recyclables.",
        "color": "#38bdf8",
    },
    "glass": {
        "category": "recyclable",
        "density_g_per_l": 220,
        "base_volume_ml": 750,
        "decomposition_time": "1 million years",
        "carbon_factor": 0.31,
        "recycled_saving": 0.22,
        "damage_score": 70,
        "risk_score": 44,
        "methane_risk": "Low",
        "tip": "Separate by color if possible and handle carefully.",
        "color": "#0ea5e9",
    },
    "paper": {
        "category": "recyclable",
        "density_g_per_l": 32,
        "base_volume_ml": 900,
        "decomposition_time": "2-5 months",
        "carbon_factor": 0.08,
        "recycled_saving": 0.11,
        "damage_score": 38,
        "risk_score": 26,
        "methane_risk": "Low",
        "tip": "Keep dry and flatten before recycling.",
        "color": "#22c55e",
    },
    "food": {
        "category": "organic",
        "density_g_per_l": 370,
        "base_volume_ml": 420,
        "decomposition_time": "2-6 weeks",
        "carbon_factor": 0.11,
        "recycled_saving": 0.06,
        "damage_score": 28,
        "risk_score": 18,
        "methane_risk": "High if landfilled",
        "tip": "Move to compost or municipal wet waste collection quickly.",
        "color": "#84cc16",
    },
    "battery": {
        "category": "hazardous",
        "density_g_per_l": 520,
        "base_volume_ml": 90,
        "decomposition_time": "100+ years",
        "carbon_factor": 0.42,
        "recycled_saving": 0.2,
        "damage_score": 96,
        "risk_score": 92,
        "methane_risk": "Low",
        "tip": "Store in a sealed dry container and take to hazardous drop-off.",
        "color": "#f59e0b",
    },
    "e-waste": {
        "category": "hazardous",
        "density_g_per_l": 610,
        "base_volume_ml": 250,
        "decomposition_time": "500+ years",
        "carbon_factor": 0.49,
        "recycled_saving": 0.28,
        "damage_score": 94,
        "risk_score": 88,
        "methane_risk": "Low",
        "tip": "Send to authorized e-waste collection points only.",
        "color": "#f97316",
    },
    "mixed waste": {
        "category": "non-recyclable",
        "density_g_per_l": 15,
        "base_volume_ml": 240,
        "decomposition_time": "100-500 years",
        "carbon_factor": 0.16,
        "recycled_saving": 0.03,
        "damage_score": 74,
        "risk_score": 56,
        "methane_risk": "Low",
        "tip": "Seal and bin separately unless your city accepts soft plastics.",
        "color": "#fb7185",
    },
}


GOVERNMENT_INITIATIVES = [
    InitiativeStat(
        title="Swachh Bharat Mission",
        value="Urban cleanliness and waste management drive",
        note="Promotes source segregation, door-to-door collection, and waste processing adoption.",
        source="Government of India",
    ),
    InitiativeStat(
        title="MoHUA Focus",
        value="Segregation at source",
        note="Municipal solid waste programs prioritize segregated collection and recovery infrastructure.",
        source="Ministry of Housing and Urban Affairs",
    ),
]


CITY_STATISTICS = [
    InitiativeStat(
        title="Smart City Readiness",
        value="76%",
        note="Illustrative readiness score for digital waste tracking and citizen participation features.",
        source="EcoVision demo analytics",
    ),
    InitiativeStat(
        title="Cleanliness Benchmark",
        value="Top-20 aspirational target",
        note="Cities improve ranking by increasing segregation, recycling, and citizen reporting.",
        source="EcoVision policy module",
    ),
]


CENTER_CATALOG = [
    ("Hyderabad Dry Waste Collection Center", "Ward Resource Recovery Hub, Banjara Hills", 17.4126, 78.4342, "Recycling"),
    ("Greater Hyderabad Hazardous Drop-Off Point", "Municipal Hazardous Collection Desk, Secunderabad", 17.4399, 78.4983, "Hazardous"),
    ("Green Hyderabad NGO Circular Hub", "Community NGO Collection Center, Hitec City", 17.4474, 78.3762, "NGO"),
]


def _distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    earth_radius = 6371.0
    d_lat = radians(lat2 - lat1)
    d_lon = radians(lon2 - lon1)
    a = sin(d_lat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lon / 2) ** 2
    return round(earth_radius * 2 * asin(sqrt(a)), 2)


def build_item_counts(detections: list[Detection]) -> list[ItemCount]:
    counter = Counter((detection.label, detection.category) for detection in detections)
    return [
        ItemCount(label=label, count=count, category=category)
        for (label, category), count in sorted(counter.items(), key=lambda item: (-item[1], item[0][0]))
    ]


def build_weight_estimate(detections: list[Detection]) -> WeightEstimate:
    total_weight = round(sum(detection.estimated_weight_g for detection in detections), 1)
    total_volume = round(sum(detection.estimated_volume_ml for detection in detections), 1)
    return WeightEstimate(
        total_weight_g=total_weight,
        total_volume_ml=total_volume,
        method="Bounding-box area scaled against an assumed smart-bin camera field of view.",
        reference_note="For production accuracy, calibrate against a known reference marker or bin geometry.",
    )


def build_environmental_metrics(primary_label: str, detections: list[Detection]) -> EnvironmentalMetrics:
    total_carbon = round(sum(detection.carbon_impact_kg_co2e for detection in detections), 3)
    total_saving = round(sum(detection.carbon_saved_if_recycled_kg for detection in detections), 3)
    max_damage = max((detection.damage_score for detection in detections), default=0)
    methane_risk = "Moderate"
    if any(detection.category == "organic" for detection in detections):
        methane_risk = "High if wet waste is landfilled"
    elif any(detection.category == "hazardous" for detection in detections):
        methane_risk = "Low methane, high toxic leakage risk"

    circularity_score = max(10, min(96, 100 - max_damage + int(total_saving * 80)))
    profile = ITEM_PROFILES.get(primary_label, ITEM_PROFILES["mixed waste"])
    return EnvironmentalMetrics(
        decomposition_time=profile["decomposition_time"],
        damage_score=max_damage,
        carbon_impact_kg_co2e=total_carbon,
        carbon_saved_if_recycled_kg=total_saving,
        methane_risk=methane_risk,
        circularity_score=circularity_score,
    )


def build_risk_assessment(category: str, detections: list[Detection]) -> RiskAssessment:
    peak_risk = max((ITEM_PROFILES.get(detection.label, ITEM_PROFILES["mixed waste"])["risk_score"] for detection in detections), default=25)
    level = "Low"
    note = "Suitable for routine segregation with standard handling."
    if category == "hazardous":
        level = "High"
        note = "Requires sealed storage and authorized collection to reduce toxicity or fire risk."
    elif category == "non-recyclable":
        level = "Medium"
        note = "Keep out of recyclable streams to avoid contamination and downstream sorting loss."
    elif category == "organic":
        level = "Low"
        note = "Low direct toxicity, but quick handling reduces odor and methane formation."
    return RiskAssessment(level=level, score=peak_risk, note=note)


def build_lifecycle() -> list[LifecycleStage]:
    return [
        LifecycleStage(title="Waste", description="Item enters the segregation pipeline at source.", accent="#16a34a"),
        LifecycleStage(title="Collection", description="Municipal or community teams collect separated streams.", accent="#0ea5e9"),
        LifecycleStage(title="Sorting", description="AI detection and human checks improve stream purity.", accent="#f59e0b"),
        LifecycleStage(title="Processing", description="Materials are cleaned, shredded, composted, or stabilized.", accent="#f97316"),
        LifecycleStage(title="Reuse", description="Recovered material re-enters the circular economy.", accent="#10b981"),
    ]


def build_nearby_centers(latitude: float, longitude: float) -> list[NearbyCenter]:
    centers = []
    for name, address, lat, lon, kind in CENTER_CATALOG:
        distance = _distance_km(latitude, longitude, lat, lon)
        centers.append(
            NearbyCenter(
                name=name,
                address=address,
                distance_km=distance,
                kind=kind,
                map_url=f"https://www.google.com/maps/search/?api=1&query={lat},{lon}",
            )
        )
    return sorted(centers, key=lambda center: center.distance_km)


def build_schedule_options(category: str) -> list[CollectionScheduleOption]:
    options = [
        CollectionScheduleOption(
            title="Book Regular Pickup",
            description="Bundle this item with the next municipal segregated collection round.",
            eta="Within 24 hours",
            suitable_for="Recyclable and organic streams",
        ),
        CollectionScheduleOption(
            title="Schedule Hazardous Drop-Off",
            description="Reserve a supervised slot for e-waste, batteries, and chemical containers.",
            eta="Next available weekend slot",
            suitable_for="Hazardous materials",
        ),
        CollectionScheduleOption(
            title="Report Illegal Dumping",
            description="Escalate unmanaged dumping spots to civic teams for clean-up.",
            eta="Escalation logged instantly",
            suitable_for="Community reporting",
        ),
    ]
    if category == "hazardous":
        return [options[1], options[2], options[0]]
    return options


def build_gamification(metrics: EnvironmentalMetrics, total_items: int) -> GamificationSnapshot:
    eco_points = max(20, int(metrics.circularity_score * 2.4) + (total_items * 8))
    eco_score = min(99, max(18, metrics.circularity_score))
    badge = "Green Warrior"
    next_badge = "Eco Hero"
    if eco_score >= 85:
        badge = "Eco Hero"
        next_badge = "Circular Champion"
    elif eco_score < 45:
        badge = "Eco Starter"
        next_badge = "Green Warrior"
    return GamificationSnapshot(
        eco_points=eco_points,
        eco_score=eco_score,
        badge=badge,
        leaderboard_rank=max(3, 100 - eco_score),
        next_badge=next_badge,
    )


def build_community_impact(weight_estimate: WeightEstimate, metrics: EnvironmentalMetrics) -> CommunityImpact:
    landfill_saved = round(weight_estimate.total_weight_g / 1000 * 4.3, 2)
    plastic_recycled = round(max(weight_estimate.total_weight_g / 1000 * 1.9, 0.2), 2)
    carbon_reduction = round(max(metrics.carbon_saved_if_recycled_kg * 12, 0.4), 2)
    return CommunityImpact(
        waste_saved_from_landfill_kg=landfill_saved,
        plastic_recycled_kg=plastic_recycled,
        carbon_reduction_kg=carbon_reduction,
        households_participating=128,
    )


def build_education_module(primary_label: str, category: str, metrics: EnvironmentalMetrics) -> EducationModule:
    if category == "organic":
        quiz = AwarenessQuiz(
            question="Which bin should most food scraps go into?",
            options=["Dry recycling", "Compost or wet waste", "Hazardous waste"],
            answer="Compost or wet waste",
            explainer="Organic waste breaks down quickly and should be diverted from landfill when composting is available.",
        )
    else:
        quiz = AwarenessQuiz(
            question=f"How long can {primary_label} remain in the environment?",
            options=["A few days", metrics.decomposition_time, "1 week"],
            answer=metrics.decomposition_time,
            explainer="Decomposition time is a strong awareness tool for encouraging correct segregation behavior.",
        )
    return EducationModule(
        title="School / College Awareness Mode",
        audience="Students and first-time recyclers",
        summary="Simple environmental explanations, decomposition awareness, and a quick quiz make the platform useful for workshops and campus campaigns.",
        quiz=quiz,
    )
