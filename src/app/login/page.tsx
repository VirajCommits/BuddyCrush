"use client";
/* eslint-disable react/no-unescaped-entities */
import React from "react";

export default function LoginPage() {
  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.heading}>Let's get you signed in!</h1>
        <p style={styles.subheading}>Log in with your Google account to get started</p>
        <a href="http://127.0.0.1:5000/api/google/login" style={styles.link}>
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
    // A subtle gradient background
    background: "linear-gradient(135deg, #1e1e2f 0%, #1b1b2f 100%)",
    color: "#fff",
    fontFamily: "'Roboto', sans-serif",
  },
  loginBox: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#2a2a3b",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
  },
  heading: {
    fontSize: "2rem", // bigger heading
    fontWeight: "bold",
    marginBottom: "16px",
    color: "#fff",
  },
  subheading: {
    fontSize: "1.2rem",
    marginBottom: "28px",
    color: "#cccccc",
  },
  link: {
    textDecoration: "none",
  },
  loginButton: {
    padding: "14px 28px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};
