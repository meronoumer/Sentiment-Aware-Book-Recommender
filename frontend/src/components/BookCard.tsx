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
      className="card-bg shadow-book rounded-xl p-5 hover:scale-[1.02] transition cursor-pointer"
    >
      <h3 className="title-serif text-lg font-semibold mb-1 text-center">
        {book.title}
      </h3>

      {book.author && (
        <p className="text-sm text-muted text-center mb-3">
          by {book.author}
        </p>
      )}

      {book.description && (
        <p className="text-sm text-gray-600 line-clamp-3 text-center">
          {book.description}
        </p>
      )}

      {genres.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {genres.map((g) => (
            <span
              key={g}
              className="text-xs rounded-full bg-amber-100 px-3 py-1 text-amber-800"
            >
              {g}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
