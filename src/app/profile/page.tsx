/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import GroupCard from "../../components/GroupCard";
import Link from "next/link";
import { triggerHabitConfetti } from "../../utils/habitConfetti";

interface Group {
  id: number;
  name: string;
  description: string;
  created_by?: string;
  members: Array<{ email: string; user_image?: string; name?: string }>;
}

const INTEREST_TAGS = [
  { label: "Fitness", emoji: "💪", keywords: ["workout", "exercise", "gym", "steps", "walk", "run", "cold shower"] },
  { label: "Reading", emoji: "📚", keywords: ["read", "pages", "book"] },
  { label: "Coding", emoji: "💻", keywords: ["code", "commit", "leetcode", "programming"] },
  { label: "Mindfulness", emoji: "🧘", keywords: ["meditate", "journal", "mindful", "gratitude"] },
  { label: "Nutrition", emoji: "🥗", keywords: ["food", "eat", "clean", "junk", "diet"] },
  { label: "Productivity", emoji: "⚡", keywords: ["social media", "screen", "wake", "morning", "routine"] },
  { label: "Language", emoji: "🌍", keywords: ["language", "duolingo", "flashcard", "learn"] },
  { label: "Creative", emoji: "🎨", keywords: ["draw", "write", "create", "art", "music"] },
];

