from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.api.schemas import ProductSchema, ConversionPredictRequest, ConversionPredictResponse
from app.ml.model_loader import model_store
from app.ml.recommender import get_recommendations_for_item, predict_conversion_probability

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok", "message": "Recommender API is healthy"}

@router.get("/products", response_model=List[ProductSchema])
def get_products(limit: int = Query(20, ge=1, le=100)):
    return model_store.products[:limit]

@router.get("/users", response_model=List[int])
def get_sample_users():
    return model_store.sample_users

@router.get("/recommend/{item_id}", response_model=List[ProductSchema])
def get_recommendations(item_id: int, top_n: int = 5):
    return get_recommendations_for_item(item_id, top_n=top_n)

@router.post("/predict-conversion", response_model=ConversionPredictResponse)
def predict_conversion(payload: ConversionPredictRequest):
    return predict_conversion_probability(payload.model_dump())