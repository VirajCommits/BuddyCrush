"use client";

import { useState } from "react";
// If you prefer inline styles instead of CSS modules:
const formStyles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
    backgroundColor: "#1c1c1c",
    borderRadius: "10px",
    color: "#fff",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default function CreateGroup({ onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    try {
      const newGroup = { name, description };
      await onCreate(newGroup); // The parent page or context handles the actual create logic
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group.");
    }
  };

  return (
    <div style={formStyles.container}>
      <h2>Create a Group</h2>
      <input
        style={formStyles.input}
        type="text"
        placeholder="Work out 🏋️‍♀️, Read 📚, Sleep early 🛌"
      
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        style={formStyles.input}
        placeholder="What would people gain by joining your group? What should they do?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button style={formStyles.button} onClick={handleCreate}>
        Create Group
      </button>
    </div>
  );
}
