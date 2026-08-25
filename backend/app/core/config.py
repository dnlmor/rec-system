import os
from pathlib import Path

# Base directory (backend root)
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Artifact paths
DATA_DIR = os.path.join(BASE_DIR, "data")
MODELS_DIR = os.path.join(BASE_DIR, "saved_models")

PRODUCTS_PATH = os.path.join(DATA_DIR, "processed_products.json")
SIMILARITY_PATH = os.path.join(DATA_DIR, "similarity_lookup.json")
USERS_PATH = os.path.join(DATA_DIR, "sample_users.json")

RF_MODEL_PATH = os.path.join(MODELS_DIR, "random_forest_conversion.pkl")
LR_MODEL_PATH = os.path.join(MODELS_DIR, "logistic_baseline.pkl")