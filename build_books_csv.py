import requests
import pandas as pd
import time

BASE_URL = "https://www.googleapis.com/books/v1/volumes"

queries = [
    "fiction",
    "fantasy",
    "science fiction",
    "romance",
    "mystery",
    "self help",
    "history",
    "poetry",
    "philosophy"
]

books = []
seen_ids = set()

for query in queries:
    print(f"Fetching books for query: {query}")

    for start_index in range(0, 200, 40):  # ~200 books per query
        params = {
            "q": query,
            "startIndex": start_index,
            "maxResults": 40,
            "printType": "books",
            "langRestrict": "en"
        }

        response = requests.get(BASE_URL, params=params)
        data = response.json()

        for item in data.get("items", []):
            volume = item.get("volumeInfo", {})

            book_id = item.get("id")
            if not book_id or book_id in seen_ids:
                continue

            seen_ids.add(book_id)

            books.append({
                "id": book_id,
                "title": volume.get("title"),
                "author": ", ".join(volume.get("authors", [])),
                "description": volume.get("description"),
                "genres": ", ".join(volume.get("categories", []))
            })

        time.sleep(0.2)  # be polite to API

print(f"Collected {len(books)} books")

df = pd.DataFrame(books)
df.dropna(subset=["title", "description"], inplace=True)
df.to_csv("books.csv", index=False)

print("Saved books.csv")
