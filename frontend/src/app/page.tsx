"use client";

import MoodInput from "@/components/MoodInput";
import BookCard from "@/components/BookCard";
import { useState as reactUseState } from "react"; // alias just in case
import { Book } from "@/types/book"; 

export default function Page() {
  const [books, setBooks] = reactUseState<Book[]>([]);
  const [loading, setLoading] = reactUseState<boolean>(false);
  const [error, setError] = reactUseState<string | null>(null);
  const [lastLimit, setLastLimit] = reactUseState<number>(6);

  const handleRecommend = async (mood: string, limit: number = 6): Promise<void> => {
    setLoading(true);
    setError(null);
    setBooks([]);
    setLastLimit(limit);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, limit }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      // assume backend returns { recommendations: Book[] }
      setBooks(data.recommendations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <div className="container-center">
        {/* HERO */}
        <header className="hero text-center">
          <div className="mx-auto max-w-3xl py-8 sm:py-10 md:py-14">
            <h1 className="title-serif text-4xl font-extrabold mb-2">
              MoodReads
            </h1>
            <p className="mt-3 text-sm text-gray-600 max-w-xl mx-auto">
              Tell me how you feel and I’ll suggest books that match your mood — calm, adventurous, nostalgic, or uplifting.
            </p>
            <div className="mt-6 flex justify-center">
              <div className="pill-btn">Curated for reading</div>
            </div>
          </div>
        </header>

        {/* INPUT */}
        <section className="mb-10 flex justify-center">
          <div className="w-full max-w-4xl">
            <MoodInput onSubmit={handleRecommend} defaultLimit={6} />

            {error && (
              <div className="mt-4 rounded-lg bg-rose-50/60 px-4 py-3 text-sm text-rose-800">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="font-semibold">
                      {error.includes("find") ? "No results" : "Something went wrong"}
                    </p>
                    <p className="mt-1 text-xs text-rose-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RECOMMENDATIONS */}
        {books.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, idx) => (
              <BookCard key={idx} book={book} onClick={() => {}} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
