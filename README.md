# 🤖 RecMate

> Full-stack e-commerce recommender & real-time conversion predictor built with **FastAPI**, **React (Vite)**, **Tailwind CSS**, and **scikit-learn**.

---

## 📌 Features
- **Item Collaborative Filtering**: Uses Cosine Similarity to find related products.
- **Conversion Predictor**: Uses a Random Forest Classifier to score purchase probability ($0–100\%$).
- **Dynamic Persona Testing**: Simulates window shoppers vs. high-intent buyers in real time.
- **Actionable AI Insights**: Explains predictions in plain English with performance metrics (**ROC-AUC: 0.84**).

---

## 🛠 Tech Stack
- **ML & Data**: Python 3.10+, pandas, scikit-learn (Random Forest, Logistic Regression), scipy
- **Backend**: FastAPI, Uvicorn, Pydantic
- **Frontend**: React 18, Vite, Tailwind CSS, Axios, Lucide Icons
- **Deployment**: Render (Web Service + Static Site)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/products?limit=10` | Fetch product catalog |
| `GET` | `/api/v1/recommend/{item_id}` | Get top similar products re-ranked by conversion probability |
| `POST` | `/api/v1/predict-conversion` | Calculate session purchase probability & business action |

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
*API docs available at `http://localhost:8000/docs`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*App running at `http://localhost:5173`*

---

## ☁️ Deployment (Render)

1. **Backend (Web Service)**
   - **Root Directory**: `backend`
   - **Build**: `pip install -r requirements.txt`
   - **Start**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

2. **Frontend (Static Site)**
   - **Root Directory**: `frontend`
   - **Build**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variable**: `VITE_API_URL=https://<your-backend>.onrender.com`