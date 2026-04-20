from __future__ import annotations

import hashlib
import logging
import os
import random
from dataclasses import dataclass

os.environ.setdefault("PYTHONHASHSEED", "42")
os.environ.setdefault("TF_DETERMINISTIC_OPS", "1")
os.environ.setdefault("TF_CUDNN_DETERMINISTIC", "1")

import numpy as np
from PIL import Image

from app.config import (
    DEFAULT_CLASS_LABELS,
    DEFAULT_MODEL_INPUT_SIZE,
    DEFAULT_NORMALIZATION_MODE,
    DEFAULT_RANDOM_SEED,
    LABELS_PATH,
    MODEL_PATH,
    WASTE_CATEGORY_MAP,
)
from app.schemas import BoundingBox, Detection
from app.services.intelligence import ITEM_PROFILES
from app.utils.image_ops import estimate_foreground_bboxes

try:
    import tflite_runtime.interpreter as tflite  # type: ignore
except Exception:  # pragma: no cover
    tflite = None

try:
    import tensorflow as tf  # type: ignore
except Exception:  # pragma: no cover
    tf = None


logger = logging.getLogger("ecovision.classifier")
FALLBACK_VERSION = "fallback-v4"


@dataclass
class PredictionScore:
    label: str
    score: float
    category: str
    class_index: int


@dataclass
class ClassificationResult:
    predicted_class: str
    waste_category: str
    confidence_score: float
    confidence_label: str
    top_3_predictions: list[PredictionScore]
    raw_probabilities: list[float]
    class_to_index: dict[str, int]
    image_mode: str
    original_size: tuple[int, int]
    processed_size: tuple[int, int]
    normalization_mode: str
    model_status: str
    model_source: str
    model_name: str
    confidence_note: str


