from pydantic import BaseModel, Field


class BoundingBox(BaseModel):
    x: int
    y: int
    width: int
    height: int


class PredictionItem(BaseModel):
    label: str
    score: float = Field(..., ge=0, le=1)
    category: str
    class_index: int


class ResultInsight(BaseModel):
    title: str
    description: str


class Detection(BaseModel):
    label: str
    category: str
    confidence: float = Field(..., ge=0, le=1)
    bounding_box: BoundingBox
    color: str
    estimated_weight_g: float
    estimated_volume_ml: float
    carbon_impact_kg_co2e: float
    carbon_saved_if_recycled_kg: float
    decomposition_time: str
    damage_score: int = Field(..., ge=0, le=100)
    disposal_tip: str


class ItemCount(BaseModel):
    label: str
    count: int
    category: str


class WeightEstimate(BaseModel):
    total_weight_g: float
    total_volume_ml: float
    method: str
    reference_note: str


class EnvironmentalMetrics(BaseModel):
    decomposition_time: str
    damage_score: int = Field(..., ge=0, le=100)
    carbon_impact_kg_co2e: float
    carbon_saved_if_recycled_kg: float
    methane_risk: str
    circularity_score: int = Field(..., ge=0, le=100)


class RiskAssessment(BaseModel):
    level: str
    score: int = Field(..., ge=0, le=100)
    note: str


class LifecycleStage(BaseModel):
    title: str
    description: str
    accent: str


class InitiativeStat(BaseModel):
    title: str
    value: str
    note: str
    source: str


class NearbyCenter(BaseModel):
    name: str
    address: str
    distance_km: float
    kind: str
    map_url: str


class CollectionScheduleOption(BaseModel):
    title: str
    description: str
    eta: str
    suitable_for: str


class GamificationSnapshot(BaseModel):
    eco_points: int
    eco_score: int = Field(..., ge=0, le=100)
    badge: str
    leaderboard_rank: int
    next_badge: str


class CommunityImpact(BaseModel):
    waste_saved_from_landfill_kg: float
    plastic_recycled_kg: float
    carbon_reduction_kg: float
    households_participating: int


class AwarenessQuiz(BaseModel):
    question: str
    options: list[str]
    answer: str
    explainer: str


class EducationModule(BaseModel):
    title: str
    audience: str
    summary: str
    quiz: AwarenessQuiz


class OrganizationItem(BaseModel):
    name: str
    kind: str
    address: str
    city: str
    contact: str
    accepted_categories: list[str]
    accepted_materials: list[str]


class PredictionDebug(BaseModel):
    file_name: str
    file_hash: str
    normalized_image_hash: str
    model_fingerprint: str
    image_mode: str
    original_size: list[int]
    processed_size: list[int]
    normalization_mode: str
    deterministic: bool
    augmentation_used: bool
    rgb_converted: bool
    class_to_index: dict[str, int]
    raw_probabilities: list[float]


class AnalysisResponse(BaseModel):
    image_id: str
    cached_image_url: str
    predicted_class: str
    waste_category: str
    confidence_score: float = Field(..., ge=0, le=1)
    confidence_label: str
    top_3_predictions: list[PredictionItem]
    detections: list[Detection]
    total_detected_items: int
    item_counts: list[ItemCount]
    weight_estimate: WeightEstimate
    environmental_metrics: EnvironmentalMetrics
    risk_assessment: RiskAssessment
    recycling_suggestion: ResultInsight
    awareness_tip: ResultInsight
    lifecycle: list[LifecycleStage]
    government_initiatives: list[InitiativeStat]
    city_statistics: list[InitiativeStat]
    nearby_centers: list[NearbyCenter]
    collection_schedule_options: list[CollectionScheduleOption]
    gamification: GamificationSnapshot
    community_impact: CommunityImpact
    education_module: EducationModule
    system_goal: str
    model_name: str
    model_status: str
    model_source: str
    confidence_note: str
    debug: PredictionDebug


class OrganizationResponse(BaseModel):
    organizations: list[OrganizationItem]


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=2)
    context_category: str | None = None


class ChatResponse(BaseModel):
    answer: str
    suggested_questions: list[str]


class ScheduleRequest(BaseModel):
    service_type: str
    category: str
    preferred_slot: str
    notes: str | None = None


class ScheduleResponse(BaseModel):
    confirmation_id: str
    status: str
    scheduled_for: str
    message: str
