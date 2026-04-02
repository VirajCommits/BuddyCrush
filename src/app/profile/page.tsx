"use client";
/* eslint-disable @next/next/no-img-element */
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
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
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
        <div className="glass-card p-8 text-center">
          <p className="text-red-400 text-lg">Something went wrong. Please try again.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)] animate-pulse">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="glass-card p-8 text-center">
          <p className="text-[var(--text-secondary)]">User not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--bg-primary)]/80 border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold gradient-text">BuddyCrush</h1>
          <div className="flex items-center gap-4">
            <img
              src={user.picture || "https://via.placeholder.com/36"}
              alt="avatar"
              width={36}
              height={36}
              className="rounded-full object-cover ring-2 ring-[var(--primary)]/30"
            />
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Card */}
        <section className="glass-card p-8 mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={user.picture || "https://via.placeholder.com/100"}
              alt={`${user.name}'s avatar`}
              width={100}
              height={100}
              className="rounded-full object-cover ring-4 ring-[var(--primary)]/30 shadow-lg shadow-purple-500/20"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold mb-1">Welcome back, {user.name}!</h2>
              <p className="text-[var(--text-secondary)]">{user.email}</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <Link href="/new" className="no-underline">
            <div className="glass-card p-6 group cursor-pointer hover:border-[var(--primary)]/40 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Create Group</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Start a new accountability group</p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/discover" className="no-underline">
            <div className="glass-card p-6 group cursor-pointer hover:border-[var(--accent)]/40 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent)] to-pink-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Discover Groups</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Find groups that match your goals</p>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Joined Groups */}
        <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--primary-light)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Your Groups
          </h2>

          {groupsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="skeleton h-48 rounded-2xl" />
              ))}
            </div>
          ) : !joinedGroups || joinedGroups.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-[var(--text-secondary)] mb-4">You haven&apos;t joined any groups yet.</p>
              <Link href="/discover" className="btn-primary no-underline inline-block">
                Discover Groups
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {joinedGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
