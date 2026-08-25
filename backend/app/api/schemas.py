from pydantic import BaseModel
from typing import List, Optional

class ProductSchema(BaseModel):
    item_id: int
    name: str
    price: float
    category_id: int
    parent_category_id: Optional[int] = 0
    rating: float
    similarity_score: Optional[float] = None

class ConversionPredictRequest(BaseModel):
    visitor_id: int
    item_id: int
    interaction_score: float = 1.0
    user_total_events: int = 5
    user_total_score: float = 8.0
    item_total_views: int = 20
    item_total_carts: int = 4
    item_total_purchases: int = 2

class ConversionPredictResponse(BaseModel):
    random_forest_conversion_prob: float
    logistic_baseline_prob: float
    model_uplift: float