// src/app/new/page.tsx
"use client";

import React from "react";
import CreateGroup from "../../components/CreateGroup";
import axios from "axios";

export default function NewGroupPage() {
  // This function is called when the user clicks “Create Group”
  const handleCreateGroup = async (newGroupData: { name: string; description: string }) => {
    try {
      // Example: POST to your backend
      // Adjust the endpoint as needed
      const response = await axios.post(
        "http://localhost:5000/api/groups/create",
        newGroupData,
        { withCredentials: true } // ensures cookies are sent
      );
      alert(response.data.message || "Group created successfully!");
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group.");
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* A simple "Back" link (optional) */}
      <button style={styles.backButton} onClick={() => history.back()}>
        &lt; BACK
      </button>

      <h1 style={styles.pageHeading}>Your new accountability group</h1>

      <CreateGroup onCreate={handleCreateGroup} />
    </div>
  );
}

// Inline styles for the page
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    maxWidth: "800px",
    margin: "50px auto",
    padding: "20px",
    color: "#fff",
    backgroundColor: "#121212",
    borderRadius: "10px",
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#bbb",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "20px",
  },
  pageHeading: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "30px",
  },
};
