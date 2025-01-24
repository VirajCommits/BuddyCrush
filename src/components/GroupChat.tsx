// src/components/GroupChat.tsx
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
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

  // 1) Join Socket & Listen
  useEffect(() => {
    socket.emit("join_group", { group_id: groupId });
    const handleIncoming = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("group_message", handleIncoming);

    return () => {
      socket.emit("leave_group", { group_id: groupId });
      socket.off("group_message", handleIncoming);
    };
  }, [groupId]);

  // 2) Fetch Messages
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/groups/${groupId}/messages`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    })();
  }, [groupId]);

  // 3) Send a Message
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await fetch(`/api/groups/${groupId}/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message: newMessage }),
    });
    setNewMessage("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onClose} style={styles.closeBtn}>X</button>
        <p style={{ margin: 0 }}>Group Chat</p>
      </div>

      <div style={styles.messagesArea}>
        {messages.map((m, i) => (
          <div key={i} style={styles.messageRow}>
            <Image src={m.user_image || "..."} width={30} height={30} alt="avatar" />
            <div style={styles.bubble}>{m.message}</div>
          </div>
        ))}
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button style={styles.sendBtn} onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

// Define style objects as React.CSSProperties
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "250px", // Or "100%" if parent is sized
    display: "flex",
    flexDirection: "column",
    fontSize: "14px",
    backgroundColor: "#1e1e2f",
    borderRadius: 8,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#2a2a3b",
    padding: "6px 10px",
  },
  closeBtn: {
    cursor: "pointer",
    color: "#fff",
    border: "none",
    background: "none",
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
  bubble: {
    marginLeft: 8,
    backgroundColor: "#2e3a4b",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 12,
    maxWidth: "70%",
  },
  inputRow: {
    display: "flex",
    gap: 6,
    padding: 8,
    backgroundColor: "#2a2a3b",
  },
  input: {
    flex: 1,
    borderRadius: 4,
    border: "1px solid #444",
    backgroundColor: "#2e3a4b",
    color: "#fff",
    padding: "6px",
  },
  sendBtn: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "6px 12px",
    cursor: "pointer",
  },
};