export default function Profile() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [welcomeFired, setWelcomeFired] = useState(false);

  const { data: user, error, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axios.get("/api/profile", { withCredentials: true });
      return response.data.user;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const { data: allGroups } = useQuery<Group[]>({
    queryKey: ["allGroups"],
    queryFn: async () => {
      const response = await axios.get("/api/groups/discover", { withCredentials: true });
      return response.data.groups || [];
    },
    enabled: !!user,
    staleTime: 60 * 1000,
  });

  const {
    data: joinedGroups,
    error: groupsError,
    isLoading: groupsLoading,
  } = useQuery<Group[]>({
    queryKey: ["joinedGroups", user?.email],
    queryFn: async () => {
      const groups: Group[] = allGroups || [];
      return groups.filter((g) => g.members.some((m) => m.email === user?.email));
    },
    enabled: !!user && !!allGroups,
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const isNewUser = !groupsLoading && (!joinedGroups || joinedGroups.length === 0);

  useEffect(() => {
    if (isNewUser && !welcomeFired) {
      setWelcomeFired(true);
      setTimeout(() => triggerHabitConfetti(), 600);
    }
  }, [isNewUser, welcomeFired]);

  const suggestedGroups = useMemo(() => {
    if (!allGroups || !user) return [];
    const notJoined = allGroups.filter(
      (g) => !g.members.some((m) => m.email === user.email)
    );
    if (selectedTags.length === 0) return notJoined.slice(0, 6);

    const activeKeywords = INTEREST_TAGS
      .filter((t) => selectedTags.includes(t.label))
      .flatMap((t) => t.keywords);

    const scored = notJoined.map((g) => {
      const text = `${g.name} ${g.description}`.toLowerCase();
      const score = activeKeywords.filter((kw) => text.includes(kw)).length;
      return { group: g, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.group).slice(0, 6);
  }, [allGroups, user, selectedTags]);

  const handleQuickJoin = useCallback(async (groupId: number) => {
    try {
      await axios.post(`/api/groups/${groupId}/join`, {}, { withCredentials: true });
      await queryClient.invalidateQueries({ queryKey: ["allGroups"] });
      await queryClient.invalidateQueries({ queryKey: ["joinedGroups"] });
      triggerHabitConfetti();
    } catch (err) {
      console.error("Join failed:", err);
    }
  }, [queryClient]);

  const toggleTag = (label: string) => {
    setSelectedTags((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const handleLogout = useCallback(async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, [router]);

  if (error || groupsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="card p-8 text-center">
          <p className="text-[var(--danger)] text-lg">Something went wrong. Please try again.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)] text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="card p-8 text-center">
          <p className="text-[var(--text-secondary)]">User not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      {/* ───── Header ───── */}
      <header className="py-6 shrink-0">
        <div className="flex justify-center">
          <div className="card px-8 py-3 flex items-center gap-2 shadow-md">
            <span className="text-2xl">🐾</span>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Pal Crush</h1>
          </div>
        </div>
      </header>

      {/* ───── Main content ───── */}
      <main className="flex-1 w-full max-w-[960px] mx-auto px-6">

        {groupsLoading ? (
          <section className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton rounded-[20px]" style={{ height: 420 }} />
              ))}
            </div>
          </section>
        ) : isNewUser ? (
          /* ╔══════════════════════════════════════════════╗
             ║  NEW USER WELCOME EXPERIENCE                ║
             ╚══════════════════════════════════════════════╝ */
          <section className="mb-12">
            {/* ── Welcome Hero ── */}
            <div className="card p-8 md:p-10 text-center mb-8 animate-scale-in overflow-hidden relative">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-[var(--primary)]/8 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-[var(--accent)]/6 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
              </div>

              <div className="relative z-10">
                {user.picture && (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-[var(--primary)]/20 shadow-lg object-cover"
                  />
                )}
                <div className="text-3xl mb-2">👋</div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] mb-2">
                  Welcome, {user.name?.split(" ")[0]}!
                </h2>
                <p className="text-[var(--text-secondary)] text-base max-w-md mx-auto leading-relaxed">
                  Your goal-crushing journey starts now. Join a group, build habits with friends, and watch your streaks grow.
                </p>
              </div>
            </div>

            {/* ── How it Works ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { icon: "🎯", title: "Pick a group", desc: "Find people who share your goals" },
                { icon: "✅", title: "Build streaks", desc: "Complete habits daily together" },
                { icon: "🏆", title: "Climb the board", desc: "Compete and motivate each other" },
              ].map((step, i) => (
                <div
                  key={step.title}
                  className="card p-5 text-center animate-slide-up opacity-0"
                  style={{ animationDelay: `${0.2 + i * 0.15}s`, animationFillMode: "forwards" }}
                >
                  <div className="text-3xl mb-2">{step.icon}</div>
                  <p className="text-sm font-bold text-[var(--text-primary)] mb-1">{step.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* ── Interest Tag Picker ── */}
            <div className="text-center mb-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">What do you want to crush?</p>
              <div className="flex flex-wrap justify-center gap-2">
                {INTEREST_TAGS.map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => toggleTag(tag.label)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedTags.includes(tag.label)
                        ? "bg-[var(--primary)] text-white shadow-md scale-105"
                        : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    }`}
                  >
                    <span className="mr-1">{tag.emoji}</span>{tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Suggested Groups ── */}
            {suggestedGroups.length > 0 && (
              <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
                <p className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-5">
                  {selectedTags.length > 0 ? "Groups matching your interests" : "Popular groups to join"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestedGroups.map((group, i) => (
                    <div
                      key={group.id}
                      className="card p-5 flex flex-col justify-between hover:shadow-md transition-all duration-300 animate-slide-up opacity-0"
                      style={{ animationDelay: `${0.9 + i * 0.08}s`, animationFillMode: "forwards" }}
                    >
                      <div>
                        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1.5">{group.name}</h3>
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">{group.description}</p>
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex -space-x-1.5">
                            {group.members.slice(0, 4).map((m, mi) => (
                              <img
                                key={mi}
                                src={m.user_image || "https://via.placeholder.com/24"}
                                alt=""
                                className="w-6 h-6 rounded-full border-2 border-[var(--surface)] object-cover"
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-[var(--text-muted)] ml-1">
                            {group.members.length} member{group.members.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleQuickJoin(group.id)}
                        className="w-full py-2 rounded-xl text-xs font-semibold btn-primary"
                      >
                        Join Group
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Bottom Actions ── */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
              <Link
                href="/discover"
                className="px-8 py-3 rounded-full text-sm font-semibold text-[var(--primary)] border border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all no-underline"
              >
                Browse All Groups
              </Link>
              <Link
                href="/new"
                className="px-8 py-3 rounded-full text-sm font-semibold text-[var(--text-secondary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-all no-underline"
              >
                Create Your Own Group
              </Link>
            </div>
          </section>
        ) : (
          /* ╔══════════════════════════════════════════════╗
             ║  EXISTING USER — GROUP CARDS                ║
             ╚══════════════════════════════════════════════╝ */
          <>
            <section className="mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {joinedGroups!.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    currentUserEmail={user?.email}
                    onGroupDeleted={() => queryClient.invalidateQueries({ queryKey: ["joinedGroups"] })}
                  />
                ))}
              </div>
            </section>

            {/* ───── Actions (always bottom) ───── */}
            <section className="pb-10">
              <div className="border-t border-[var(--border)] pt-6 mb-5">
                <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                  More actions
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
                <Link href="/discover" className="no-underline">
                  <div className="card card-interactive flex flex-col items-center justify-center py-12 px-6 cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-3" title="Discover groups">
                      <svg className="w-6 h-6 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-secondary)] tracking-wide uppercase">Discover Groups</span>
                  </div>
                </Link>
                <Link href="/new" className="no-underline">
                  <div className="card card-interactive flex flex-col items-center justify-center py-12 px-6 cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-3" title="Create new group">
                      <svg className="w-6 h-6 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-secondary)] tracking-wide uppercase">New Group</span>
                  </div>
                </Link>
              </div>
            </section>
          </>
        )}
      </main>

      {/* ───── Footer ───── */}
      <footer className="shrink-0 py-5">
        <div className="max-w-[960px] mx-auto px-6 flex justify-end">
          <button
            onClick={handleLogout}
            className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-wider"
          >
            Logout
          </button>
        </div>
      </footer>
    </div>
  );
}
