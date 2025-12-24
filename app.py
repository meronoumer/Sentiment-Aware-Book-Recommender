"""Minimal FastAPI inference-only backend for recommendations.

Usage:
1. Install: python -m pip install -r requirements.txt
2. Run locally: uvicorn app:app --reload --port 8000

Notes:
- Model is loaded from `MODEL_PATH` env var or from `model.pkl` in working directory.
- If the model is missing or doesn't provide a usable API, the endpoint returns mock recommendations.
"""
from typing import List, Optional, Any
import os
import pickle

from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware

MODEL_PATH = os.environ.get("MODEL_PATH", "model.pkl")
model: Optional[Any] = None


class RecommendRequest(BaseModel):
    mood: str
    sentiment: Optional[str] = None
    genres: Optional[List[str]] = None
    limit: Optional[int] = Field(5, ge=1, le=50)


class BookRecommendation(BaseModel):
    title: str
    author: Optional[str] = None
    genres: Optional[List[str]] = None
    score: Optional[float] = None


class RecommendResponse(BaseModel):
    recommendations: List[BookRecommendation]


app = FastAPI(title="Minimal Recommender API", version="0.1")

# CORS: open for minimal local usage (no auth, no DB)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _load_model(path: str) -> Optional[Any]:
    """Try to load a model using pickle. Return None on failure."""
    if not os.path.exists(path):
        return None
    try:
        with open(path, "rb") as f:
            return pickle.load(f)
    except Exception:
        return None


def _generate_mock(limit: int, genres: Optional[List[str]] = None) -> List[BookRecommendation]:
    sample = [
        {"title": "The Little Guide to Feeling Good", "author": "A. Author", "genres": ["self-help"], "score": 0.9},
        {"title": "A Cozy Mystery", "author": "B. Writer", "genres": ["mystery", "cozy"], "score": 0.85},
        {"title": "Space Adventures", "author": "C. Scribe", "genres": ["sci-fi"], "score": 0.8},
        {"title": "Historical Tales", "author": "D. Chronicler", "genres": ["history"], "score": 0.75},
        {"title": "Poems for Quiet Nights", "author": "E. Lyric", "genres": ["poetry"], "score": 0.72},
    ]
    results = []
    i = 0
    while len(results) < limit:
        item = sample[i % len(sample)].copy()
        # slightly vary title to avoid exact duplicates
        item["title"] = f"{item['title']} ({len(results)+1})"
        # if genres filter provided, prefer matches
        if not genres or set(genres).intersection(set(item.get("genres", []))):
            results.append(BookRecommendation(**item))
        i += 1
        # safety to avoid infinite loop if genres filter excludes everything
        if i > limit * 10:
            break
    return results[:limit]


@app.on_event("startup")
def startup_event():
    global model
    model = _load_model(MODEL_PATH)


@app.post("/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest):
    """Return a small list of book recommendations.

    The real model (if present) should implement a simple `recommend` method that accepts
    keyword args `mood`, `sentiment`, `genres`, `limit` and returns an iterable of items.

    Supported return item formats (in order of preference):
    - list of dicts with keys matching `BookRecommendation`
    - list of tuples/lists: (title, author?, genres?, score?)
    - list of strings (title)

    If the model is absent or incompatible, a stable mock list is returned.
    """
    limit = req.limit or 5
    if model is None:
        recs = _generate_mock(limit, req.genres)
        return RecommendResponse(recommendations=recs)

    # Attempt to call model.recommend(...) if available
    try:
        if hasattr(model, "recommend"):
            raw = model.recommend(mood=req.mood, sentiment=req.sentiment, genres=req.genres, limit=limit)
        else:
            # Unknown model API — fall back to mock
            raw = None
    except Exception:
        raw = None

    if not raw:
        recs = _generate_mock(limit, req.genres)
        return RecommendResponse(recommendations=recs)

    parsed: List[BookRecommendation] = []
    for item in list(raw)[:limit]:
        if isinstance(item, dict):
            parsed.append(BookRecommendation(**item))
        elif isinstance(item, (list, tuple)):
            title = item[0] if len(item) > 0 else ""
            author = item[1] if len(item) > 1 else None
            genres = item[2] if len(item) > 2 else None
            score = float(item[3]) if len(item) > 3 and item[3] is not None else None
            parsed.append(BookRecommendation(title=title, author=author, genres=genres, score=score))
        elif isinstance(item, str):
            parsed.append(BookRecommendation(title=item))
        else:
            # cannot interpret — skip
            continue

    if not parsed:
        parsed = _generate_mock(limit, req.genres)

    return RecommendResponse(recommendations=parsed[:limit])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000)
