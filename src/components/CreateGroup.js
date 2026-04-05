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
          className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] px-4 py-3 rounded-xl border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-sm"
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
          className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] px-4 py-3 rounded-xl border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-sm resize-vertical"
        />
      </div>

      <button
        onClick={handleCreate}
        disabled={isSubmitting || !name.trim() || !description.trim()}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
          !isSubmitting && name.trim() && description.trim()
            ? "bg-[var(--success)] text-white hover:bg-[#43A047] active:scale-[0.98]"
            : "bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed"
        }`}
      >
        {isSubmitting ? "Creating..." : "Create Group"}
      </button>
    </div>
  );
}
