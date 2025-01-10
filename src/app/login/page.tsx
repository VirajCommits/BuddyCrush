"use client";

import React from "react";

export default function LoginPage() {
  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.heading}>Welcome to Pal Crush</h1>
        <p style={styles.subheading}>Log in with your Google account to get started</p>
        <a href="http://localhost:5000/api/google/login">
          <button style={styles.loginButton}>Log In with Google</button>
        </a>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e2f", // Blueish-purple background
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  loginBox: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#2a2a3b",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subheading: {
    fontSize: "16px",
    marginBottom: "20px",
    color: "#aaa",
  },
  loginButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};
