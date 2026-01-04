"use client";
import { useState } from "react";
import { Star, Coffee, Compass, Music, Sparkles, Cloud, Edit3 } from "lucide-react";

type Props = {
  onSubmit: (mood: string, limit?: number) => Promise<void>;
  defaultLimit?: number;
  onMoodChange?: (accentClass: string | null) => void;
};

const MOODS = [
  { id: "calm", label: "Calm", icon: Star, color: "bg-amber-50 text-amber-800", accent: "accent-amber" },
  { id: "cozy", label: "Cozy", icon: Coffee, color: "bg-amber-50 text-amber-800", accent: "accent-amber" },
  { id: "adventurous", label: "Adventurous", icon: Compass, color: "bg-teal-50 text-teal-800", accent: "accent-teal" },
  { id: "nostalgic", label: "Nostalgic", icon: Music, color: "bg-rose-50 text-rose-800", accent: "accent" },
  { id: "uplifting", label: "Uplifting", icon: Sparkles, color: "bg-amber-50 text-amber-800", accent: "accent-amber" },
  { id: "melancholy", label: "Melancholy", icon: Cloud, color: "bg-slate-50 text-slate-700", accent: "accent" },
];

export default function MoodInput({ onSubmit, defaultLimit = 6, onMoodChange }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(defaultLimit);
  const [localError, setLocalError] = useState<string | null>(null);

  const moodToSend = selected === "custom" ? custom.trim() : selected;

  const handleSelect = (id: string) => {
    setLocalError(null);
    setSelected(id);
    if (id !== "custom") setCustom("");
    const mood = MOODS.find((m) => m.id === id);
    if (mood) onMoodChange?.(mood.accent || null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!moodToSend || !moodToSend.trim()) {
      setLocalError("Pick a mood or enter one to continue.");
      return;
    }
    setLocalError(null);
    setLoading(true);
    try {
      await onSubmit(moodToSend as string, limit);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl">
      <div className="rounded-2xl card-bg p-4 shadow-book">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">How are you feeling today?</h3>
            <p className="mt-1 text-xs text-gray-600">Choose a mood to find a matching book — or write your own.</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm">
              {[3,6,9,12].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {MOODS.map((m) => {
            const active = selected === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelect(m.id)}
                className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition transform duration-200 ${m.color} ${active ? "scale-105 shadow-md" : "hover:scale-105 hover:shadow-sm"}`}
                aria-pressed={active}
              >
                <div className="text-2xl">
                  {m.icon ? (() => {
                    const Icon = m.icon as any;
                    return <Icon className="h-6 w-6" />;
                  })() : null}
                </div>
                <div className="text-xs font-medium">{m.label}</div>
              </button>
            );
          })}

          <div>
            <button
              type="button"
              onClick={() => handleSelect("custom")}
              className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition duration-200 ${selected === "custom" ? "scale-105 shadow-md" : "hover:shadow-sm"}`}
            >
              <div className="text-2xl"><Edit3 className="h-5 w-5" /></div>
              <div className="flex-1">
                <div className="text-xs font-medium">Custom</div>
                {selected === "custom" && (
                  <input
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="e.g. reflective and nostalgic"
                    className="mt-1 w-full rounded-md border border-gray-100 px-2 py-1 text-sm"
                  />
                )}
              </div>
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          {localError && <div className="text-sm text-rose-600">{localError}</div>}
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-white shadow-md transition transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-60" style={{background: 'linear-gradient(90deg, var(--accent-color, var(--accent-amber)), rgba(167,139,250,0.85))'}}>
            {loading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              <span className="text-sm font-semibold">Find books</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
