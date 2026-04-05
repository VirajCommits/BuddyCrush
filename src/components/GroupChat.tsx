/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import socket from "../utils/socket";
import Link from "next/link";

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
  isFullPage?: boolean;
}

const EMOJI_LIST = [
  "\u{1F600}", "\u{1F602}", "\u{1F979}", "\u{1F60D}", "\u{1F929}", "\u{1F60E}", "\u{1F973}", "\u{1F914}", "\u{1F624}", "\u{1F62D}",
  "\u{1F525}", "\u{1F4AA}", "\u{1F3AF}", "\u{1F3C6}", "\u2B50", "\u{1F4AF}", "\u2705", "\u2764\uFE0F", "\u{1F44F}", "\u{1F64C}",
  "\u{1F4AC}", "\u{1F440}", "\u{1F680}", "\u{1F4A1}", "\u{1F389}", "\u{1F3C5}", "\u{1F4C8}", "\u{1F48E}", "\u{1F91D}", "\u2728",
];

export default function GroupChat({ groupId, onClose, isFullPage = false }: GroupChatProps) {
  const [currentUserName, setCurrentUserName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [groupName, setGroupName] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [hoveredMsg, setHoveredMsg] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const POLL_MS = 1000;

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

  // Socket.IO connection + polling fallback
  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    setIsConnected(socket.connected);

    const handleIncomingMessage = (data: Message) => {
      setMessages((prev) => {
        if (data.id && prev.some(m => m.id === data.id)) return prev;
        return [...prev, data];
      });
    };
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
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [groupId]);

  // Frequent poll keeps other users’ messages visible even if Socket.IO drops (merge by id)
  useEffect(() => {
    const pollMessages = async () => {
      try {
        const res = await fetch(`/api/groups/${groupId}/messages`, { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        const incoming: Message[] = data.messages || [];
        setMessages((prev) => {
          if (
            incoming.length === prev.length &&
            incoming.every((m, i) => m.id === prev[i]?.id && m.created_at === prev[i]?.created_at)
          ) {
            return prev;
          }
          return incoming;
        });
      } catch (err) { console.error("Polling error:", err); }
    };

    pollMessages();
    pollingRef.current = setInterval(pollMessages, POLL_MS);
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
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
    const text = newMessage.trim();
    if (!text) return;
    try {
      const res = await fetch(`/api/groups/${groupId}/send-message`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ message: text }),
      });
      setNewMessage("");
      setShowEmoji(false);
      inputRef.current?.focus();
      if (res.ok) {
        const body = await res.json().catch(() => null);
        const cm = body?.chat_message;
        if (cm?.id) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === cm.id)) return prev;
            return [...prev, cm as Message];
          });
        }
      }
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

  const formatDate = (isoString?: string) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const shouldShowDateSeparator = (index: number) => {
    if (index === 0) return true;
    const curr = messages[index].created_at;
    const prev = messages[index - 1].created_at;
    if (!curr || !prev) return false;
    return new Date(curr).toDateString() !== new Date(prev).toDateString();
  };

  return (
    <div className={`${isFullPage ? "min-h-screen" : "fixed inset-0 z-50"} flex flex-col bg-[var(--bg-primary)]`}>
      {/* Chat Header */}
      <header className="flex items-center gap-3 px-5 py-3.5 bg-[var(--surface)] border-b border-[var(--border)] shrink-0 shadow-sm">
        {!isFullPage && (
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" aria-label="Close Chat">
            <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="flex-1">
          <h2 className="text-base font-bold text-[var(--text-primary)]">{groupName}</h2>
          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-[var(--success)]" : "bg-[var(--accent-warm)]"}`} />
            {isConnected ? "Connected" : "Syncing..."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isFullPage && (
            <Link
              href={`/chat/${groupId}`}
              className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors"
              title="Open full chat"
            >
              <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </Link>
          )}
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 chat-wallpaper relative">
        <div className="relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="w-8 h-8 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
              <p className="text-[var(--text-muted)] text-sm">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <span className="text-5xl">💬</span>
              <p className="text-[var(--text-muted)] text-sm">Be the first to send a message!</p>
            </div>
          ) : (
            messages.map((m, i) => {
              const isMine = m.user === currentUserName;
              const showAvatar = i === 0 || messages[i - 1].user !== m.user;
              const showDate = shouldShowDateSeparator(i);

              return (
                <React.Fragment key={m.id || i}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="text-xs font-medium text-[var(--text-muted)] bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                        {formatDate(m.created_at)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"} ${showAvatar ? "mt-3" : "mt-0.5"} animate-message-pop`}
                    onMouseEnter={() => setHoveredMsg(m.id || i)}
                    onMouseLeave={() => setHoveredMsg(null)}
                  >
                    <div className="w-7 shrink-0">
                      {showAvatar && !isMine && (
                        <img src={m.user_image || "https://via.placeholder.com/28"} alt={m.user}
                          width={28} height={28} className="rounded-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/28"; }} />
                      )}
                    </div>
                    <div className={`max-w-[75%] flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                      {showAvatar && !isMine && (
                        <span className="text-[11px] font-medium text-[var(--primary-dark)] mb-0.5 ml-1">
                          {m.user}
                        </span>
                      )}
                      <div className="flex items-center gap-1 group">
                        {isMine && hoveredMsg === (m.id || i) && (
                          <button onClick={() => handleDeleteMessage(m.id)}
                            className="p-1 rounded-full hover:bg-[var(--danger)]/10 text-[var(--text-muted)] hover:text-[var(--danger)] transition-all opacity-0 group-hover:opacity-100"
                            title="Delete message">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                        <div className={`px-3.5 py-2 text-sm leading-relaxed break-words ${isMine ? "bubble-mine" : "bubble-theirs"}`}>
                          {m.message}
                          <span className={`block text-[10px] mt-0.5 ${isMine ? "text-white/60" : "text-[var(--text-muted)]"}`}>
                            {formatTime(m.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Emoji Picker */}
      {showEmoji && (
        <div ref={emojiRef} className="mx-4 mb-2 p-3 bg-white rounded-2xl shadow-lg border border-[var(--border)] animate-scale-in grid grid-cols-10 gap-0.5 max-h-36 overflow-y-auto">
          {EMOJI_LIST.map((emoji) => (
            <button key={emoji} onClick={() => handleEmojiClick(emoji)}
              className="text-xl p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer">
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 py-3 bg-[var(--surface)] border-t border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowEmoji(!showEmoji)}
            className={`p-2.5 rounded-full transition-all ${showEmoji ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]"}`}
            title="Emojis">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <input ref={inputRef} type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown} placeholder="Type a message..."
            className="flex-1 bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] px-4 py-2.5 rounded-full border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-sm" />
          <button onClick={handleSend} disabled={!newMessage.trim()}
            className={`p-2.5 rounded-full transition-all ${newMessage.trim()
              ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] active:scale-95"
              : "bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed"}`}
            title="Send message">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
