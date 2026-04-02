"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CreateGroup from "../../components/CreateGroup";
import axios from "axios";

export default function NewGroupPage() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleCreateGroup = async (newGroupData: { name: string; description: string }) => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const response = await axios.post(
        "/api/groups/create",
        newGroupData,
        { withCredentials: true }
      );
      alert(response.data.message || "Group created successfully!");
      router.push("/profile");
    } catch (error: unknown) {
      console.error("Error creating group:", error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        alert(`Failed to create group: ${error.response.data.error}`);
      } else {
        alert("Failed to create group.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--bg-primary)]/80 border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Go Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Create a New Group</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="glass-card p-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--success)] to-emerald-700 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-[var(--text-secondary)]">
              Start a new accountability group and crush your goals together!
            </p>
          </div>

          <CreateGroup onCreate={handleCreateGroup} />
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6 italic">
          Invite your friends to join and make your group more impactful!
        </p>
      </div>
    </div>
  );
}
