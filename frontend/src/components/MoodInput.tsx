"use client";
import { useState } from "react";

type Props = {  
  onSubmit: (mood: string, limit?: number) => Promise<void>;
  defaultLimit?: number;
};

export default function MoodInput({ onSubmit, defaultLimit = 6 }: Props) {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(defaultLimit);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!mood.trim()) return;
    setLoading(true);
    try {
      await onSubmit(mood.trim(), limit);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-3 items-center">
        <input
          aria-label="Enter your mood"
          className="flex-1 rounded-md border border-gray-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="How are you feeling? e.g. cozy, adventurous, thoughtful..."
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="w-24 rounded-md border border-gray-200 px-3 py-2 bg-white"
          aria-label="Number of results"
        >
          {[3,6,9,12].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            "Recommend"
          )}
        </button>
      </div>
    </form>
  );
}
