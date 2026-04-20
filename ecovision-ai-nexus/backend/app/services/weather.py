from __future__ import annotations

import json
from urllib import parse, request

from app.config import DEFAULT_LATITUDE, DEFAULT_LONGITUDE
from app.schemas import WeatherImpact


def _build_note(category: str, temperature_c: float, wind_speed_kph: float) -> str:
    if category == "organic" and temperature_c >= 28:
        return "Warm conditions can accelerate odor and decomposition, so compost or dispose of organics quickly."
    if category == "hazardous" and temperature_c >= 30:
        return "Hot weather increases battery and chemical storage risk; keep hazardous items shaded until drop-off."
    if wind_speed_kph >= 18:
        return "Breezy conditions can scatter light waste, so use covered bins and secure sorted materials."
    return "Current weather is relatively stable, making this a good time to sort waste accurately."


def get_weather_impact(category: str, latitude: float | None, longitude: float | None) -> WeatherImpact:
    lat = latitude if latitude is not None else DEFAULT_LATITUDE
    lon = longitude if longitude is not None else DEFAULT_LONGITUDE

    params = parse.urlencode(
        {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,weather_code,wind_speed_10m",
        }
    )
    url = f"https://api.open-meteo.com/v1/forecast?{params}"

    try:
        with request.urlopen(url, timeout=8) as response:
            payload = json.loads(response.read().decode("utf-8"))

        current = payload["current"]
        temperature_c = float(current["temperature_2m"])
        wind_speed_kph = float(current["wind_speed_10m"])
        weather_code = int(current["weather_code"])
        source = "Open-Meteo"
    except Exception:
        temperature_c = 27.0
        wind_speed_kph = 11.0
        weather_code = 0
        source = "Open-Meteo (fallback)"

    impact_note = _build_note(category, temperature_c, wind_speed_kph)

    return WeatherImpact(
        temperature_c=temperature_c,
        weather_code=weather_code,
        wind_speed_kph=wind_speed_kph,
        impact_note=impact_note,
        latitude=lat,
        longitude=lon,
        source=source,
    )
