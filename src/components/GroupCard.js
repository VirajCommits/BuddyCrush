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
      const data = await completeDailyTask(group.id);
      alert(data.message || "Habit completed successfully!");
      setAlreadyCompleted(true);
      setActivityData((prev) => [
        ...prev,
        {
          user_picture: group.members.find((member) => member.email === currentUserEmail)?.user_image,
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
    { key: "activity", label: "Activity" },
    { key: "leaderboard", label: "Leaderboard" },
    { key: "about", label: "About" },
  ];

  return (
    <div className="glass-card overflow-hidden flex flex-col animate-fade-in" style={{ minHeight: "420px" }}>
      {/* Card Header */}
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{group.name}</h3>
          <button
            onClick={() => setIsChatOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[var(--primary-light)]"
            title="Open Chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[var(--bg-primary)]/50 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-[var(--primary)] text-white shadow-lg shadow-purple-500/20"
                  : "text-[var(--text-secondary)] hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-5 overflow-y-auto" style={{ maxHeight: "280px" }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "activity" && <ActivityFeed activity={activityData} />}
            {activeTab === "leaderboard" && <Leaderboard leaderboard={leaderboardData} />}
            {activeTab === "about" && (
              <div>
                <p className="text-[var(--text-secondary)] text-sm mb-4">{group.description}</p>
                <p className="text-sm text-[var(--text-muted)] mb-3 font-medium">{group.members.length} members</p>
                <div className="flex flex-wrap gap-2">
                  {group.members.map((member) => (
                    <div key={member.email} className="flex items-center gap-2 bg-white/5 rounded-full pl-1 pr-3 py-1">
                      <img
                        src={member.user_image || "https://via.placeholder.com/24"}
                        alt={`${member.name}`}
                        width={24} height={24}
                        className="rounded-full object-cover"
                      />
                      <span className="text-xs text-[var(--text-secondary)]">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {error && <p className="px-5 text-sm text-red-400">{error}</p>}

      {/* Complete Habit Button */}
      <div className="p-5 pt-0">
        <button
          onClick={handleCompleteHabit}
          disabled={alreadyCompleted || loading}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
            alreadyCompleted
              ? "bg-[var(--success)]/20 text-[var(--success)] cursor-default"
              : "bg-gradient-to-r from-[var(--success)] to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-100"
          }`}
        >
          {alreadyCompleted ? "\u2705 Completed Today" : loading ? "Completing..." : "\u{1F680} Complete Habit"}
        </button>
      </div>

      {isChatOpen && <GroupChat groupId={group.id} onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
