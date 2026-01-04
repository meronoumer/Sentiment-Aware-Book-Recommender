"use client";


import MoodInput from "@/components/MoodInput";
import BookCard from "@/components/BookCard";
import SkeletonCard from "@/components/SkeletonCard";
import { useState as reactUseState } from "react";
import { Book } from "@/types/book"; 

export default function Page() {
  const [books, setBooks] = reactUseState<Book[]>([]);
  const [loading, setLoading] = reactUseState<boolean>(false);
  const [error, setError] = reactUseState<string | null>(null);
  const [lastLimit, setLastLimit] = reactUseState<number>(6);
  const [accentClass, setAccentClass] = reactUseState<string | null>("accent");

  const handleRecommend = async (mood: string, limit: number = 6): Promise<void> => {
    setLoading(true);
    setError(null);
    setBooks([]);
    setLastLimit(limit);

    try {
      const response = await fetch("http://localhost:8000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, limit }),
    });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      console.log("API response:", data);

      // assume backend returns { recommendations: Book[] }
      setBooks(data.recommendations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <main className={`app-shell ${accentClass ?? "accent"}`}>
      <div className="container-center">
        {/* HERO */}
        <header className="hero text-center hero-glow">
          <div className="mx-auto max-w-3xl py-8 sm:py-10 md:py-14 fade-in-up">
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
            <MoodInput onSubmit={handleRecommend} defaultLimit={6} onMoodChange={(c) => setAccentClass(c)} />

            {error && (
              <div className="mt-4 rounded-lg bg-rose-50/60 px-4 py-3 text-sm text-rose-800">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="font-semibold">Something went wrong</p>
                    <p className="mt-1 text-xs text-rose-700">{error}</p>
                    <div className="mt-2 text-xs text-gray-600">Try a different mood or check your network.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RECOMMENDATIONS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: lastLimit }).map((_, i) => <SkeletonCard key={i} />)
          ) : books.length > 0 ? (
            books.map((book, idx) => <BookCard key={idx} book={book} onClick={() => {}} />)
          ) : (
            <div className="col-span-full mt-6">
              <div className="rounded-xl card-bg p-8 text-center shadow-book">
                <h3 className="text-lg font-semibold">No recommendations yet</h3>
                <p className="mt-2 text-sm text-gray-600">Try selecting a mood to get curated book suggestions. The UI will adapt to the mood you choose.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
