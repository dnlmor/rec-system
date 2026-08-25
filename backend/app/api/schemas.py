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
    reason: Optional[str] = "Similar to products previously viewed"

class CustomerActivitySchema(BaseModel):
    visitor_id: int
    segment: str
    total_views: int
    total_carts: int
    total_purchases: int
    last_active: str

class BusinessActionSchema(BaseModel):
    action: str
    strategy: str
    discount_tier: Optional[str] = None

class ModelPerformanceSchema(BaseModel):
    conversion_roc_auc: float
    conversion_pr_auc: float
    conversion_f1: float
    rec_precision_at_k: float
    rec_recall_at_k: float
    rec_ndcg_at_k: float

class ConversionPredictRequest(BaseModel):
    visitor_id: int
    item_id: int
    interaction_score: Optional[float] = 1.0
    user_total_events: Optional[int] = 5
    user_total_score: Optional[float] = 8.0
    user_total_purchases: Optional[int] = 0
    item_total_views: Optional[int] = 20
    item_total_carts: Optional[int] = 4
    item_total_purchases: Optional[int] = 2

class ConversionPredictResponse(BaseModel):
    random_forest_conversion_prob: float
    logistic_baseline_prob: float
    model_uplift: float
    intent_category: str
    influencing_factors: List[str]
    business_action: BusinessActionSchema
    performance: ModelPerformanceSchema