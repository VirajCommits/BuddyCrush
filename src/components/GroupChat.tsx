// src/components/GroupChat.tsx
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import socket from "../utils/socket";

type Message = {
  id?: number;
  user: string;
  message: string;
  user_image?: string;
  created_at?: string;
};

interface GroupChatProps {
  groupId: number;
  currentUser?: string;
  onClose: () => void;
}

const EMOJI_LIST = [
  "\u{1F600}", "\u{1F602}", "\u{1F979}", "\u{1F60D}", "\u{1F929}", "\u{1F60E}", "\u{1F973}", "\u{1F914}", "\u{1F624}", "\u{1F62D}",
  "\u{1F525}", "\u{1F4AA}", "\u{1F3AF}", "\u{1F3C6}", "\u2B50", "\u{1F4AF}", "\u2705", "\u2764\uFE0F", "\u{1F44F}", "\u{1F64C}",
  "\u{1F4AC}", "\u{1F440}", "\u{1F680}", "\u{1F4A1}", "\u{1F389}", "\u{1F3C5}", "\u{1F4C8}", "\u{1F48E}", "\u{1F91D}", "\u2728",
];

export default function GroupChat({ groupId, onClose }: GroupChatProps) {
  const [currentUserName, setCurrentUserName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [groupName, setGroupName] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [hoveredMsg, setHoveredMsg] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) setShowEmoji(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, groupsRes] = await Promise.all([
          fetch("/api/profile", { credentials: "include" }),
          fetch("/api/groups/discover", { credentials: "include" }),
        ]);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setCurrentUserName(profileData.user.name);
        }
        if (groupsRes.ok) {
          const groupsData = await groupsRes.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const group = groupsData.groups.find((g: any) => g.id === groupId);
          setGroupName(group ? group.name : `Group #${groupId}`);
        }
      } catch (err) { console.error("Error fetching data:", err); }
    };
    fetchData();
  }, [groupId]);

  useEffect(() => {
    const handleIncomingMessage = (data: Message) => { setMessages((prev) => [...prev, data]); };
    const handleMessageDeleted = (data: { message_id: number }) => {
      setMessages((prev) => prev.filter((m) => m.id !== data.message_id));
    };
    socket.emit("join_group", { group_id: groupId });
    socket.on("group_message", handleIncomingMessage);
    socket.on("message_deleted", handleMessageDeleted);
    return () => {
      socket.emit("leave_group", { group_id: groupId });
      socket.off("group_message", handleIncomingMessage);
      socket.off("message_deleted", handleMessageDeleted);
    };
  }, [groupId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/groups/${groupId}/messages`, { credentials: "include" });
        if (res.ok) { const data = await res.json(); setMessages(data.messages || []); }
      } catch (err) { console.error("Error fetching messages:", err); }
      finally { setLoading(false); }
    };
    fetchMessages();
  }, [groupId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await fetch(`/api/groups/${groupId}/send-message`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ message: newMessage }),
      });
      setNewMessage(""); setShowEmoji(false); inputRef.current?.focus();
    } catch (err) { console.error("Failed to send message:", err); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage((prev) => prev + emoji); inputRef.current?.focus();
  };

  const handleDeleteMessage = async (messageId: number | undefined) => {
    if (!messageId) return;
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`/api/messages/${messageId}/delete`, { method: "DELETE", credentials: "include" });
      if (res.ok) setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err) { console.error("Failed to delete message:", err); }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--bg-primary)]">
      {/* Chat Header */}
      <header className="flex items-center gap-3 px-5 py-4 bg-[var(--bg-secondary)] border-b border-[var(--border)] shrink-0">
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Close Chat">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-bold">{groupName}</h2>
          <p className="text-xs text-[var(--text-muted)]">Group Chat</p>
        </div>
        <div className="w-3 h-3 rounded-full bg-[var(--success)] animate-pulse" title="Connected" />
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            <p className="text-[var(--text-muted)] text-sm">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
            <svg className="w-16 h-16 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-[var(--text-muted)]">Be the first to send a message!</p>
          </div>
        ) : (
          messages.map((m, i) => {
            const isMine = m.user === currentUserName;
            const showAvatar = i === 0 || messages[i - 1].user !== m.user;
            return (
              <div key={m.id || i}
                className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"} ${showAvatar ? "mt-4" : "mt-0.5"}`}
                onMouseEnter={() => setHoveredMsg(m.id || i)}
                onMouseLeave={() => setHoveredMsg(null)}>
                <div className="w-8 shrink-0">
                  {showAvatar && (
                    <img src={m.user_image || "https://via.placeholder.com/32"} alt={`${m.user}'s avatar`}
                      width={32} height={32} className="rounded-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/32"; }} />
                  )}
                </div>
                <div className={`max-w-[70%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                  {showAvatar && (
                    <span className={`text-xs font-medium mb-1 ${isMine ? "text-[var(--primary-light)]" : "text-[var(--accent)]"} ${isMine ? "text-right" : "text-left"} w-full`}>
                      {m.user}
                    </span>
                  )}
                  <div className="flex items-center gap-1.5 group">
                    {isMine && hoveredMsg === (m.id || i) && (
                      <button onClick={() => handleDeleteMessage(m.id)}
                        className="p-1 rounded hover:bg-red-500/20 text-[var(--text-muted)] hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete message">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                    <div className={`px-4 py-2.5 text-sm leading-relaxed break-words ${
                      isMine ? "bg-gradient-to-br from-[var(--primary)] to-purple-700 text-white rounded-2xl rounded-br-md"
                        : "bg-[var(--surface)] text-[var(--text-primary)] rounded-2xl rounded-bl-md border border-[var(--border)]"}`}>
                      {m.message}
                    </div>
                  </div>
                  {showAvatar && (
                    <span className={`text-[10px] text-[var(--text-muted)] mt-1 ${isMine ? "text-right" : "text-left"} w-full`}>
                      {formatTime(m.created_at)}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {showEmoji && (
        <div ref={emojiRef} className="mx-4 mb-2 p-3 glass-card animate-scale-in grid grid-cols-10 gap-1 max-h-36 overflow-y-auto">
          {EMOJI_LIST.map((emoji) => (
            <button key={emoji} onClick={() => handleEmojiClick(emoji)}
              className="text-xl p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 py-3 bg-[var(--bg-secondary)] border-t border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowEmoji(!showEmoji)}
            className={`p-2.5 rounded-xl transition-all ${showEmoji ? "bg-[var(--primary)]/20 text-[var(--primary-light)]" : "hover:bg-white/10 text-[var(--text-muted)]"}`}
            title="Emojis">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <input ref={inputRef} type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown} placeholder="Type a message..."
            className="flex-1 bg-[var(--surface)] text-white placeholder-[var(--text-muted)] px-4 py-3 rounded-xl border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/50 transition-all text-sm" />
          <button onClick={handleSend} disabled={!newMessage.trim()}
            className={`p-3 rounded-xl transition-all ${newMessage.trim()
              ? "bg-gradient-to-r from-[var(--primary)] to-purple-700 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105"
              : "bg-[var(--surface)] text-[var(--text-muted)] cursor-not-allowed"}`}
            title="Send message">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
