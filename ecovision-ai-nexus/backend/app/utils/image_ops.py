from __future__ import annotations

import hashlib
from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image

from app.config import CACHE_DIR


def load_image(image_bytes: bytes) -> Image.Image:
    try:
        image = Image.open(BytesIO(image_bytes))
        image.load()
    except Exception as exc:  # pragma: no cover - invalid-image branch depends on user upload
        raise ValueError("Uploaded file is not a valid readable image.") from exc
    return image.convert("RGB")


def file_hash(image_bytes: bytes) -> str:
    return hashlib.sha256(image_bytes).hexdigest()


def normalized_image_hash(image: Image.Image) -> str:
    normalized = image.copy()
    if max(normalized.size) > 1024:
        normalized.thumbnail((1024, 1024))
    payload = normalized.tobytes() + f"{normalized.width}x{normalized.height}".encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def save_cached_image(image: Image.Image, image_hash: str) -> str:
    image_id = f"{image_hash[:24]}.jpg"
    output_path = CACHE_DIR / image_id
    if not output_path.exists():
        image.save(output_path, format="JPEG", quality=92)
    return image_id


def image_path(image_id: str) -> Path:
    return CACHE_DIR / image_id


def estimate_foreground_bboxes(image: Image.Image, max_regions: int = 5) -> list[tuple[int, int, int, int]]:
    pixels = np.asarray(image).astype(np.int16)
    grayscale = pixels.mean(axis=2)
    baseline = np.median(grayscale)
    contrast = np.abs(grayscale - baseline)
    color_spread = np.abs(pixels - np.median(pixels, axis=(0, 1)))
    color_mask = color_spread.mean(axis=2) > np.percentile(color_spread.mean(axis=2), 64)
    threshold = max(16, np.percentile(contrast, 68))
    mask = np.logical_or(contrast > threshold, color_mask)

    coordinates = np.argwhere(mask)
    if coordinates.size == 0:
        return [(0, 0, image.width, image.height)]

    height, width = mask.shape
    visited = np.zeros_like(mask, dtype=bool)
    min_region_area = max(220, int((height * width) * 0.003))
    boxes: list[tuple[int, int, int, int, int]] = []

    for y, x in coordinates:
        if visited[y, x]:
            continue

        stack = [(int(y), int(x))]
        visited[y, x] = True
        area = 0
        y_min = y_max = int(y)
        x_min = x_max = int(x)

        while stack:
            cy, cx = stack.pop()
            area += 1
            y_min = min(y_min, cy)
            y_max = max(y_max, cy)
            x_min = min(x_min, cx)
            x_max = max(x_max, cx)

            for ny, nx in (
                (cy - 1, cx),
                (cy + 1, cx),
                (cy, cx - 1),
                (cy, cx + 1),
                (cy - 1, cx - 1),
                (cy - 1, cx + 1),
                (cy + 1, cx - 1),
                (cy + 1, cx + 1),
            ):
                if ny < 0 or nx < 0 or ny >= height or nx >= width:
                    continue
                if visited[ny, nx] or not mask[ny, nx]:
                    continue
                visited[ny, nx] = True
                stack.append((ny, nx))

        if area < min_region_area:
            continue

        padding_x = max(8, int((x_max - x_min) * 0.1))
        padding_y = max(8, int((y_max - y_min) * 0.1))
        padded_x = max(0, x_min - padding_x)
        padded_y = max(0, y_min - padding_y)
        padded_width = min(width - padded_x, (x_max - x_min) + (padding_x * 2))
        padded_height = min(height - padded_y, (y_max - y_min) + (padding_y * 2))
        boxes.append((area, padded_x, padded_y, padded_width, padded_height))

    if not boxes:
        return [(0, 0, image.width, image.height)]

    boxes.sort(key=lambda item: item[0], reverse=True)
    return [(x, y, box_width, box_height) for _, x, y, box_width, box_height in boxes[:max_regions]]
