import pandas as pd
from app.ml.model_loader import model_store

def get_recommendations_for_item(item_id: int, top_n: int = 5):
    """
    Retrieves top similar items from Engine A (Cosine Similarity)
    and attaches product metadata.
    """
    str_item_id = str(item_id)
    if str_item_id not in model_store.similarity_lookup:
        # Fallback to top products if item is unknown
        return model_store.products[:top_n]

    raw_recs = model_store.similarity_lookup[str_item_id][:top_n]
    product_map = {p["item_id"]: p for p in model_store.products}

    enhanced_recs = []
    for rec in raw_recs:
        rec_id = rec["recommended_item_id"]
        product_info = product_map.get(rec_id, {
            "item_id": rec_id,
            "name": f"Retail Item #{rec_id}",
            "price": 49.99,
            "category_id": 0,
            "rating": 4.5
        })
        enhanced_recs.append({
            **product_info,
            "similarity_score": rec["similarity_score"]
        })

    return enhanced_recs

def predict_conversion_probability(payload: dict):
    """
    Runs feature input through Random Forest and Logistic Regression
    to compare conversion likelihood.
    """
    # Feature order MUST match X_train in Phase 1:
    # ['interaction_score', 'user_total_events', 'user_total_score', 'item_total_views', 'item_total_carts', 'item_total_purchases']
    features_df = pd.DataFrame([{
        'interaction_score': payload.get('interaction_score', 1.0),
        'user_total_events': payload.get('user_total_events', 5),
        'user_total_score': payload.get('user_total_score', 8.0),
        'item_total_views': payload.get('item_total_views', 20),
        'item_total_carts': payload.get('item_total_carts', 4),
        'item_total_purchases': payload.get('item_total_purchases', 2)
    }])

    rf_prob = float(model_store.rf_model.predict_proba(features_df)[0][1])
    lr_prob = float(model_store.lr_model.predict_proba(features_df)[0][1])

    return {
        "random_forest_conversion_prob": round(rf_prob * 100, 2),
        "logistic_baseline_prob": round(lr_prob * 100, 2),
        "model_uplift": round((rf_prob - lr_prob) * 100, 2)
    }