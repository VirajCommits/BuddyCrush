"use client";

import React, { useState } from "react";

export default function CreateGroup({ onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (isSubmitting) return;
    if (!name.trim() || !description.trim()) {
      alert("Please provide both name and description.");
      return;
    }
    setIsSubmitting(true);
    try {
      onCreate({ name: name.trim(), description: description.trim() });
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error in CreateGroup component:", error);
      alert("Failed to create group.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && name.trim() && description.trim()) {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Group Name
        </label>
        <input
          type="text"
          placeholder="e.g. Morning Runners, Book Club, Code Daily"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          className="w-full bg-[var(--surface)] text-white placeholder-[var(--text-muted)] px-4 py-3 rounded-xl border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/50 transition-all text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Description
        </label>
        <textarea
          placeholder="What would people gain by joining your group? What should they do?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          rows={4}
          className="w-full bg-[var(--surface)] text-white placeholder-[var(--text-muted)] px-4 py-3 rounded-xl border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/50 transition-all text-sm resize-vertical"
        />
      </div>

      <button
        onClick={handleCreate}
        disabled={isSubmitting || !name.trim() || !description.trim()}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
          !isSubmitting && name.trim() && description.trim()
            ? "bg-gradient-to-r from-[var(--success)] to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-100"
            : "bg-[var(--surface)] text-[var(--text-muted)] cursor-not-allowed"
        }`}
      >
        {isSubmitting ? "Creating..." : "Create Group"}
      </button>
    </div>
  );
}
