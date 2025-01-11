"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */


import React, { CSSProperties, useEffect, useState } from "react";
import axios from "axios";

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

  const _ = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/logout",
        {},
        { withCredentials: true }
      );
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
          </div>
        )}
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <h1 style={styles.mainHeading}>Crush Your Habits with Friends</h1>
        <p style={styles.subHeading}>
          Create or join{" "}
          <span style={styles.highlight}>accountability groups</span>, see each
          other&apos;s progress, and compete for the leaderboard!
        </p>
        <a href="/login" style={styles.link}>
          <button style={styles.ctaButton}>CRUSH MY GOALS ➜</button>
        </a>
        <p style={styles.freeText}>100% Free!</p>
      </main>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  pageContainer: {
    background: "linear-gradient(135deg, #2f2f4f, #1c1c2e)", // Darkish greyish purplish gradient background
    color: "#fff", // Light text for readability
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    backgroundColor: "rgba(28, 28, 46, 0.8)", // Semi-transparent dark greyish purple for header
    backdropFilter: "blur(10px)", // Blurred background for a modern look
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  logo: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#fff",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Subtle text shadow for depth
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    cursor: "pointer",
    border: "2px solid #fff",
    transition: "transform 0.3s, box-shadow 0.3s",
    objectFit: "cover", // Ensure the image covers the container
  },
  main: {
    textAlign: "center",
    margin: "auto",
    padding: "40px 20px",
    maxWidth: "800px",
  },
  mainHeading: {
    fontSize: "3rem",
    fontWeight: "800",
    marginBottom: "20px",
    textShadow: "2px 2px 8px rgba(0,0,0,0.3)", // Enhanced text shadow for prominence
  },
  subHeading: {
    fontSize: "1.5rem",
    marginBottom: "40px",
    lineHeight: "1.6",
    color: "#e0e0e0", // Softer color for secondary text
  },
  highlight: {
    color: "#f76c6c", // Soft red-pink highlight
    fontWeight: "bold",
  },
  ctaButton: {
    padding: "15px 35px",
    fontSize: "1.2rem",
    color: "#fff",
    backgroundColor: "#ff4081", // Vibrant pink button
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s ease, transform 0.3s ease",
  },
  link: {
    textDecoration: "none",
  },
  freeText: {
    fontSize: "16px",
    color: "#b0b0b0",
    marginTop: "20px",
  },
};
