import httpx
from app.core.config import settings
from typing import Optional, Tuple
from math import radians, sin, cos, sqrt, atan2

async def geocode_address(address: str, city: str, state: str) -> Optional[Tuple[float, float]]:
    if not settings.GEOAPIFY_API_KEY:
        return None

    url = "https://api.geoapify.com/v1/geocode/search"
    params = {"text": f"{address}, {city}, {state}", "apiKey": settings.GEOAPIFY_API_KEY, "limit": 1}

    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        data = r.json()
        features = data.get("features") or []
        if not features:
            return None
        lon, lat = features[0]["geometry"]["coordinates"]
        return (lat, lon)

def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    return R * c
