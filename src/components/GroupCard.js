/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Leaderboard from "./Leaderboard";
import ActivityFeed from "./ActivityFeed";
import {
  completeDailyTask,
  fetchActivityFeed,
  fetchLeaderboard,
  fetchProfile,
  checkHabitCompletion,
} from "../utils/api";
import GroupChat from "./GroupChat";
import { triggerHabitConfetti } from "../utils/habitConfetti";

export default function GroupCard({ group }) {
  const [activeTab, setActiveTab] = useState("activity");
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchCurrentUserAndCheckCompletion = async () => {
      try {
        const response = await fetchProfile();
        const curUser = response.data.user;
        setCurrentUserEmail(curUser.email);
        const habitStatus = await checkHabitCompletion(group.id);
        setAlreadyCompleted(habitStatus.data.completed);
      } catch (err) {
        console.error("Error fetching user or habit status:", err);
        setError("Failed to fetch user or habit state.");
      }
    };
    fetchCurrentUserAndCheckCompletion();
  }, [group.id]);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      try {
        const response = await fetchActivityFeed(group.id);
        setActivityData(response.data.activity);
      } catch (err) {
        console.error("Error fetching activity:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [group.id]);

  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        const res = await fetchLeaderboard(group.id);
        setLeaderboardData(res.data.leaderboard);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };
    getLeaderboard();
  }, [group.id]);

  const handleCompleteHabit = async () => {
    setLoading(true);
    try {
      await completeDailyTask(group.id);
      triggerHabitConfetti();
      setAlreadyCompleted(true);
      const me = group.members.find((member) => member.email === currentUserEmail);
      setActivityData((prev) => [
        ...prev,
        {
          user_name: me?.name || "You",
          user_picture: me?.user_image,
          completed_date: new Date().toISOString().split("T")[0],
          days_ago: 0,
        },
      ]);
      setLeaderboardData((prev) =>
        prev.map((user) =>
          user.user_email === currentUserEmail
            ? { ...user, completion_count: user.completion_count + 1 }
            : user
        )
      );
    } catch (err) {
      console.error("Error completing habit:", err);
      setError(err.response?.data?.error || "Failed to complete the daily task.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: "activity", label: "Activity", icon: "🔥" },
    { key: "leaderboard", label: "Leaderboard", icon: "📊" },
    { key: "about", label: "About", icon: "ℹ️" },
  ];

  return (
    <div className="card flex flex-col rounded-[20px] overflow-hidden animate-fade-in" style={{ minHeight: "380px" }}>
      {/* Card Header */}
      <div className="p-5 pb-3 pt-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-base font-bold text-[var(--text-primary)] leading-snug pr-1 flex-1 min-w-0">{group.name}</h3>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
                {group.members.length}
              </span>
              <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-1.5 pl-3 pr-3 py-2 rounded-full bg-[var(--accent)] text-white text-xs font-bold uppercase tracking-wide shadow-md hover:brightness-95 active:scale-[0.98] transition-all"
              title="Open group chat"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chat
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`tab-pill flex items-center gap-1 ${
                activeTab === tab.key ? "tab-pill-active" : "tab-pill-inactive"
              }`}
            >
              <span className="text-xs">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-5 py-3 overflow-y-auto" style={{ maxHeight: "240px" }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "activity" && <ActivityFeed activity={activityData} />}
            {activeTab === "leaderboard" && <Leaderboard leaderboard={leaderboardData} />}
            {activeTab === "about" && (
              <div className="space-y-3">
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{group.description}</p>
                <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
                  </svg>
                  This group is public
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  👥 {group.members.length} members
                </p>
                <div className="space-y-1.5">
                  {group.members.map((member) => (
                    <div key={member.email} className="flex items-center gap-2 py-1">
                      <img
                        src={member.user_image || "https://via.placeholder.com/28"}
                        alt={`${member.name}`}
                        width={28} height={28}
                        className="rounded-full object-cover"
                      />
                      <span className="text-sm text-[var(--text-secondary)]">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {error && <p className="px-5 text-xs text-[var(--danger)]">{error}</p>}

      {/* Bottom Action */}
      <div className="p-4 pt-2">
        {alreadyCompleted ? (
          <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--success-light)] text-[var(--success)]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span className="text-sm font-semibold">Completed today</span>
          </div>
        ) : (
          <button
            onClick={handleCompleteHabit}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm bg-[var(--success)] text-white hover:bg-[#43A047] transition-colors active:scale-[0.98]"
          >
            {loading ? "Completing..." : "✓ COMPLETE HABIT"}
          </button>
        )}
      </div>

      {/* Inline Chat Modal */}
      {isChatOpen && (
        <GroupChat
          groupId={group.id}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}
