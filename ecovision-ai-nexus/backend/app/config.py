from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = ROOT_DIR / "models"
MODEL_PATH = MODEL_DIR / "mobilenet_v2_waste.tflite"
LABELS_PATH = MODEL_DIR / "labels.txt"
CACHE_DIR = ROOT_DIR / "cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)
ANALYSIS_CACHE_DIR = ROOT_DIR / "analysis_cache"
ANALYSIS_CACHE_DIR.mkdir(parents=True, exist_ok=True)

DEFAULT_MODEL_INPUT_SIZE = 224
DEFAULT_RANDOM_SEED = 42
DEFAULT_NORMALIZATION_MODE = "minus_one_to_one"

DEFAULT_CLASS_LABELS = [
    "plastic",
    "glass",
    "food",
    "paper",
    "metal",
    "textile",
    "battery",
    "e-waste",
    "medical",
    "mixed waste",
]

WASTE_CATEGORY_MAP = {
    "plastic": "Recyclable",
    "glass": "Recyclable",
    "paper": "Recyclable",
    "metal": "Recyclable",
    "food": "Organic",
    "textile": "Non-recyclable",
    "mixed waste": "Non-recyclable",
    "battery": "Hazardous",
    "e-waste": "Hazardous",
    "medical": "Hazardous",
}

CATEGORY_DESCRIPTIONS = {
    "Recyclable": "Sort this item into the dry recycling stream after basic cleaning.",
    "Non-recyclable": "Keep this item out of recycling to avoid contamination in the sorting stream.",
    "Organic": "This material is suitable for compost or wet-waste collection where available.",
    "Hazardous": "Handle separately and send to an approved hazardous or special-waste collection point.",
}
