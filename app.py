import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Optional

# --- Load data once ---
books_df = pd.read_csv("books.csv")

vectorizer = joblib.load("vectorizer.pkl")
book_vectors = vectorizer.transform(books_df["description"].fillna(""))

# --- App ---
app = FastAPI(title="Mood-Based Book Recommender", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schemas ---
class MoodRequest(BaseModel):
    mood: str


class BookRecommendation(BaseModel):
    title: str
    author: Optional[str] = None
    genres: Optional[List[str]] = None 
    description: Optional[str] = None

class RecommendResponse(BaseModel):
    recommendations: List[BookRecommendation]

# --- Endpoint ---
@app.post("/recommend", response_model=RecommendResponse)
def recommend(req: MoodRequest):
    mood_vec = vectorizer.transform([req.mood])

    similarities = cosine_similarity(mood_vec, book_vectors)[0]
    top_indices = similarities.argsort()[-6:][::-1]

    recommendations = []
    for idx in top_indices:
        row = books_df.iloc[idx]
        recommendations.append({
            "title": row["title"],
            "author": row.get("author"),
            "genres": [g.strip() for g in row["genres"].split(",")] if isinstance(row.get("genres"), str) else [],
            "description": row.get("description"),
        })



    return {"recommendations": recommendations}
