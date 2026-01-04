"use client";
import React from "react";

export default function SkeletonCard() {
  return (
    <div className="rounded-xl card-bg p-4 subtle-transition">
      <div className="flex items-start gap-4">
        <div className="w-20 h-28 rounded-md skeleton" />
        <div className="flex-1">
          <div className="h-4 w-3/4 mb-3 rounded skeleton" />
          <div className="h-3 w-1/2 mb-2 rounded skeleton" />
          <div className="h-3 w-full mb-2 rounded skeleton" />
          <div className="h-3 w-5/6 rounded skeleton mt-2" />
        </div>
      </div>
    </div>
  );
}
