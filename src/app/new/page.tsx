"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import CreateGroup from "../../components/CreateGroup";
import axios from "axios";

export default function NewGroupPage() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleCreateGroup = async (newGroupData: { name: string; description: string }) => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      await axios.post(
        "/api/groups/create",
        newGroupData,
        { withCredentials: true }
      );
      await queryClient.invalidateQueries({ queryKey: ["joinedGroups"] });
      await queryClient.refetchQueries({ queryKey: ["joinedGroups"] });
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
      <header className="bg-[var(--surface)] border-b border-[var(--border)] shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors"
            aria-label="Go Back"
          >
            <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-[var(--text-primary)]">Create a New Group</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="card p-8 animate-fade-in">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-4">🌟</span>
            <p className="text-[var(--text-secondary)]">
              Start a new accountability group and crush your goals together!
            </p>
          </div>

          <CreateGroup onCreate={handleCreateGroup} />
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Invite your friends to join and make your group more impactful!
        </p>
      </div>
    </div>
  );
}
