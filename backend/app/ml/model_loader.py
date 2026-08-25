import json
import joblib
from app.core import config

class MLModelStore:
    def __init__(self):
        self.rf_model = None
        self.lr_model = None
        self.similarity_lookup = {}
        self.products = []
        self.sample_users = []

    def load_artifacts(self):
        print("Loading ML models and data artifacts...")
        
        # Load ML models
        self.rf_model = joblib.load(config.RF_MODEL_PATH)
        self.lr_model = joblib.load(config.LR_MODEL_PATH)

        # Load JSON data
        with open(config.SIMILARITY_PATH, 'r') as f:
            self.similarity_lookup = json.load(f)

        with open(config.PRODUCTS_PATH, 'r') as f:
            self.products = json.load(f)

        with open(config.USERS_PATH, 'r') as f:
            self.sample_users = json.load(f)

        print("Artifacts loaded successfully!")

# Global instance
model_store = MLModelStore()