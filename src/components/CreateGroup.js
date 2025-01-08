// src/components/CreateGroup.js

"use client";

import React, { useState } from "react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (isSubmitting) return; // Prevent multiple submissions

    // Basic validation
    if (!name.trim() || !description.trim()) {
      alert("Please provide both name and description.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newGroup = { name: name.trim(), description: description.trim() };
      console.log("Group data to be sent to parent:", newGroup);

      // Pass the data to the parent component
      onCreate(newGroup);

      // Clear the form fields after submission
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error in CreateGroup component:", error);
      alert("Failed to create group.");
    } finally {
      setIsSubmitting(false);
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
        disabled={isSubmitting}
      />
      <textarea
        style={formStyles.input}
        placeholder="What would people gain by joining your group? What should they do?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isSubmitting}
      />
      <button
        style={formStyles.button}
        onClick={handleCreate}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Group"}
      </button>
    </div>
  );
}
