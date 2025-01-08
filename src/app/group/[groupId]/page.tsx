"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import socket from "../../../utils/socket"; // Singleton socket instance

/** Type for messages in chat */
type Message = {
  user: string; // e.g. user email or user ID
  message: string;
  picture: string; // the avatar URL
};

export default function GroupChatPage() {
  const params = useParams();
  const groupId = params.groupId; // e.g., "1"

  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [groupName, setGroupName] = useState(`Group #${groupId}`);
  const [error, setError] = useState("");

  /** Fetch user profile */
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const data = await res.json();
        setCurrentUserEmail(data.user.name);
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        setError(err.message || "Error fetching user profile");
      }
    };

    fetchUserProfile();
  }, []);

  /** Initialize socket and manage listeners */
  useEffect(() => {
    const handleIncomingMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    // Join the group and listen for messages
    socket.emit("join_group", { group_id: groupId });
    socket.on("group_message", handleIncomingMessage);

    // Cleanup on unmount
    return () => {
      socket.emit("leave_group", { group_id: groupId });
      socket.off("group_message", handleIncomingMessage);
    };
  }, [groupId]);

  /** Fetch existing messages on initial load */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/groups/${groupId}/messages`, {
          credentials: "include",
        });
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

  /** Send a new message */
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/groups/${groupId}/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: newMessage }),
      });
      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      setNewMessage("");
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError("Error sending message. Try again.");
    }
  };

  /** Render the component */
  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h2 style={styles.groupName}>{groupName}</h2>
      </header>

      <div style={styles.chatContainer}>
        <div style={styles.messagesBox}>
          {messages.map((msg, index) => {
            console.log(">>>>" , msg.user , msg , currentUserEmail)
            const isMine = msg.user === currentUserEmail;

            return (
              <div key={index} style={isMine ? styles.rowRight : styles.rowLeft}>
                {!isMine && (
                  <img src={msg.picture} alt="Avatar" style={styles.avatarLeft} />
                )}

                <div style={isMine ? styles.bubbleRight : styles.bubbleLeft}>
                  {msg.message}
                </div>

                {isMine && (
                  <img src={msg.picture} alt="My Avatar" style={styles.avatarRight} />
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

/** Inline styling for left/right alignment */
const styles: { [key: string]: React.CSSProperties } = {
  error: {
    color: "red",
    margin: "40px auto",
    textAlign: "center",
  },
  page: {
    minHeight: "100vh",
    backgroundColor: "#121212",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    fontFamily: "sans-serif",
  },
  header: {
    backgroundColor: "#360929",
    padding: "10px 20px",
  },
  groupName: {
    margin: 0,
    fontSize: "1.5rem",
  },
  chatContainer: {
    flex: 1,
    maxWidth: "800px",
    margin: "30px auto",
    display: "flex",
    flexDirection: "column",
    borderRadius: "10px",
    backgroundColor: "#1c1c1c",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
  },
  messagesBox: {
    flex: 1,
    overflowY: "auto",
    marginBottom: "20px",
    paddingRight: "10px",
  },
  // Align messages on the left
  rowLeft: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  avatarLeft: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    marginRight: "8px",
    objectFit: "cover",
  },
  bubbleLeft: {
    backgroundColor: "#2a2a2a",
    padding: "10px 15px",
    borderRadius: "10px",
    maxWidth: "60%",
  },
  // Align messages on the right
  rowRight: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: "8px",
  },
  avatarRight: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    marginLeft: "8px",
    objectFit: "cover",
  },
  bubbleRight: {
    backgroundColor: "#007bff",
    padding: "10px 15px",
    borderRadius: "10px",
    maxWidth: "60%",
  },
  inputRow: {
    display: "flex",
    gap: "8px",
  },
  input: {
    flex: 1,
    borderRadius: "5px",
    border: "1px solid #444",
    padding: "8px",
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "#2a2a2a",
  },
  sendButton: {
    padding: "0 16px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};