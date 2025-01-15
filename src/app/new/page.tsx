"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CreateGroup from "../../components/CreateGroup";
import axios from "axios";

export default function NewGroupPage() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleCreateGroup = async (newGroupData: { name: string; description: string }) => {
    if (isCreating) return;

    setIsCreating(true);
    console.log("handleCreateGroup called with:", newGroupData);
    try {
      const response = await axios.post(
        "/api/groups/create",
        newGroupData,
        { withCredentials: true }
      );
      alert(response.data.message || "Group created successfully!");
      router.push("/profile"); // Redirect to Profile Page
    } catch (error: unknown) {
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
        <button
          style={styles.backButton}
          onClick={() => router.back()}
          aria-label="Go Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={styles.backIcon}
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
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
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#1e1e2f", // Aesthetic blueish-purple background
    color: "#fff",
    padding: "40px 20px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "40px",
  },
  backButton: {
    background: "none",
    border: "none",
    padding: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "transform 0.2s",
    marginRight: "15px",
  },
  backButtonHover: {
    transform: "scale(1.1)",
  },
  backIcon: {
    width: "24px",
    height: "24px",
    stroke: "#fff",
  },
  pageHeading: {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    margin: "0",
    color: "#fff",
  },
  subHeading: {
    fontSize: "18px",
    color: "#ccc",
    marginBottom: "30px",
    textAlign: "center",
  },
  footerNote: {
    fontSize: "14px",
    color: "#aaa",
    marginTop: "auto",
    textAlign: "center",
    fontStyle: "italic",
  },
};
