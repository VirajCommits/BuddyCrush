"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { fetchMessages, sendMessage } from "../utils/api";

const socket = io("http://localhost:5000"); // Your backend WebSocket URL

export default function GroupChat({ groupId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch historical messages
    fetchMessages(groupId)
      .then((response) => setMessages(response.data.messages))
      .catch((error) => console.error("Error fetching messages:", error));

    // Join the WebSocket room
    socket.emit("join_group", { group_id: groupId });

    // Listen for incoming messages
    socket.on("group_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit("leave_group", { group_id: groupId });
    };
  }, [groupId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    try {
      await sendMessage(groupId, newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <h2>Group Chat</h2>
      <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "scroll" }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}
