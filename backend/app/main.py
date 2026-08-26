from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.routes import router
from app.ml.model_loader import model_store
import pandas as pd
import numpy as np

import warnings
warnings.filterwarnings("ignore", category=UserWarning)

def load_stratified_sample(events_path: str, n_samples: int = 10):
    df = pd.read_csv(events_path)
    user_stats = df.groupby('visitorid').agg(
        views=('event', lambda x: (x == 'view').sum()),
        carts=('event', lambda x: (x == 'addtocart').sum()),
        buys=('event', lambda x: (x == 'transaction').sum()),
        total_events=('event', 'count')
    ).reset_index()

    user_stats['strata'] = pd.qcut(
        user_stats['total_events'], 
        q=5, 
        labels=['Casual Browser', 'Active Explorer', 'Consideration Shopper', 'High Intent', 'Power User'],
        duplicates='drop'
    )

    sampled = user_stats.groupby('strata', observed=False).apply(
        lambda x: x.sample(n=min(len(x), max(1, n_samples // 5)), random_state=42)
    ).reset_index(drop=True).head(n_samples)

    sampled['visitor_id'] = sampled['visitorid']
    sampled['segment'] = sampled['strata']

    return sampled.to_dict(orient='records')

@asynccontextmanager
async def lifespan(app: FastAPI):
    model_store.load_artifacts()
    yield

app = FastAPI(
    title="RecMate Recommender API",
    description="FastAPI service serving Cosine Similarity Recommendations & Conversion Predictions",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint to confirm server health on base URL
@app.get("/")
def root():
    return {"status": "ok", "message": "RecMate API Root"}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "RecMate API"}

# Include API router under /api/v1 prefix
app.include_router(router, prefix="/api/v1")