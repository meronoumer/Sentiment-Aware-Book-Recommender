import pandas as pd
import pickle
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Load training data
X_train = pd.read_csv("X_train.csv")
y_train = pd.read_csv("y_train.csv")

# Ensure proper shapes
X_train = X_train.iloc[:, 0]  # text column
y_train = y_train.iloc[:, 0]  # label column

# Build pipeline
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', LogisticRegression())
])

pipeline.fit(X_train, y_train)

# Save
with open("mood_pipeline.pkl", "wb") as f:
    pickle.dump(pipeline, f)

print("Model saved as mood_pipeline.pkl")
