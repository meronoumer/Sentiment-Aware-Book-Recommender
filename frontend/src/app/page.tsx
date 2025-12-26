"use client";
import { useState } from "react";
import MoodInput from "../components/MoodInput";
import BookCard, { Book } from "../components/BookCard";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async (mood: string, limit = 6) => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, limit }),
      });
      if (!res.ok) throw new Error("request failed");
      const data = await res.json();
      // IMPORTANT: match the backend field exactly
      setBooks(data.recommendations || []);
    } catch (err) {
      console.error(err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Mood-Based Book Recommender</h1>
          <p className="text-gray-600">Type a mood and get tailored book suggestions.</p>
        </header>

        <section className="mb-8">
          <MoodInput onSubmit={handleRecommend} defaultLimit={6} />
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Recommendations</h2>

          {loading && <p className="text-gray-600">Loading recommendations…</p>}

          {!loading && books.length === 0 && (
            <p className="text-gray-500">No recommendations yet — try sending a mood.</p>
          )}

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((b) => (
              <BookCard key={b.id ?? b.title} {...b} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
