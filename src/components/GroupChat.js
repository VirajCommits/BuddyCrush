// src/components/GroupChat.js

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
    // Initialize the socket only once
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000", {
        transports: ["websocket"],
        reconnectionAttempts: 5, // Optional: Configure reconnection attempts
      });
    }

    const socket = socketRef.current;

    // Function to handle incoming messages
    const handleGroupMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    // Join the group room
    socket.emit("join_group", { group_id: groupId });

    // Listen for group messages
    socket.on("group_message", handleGroupMessage);

    // Fetch historical messages
    const fetchHistoricalMessages = async () => {
      try {
        const response = await fetchMessages(groupId);
        setMessages(response.data.messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to fetch messages.");
      }
    };

    fetchHistoricalMessages();

    // Cleanup function to remove listeners and leave the room
    return () => {
      socket.off("group_message", handleGroupMessage);
      socket.emit("leave_group", { group_id: groupId });

      // Optionally disconnect the socket if it's no longer needed
      // socket.disconnect();
    };
  }, [groupId]);

  useEffect(() => {
    // Scroll to the latest message when messages update
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      group_id: groupId,
      message: newMessage.trim(),
    };

    try {
      // Optionally send the message to the backend API for persistence
      await apiSendMessage(groupId, newMessage.trim());

      // Emit the message to the socket server
      socketRef.current.emit("send_message", messageData);

      // Clear the input field
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    }
  };

  // Optional: Handle "Enter" key press for sending messages
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
          Send Viraj
        </button>
      </div>
    </div>
  );
}

/** 
 * Inline styles for the component
 */
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
