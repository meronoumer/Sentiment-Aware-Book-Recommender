"use client";
import React from "react";

export type Book = {
  id?: string | number;
  title: string;
  author?: string | null;
  genres?: string[] | null;
  score?: number | null;
  description?: string | null;
};

export default function BookCard({
  id,
  title,
  author,
  genres,
  score,
  description,
}: Book) {
  return (
    <article className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {author && <p className="mt-1 text-sm text-gray-600">by {author}</p>}
        {genres && genres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {genres.map((g) => (
              <span key={g} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                {g}
              </span>
            ))}
          </div>
        )}
        {description && <p className="mt-3 text-sm text-gray-700">{description}</p>}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span className="text-xs">ID: {id ?? "—"}</span>
        {score != null && <span className="font-medium">{(score * 100).toFixed(0)}%</span>}
      </div>
    </article>
  );
}
