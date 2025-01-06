"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import io, { Socket } from "socket.io-client";

/** Type for messages in chat */
type Message = {
  user: string;      // e.g. user email or user ID
  message: string;
  picture: string;   // the avatar URL
};

let socket: Socket | null = null;

export default function GroupChatPage() {
  const params = useParams();
  const groupId = params.groupId; // e.g. "1"

  // We'll fetch the current user from /api/profile
  // and set 'currentUserEmail' from that data.
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [groupName, setGroupName] = useState(`Group #${groupId}`);
  const [error, setError] = useState("");

  // 1) On initial mount, fetch the user profile and connect to Socket.IO
  useEffect(() => {
    // A function to fetch the logged-in user's profile
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const data = await res.json();
        // data => { user: { email, name, picture } }
        setCurrentUserEmail(data.user.name);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error fetching user profile");
      }
    };

    // Connect to the Socket.IO server & join group
    const initSocket = () => {
      socket = io("http://localhost:5000", {
        withCredentials: true,
      });

      // Join the group room
      socket.emit("join_group", { group_id: groupId });

      // Listen for group_message broadcasts
      socket.on("group_message", (data: Message) => {
        setMessages((prev) => [...prev, data]);
      });
    };

    fetchUserProfile().then(() => {
      initSocket();
    });

    // Cleanup on unmount
    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [groupId]);

  // 2) Fetch existing messages for initial load
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
        // data.messages => [{ user, message, picture, ... }, ...]
        setMessages(data.messages || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred fetching messages.");
      }
    };

    fetchMessages();
  }, [groupId]);

  // 3) Send a new message via POST
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
    } catch (err) {
      console.error(err);
      alert("Error sending message. See console for details.");
    }
  };

  // 4) If there's an error, show it
  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  // 5) Render the chat UI
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h2 style={styles.groupName}>{groupName}</h2>
      </header>

      <div style={styles.chatContainer}>
        <div style={styles.messagesBox}>
          {messages.map((msg, index) => {
            // If msg.user matches the current user's email, it's your message
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
