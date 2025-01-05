"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Message = {
  user: string;
  message: string;
};

export default function GroupChatPage() {
  const params = useParams();
  const groupId = params.groupId; // from the route /group/[groupId]
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");

  // 1) On mount, fetch the existing messages for this group
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // fetch group messages
        const res = await fetch(`http://localhost:5000/api/groups/${groupId}/messages`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch group messages");
        }
        const data = await res.json();
        // data: { messages: [{ user, message }, ...] } 
        setMessages(data.messages || []);

        // Optionally fetch group info if you want to show group name
        // or you can pass it from the previous page. For now, let’s just store "Group # groupId"
        setGroupName(`Group #${groupId}`);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred");
      }
    };

    fetchMessages();
  }, [groupId]);

  // 2) Post a new message 
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/groups/${groupId}/messages`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      // You could re-fetch messages or just append locally
      setMessages((prev) => [...prev, { user: "You", message: newMessage }]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
      alert("Error sending message. See console for details.");
    }
  };

  // 3) Basic rendering
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
          {messages.map((msg, index) => (
            <div key={index} style={styles.messageRow}>
              <span style={styles.messageUser}>{msg.user}:</span>{" "}
              <span style={styles.messageText}>{msg.message}</span>
            </div>
          ))}
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
  messageRow: {
    marginBottom: "8px",
  },
  messageUser: {
    fontWeight: "bold",
    marginRight: "6px",
  },
  messageText: {
    color: "#eee",
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
