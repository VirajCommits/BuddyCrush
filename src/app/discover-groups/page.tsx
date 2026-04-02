"use client";

import React from "react";
import { useRouter } from "next/navigation";
import DiscoverGroups from "../../components/DiscoverGroups";

export default function DiscoverGroupsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--bg-primary)]/80 border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex items-center gap-4 px-6 py-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Go Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Discover Groups</h1>
        </div>
      </header>
      <DiscoverGroups />
    </div>
  );
}
