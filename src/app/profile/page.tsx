"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { CSSProperties, useEffect, useState } from "react";
import axios from "axios";
import GroupCard from "../../components/GroupCard";
import { useRouter } from "next/navigation";
import NextImage from 'next/image'; // Renamed import

// Define the User type
interface User {
  name: string;
  email: string;
  picture: string;
}

// Define the Group type based on your data structure
interface Group {
  id: number;
  name: string;
  members: Array<{ email: string }>;
  // Add other relevant fields if necessary
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [joinedGroups, setJoinedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/profile", {
          withCredentials: true,
        });
        console.log("This is the response i get(users image link):" ,response.data.user.picture)

        setUser(response.data.user);
      } catch (err: any) {
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
        const response = await axios.get("/api/groups/discover", {
          withCredentials: true,
        });
        const allGroups: Group[] = response.data.groups || [];
        const joined = allGroups.filter((g: Group) =>
          g.members.some((m) => m.email === user.email)
        );
        setJoinedGroups(joined);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };

    fetchJoinedGroups();
  }, [user]);

  // Check if all required resources (data and images) are loaded
  useEffect(() => {
    if (user) {
      const img = new Image();
      setTimeout(() => {
        img.src = user.picture;
        console.log(img.src)
      }, 300); // Add a small delay
      img.onload = () => setLoading(false);
      img.onerror = () => {
        console.error("Error loading image");
        setLoading(false);
      };
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed, see console for details.");
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading profile...</div>;
  }

  if (error) {
    return <div style={styles.errorMsg}>Error: {error}</div>;
  }

  return (
    <div style={styles.pageWrapper}>
      {/* Top Bar / Header */}
      <header style={styles.header}>
        <div style={styles.logoArea}>
          <h1 style={styles.logoText}>Buddy Board</h1>
        </div>
        <div style={styles.userArea}>
          {(() => {
            console.log("user info:", user?.picture);
            return null;
          })()}
          <NextImage
            src={user?.picture || "https://via.placeholder.com/50"}
            alt={`${user?.name}'s avatar`}
            width={50}
            height={50}
            style={styles.userAvatar}
            onClick={handleLogout}
            title="Logout"
          />
        </div>
      </header>

      <div style={styles.container}>
        {/* Profile Card */}
        <section style={styles.profileCard}>
          <h2 style={styles.welcomeText}>Welcome, {user?.name}!</h2>
          {/* Replaced <img> with <NextImage> */}
          <NextImage
            src={user?.picture || "https://via.placeholder.com/140"}
            alt={`${user?.name}'s avatar`}
            width={140}
            height={140}
            style={styles.avatar}
          />
          <p style={styles.emailText}>Email: {user?.email}</p>
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
                <GroupCard key={group.id} group={group}  />
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
const styles: { [key: string]: CSSProperties } = {
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
    fontSize: "16px",
  },
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#1A1A1D", // Dark background
    color: "#EAEAEA",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Roboto', sans-serif",
  },
  header: {
    backgroundColor: "#29293D", // Darker header for contrast
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 30px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  },
  logoArea: {
    // Add any specific styles if needed
  },
  logoText: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#FFFFFF",
    margin: 0,
  },
  userArea: {
    display: "flex",
    alignItems: "center",
  },
  userAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover", // Ensure the image covers the container
    border: "2px solid #555",
    cursor: "pointer",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  container: {
    flex: 1,
    maxWidth: "1100px",
    margin: "40px auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  profileCard: {
    backgroundColor: "#2A2A40", // Slightly lighter card background
    borderRadius: "12px",
    padding: "30px",
    textAlign: "center",
    boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
    color: "#EAEAEA",
  },
  welcomeText: {
    fontSize: "2rem",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  avatar: {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    margin: "20px 0",
    objectFit: "cover",
    border: "3px solid #444",
  },
  emailText: {
    margin: "10px 0 20px 0",
    color: "#BBBBBB",
  },
  logoutButton: {
    padding: "12px 24px",
    backgroundColor: "#FF4B5C",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  logoutButtonHover: {
    backgroundColor: "#FF6E7A",
  },
  cardGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#2A2A40",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "10px",
    flex: "1 1 280px",
    maxWidth: "300px",
  },
  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#FFFFFF",
  },
  cardDesc: {
    color: "#BBBBBB",
    marginBottom: "15px",
    fontSize: "14px",
  },
  actionButton: {
    padding: "12px 20px",
    backgroundColor: "#007BFF",
    color: "#FFFFFF",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    textAlign: "center",
    cursor: "pointer",
  },
  actionButtonHover: {
    backgroundColor: "#339CFF",
  },
  groupsSection: {
    marginTop: "30px",
  },
  subheading: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    fontWeight: "bold",
    textAlign: "center",
  },
  noGroupsText: {
    color: "#BBBBBB",
    textAlign: "center",
    fontSize: "14px",
  },
  groupsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
};
