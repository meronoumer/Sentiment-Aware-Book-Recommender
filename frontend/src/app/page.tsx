"use client";
import { useState } from "react";
import MoodInput from "../components/MoodInput";
import BookCard, { Book } from "../components/BookCard";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastLimit, setLastLimit] = useState<number>(6);

  const handleRecommend = async (mood: string, limit = 6) => {
    setError(null);
    setLastLimit(limit || 6);
    setLoading(true);
    try {
      const payload = { mood, limit };
      let res: Response | null = null;
      try {
        res = await fetch(`/recommend`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } catch (e) {
        // ignore, we'll try fallback
      }

      if (!res || !res.ok) {
        res = await fetch("http://127.0.0.1:8000/recommend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }

      if (!res.ok) throw new Error("request failed");
      const data = await res.json();
      const recs = data.recommendations || [];
      if (!Array.isArray(recs) || recs.length === 0) {
        setError("We couldn’t find books for that mood. Try another feeling.");
        setBooks([]);
      } else {
        setBooks(recs);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong — try again in a moment.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <h1 className="title-serif text-4xl font-extrabold text-gray-900">Moodful</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">Tell me how you feel and I’ll surface books that match your mood — calm, adventurous, nostalgic, or uplifting.</p>
          </div>
          <div className="hidden md:block">
            <div className="rounded-full bg-gradient-to-r from-amber-100 to-pink-100 px-4 py-2 text-sm font-medium text-amber-700 shadow-sm">Curated for reading</div>
          </div>
        </header>

        <section className="mb-8">
          <MoodInput onSubmit={handleRecommend} defaultLimit={6} />
          {error && (
            <div className="mt-4 rounded-lg bg-rose-50/60 px-4 py-3 text-sm text-rose-800">
              <div className="flex items-center gap-3">
                <div className="text-xl">⚠️</div>
                <div>
                  <p className="font-semibold">{error.includes("find") ? "No results" : "Something went wrong"}</p>
                  <p className="mt-1 text-xs text-rose-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Recommendations</h2>

          {loading && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: lastLimit }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 card-bg p-5 shadow-sm">
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="mt-3 skeleton h-4 w-1/3 rounded" />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <div className="skeleton h-6 w-16 rounded-full" />
                    <div className="skeleton h-6 w-12 rounded-full" />
                  </div>
                  <div className="mt-4 skeleton h-12 w-full rounded" />
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
                    <div className="skeleton h-3 w-12 rounded" />
                    <div className="skeleton h-3 w-10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && books.length === 0 && !error && (
            <div className="mt-6 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-100 card-bg p-10 text-center shadow-sm">
              <div className="text-4xl">📚✨</div>
              <h3 className="text-lg font-semibold text-gray-900">Tell me how you’re feeling</h3>
              <p className="text-sm text-gray-600 max-w-xl">Tell me how you’re feeling, and I’ll find a book to match — something calm, uplifting, or thought-provoking.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {["cozy and curious", "adventurous", "nostalgic", "need something uplifting"].map((s) => (
                  <button key={s} onClick={() => handleRecommend(s, 6)} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition hover:shadow-md hover:border-transparent hover:bg-amber-50">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && books.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((b) => (
                <BookCard key={b.id ?? b.title} {...b} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
