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
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => window.history.back()}>
          &lt; BACK
        </button>
        <h1 style={styles.pageHeading}>Create a New Group</h1>
      </div>

      <p style={styles.subHeading}>
        Start a new accountability group and crush your goals together with your friends!
      </p>

      <CreateGroup onCreate={handleCreateGroup} />

      <p style={styles.footerNote}>
        Invite your friends to join and make your group more impactful!
      </p>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    backgroundColor: "#1e1e2f", // Aesthetic blueish-purple background
    color: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#aaa",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  pageHeading: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    margin: "0",
    color: "#fff",
  },
  subHeading: {
    fontSize: "16px",
    color: "#ccc",
    marginBottom: "30px",
  },
  footerNote: {
    fontSize: "14px",
    color: "#aaa",
    marginTop: "20px",
    fontStyle: "italic",
  },
};
