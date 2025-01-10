"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import socket from "../../../utils/socket"; // Singleton socket instance

type Message = {
  user: string; 
  message: string;
  picture: string;
};

export default function GroupChatPage() {
  const params = useParams();
  const groupId = params.groupId; 

  const [currentUserName, setcurrentUserName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [groupName, setGroupName] = useState(`Group #${groupId}`);
  const [error, setError] = useState("");


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
        setcurrentUserName(data.user.name);
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        setError(err.message || "Error fetching user profile");
      }
    };

    fetchUserProfile();
  }, []);

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
        const res = await fetch(`http://localhost:5000/api/groups/${groupId}/messages`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch group messages");
        }
        const data = await res.json();
        console.log(data.messages)
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

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <div style={styles.page}>

      <div style={styles.chatContainer}>
        <div style={styles.messagesBox}>
          {messages.map((msg, index) => {
            const isMine = msg.user === currentUserName;

            return (
              <div key={index} style={isMine ? styles.rowRight : styles.rowLeft}>
                {!isMine && (
                  <img
                  src={msg.user_image}
                  alt="Avatar"
                  style={isMine ? styles.avatarRight : styles.avatarLeft}
                />
                )}

                <div style={isMine ? styles.bubbleRight : styles.bubbleLeft}>
                  {msg.message}
                </div>

                {isMine && (
                  <img
                  src={msg.user_image || "https://imgs.search.brave.com/liVtoLQ1_sNYI7Hysr17zleeDN-50DQTD93nqhHCfiE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTMz/MjEwMDkxOS92ZWN0/b3IvbWFuLWljb24t/YmxhY2staWNvbi1w/ZXJzb24tc3ltYm9s/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1BVlZKa3Z4UVFD/dUJoYXdIclVoRFJU/Q2VOUTNKZ3QwSzF0/WGpKc0Z5MWVnPQ"}
                  alt="Avatar"
                  style={isMine ? styles.avatarRight : styles.avatarLeft}
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
    height: "100vh", // Full screen height
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#1e1e2f", // Aesthetic blueish-purple background
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    padding: "20px",
    backgroundColor: "#2a2a3b", // Slightly darker for contrast
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
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
    overflowY: "scroll", // Enable scrolling
    marginBottom: "20px",
    padding: "10px 10px",
    backgroundColor: "#2a2a3b",
    borderRadius: "8px",
    boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)",
  },
  rowLeft: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  avatarLeft: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "10px",
    objectFit: "cover",
    border: "2px solid #007bff",
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
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginLeft: "10px",
    objectFit: "cover",
    border: "2px solid #2a2a3b",
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
    backgroundColor: "#2a2a3b",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
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
    transition: "background-color 0.3s ease",
  },
};
