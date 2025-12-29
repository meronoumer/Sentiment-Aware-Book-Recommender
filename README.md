# Sentiment-Aware Book Recommender

>A mood-based book recommender that matches user mood text to book descriptions using TF-IDF embeddings and cosine similarity. FastAPI powers the backend recommendation API and a Next.js frontend provides the UI.

---

## Table of contents
- [Features](#features)
- [Repository structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Backend (API) — setup & run](#backend-api---setup--run)
- [Frontend — setup & run](#frontend---setup--run)
- [Model training & artifacts](#model-training--artifacts)
- [Data](#data)
- [API Usage Examples](#api-usage-examples)
- [Development notes](#development-notes)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- Convert a short mood phrase into a TF-IDF vector and find similar books by description.
- Simple FastAPI endpoint for recommendations.
- Modern Next.js frontend with a minimal UI for entering mood and displaying recommendations.

## Repository structure (high level)

- `app.py` — FastAPI backend serving `POST /recommend` (loads `vectorizer.pkl` and `books.csv`).
- `requirements.txt` — Python dependencies for backend.
- `train_model.py` — example training script that creates `mood_pipeline.pkl` (a TF-IDF + classifier pipeline).
- `build_books_csv.py` — helper that fetches book metadata and writes `books.csv`.
- `books.csv`, `bookReviewsData.csv` — datasets used by the app (not tracked here if large).
- `frontend/` — Next.js app (run with `npm run dev`).

## Prerequisites

- Python 3.10+ (or compatible)
- Node.js 18+ and npm (for frontend)
- `git` (optional)

## Backend (API) - setup & run

1. Create a virtual environment and install Python dependencies:

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate
pip install -r requirements.txt
```

2. Ensure the following files exist in the project root before starting the API:

- `books.csv` — a CSV with at least a `description` column (see `build_books_csv.py`).
- `vectorizer.pkl` — a saved TF-IDF vectorizer (joblib format) used to vectorize both mood text and book descriptions.

If you only have `mood_pipeline.pkl` (created by `train_model.py`), you can extract and save the TF-IDF vectorizer like this:

```python
import pickle
import joblib

with open("mood_pipeline.pkl", "rb") as f:
    pipeline = pickle.load(f)

vectorizer = pipeline.named_steps['tfidf']
joblib.dump(vectorizer, "vectorizer.pkl")
```

3. Start the FastAPI server (default example uses port 8000):

```bash
uvicorn app:app --reload --port 8000
```

The app exposes `POST /recommend` which accepts JSON: `{ "mood": "I feel ..." }`.

## Frontend - setup & run

1. Install dependencies and run the Next.js app:

```bash
cd frontend
npm install
npm run dev
```

2. By default Next.js runs on port 3000. Open `http://localhost:3000` and enter a mood to get recommendations. Make sure backend is running (`uvicorn ... --port 8000`) and the frontend is configured to call the backend URL (the frontend code expects the API to be accessible at a given URL; if CORS or base URLs need updating, search the frontend for the API base URL).

## Model training & artifacts

- `train_model.py` demonstrates training a TF-IDF + LogisticRegression pipeline and saves it as `mood_pipeline.pkl`.
- The backend currently expects a standalone `vectorizer.pkl` (joblib). If you train using `train_model.py`, extract the TF-IDF step and dump it as `vectorizer.pkl` (see snippet above).

If you want to train a TF-IDF vectorizer only (no classifier):

```python
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib

texts = ... # list/Series of training text (e.g., book descriptions or mood samples)
vec = TfidfVectorizer()
vec.fit(texts)
joblib.dump(vec, "vectorizer.pkl")
```

## Data

- `build_books_csv.py` fetches book metadata (title, author, description, categories) from the Google Books API and writes `books.csv`.
- Ensure `books.csv` is present in the project root and contains `title` and `description` columns (the backend drops rows missing these).

## API usage examples

Simple `curl` request to get recommendations:

```bash
curl -X POST http://localhost:8000/recommend \
  -H "Content-Type: application/json" \
  -d '{"mood": "feeling adventurous and curious"}'
```

Example successful response (JSON):

```json
{
  "recommendations": [
    {"title": "...", "author": "...", "genres": ["..."], "description": "..."},
    ...
  ]
}
```

## Development notes

- The backend uses FastAPI and expects `vectorizer.pkl` (joblib). It precomputes book vectors by transforming `books.csv` descriptions.
- If you modify the vectorizer or the books dataset, restart the backend to reload artifacts.
- CORS is currently wide-open (`allow_origins=["*"]`) for convenience during development; tighten for production.

## Deployment suggestions

- Bundle the backend into a container or run with a production ASGI server (e.g., `uvicorn`/`gunicorn` with workers) and configure environment variables for host/port.
- Build the Next.js frontend (`npm run build` then `npm run start`) or deploy to Vercel/Netlify and point the UI to the backend API URL.

## Contributing

1. Open an issue to discuss major changes.
2. Create a feature branch and a concise PR with tests or reproducible steps.

## License

This project does not include a license file. Add a `LICENSE` if you plan to share or publish this repository.
