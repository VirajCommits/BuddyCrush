"use client";

import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { fetchMessages, sendMessage as apiSendMessage } from "../utils/api";

export default function GroupChat({ groupId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize the socket
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000", {
        transports: ["websocket"],
        reconnectionAttempts: 5,
      });
    }

    const socket = socketRef.current;

    const handleGroupMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.emit("join_group", { group_id: groupId });
    socket.on("group_message", handleGroupMessage);

    const fetchHistoricalMessages = async () => {
      try {
        const response = await fetchMessages(groupId);
        setMessages(response.data.messages || []);
        console.log("these are the messages:",messages)
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to fetch messages.");
      }
    };

    fetchHistoricalMessages();

    return () => {
      socket.off("group_message", handleGroupMessage);
      socket.emit("leave_group", { group_id: groupId });
    };
  }, [groupId]);

  useEffect(() => {
    // Scroll to the latest message when messages update
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      group_id: groupId,
      message: newMessage.trim(),
    };

    try {
      await apiSendMessage(groupId, newMessage.trim());
      socketRef.current.emit("send_message", messageData);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "50px" }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Group Chat</h2>
      <div style={styles.chatBox}>
        {messages.length === 0 && (
          <p style={styles.placeholder}>Be the first to write a message!</p>
        )}
        {messages.map((msg, index) => (
          <div key={index} style={styles.message}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#1c1c1c",
    borderRadius: "10px",
    color: "#fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    height: "500px",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  chatBox: {
    flex: 1,
    border: "1px solid #555",
    borderRadius: "5px",
    padding: "10px",
    overflowY: "auto",
    marginBottom: "20px",
    backgroundColor: "#121212",
    position: "relative",
  },
  placeholder: {
    textAlign: "center",
    color: "#aaa",
    fontStyle: "italic",
    marginTop: "20px",
  },
  message: {
    marginBottom: "10px",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #555",
    backgroundColor: "#2c2c2c",
    color: "#fff",
  },
  sendButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
