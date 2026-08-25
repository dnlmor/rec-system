from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.routes import router
from app.ml.model_loader import model_store

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load ML models and JSON lookups
    model_store.load_artifacts()
    yield
    # Shutdown logic (if any)

app = FastAPI(
    title="Hybrid E-Commerce Recommender API",
    description="FastAPI service serving Cosine Similarity Recommendations & Random Forest Conversion Predictions",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local testing & Render production deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from React local dev server & Render URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes under /api/v1
app.include_router(router, prefix="/api/v1")