// src/components/GroupChat.tsx
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import socket from "../utils/socket";

// Define the shape of each message
interface Message {
  user: string;
  message: string;
  user_image?: string; // optional if not always present
}

// Define props for this component
interface GroupChatProps {
  groupId: number;
  onClose: () => void;
}

export default function GroupChat({ groupId, onClose }: GroupChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

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

  // If loading, show skeleton placeholders + "Loading chat..."
  if (loading) {
    return (
      <>
        {/* Global keyframes for blinking animation */}
        <style jsx global>{`
          @keyframes blink {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }
        `}</style>

        <div style={styles.container}>
          <div style={styles.header}>
            <button onClick={onClose} style={styles.closeBtn}>
              X
            </button>
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
            <input
              style={styles.inputDisabled}
              placeholder="Loading..."
              disabled
            />
            <button style={styles.sendBtnDisabled} disabled>
              Send
            </button>
          </div>
        </div>
      </>
    );
  }

  // Otherwise, show the actual chat
  return (
    <>
      {/* Keep the blink animation globally if you'd like to reuse it */}
      <style jsx global>{`
        @keyframes blink {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={onClose} style={styles.closeBtn}>
            X
          </button>
          <p style={{ margin: 0 }}>Group Chat</p>
        </div>

        <div style={styles.messagesArea}>
          {messages.map((m, i) => (
            <div key={i} style={styles.messageRow}>
              <img
                src={m.user_image || "https://via.placeholder.com/30"}
                width={30}
                height={30}
                alt="avatar"
                style={styles.avatar}
              />
              <div style={styles.bubble}>{m.message}</div>
            </div>
          ))}
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
  messageRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "6px",
  },
  avatar: {
    borderRadius: "50%",
    objectFit: "cover",
  },
  bubble: {
    marginLeft: 8,
    backgroundColor: "#2e3a4b",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 12,
    maxWidth: "70%",
    lineHeight: 1.4,
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

  // Loading state (skeleton)
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

  // Skeleton row
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

  // Disabled input & send button during loading
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
