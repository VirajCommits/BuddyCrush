// src/components/GroupChat.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import Image from 'next/image'; // Import Image from next/image
import socket from "../utils/socket"; // Singleton socket instance

type Message = {
  user: string;
  message: string;
  user_image: string;
};

type GroupChatProps = {
  groupId: number;
  onClose: () => void;
};

const GroupChat: React.FC<GroupChatProps> = ({ groupId, onClose }) => {
  const [currentUserName, setCurrentUserName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const data = await res.json();
        setCurrentUserName(data.user.name);
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        setError(err.message || "Error fetching user profile");
      }
    };

    const fetchGroupDescription = async () => {
      try {
        const res = await fetch("/api/groups/discover", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch groups");
        }
        const data = await res.json();
        const group = data.groups.find((g: any) => g.id === groupId);
        console.log(group);
        setGroupDescription(group ? group.name : `Group #${groupId}`);
      } catch (err: any) {
        console.error("Error fetching group description:", err);
        setError(err.message || "Error fetching group description");
      }
    };

    fetchUserProfile();
    fetchGroupDescription();
  }, [groupId]);

  useEffect(() => {
    const handleIncomingMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.emit("join_group", { group_id: groupId });
    socket.on("group_message", handleIncomingMessage);

    return () => {
      socket.emit("leave_group", { group_id: groupId });
      socket.off("group_message", handleIncomingMessage);
    };
  }, [groupId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `/api/groups/${groupId}/messages`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch group messages");
        }
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err: any) {
        console.error("Error fetching messages:", err);
        setError(err.message || "Error fetching group messages");
      }
    };

    fetchMessages();
  }, [groupId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(
        `/api/groups/${groupId}/send-message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ message: newMessage }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      setNewMessage("");
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError("Error sending message. Try again.");
    }
  };

  if (error) {
    return <div style={styles.errorMsg}>Error: {error}</div>;
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button style={styles.backButton} onClick={onClose} aria-label="Close Chat">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={styles.backIcon}
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h2 style={styles.groupName}>{groupDescription}</h2>
      </header>

      <div style={styles.chatContainer}>
        <div style={styles.messagesBox}>
          {messages.length === 0 && (
            <div style={styles.placeholder}>Be the first to write a message!</div>
          )}
          {messages.map((msg, index) => {
            const isMine = msg.user === currentUserName;

            return (
              <div key={index} style={isMine ? styles.rowRight : styles.rowLeft}>
                {!isMine && (
                  <img
                  src={msg.user_image || "https://via.placeholder.com/40"}
                  alt={`${msg.user}'s avatar`}
                  width={40}
                  height={40}
                  style={styles.avatarLeft}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
                  }}
                />
                )}

                <div style={isMine ? styles.bubbleRight : styles.bubbleLeft}>
                  {msg.message}
                </div>

                {isMine && (
                  <img
                  src={msg.user_image || "https://via.placeholder.com/40"}
                  alt={`${msg.user}'s avatar`}
                  width={40}
                  height={40}
                  style={styles.avatarRight}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
                  }}
                />
                )}
              </div>
            );
          })}
        </div>

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button style={styles.sendButton} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    height: "100%",
    width: "100vw",
    margin: "0",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#1e1e2f",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },
  header: {
    padding: "20px",
    backgroundColor: "#2a2a3b",
    display: "flex",
    alignItems: "center",
    color: "#fff",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
  },
  backButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0",
    marginRight: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s",
  },
  backButtonHover: {
    transform: "scale(1.1)",
  },
  backIcon: {
    width: "24px",
    height: "24px",
  },
  groupName: {
    margin: 0,
    fontSize: "1.8rem",
    fontWeight: "bold",
  },
  chatContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "10px 20px",
  },
  messagesBox: {
    flex: 1,
    overflowY: "auto",
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "#2a2a3b",
    borderRadius: "8px",
    boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)",
  },
  placeholder: {
    textAlign: "center",
    color: "#aaa",
    fontStyle: "italic",
    marginTop: "20px",
  },
  rowLeft: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  avatarLeft: {
    borderRadius: "50%",
    marginRight: "10px",
    objectFit: "cover",
  },
  bubbleLeft: {
    backgroundColor: "#2e3a4b",
    padding: "10px 15px",
    borderRadius: "15px 15px 15px 0",
    maxWidth: "70%",
    color: "#fff",
    fontSize: "14px",
  },
  rowRight: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: "10px",
  },
  avatarRight: {
    borderRadius: "50%",
    marginLeft: "10px",
    objectFit: "cover",
  },
  bubbleRight: {
    backgroundColor: "#007bff",
    padding: "10px 15px",
    borderRadius: "15px 15px 0 15px",
    maxWidth: "70%",
    color: "#fff",
    fontSize: "14px",
  },
  inputRow: {
    display: "flex",
    gap: "10px",
    padding: "10px",
  },
  input: {
    flex: 1,
    borderRadius: "8px",
    border: "1px solid #444",
    padding: "10px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#3b3b4f",
    outline: "none",
  },
  sendButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};
