/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Leaderboard from "./Leaderboard";
import ActivityFeed from "./ActivityFeed";
import {
  completeDailyTask,
  fetchActivityFeed,
  fetchLeaderboard,
  checkHabitCompletion,
  deleteGroup,
} from "../utils/api";
import { triggerHabitConfetti } from "../utils/habitConfetti";
import Link from "next/link";
import socket from "../utils/socket";

const CARD_HEIGHT = 430;

export default function GroupCard({ group, currentUserEmail, onGroupDeleted }) {
  const [activeTab, setActiveTab] = useState("activity");
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const habitStatus = await checkHabitCompletion(group.id);
        setAlreadyCompleted(habitStatus.data.completed);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch habit state.");
      }
    };
    run();
  }, [group.id]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const response = await fetchActivityFeed(group.id);
        setActivityData(response.data.activity);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [group.id]);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetchLeaderboard(group.id);
        setLeaderboardData(res.data.leaderboard);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    run();
  }, [group.id]);

  const handleCompleteHabit = async () => {
    setLoading(true);
    try {
      await completeDailyTask(group.id);
      triggerHabitConfetti();
      setAlreadyCompleted(true);
      const me = group.members.find((m) => m.email === currentUserEmail);
      setActivityData((prev) => [
        ...prev,
        { user_name: me?.name || "You", user_picture: me?.user_image, completed_date: new Date().toISOString().split("T")[0], days_ago: 0 },
      ]);
      setLeaderboardData((prev) =>
        prev.map((u) => u.user_email === currentUserEmail ? { ...u, completion_count: u.completion_count + 1 } : u)
      );
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.error || "Failed to complete.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm(`Delete "${group.name}"? This action cannot be undone.`)) return;
    try {
      await deleteGroup(group.id);
      onGroupDeleted?.();
    } catch (err) {
      console.error("Delete group failed:", err);
      setError(err.response?.data?.error || "Failed to delete group.");
    }
  };

  const tabs = [
    { key: "activity", label: "Activity", icon: "🔥", tip: "Recent completions" },
    { key: "leaderboard", label: "Board", icon: "📊", tip: "Top contributors" },
    { key: "about", label: "About", icon: "ℹ️", tip: "Group info" },
  ];

  return (
    <div className="card flex flex-col rounded-[20px] overflow-hidden" style={{ height: `${CARD_HEIGHT}px` }}>

      {isChatOpen ? (
        <InlineChat groupId={group.id} onClose={() => setIsChatOpen(false)} />
      ) : (
        <>
          {/* ── Title ── */}
          <div className="px-4 pt-4 pb-1 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[15px] font-bold text-[var(--text-primary)] leading-tight truncate flex-1 min-w-0">
                {group.name}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text-muted)] bg-[var(--bg-secondary)] rounded-full px-2 py-0.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                  {group.members.length}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] text-[var(--text-muted)] bg-[var(--bg-secondary)] rounded-full px-2 py-0.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3"/></svg>
                  Public
                </span>
              </div>
            </div>
          </div>

          {/* ── Chat button ── */}
          <div className="px-4 pb-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold hover:bg-[var(--accent)]/20 active:scale-[0.99] transition-all"
              title="Open group chat"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              Open Chat
            </button>
          </div>

          {/* ── Tabs ── */}
          <div className="px-4 pb-2 shrink-0 overflow-hidden">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  title={tab.tip}
                  className={`flex-1 min-w-0 py-1.5 px-1 rounded-full text-[12px] font-medium text-center transition-all truncate ${
                    activeTab === tab.key
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  <span className="mr-0.5">{tab.icon}</span>{tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Content ── */}
          <div className="flex-1 min-h-0 px-4 py-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {activeTab === "activity" && <ActivityFeed activity={activityData} />}
                {activeTab === "leaderboard" && <Leaderboard leaderboard={leaderboardData} />}
                {activeTab === "about" && (
                  <div className="space-y-2">
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{group.description}</p>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                      <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3"/></svg>
                      This group is public
                    </div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">👥 {group.members.length} members</p>
                    <div className="space-y-1">
                      {group.members.slice(0, 5).map((member) => (
                        <div key={member.email} className="flex items-center gap-2 py-0.5">
                          <img src={member.user_image || "https://via.placeholder.com/22"} alt={member.name} width={22} height={22} className="rounded-full object-cover shrink-0" />
                          <span className="text-sm text-[var(--text-secondary)] truncate">{member.name}</span>
                        </div>
                      ))}
                      {group.members.length > 5 && (
                        <p className="text-xs text-[var(--text-muted)] pl-8">+{group.members.length - 5} more</p>
                      )}
                    </div>

                    {group.created_by === currentUserEmail && (
                      <button
                        onClick={handleDeleteGroup}
                        className="w-full mt-3 py-2 rounded-xl text-xs font-semibold text-[var(--danger)] bg-[var(--danger)]/8 hover:bg-[var(--danger)]/15 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        Delete Group
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {error && <p className="px-4 py-1 text-xs text-[var(--danger)] shrink-0">{error}</p>}

          {/* ── Bottom ── */}
          <div className="px-4 pb-4 pt-2 shrink-0">
            {alreadyCompleted ? (
              <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-[var(--success-light)] text-[var(--success)]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                <span className="text-sm font-semibold">Completed today</span>
              </div>
            ) : (
              <button
                onClick={handleCompleteHabit}
                disabled={loading}
                className="w-full py-2.5 rounded-xl font-semibold text-sm bg-[var(--success)] text-white hover:bg-[#43A047] transition-colors active:scale-[0.98]"
              >
                {loading ? "..." : "✓ COMPLETE HABIT"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}


/* ─────────────────────────────────────────────
   Inline chat that renders INSIDE the card
   ───────────────────────────────────────────── */
function InlineChat({ groupId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [userName, setUserName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const pollRef = useRef(null);

  const scroll = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scroll(); }, [messages, scroll]);

  useEffect(() => {
    (async () => {
      try {
        const [pRes, gRes] = await Promise.all([
          fetch("/api/profile", { credentials: "include" }),
          fetch("/api/groups/discover", { credentials: "include" }),
        ]);
        if (pRes.ok) { const d = await pRes.json(); setUserName(d.user.name); }
        if (gRes.ok) {
          const d = await gRes.json();
          const g = d.groups.find((x) => x.id === groupId);
          setGroupName(g ? g.name : `Group #${groupId}`);
        }
      } catch (e) { console.error(e); }
    })();
  }, [groupId]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/groups/${groupId}/messages`, { credentials: "include" });
        if (res.ok) { const d = await res.json(); setMessages(d.messages || []); }
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, [groupId]);

  useEffect(() => {
    socket.emit("join_group", { group_id: groupId });
    const onMsg = (data) => {
      setMessages((prev) => {
        if (data.id && prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
    };
    const onDel = (data) => setMessages((prev) => prev.filter((m) => m.id !== data.message_id));
    socket.on("group_message", onMsg);
    socket.on("message_deleted", onDel);
    return () => {
      socket.emit("leave_group", { group_id: groupId });
      socket.off("group_message", onMsg);
      socket.off("message_deleted", onDel);
    };
  }, [groupId]);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/groups/${groupId}/messages`, { credentials: "include" });
        if (!res.ok) return;
        const d = await res.json();
        const incoming = d.messages || [];
        setMessages((prev) => {
          if (incoming.length === prev.length && incoming.every((m, i) => m.id === prev[i]?.id)) return prev;
          return incoming;
        });
      } catch (e) { void e; }
    };
    pollRef.current = setInterval(poll, 1500);
    return () => clearInterval(pollRef.current);
  }, [groupId]);

  const handleSend = async () => {
    const text = newMsg.trim();
    if (!text) return;
    setNewMsg("");
    inputRef.current?.focus();
    try {
      const res = await fetch(`/api/groups/${groupId}/send-message`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ message: text }),
      });
      if (res.ok) {
        const body = await res.json().catch(() => null);
        const cm = body?.chat_message;
        if (cm?.id) setMessages((prev) => prev.some((m) => m.id === cm.id) ? prev : [...prev, cm]);
      }
    } catch (e) { console.error(e); }
  };

  const fmt = (iso) => { if (!iso) return ""; return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] shrink-0 bg-[var(--surface)]">
        <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" title="Back to card">
          <svg className="w-4 h-4 text-[var(--text-primary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[var(--text-primary)] truncate">{groupName}</p>
        </div>
        <Link href={`/chat/${groupId}`} className="p-1.5 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" title="Expand to full page">
          <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/></svg>
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 chat-wallpaper relative">
        <div className="relative z-10">
          {loading ? (
            <div className="flex items-center justify-center h-20">
              <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <p className="text-center text-xs text-[var(--text-muted)] py-6">No messages yet</p>
          ) : (
            messages.map((m, i) => {
              const mine = m.user === userName;
              const showName = i === 0 || messages[i - 1].user !== m.user;
              return (
                <div key={m.id || i} className={`flex ${mine ? "justify-end" : "justify-start"} ${showName ? "mt-2" : "mt-0.5"}`}>
                  <div className={`max-w-[80%] ${mine ? "bubble-mine" : "bubble-theirs"} px-3 py-1.5 text-[13px] leading-snug`}>
                    {showName && !mine && <p className="text-[10px] font-semibold text-[var(--primary-dark)] mb-0.5">{m.user}</p>}
                    {m.message}
                    <span className={`block text-[9px] mt-0.5 ${mine ? "text-white/50" : "text-[var(--text-muted)]"}`}>{fmt(m.created_at)}</span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* Input */}
      <div className="px-3 py-2 border-t border-[var(--border)] shrink-0 bg-[var(--surface)]">
        <div className="flex items-center gap-1.5">
          <input
            ref={inputRef}
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Message..."
            className="flex-1 bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm px-3 py-2 rounded-full border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/20 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!newMsg.trim()}
            className={`p-2 rounded-full transition-all ${newMsg.trim() ? "bg-[var(--primary)] text-white active:scale-95" : "bg-[var(--bg-secondary)] text-[var(--text-muted)]"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
