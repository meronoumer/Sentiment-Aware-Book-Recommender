"use client";
import React from "react";

import { Book } from "@/types/book";

type Props = {
  book: Book;
  onClick?: () => void;
};

export default function BookCard({ book, onClick }: Props) {
  const genres = book.genres ?? [];

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={0}
      className="card-bg rounded-xl p-4 subtle-transition hover:-translate-y-1 hover:shadow-book cursor-pointer"
      style={{ borderLeftWidth: 4, borderLeftStyle: 'solid', borderLeftColor: 'var(--accent-color, var(--accent-mauve))' }}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-28 h-40 rounded-md overflow-hidden shadow-sm bg-gradient-to-br from-amber-50 to-purple-50 flex items-center justify-center">
          {book.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <div className="w-28 h-40 rounded-md overflow-hidden shadow-sm bg-gradient-to-br from-amber-50 to-purple-50 flex items-center justify-center">
          {/* Show book cover if available, fallback otherwise */}
          <img
            src={book.coverUrl ?? "/fallback-cover.png"}  // fallback image
            alt={book.title + " cover"}
            className="w-full h-full object-cover"
          />
        </div>

          ) : (
            <div className="text-muted text-sm px-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
              </svg>
            </div>
          )}
        </div>

        <div className="w-full">
          <h3 className="title-serif text-base font-semibold leading-tight">{book.title}</h3>
          {book.author && <p className="text-xs text-muted mt-1">by {book.author}</p>}

          {book.description && (
            <p className="text-sm text-gray-600 line-clamp-3 mt-3">{book.description}</p>
          )}

          {genres.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {genres.map((g) => (
                <span key={g} className="text-xs rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
