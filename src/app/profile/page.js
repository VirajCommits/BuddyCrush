// pages/profile.js

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import GroupCard from "../../components/GroupCard";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [error, setError] = useState("");

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  // Fetch joined groups once user is fetched
  useEffect(() => {
    const fetchJoinedGroups = async () => {
      if (!user) return;

      try {
        const response = await axios.get("http://localhost:5000/api/groups/discover", {
          withCredentials: true,
        });
        const allGroups = response.data.groups || [];
        const joined = allGroups.filter((g) =>
          g.members.some((m) => m.email === user.email)
        );
        setJoinedGroups(joined);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };

    fetchJoinedGroups();
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed, see console for details.");
    }
  };

  if (error) {
    return <div style={styles.errorMsg}>Error: {error}</div>;
  }

  if (!user) {
    return <div style={styles.loading}>Loading profile...</div>;
  }

  return (
    <div style={styles.pageWrapper}>
      {/* Top Bar / Header */}
      <header style={styles.header}>
        <div style={styles.logoArea}>
          <h1 style={styles.logoText}>Buddy Crush</h1>
        </div>
        <div style={styles.userArea}>
          <img src={user.picture} alt={`${user.name}'s avatar`} style={styles.userAvatar} />
        </div>
      </header>

      <div style={styles.container}>
        {/* Profile Card */}
        <section style={styles.profileCard}>
          <h2 style={styles.welcomeText}>Welcome, {user.name}!</h2>
          <img src={user.picture} alt="avatar" style={styles.avatar} />
          <p style={styles.emailText}>Email: {user.email}</p>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Log Out
          </button>
        </section>

        {/* Create/Discover Groups Cards */}
        <section style={styles.cardGrid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Create Group</h3>
            <p style={styles.cardDesc}>
              Start a new accountability group to track your habits together!
            </p>
            <a href="/new" style={styles.actionButton}>
              Create Group
            </a>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Discover Groups</h3>
            <p style={styles.cardDesc}>
              Join existing groups and find new buddies to crush your goals.
            </p>
            <a href="/discover" style={styles.actionButton}>
              Discover Groups
            </a>
          </div>
        </section>

        {/* Display Joined Groups */}
        <section style={styles.groupsSection}>
          <h2 style={styles.subheading}>Your Joined Groups</h2>
          {joinedGroups.length === 0 ? (
            <p style={styles.noGroupsText}>You have not joined any groups.</p>
          ) : (
            <div style={styles.groupsGrid}>
              {joinedGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/** 
 * Dark-themed inline styles
 */
const styles = {
  errorMsg: {
    color: "red",
    textAlign: "center",
    marginTop: "50px",
  },
  loading: {
    color: "#fff",
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "sans-serif",
  },
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#121212",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#360929",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
  },
  logoArea: {},
  logoText: {
    fontSize: "1.4rem",
    margin: 0,
    color: "#fff",
  },
  userArea: {},
  userAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  container: {
    flex: 1,
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "sans-serif",
  },
  profileCard: {
    backgroundColor: "#1c1c1c",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "30px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
  },
  welcomeText: {
    fontSize: "1.8rem",
    margin: "0 0 10px 0",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    margin: "10px 0",
    objectFit: "cover",
    boxShadow: "0 0 6px rgba(255,255,255,0.1)",
  },
  emailText: {
    margin: "10px 0 20px 0",
    color: "#ccc",
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    backgroundColor: "#1c1c1c",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: "1.2rem",
    marginBottom: "10px",
  },
  cardDesc: {
    color: "#ccc",
    marginBottom: "20px",
    minHeight: "48px",
  },
  actionButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "5px",
    textDecoration: "none",
    fontWeight: "bold",
    display: "inline-block",
    textAlign: "center",
  },
  groupsSection: {
    marginTop: "40px",
  },
  subheading: {
    fontSize: "1.6rem",
    marginBottom: "20px",
  },
  noGroupsText: {
    color: "#aaa",
  },
  groupsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
};
