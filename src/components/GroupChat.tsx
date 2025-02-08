// src/components/GroupChat.tsx
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";

// Define the shape of each message
interface Message {
  user: string;
  message: string;
  user_image?: string; // optional if not always present
}

// Define props for this component
// NOTE: Added currentUser prop to identify which messages are yours.
interface GroupChatProps {
  groupId: number;
  currentUser: string;
  onClose: () => void;
}

export default function GroupChat({ groupId, currentUser, onClose }: GroupChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Ref for the outer chat container – used to scroll the main page
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // Ref for the inner messages container – used to auto-scroll the messages themselves
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // On component mount, scroll the main page so that the chat container is at the top.
  useEffect(() => {
    chatContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Auto-scroll the messages container whenever messages update.
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 1) Join Socket & Listen
  useEffect(() => {
    // Join group via socket
    socket.emit("join_group", { group_id: groupId });

    // Listen for incoming group messages
    const handleIncoming = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("group_message", handleIncoming);

    // Cleanup on unmount
    return () => {
      socket.emit("leave_group", { group_id: groupId });
      socket.off("group_message", handleIncoming);
    };
  }, [groupId]);

  // 2) Fetch Messages
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/groups/${groupId}/messages`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error("Failed to fetch group messages:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [groupId]);

  // 3) Send a Message
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await fetch(`/api/groups/${groupId}/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: newMessage }),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Loading state: show skeleton placeholders and a "Loading chat..." message
  if (loading) {
    return (
      <>
        {/* Global keyframes for blinking animation */}
        <style jsx global>{`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}</style>

        <div style={styles.container} ref={chatContainerRef}>
          <div style={styles.header}>
            <button onClick={onClose} style={styles.closeBtn}>X</button>
            <p style={{ margin: 0 }}>Group Chat</p>
          </div>

          <div style={styles.loadingContainer}>
            <p style={styles.loadingText}>Loading chat...</p>
          </div>

          <div style={styles.skeletonMessagesArea}>
            <SkeletonMessage />
            <SkeletonMessage />
            <SkeletonMessage />
          </div>

          <div style={styles.inputRow}>
            <input style={styles.inputDisabled} placeholder="Loading..." disabled />
            <button style={styles.sendBtnDisabled} disabled>Send</button>
          </div>
        </div>
      </>
    );
  }

  // Chat display
  return (
    <>
      {/* Global blink animation */}
      <style jsx global>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>

      <div style={styles.container} ref={chatContainerRef}>
        <div style={styles.header}>
          <button onClick={onClose} style={styles.closeBtn}>X</button>
          <p style={{ margin: 0 }}>Group Chat</p>
        </div>

        {/* Messages area with its own scroll behavior.
            The onWheel stops the scroll event from affecting the main page. */}
        <div
          ref={messagesContainerRef}
          onWheel={(e) => e.stopPropagation()}
          style={styles.messagesArea}
        >
          {messages.map((m, i) => {
            const isCurrentUser = m.user === currentUser;
            return (
              <div key={i} style={isCurrentUser ? styles.myMessageRow : styles.otherMessageRow}>
                {/* For other users, show avatar on left */}
                {!isCurrentUser && (
                  <img
                    src={m.user_image || "https://via.placeholder.com/30"}
                    width={30}
                    height={30}
                    alt="avatar"
                    style={styles.avatar}
                  />
                )}

                <div style={styles.messageContent}>
                  <div style={styles.username}>{m.user}</div>
                  <div style={isCurrentUser ? styles.myBubble : styles.otherBubble}>
                    {m.message}
                  </div>
                </div>

                {/* For current user, show avatar on right */}
                {isCurrentUser && (
                  <img
                    src={m.user_image || "https://via.placeholder.com/30"}
                    width={30}
                    height={30}
                    alt="avatar"
                    style={styles.avatar}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button style={styles.sendBtn} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </>
  );
}

// ---------------------
// Skeleton "Message" row
// ---------------------
function SkeletonMessage() {
  return (
    <div style={styles.skeletonMessageRow}>
      <div style={styles.skeletonAvatar} />
      <div style={styles.skeletonBubble} />
    </div>
  );
}

// ---------------------
// Styles
// ---------------------
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "300px",
    display: "flex",
    flexDirection: "column",
    fontSize: "14px",
    backgroundColor: "#1e1e2f",
    borderRadius: 8,
    overflow: "hidden",
    border: "1px solid #2a2a3b",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#2a2a3b",
    padding: "6px 10px",
    borderBottom: "1px solid #3a3a4f",
  },
  closeBtn: {
    cursor: "pointer",
    color: "#fff",
    border: "none",
    background: "none",
    fontSize: "1rem",
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto",
    padding: "8px",
  },
  myMessageRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    marginBottom: "6px",
  },
  otherMessageRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: "6px",
  },
  messageContent: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "70%",
  },
  // Improved username styling:
  username: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#ffdd57",
    marginBottom: "4px",
    letterSpacing: "0.5px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
  },
  myBubble: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 12,
    lineHeight: 1.4,
    textAlign: "right",
  },
  otherBubble: {
    backgroundColor: "#2e3a4b",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 12,
    lineHeight: 1.4,
    textAlign: "left",
  },
  avatar: {
    borderRadius: "50%",
    objectFit: "cover",
    margin: "0 8px",
  },
  inputRow: {
    display: "flex",
    gap: 6,
    padding: 8,
    backgroundColor: "#2a2a3b",
    borderTop: "1px solid #3a3a4f",
  },
  input: {
    flex: 1,
    borderRadius: 4,
    border: "1px solid #444",
    backgroundColor: "#2e3a4b",
    color: "#fff",
    padding: "6px",
    outline: "none",
  },
  sendBtn: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: 500,
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
  },
  loadingText: {
    color: "#ccc",
    fontStyle: "italic",
  },
  skeletonMessagesArea: {
    flex: 1,
    overflowY: "auto",
    padding: "8px",
  },
  skeletonMessageRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
  },
  skeletonAvatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#3a3a4f",
    animation: "blink 1.2s ease-in-out infinite",
  },
  skeletonBubble: {
    marginLeft: "8px",
    backgroundColor: "#3a3a4f",
    height: "16px",
    width: "40%",
    borderRadius: "12px",
    animation: "blink 1.2s ease-in-out infinite",
  },
  inputDisabled: {
    flex: 1,
    borderRadius: 4,
    border: "1px solid #444",
    backgroundColor: "#3a3a4f",
    color: "#888",
    padding: "6px",
    outline: "none",
  },
  sendBtnDisabled: {
    backgroundColor: "#555",
    color: "#ccc",
    border: "none",
    borderRadius: 4,
    padding: "6px 12px",
    cursor: "not-allowed",
    fontWeight: 500,
  },
};
