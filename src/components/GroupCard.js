// src/components/GroupCard.js

"use client";

import React, { useState, useEffect } from "react";
import Leaderboard from "./Leaderboard";
import ActivityFeed from "./ActivityFeed";
import { FaComments } from "react-icons/fa";
import {
  completeDailyTask,
  fetchActivityFeed,
  fetchLeaderboard,
  fetchProfile,
} from "../utils/api";
import NextImage from 'next/image'; // Import from 'next/image'
import GroupChat from "./GroupChat"; // Import the GroupChat component

export default function GroupCard({ group }) {
  const [activeTab, setActiveTab] = useState("activity");
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  
  // Controls visibility of the chat modal
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Check if the user has already completed the task today
  useEffect(() => {
    const checkCompletion = async () => {
      try {
        const response = await fetchActivityFeed(group.id);
        const curUser = (await fetchProfile()).data.user;
        const today = new Date().toISOString().split("T")[0];
        const hasCompletedToday = response.data.activity.some(
          (item) => item.completed_date === today && item.user_email === curUser.email
        );
        
        setAlreadyCompleted(hasCompletedToday);
        setActivityData(response.data.activity);
      } catch (err) {
        console.error("Error checking completion:", err);
        setError("Failed to verify task completion.");
      }
    };
    checkCompletion();
  }, [group.id]);

  // Fetch leaderboard data
  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        const res = await fetchLeaderboard(group.id);
        setLeaderboardData(res.data.leaderboard);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to fetch leaderboard.");
      }
    };
    getLeaderboard();
  }, [group.id]);

  // Handle "Complete Habit" button
  const handleCompleteHabit = async () => {
    setLoading(true);
    try {
      const data = await completeDailyTask(group.id);
      console.log("Completed data:", data);
      const user_name = data.data.user_email; // Adjust if needed
      alert(data.message || "Habit completed successfully!");
      setAlreadyCompleted(true);

      // Optionally, refresh activity & leaderboard
      setActivityData((prev) => [
        ...prev,
        {
          user_picture: group.members.find(
            (member) => member.email === user_name
          )?.user_image,
          completed_date: new Date().toISOString().split("T")[0],
          days_ago: 0,
        },
      ]);
      setLeaderboardData((prev) =>
        prev.map((user) =>
          user.user_email === data.user_email
            ? { ...user, completion_count: user.completion_count + 1 }
            : user
        )
      );
    } catch (err) {
      console.error("Error completing habit:", err);
      setError(
        err.response?.data?.error || "Failed to complete the daily task."
      );
    } finally {
      setLoading(false);
    }
  };

  // Chat icon click => open chat modal
  const handleChatClick = () => {
    setIsChatOpen(true);
  };

  // Close chat modal
  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <div style={styles.card}>
      {/* Header with Group Name and Tabs */}
      <div style={styles.topHeader}>
        <h3 style={styles.groupName}>{group.name}</h3>
      </div>

      <div style={styles.header}>
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === "activity" ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab("activity")}
          >
            Activity
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === "leaderboard" ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab("leaderboard")}
          >
            Leaderboard
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === "about" ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </div>
        <FaComments
          style={styles.chatIcon}
          title="Open Chat"
          onClick={handleChatClick}
        />
      </div>

      {/* Content Area */}
      <div style={styles.content}>
        {activeTab === "activity" && (
          <ActivityFeed activity={activityData} />
        )}
        {activeTab === "leaderboard" && (
          <Leaderboard leaderboard={leaderboardData} />
        )}
        {activeTab === "about" && (
          <div style={styles.about}>
            <p style={styles.description}>{group.description}</p>
            <p style={styles.totalMembers}>
              {group.members.length} members
            </p>
            <div style={styles.membersList}>
              {group.members.map((member) => (
                <div key={member.email} style={styles.member}>
                  <NextImage
                    src={member.user_image || "https://via.placeholder.com/30"}
                    alt={`${member.name}'s avatar`}
                    width={30}
                    height={30}
                    style={styles.memberAvatar}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/30";
                    }}
                  />
                  <span style={styles.memberName}>{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Complete Habit Button */}
      <button
        onClick={handleCompleteHabit}
        style={{
          ...styles.completeButton,
          ...(alreadyCompleted ? styles.completedButton : {}),
        }}
        disabled={alreadyCompleted || loading}
      >
        {alreadyCompleted
          ? "Completed Today 🎉"
          : loading
          ? "Completing🚀"
          : "Complete Habit 🚀🚀"}
      </button>

      {/* Render GroupChat Modal if chat is open */}
      {isChatOpen && (
        <GroupChat
          groupId={group.id}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
}

/** 
 * Light Purplish Themed Inline Styles
 */
const styles = {
  topHeader: {
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#1c1c1c",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "500px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  groupName: {
    margin: 0,
    color: "#fff",
  },
  tabs: {
    display: "flex",
    gap: "10px",
  },
  tabButton: {
    padding: "5px 10px",
    backgroundColor: "#2c2c2c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.3s",
  },
  activeTab: {
    backgroundColor: "#007bff",
  },
  content: {
    flex: 1,
    marginBottom: "10px",
    overflowY: "auto",
    maxHeight: "350px",
  },
  about: {
    padding: "10px",
    backgroundColor: "#2c2c3b",
    borderRadius: "5px",
  },
  description: {
    marginBottom: "10px",
    color: "#ccc",
  },
  totalMembers: {
    marginBottom: "10px",
    color: "#ccc",
    fontWeight: "bold",
  },
  membersList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  member: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#3c3c3c",
    padding: "5px 10px",
    borderRadius: "5px",
  },
  memberAvatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "8px",
  },
  memberName: {
    color: "#fff",
    fontSize: "0.9rem",
  },
  chatIcon: {
    color: "#007bff",
    fontSize: "20px",
    cursor: "pointer",
    transition: "color 0.3s",
  },
  completeButton: {
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
    transition: "background-color 0.3s",
  },
  completedButton: {
    backgroundColor: "#6c757d",
    cursor: "not-allowed",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};
