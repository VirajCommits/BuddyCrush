// src/app/new/page.tsx

"use client";

import React, { useState } from "react";
import CreateGroup from "../../components/CreateGroup";
import axios from "axios";

export default function NewGroupPage() {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGroup = async (newGroupData: { name: string; description: string }) => {
    if (isCreating) return;

    setIsCreating(true);
    console.log("handleCreateGroup called with:", newGroupData);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/groups/create",
        newGroupData,
        { withCredentials: true }
      );
      alert(response.data.message || "Group created successfully!");
    } catch (error) {
      console.error("Error creating group:", error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        alert(`Failed to create group: ${error.response.data.error}`);
      } else {
        alert("Failed to create group.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <button style={styles.backButton} onClick={() => window.history.back()}>
        &lt; BACK
      </button>

      <h1 style={styles.pageHeading}>Your New Accountability Group</h1>

      <CreateGroup onCreate={handleCreateGroup} />
    </div>
  );
}

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
