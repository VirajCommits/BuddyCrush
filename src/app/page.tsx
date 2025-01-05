// src/app/page.tsx

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
      await axios.post("http://localhost:50000/api/logout", {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
      alert("Logged out successfully");
      // Optionally, redirect to home
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.logo}>Buddy Crush</h1>
        {isAuthenticated && user && (
          <div style={styles.userInfo}>
            <a href="/profile">
              <img
                src={user.picture}
                alt={`${user.name}'s avatar`}
                style={styles.avatar}
              />
            </a>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Log Out
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      {!isAuthenticated ? (
        <div style={styles.loginContainer}>
          <a href="http://localhost:5000/api/google/login">
            <button style={styles.loginButton}>Sign Up / Log In with Google</button>
          </a>
        </div>
      ) : (
        <HomePage />
      )}
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#121212",
    color: "#fff",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer", // Indicate it's clickable
  },
  logoutButton: {
    padding: "10px 15px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  loginContainer: {
    textAlign: "center",
    marginTop: "50px",
  },
  loginButton: {
    padding: "15px 30px",
    fontSize: "18px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
