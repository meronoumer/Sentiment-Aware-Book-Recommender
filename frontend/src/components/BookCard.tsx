"use client";
import React from "react";

export type Book = {
  id?: string | number;
  title: string;
  author?: string | null;
  genres?: string[] | null;
  cover_url?: string | null;
  score?: number | null;
  description?: string | null;
};

export default function BookCard({
  id,
  title,
  author,
  genres,
  cover_url,
  score,
  description,
}: Book) {
  return (
    <article className="group flex h-full flex-col justify-between rounded-2xl border border-gray-100 card-bg shadow-book overflow-hidden transition-transform duration-200 hover:-translate-y-1.5 hover:shadow-lg motion-safe:transform">
      <div className="w-full bg-gradient-to-br from-amber-50 via-rose-50 to-teal-50 relative h-44 flex items-center justify-center">
        <div className="absolute left-4 top-4 rounded-md bg-white/80 px-3 py-1 text-xs font-semibold text-gray-800">
          {genres && genres.length ? genres[0] : "Book"}
        </div>
        {/* cover placeholder: gentle vignette */}
        {/** show cover if provided, else subtle placeholder */}
        {typeof (cover_url) !== "undefined" && cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover_url} alt={`${title} cover`} className="h-32 w-24 rounded-sm object-cover shadow-sm transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="h-28 w-20 rounded-sm bg-white/40 shadow-sm" />
        )}
      </div>

      <div className="p-5 flex flex-1 flex-col justify-between">
        <div>
          <h3 className="title-serif text-lg font-semibold text-gray-900 leading-tight">{title}</h3>
          {author && <p className="mt-2 text-sm text-gray-600">by {author}</p>}

          {genres && genres.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {genres.map((g) => (
                <span key={g} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {g}
                </span>
              ))}
            </div>
          )}

          {description && (
            <p className="mt-4 text-sm text-gray-700 line-clamp-3">{description}</p>
          )}
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
            <span className="text-xs">ID: {id ?? "—"}</span>
            {score != null && <span className="text-xs font-semibold text-gray-800">{(score * 100).toFixed(0)}%</span>}
          </div>

          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-2 rounded-full"
              style={{ width: `${Math.min(100, Math.round((score ?? 0) * 100))}%`, background: 'linear-gradient(90deg,var(--accent-amber),var(--accent-mauve))' }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
