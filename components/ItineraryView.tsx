"use client";

import React from "react";
import type { ProcessedItinerary } from "@/lib/processItinerary";
import { estimateReadingTime } from "@/lib/processItinerary";

interface ItineraryViewProps {
  itinerary: ProcessedItinerary;
}

export default function ItineraryView({ itinerary }: ItineraryViewProps) {
  const readingTime = estimateReadingTime(itinerary.wordCount);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card p-8">
        {/* Header */}
        <div className="mb-8 pb-8 border-b border-slate-200">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            {itinerary.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>📖 {readingTime} min read</span>
            <span>📝 {itinerary.wordCount} words</span>
            <span>🕐 {new Date(itinerary.generatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Overview */}
        {itinerary.overview && (
          <div className="mb-8 p-6 bg-brand-50 border border-brand-200 rounded-xl">
            <p className="text-slate-700 leading-relaxed">{itinerary.overview}</p>
          </div>
        )}

        {/* Sections */}
        <div className="space-y-8">
          {itinerary.sections.map((section, idx) => (
            <div key={idx} className="prose-travel">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {section.emoji} {section.title}
              </h2>
              <div
                className="text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: section.content
                    .split("\n")
                    .map((line) => {
                      if (!line.trim()) return "";
                      if (line.startsWith("- "))
                        return `<li>${line.slice(2)}</li>`;
                      if (line.startsWith("| "))
                        return `<tr><td>${line}</td></tr>`;
                      return `<p>${line}</p>`;
                    })
                    .join(""),
                }}
              />
            </div>
          ))}
        </div>

        {/* Raw Markdown */}
        <details className="mt-12 pt-8 border-t border-slate-200">
          <summary className="cursor-pointer font-semibold text-slate-700 hover:text-slate-900">
            View Raw Markdown
          </summary>
          <pre className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg overflow-auto text-xs text-slate-600">
            {itinerary.raw}
          </pre>
        </details>
      </div>
    </div>
  );
}