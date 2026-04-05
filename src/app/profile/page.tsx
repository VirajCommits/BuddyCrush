"use client";

import React, { useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import GroupCard from "../../components/GroupCard";
import Link from "next/link";

interface Group {
  id: number;
  name: string;
  description: string;
  members: Array<{ email: string; user_image?: string; name?: string }>;
}

export default function Profile() {
  const router = useRouter();

  const { data: user, error, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axios.get("/api/profile", { withCredentials: true });
      return response.data.user;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const {
    data: joinedGroups,
    error: groupsError,
    isLoading: groupsLoading,
  } = useQuery<Group[]>({
    queryKey: ["joinedGroups", user?.email],
    queryFn: async () => {
      const response = await axios.get("/api/groups/discover", { withCredentials: true });
      const allGroups: Group[] = response.data.groups || [];
      return allGroups.filter((g) => g.members.some((m) => m.email === user?.email));
    },
    enabled: !!user,
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="pt-8 pb-2 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-center px-5">
          <div className="card px-8 py-3 flex items-center gap-2 shadow-md">
            <span className="text-2xl">🐾</span>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Buddy Crush</h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 pt-4 pb-8 space-y-10 overflow-visible">
        {/* Your groups — full width grid; nothing clipped */}
        <section className="space-y-4 overflow-visible">
          <h2 className="sr-only">Your groups</h2>
          {groupsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-80 rounded-[20px]" />
              ))}
            </div>
          ) : !joinedGroups || joinedGroups.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-[var(--text-secondary)] mb-2">You haven&apos;t joined any groups yet.</p>
              <p className="text-sm text-[var(--text-muted)]">Use Discover or New Group below to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 overflow-visible">
              {joinedGroups.map((group) => (
                <div key={group.id} className="min-w-0 overflow-visible">
                  <GroupCard group={group} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Always at the bottom */}
        <section className="pt-6 border-t border-[var(--border)] overflow-visible">
          <h2 className="text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4">
            More actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            <Link href="/discover" className="no-underline">
              <div className="card card-interactive flex flex-col items-center justify-center py-14 px-6 cursor-pointer min-h-[200px]">
                <div className="w-14 h-14 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-[var(--text-secondary)] tracking-wide uppercase">Discover Groups</span>
              </div>
            </Link>
            <Link href="/new" className="no-underline">
              <div className="card card-interactive flex flex-col items-center justify-center py-14 px-6 cursor-pointer min-h-[200px]">
                <div className="w-14 h-14 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-[var(--text-secondary)] tracking-wide uppercase">New Group</span>
              </div>
            </Link>
          </div>
        </section>
      </div>

      {/* Logout */}
      <div className="max-w-5xl mx-auto px-5 pb-8 flex justify-end">
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-wider"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
