"use client";

import React, { CSSProperties, useEffect, useState } from "react";
import axios from "axios";
import HomePage from "../components/HomePage";

// Define the User type
type User = {
  name: string;
  email: string;
  picture: string;
};

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if the user is authenticated
    axios
      .get("http://localhost:5000/api/profile", { withCredentials: true })
      .then((response) => {
        setIsAuthenticated(true);
        setUser(response.data.user);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
      alert("Logged out successfully");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.logo}>Buddy Board</h1>
        {isAuthenticated && user && (
          <div style={styles.userInfo}>
            <a href="/profile">
              <img
                src={user.picture}
                alt={`${user.name}'s avatar`}
                style={styles.avatar}
              />
            </a>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <h1 style={styles.mainHeading}>Crush your habits with friends</h1>
        <p style={styles.subHeading}>
          Create or join <span style={styles.highlight}>accountability groups</span>, see each other's progress,
          and compete for the leaderboard!
        </p>
        <a href="/login">
          <button style={styles.ctaButton}>CRUSH MY GOALS ➜</button>
        </a>
        <p style={styles.freeText}>100% free!</p>

      </main>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  pageContainer: {
    backgroundColor: "#121212", // Dark background
    color: "#fff", // Light text
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    backgroundColor: "#1C1C1C", // Slightly darker shade for header
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fff",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
  },
  main: {
    textAlign: "center",
    margin: "auto",
    padding: "20px",
    maxWidth: "800px",
  },
  mainHeading: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  subHeading: {
    fontSize: "18px",
    marginBottom: "40px",
    lineHeight: "1.6",
  },
  highlight: {
    color: "#F76C6C", // Highlight color for important text
    fontWeight: "bold",
  },
  ctaButton: {
    padding: "15px 30px",
    fontSize: "18px",
    color: "#fff",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  freeText: {
    fontSize: "14px",
    color: "#aaa",
    marginTop: "10px",
  },
  exampleCard: {
    marginTop: "50px",
  },
};
