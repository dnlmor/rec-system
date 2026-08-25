import json
from pathlib import Path
from typing import List
from fastapi import APIRouter, Query

from app.api.schemas import ProductSchema, ConversionPredictRequest, ConversionPredictResponse
from app.ml.model_loader import model_store
from app.ml.recommender import get_recommendations_for_item, predict_conversion_probability

router = APIRouter()
SAMPLE_USERS_PATH = Path(__file__).resolve().parent.parent / "data" / "sample_users.json"


def _derive_segment(views: int, carts: int, buys: int) -> str:
    """Logical behavioral segmentation using interaction volume."""
    if buys >= 2:
        return "High VIP"
    if carts >= 2:
        return "Cart Abandoner"
    if views >= 8:
        return "Active Shopper"
    if views >= 3:
        return "Window Shopper"
    return "Cold Start User"


@router.get("/health")
def health_check():
    return {"status": "ok", "message": "Recommender API is healthy"}


@router.get("/products", response_model=List[ProductSchema])
def get_products(limit: int = Query(20, ge=1, le=100)):
    return model_store.products[:limit]


@router.get("/users")
def get_sample_users():
    """Generates user profiles with logical interaction counts and segments."""
    try:
        if SAMPLE_USERS_PATH.exists():
            with open(SAMPLE_USERS_PATH, "r", encoding="utf-8") as f:
                user_ids = json.load(f)
        else:
            user_ids = model_store.sample_users[:10]
    except Exception:
        user_ids = [2, 6, 37, 51, 54, 64, 74, 75, 97, 155]

    formatted_users = []
    for idx, raw_id in enumerate(user_ids[:10]):
        v_id = int(raw_id) if isinstance(raw_id, (int, str)) else 100 + idx

        # Deterministic feature values derived from user ID
        views = ((v_id * 7) % 18) + 1
        carts = ((v_id * 3) % 4)
        buys = 2 if (v_id % 4 == 0) else (1 if (v_id % 2 == 0 and carts > 0) else 0)

        formatted_users.append({
            "visitor_id": v_id,
            "visitorid": v_id,
            "user_label": f"User {idx + 1} (ID: {v_id})",
            "views": views,
            "carts": carts,
            "buys": buys,
            "total_events": views + carts + buys,
            "segment": _derive_segment(views, carts, buys),
            "interaction_score": round((views * 0.5) + (carts * 2.0) + (buys * 5.0), 2)
        })

    return formatted_users


@router.get("/recommend/{item_id}", response_model=List[ProductSchema])
def get_recommendations(item_id: int, top_n: int = 5):
    return get_recommendations_for_item(item_id, top_n=top_n)


@router.post("/predict-conversion", response_model=ConversionPredictResponse)
def predict_conversion(payload: ConversionPredictRequest):
    data = payload.model_dump()
    res = predict_conversion_probability(data)
    return ConversionPredictResponse(**res)