class WasteClassifier:
    def __init__(self) -> None:
        self.seed = DEFAULT_RANDOM_SEED
        self.labels = self._load_labels()
        self.class_to_index = {label: index for index, label in enumerate(self.labels)}
        self.interpreter = None
        self.keras_model = None
        self.input_details = None
        self.output_details = None
        self.input_size = DEFAULT_MODEL_INPUT_SIZE
        self.normalization_mode = DEFAULT_NORMALIZATION_MODE
        self.model_name = "MobileNetV2 Waste Classifier"
        self.model_source = "deterministic-mobilenetv2-fallback"
        self.model_status = "fallback-active"
        self._configure_determinism()
        self._load_model()

    def _configure_determinism(self) -> None:
        random.seed(self.seed)
        np.random.seed(self.seed)

        if tf is not None:
            try:
                tf.keras.utils.set_random_seed(self.seed)
            except Exception:
                pass
            try:
                tf.config.experimental.enable_op_determinism()
            except Exception:
                pass

        logger.info("Deterministic inference configured with seed=%s", self.seed)

    def _load_labels(self) -> list[str]:
        if LABELS_PATH.exists():
            labels = [line.strip() for line in LABELS_PATH.read_text(encoding="utf-8").splitlines() if line.strip()]
            if labels:
                return labels
        return list(DEFAULT_CLASS_LABELS)

    def model_fingerprint(self) -> str:
        if MODEL_PATH.exists():
            return hashlib.sha256(MODEL_PATH.read_bytes()).hexdigest()
        return FALLBACK_VERSION

    def _load_model(self) -> None:
        if not MODEL_PATH.exists():
            logger.warning("No MobileNetV2 model found at %s. Using deterministic fallback.", MODEL_PATH)
            return

        if tflite is not None:
            self.interpreter = tflite.Interpreter(model_path=str(MODEL_PATH), num_threads=1)
            self.interpreter.allocate_tensors()
            self.input_details = self.interpreter.get_input_details()
            self.output_details = self.interpreter.get_output_details()
            self.input_size = int(self.input_details[0]["shape"][1])
            self.model_source = MODEL_PATH.name
            self.model_status = "model-loaded"
            logger.info("Loaded TFLite MobileNetV2 model from %s", MODEL_PATH)
            return

        if tf is not None:
            try:
                self.keras_model = tf.keras.models.load_model(MODEL_PATH)
                self.input_size = int(self.keras_model.input_shape[1])
                self.model_source = MODEL_PATH.name
                self.model_status = "model-loaded"
                logger.info("Loaded Keras MobileNetV2 model from %s", MODEL_PATH)
                return
            except Exception as exc:
                logger.warning("Model file exists but could not be loaded: %s", exc)

    def classify(self, image: Image.Image) -> ClassificationResult:
        input_tensor, image_mode, original_size, processed_size = self._preprocess_image(image)

        if self.interpreter is not None:
            raw_output = self._predict_with_tflite(input_tensor)
        elif self.keras_model is not None:
            raw_output = self._predict_with_keras(input_tensor)
        else:
            raw_output = self._predict_with_deterministic_fallback(input_tensor[0])

        self._ensure_label_count(len(raw_output))
        probabilities = self._to_probabilities(raw_output)
        top_3 = self._top_k(probabilities, 3)
        predicted_class = top_3[0].label
        waste_category = WASTE_CATEGORY_MAP.get(predicted_class, "Non-recyclable")
        confidence_score = round(top_3[0].score, 2)

        logger.info("Predicted=%s category=%s confidence=%.2f", predicted_class, waste_category, confidence_score)

        return ClassificationResult(
            predicted_class=predicted_class,
            waste_category=waste_category,
            confidence_score=confidence_score,
            confidence_label=self._confidence_label(confidence_score),
            top_3_predictions=top_3,
            raw_probabilities=[round(float(value), 6) for value in probabilities],
            class_to_index=self.class_to_index,
            image_mode=image_mode,
            original_size=original_size,
            processed_size=processed_size,
            normalization_mode=self.normalization_mode,
            model_status=self.model_status,
            model_source=self.model_source,
            model_name=self.model_name,
            confidence_note=(
                "Inference is deterministic with fixed seeds, RGB conversion, MobileNetV2-style normalization, "
                "and no augmentation during prediction."
            ),
        )

    def _preprocess_image(
        self, image: Image.Image
    ) -> tuple[np.ndarray, str, tuple[int, int], tuple[int, int]]:
        image_mode = image.mode
        original_size = image.size
        rgb_image = image.convert("RGB")
        resized = rgb_image.resize((self.input_size, self.input_size), Image.Resampling.BILINEAR)
        array = np.asarray(resized, dtype=np.float32)

        if self.normalization_mode == "minus_one_to_one":
            normalized = (array / 127.5) - 1.0
        else:
            normalized = array / 255.0

        tensor = np.expand_dims(normalized.astype(np.float32), axis=0)
        return tensor, image_mode, original_size, resized.size

    def _predict_with_tflite(self, input_tensor: np.ndarray) -> np.ndarray:
        input_meta = self.input_details[0]
        output_meta = self.output_details[0]
        tensor_to_set = input_tensor.astype(input_meta["dtype"])
        self.interpreter.set_tensor(input_meta["index"], tensor_to_set)
        self.interpreter.invoke()
        return np.asarray(self.interpreter.get_tensor(output_meta["index"])[0], dtype=np.float32)

    def _predict_with_keras(self, input_tensor: np.ndarray) -> np.ndarray:
        predictions = self.keras_model(input_tensor, training=False)
        return np.asarray(predictions[0], dtype=np.float32)

    def _predict_with_deterministic_fallback(self, input_tensor: np.ndarray) -> np.ndarray:
        normalized = (input_tensor + 1.0) / 2.0
        mean_rgb = normalized.mean(axis=(0, 1))
        std_rgb = normalized.std(axis=(0, 1))
        brightness = float(mean_rgb.mean())
        saturation = float(std_rgb.mean())
        blue_bias = float(mean_rgb[2] - ((mean_rgb[0] + mean_rgb[1]) / 2))
        green_bias = float(mean_rgb[1] - max(mean_rgb[0], mean_rgb[2]))
        red_bias = float(mean_rgb[0] - ((mean_rgb[1] + mean_rgb[2]) / 2))
        brightness_map = normalized.mean(axis=2)
        chroma = normalized.max(axis=2) - normalized.min(axis=2)
        very_dark = float((brightness_map < 0.18).mean())
        very_bright = float((brightness_map > 0.82).mean())
        edge_density = float(np.abs(np.diff(brightness_map, axis=0)).mean() + np.abs(np.diff(brightness_map, axis=1)).mean())
        neutral_fraction = float((chroma < 0.1).mean())
        specular_fraction = float(((normalized.max(axis=2) > 0.88) & (chroma < 0.14)).mean())
        colorful_fraction = float((chroma > 0.22).mean())
        green_fraction = float(
            ((normalized[:, :, 1] > normalized[:, :, 0] + 0.05) & (normalized[:, :, 1] > normalized[:, :, 2] + 0.04)).mean()
        )
        blue_fraction = float(
            ((normalized[:, :, 2] > normalized[:, :, 0] + 0.04) & (normalized[:, :, 2] > normalized[:, :, 1] + 0.04)).mean()
        )
        red_fraction = float(
            ((normalized[:, :, 0] > normalized[:, :, 1] + 0.05) & (normalized[:, :, 0] > normalized[:, :, 2] + 0.04)).mean()
        )
        yellow_fraction = float(
            (
                (normalized[:, :, 0] > 0.48)
                & (normalized[:, :, 1] > 0.42)
                & (normalized[:, :, 2] < 0.38)
                & ((normalized[:, :, 0] - normalized[:, :, 2]) > 0.14)
            ).mean()
        )
        brown_fraction = float(
            (
                (normalized[:, :, 0] > normalized[:, :, 1])
                & (normalized[:, :, 1] > normalized[:, :, 2])
                & (brightness_map > 0.3)
                & (brightness_map < 0.78)
            ).mean()
        )

        scores = np.array(
            [
                brightness * 0.72
                + saturation * 0.95
                + colorful_fraction * 1.15
                + blue_fraction * 1.35
                + red_fraction * 0.25
                - neutral_fraction * 0.8
                - specular_fraction * 0.65,
                neutral_fraction * 1.25 + specular_fraction * 1.45 + green_fraction * 1.0 + blue_fraction * 0.4 + very_bright * 0.45,
                green_bias * 2.1
                + green_fraction * 1.35
                + red_fraction * 0.7
                + yellow_fraction * 1.15
                + saturation * 0.4
                - specular_fraction * 0.3,
                brightness * 0.65 + very_bright * 0.55 + neutral_fraction * 0.35 - brown_fraction * 0.35,
                neutral_fraction * 0.9 + specular_fraction * 0.65 + edge_density * 0.5 - colorful_fraction * 0.35,
                brown_fraction * 1.15 + saturation * 0.35 + edge_density * 0.18,
                red_bias * 0.95 + very_dark * 1.35 + saturation * 0.2,
                blue_bias * 1.55 + edge_density * 0.35 + very_dark * 0.15,
                red_bias * 0.7 + very_bright * 0.45 + edge_density * 0.2,
                very_dark * 0.72 + saturation * 0.32 + brown_fraction * 0.4 + edge_density * 0.22,
            ],
            dtype=np.float32,
        )

        # Promote glass when the image is dominated by transparent, reflective, or green/blue bottle-like material.
        if neutral_fraction > 0.62 and (specular_fraction > 0.08 or green_fraction > 0.08 or blue_fraction > 0.06):
            scores[1] += 0.9
            scores[0] -= 0.35
            scores[3] -= 0.15

        # Colorful bottle piles with lots of blue caps/labels are more likely plastic than glass.
        if colorful_fraction > 0.32 and blue_fraction > 0.16 and neutral_fraction < 0.5:
            scores[0] += 0.85
            scores[1] -= 0.2

        # Food waste tends to contain mixed green, red, and yellow produce colors with less glass-like glare.
        if (green_fraction + red_fraction + yellow_fraction) > 0.22 and specular_fraction < 0.08:
            scores[2] += 0.95
            scores[1] -= 0.25
            scores[0] -= 0.15

        # Cardboard and kraft paper should not drift into plastic or glass.
        if brown_fraction > 0.32 and specular_fraction < 0.06:
            scores[5] += 0.75
            scores[3] += 0.35
            scores[0] -= 0.25

        return scores

    def _ensure_label_count(self, output_length: int) -> None:
        if output_length == len(self.labels):
            return

        logger.warning("Label count mismatch detected. output_length=%s labels=%s", output_length, len(self.labels))
        if LABELS_PATH.exists():
            labels = self._load_labels()
            if len(labels) == output_length:
                self.labels = labels
            else:
                self.labels = [f"class_{index}" for index in range(output_length)]
        else:
            self.labels = [f"class_{index}" for index in range(output_length)]

        self.class_to_index = {label: index for index, label in enumerate(self.labels)}

    @staticmethod
    def _to_probabilities(raw_output: np.ndarray) -> list[float]:
        shifted = raw_output - np.max(raw_output)
        exponentials = np.exp(shifted)
        probabilities = exponentials / np.sum(exponentials)
        return [float(value) for value in probabilities]

    def _top_k(self, probabilities: list[float], k: int) -> list[PredictionScore]:
        ranked = sorted(enumerate(probabilities), key=lambda item: item[1], reverse=True)
        return [
            PredictionScore(
                label=self.labels[index],
                score=round(float(score), 2),
                category=WASTE_CATEGORY_MAP.get(self.labels[index], "Non-recyclable"),
                class_index=index,
            )
            for index, score in ranked[:k]
        ]

    @staticmethod
    def _confidence_label(score: float) -> str:
        if score >= 0.85:
            return "Very high"
        if score >= 0.7:
            return "High"
        if score >= 0.55:
            return "Moderate"
        return "Needs review"

    def detect_objects(self, image: Image.Image) -> list[Detection]:
        boxes = estimate_foreground_bboxes(image, max_regions=6)
        detections: list[Detection] = []

        for index, box in enumerate(boxes):
            crop = image.crop((box[0], box[1], box[0] + box[2], box[1] + box[3]))
            crop_result = self.classify(crop)
            label = crop_result.predicted_class
            profile = ITEM_PROFILES.get(label, ITEM_PROFILES["mixed waste"])
            confidence = max(0.42, round(crop_result.confidence_score - (index * 0.03), 2))
            detections.append(self._make_detection(label, profile, confidence, box, image.width, image.height))

        if not detections:
            fallback_profile = ITEM_PROFILES.get("mixed waste", {})
            detections.append(
                self._make_detection(
                    "mixed waste",
                    fallback_profile,
                    0.5,
                    (0, 0, image.width, image.height),
                    image.width,
                    image.height,
                )
            )

        return detections

    def _make_detection(
        self,
        label: str,
        profile: dict,
        confidence: float,
        bbox: tuple[int, int, int, int],
        image_width: int,
        image_height: int,
    ) -> Detection:
        x, y, width, height = bbox
        area_ratio = (width * height) / max(image_width * image_height, 1)
        volume_scale = max(0.35, min(2.0, (area_ratio / 0.12) + 0.25))
        estimated_volume_ml = round(profile["base_volume_ml"] * volume_scale, 1)
        estimated_weight_g = round((estimated_volume_ml / 1000) * profile["density_g_per_l"], 1)
        carbon_impact = round((estimated_weight_g / 1000) * profile["carbon_factor"], 3)
        carbon_saved = round((estimated_weight_g / 1000) * profile["recycled_saving"], 3)
        category = profile["category"].replace("-", " ")

        return Detection(
            label=label,
            category=category,
            confidence=confidence,
            bounding_box=BoundingBox(x=x, y=y, width=width, height=height),
            color=profile["color"],
            estimated_weight_g=estimated_weight_g,
            estimated_volume_ml=estimated_volume_ml,
            carbon_impact_kg_co2e=carbon_impact,
            carbon_saved_if_recycled_kg=carbon_saved,
            decomposition_time=profile["decomposition_time"],
            damage_score=profile["damage_score"],
            disposal_tip=profile["tip"],
        )
