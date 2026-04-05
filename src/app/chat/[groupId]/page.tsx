"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import GroupChat from "../../../components/GroupChat";

export default function FullChatPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = Number(params.groupId);

  if (!groupId || isNaN(groupId)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="card p-8 text-center">
          <span className="text-4xl mb-3 block">🔍</span>
          <p className="text-[var(--text-secondary)]">Invalid group. Please go back and try again.</p>
          <button onClick={() => router.push("/profile")} className="btn-primary mt-4">
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Full-page header */}
      <header className="bg-[var(--surface)] border-b border-[var(--border)] px-5 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => router.push("/profile")}
          className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors"
        >
          <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-[var(--text-primary)]">Full Chat View</h1>
          <p className="text-xs text-[var(--text-muted)]">Expanded conversation</p>
        </div>
      </header>

      {/* Chat area with beautiful wallpaper */}
      <div className="max-w-3xl mx-auto" style={{ height: "calc(100vh - 56px)" }}>
        <GroupChat
          groupId={groupId}
          onClose={() => router.push("/profile")}
          isFullPage={true}
        />
      </div>
    </div>
  );
}
