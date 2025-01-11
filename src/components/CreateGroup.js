"use client";

import React, { useState } from "react";

const formStyles = {
  container: {
    padding: "40px", // Increased padding for more space
    maxWidth: "800px", // Increased width for a larger form
    margin: "auto",
    backgroundColor: "#1c1c1c",
    borderRadius: "15px", // Slightly larger border radius for a softer look
    color: "#fff",
    boxSizing: "border-box",
    textAlign: "center",
  },
  heading: {
    fontSize: "36px", // Larger font size for the heading
    fontWeight: "bold",
    marginBottom: "30px",
  },
  input: {
    width: "100%",
    padding: "15px 20px", // Larger padding for bigger fields
    fontSize: "18px", // Bigger font size for better readability
    marginBottom: "20px",
    borderRadius: "8px", // Rounded edges
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "15px 20px", // Larger padding for bigger text area
    fontSize: "18px", // Bigger font size for better readability
    marginBottom: "30px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    resize: "vertical",
  },
  button: {
    width: "100%",
    padding: "15px 0", // Taller button
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "20px", // Larger font size for button text
    boxSizing: "border-box",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#218838", // Slightly darker green on hover
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
      <h2 style={formStyles.heading}>Create a Group</h2>
      <input
        style={formStyles.input}
        type="text"
        placeholder="Work out 🏋️‍♀️, Read 📚, Sleep early 🛌"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isSubmitting}
      />
      <textarea
        style={formStyles.textarea}
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
