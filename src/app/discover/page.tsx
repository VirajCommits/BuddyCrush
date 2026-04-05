"use client";

import React from "react";
import { useRouter } from "next/navigation";
import DiscoverGroups from "../../components/DiscoverGroups";

export default function DiscoverGroupsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="bg-[var(--surface)] border-b border-[var(--border)] shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-4 px-6 py-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors"
            aria-label="Go Back"
          >
            <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-[var(--text-primary)]">Discover Groups</h1>
        </div>
      </header>

      <DiscoverGroups />
    </div>
  );
}
