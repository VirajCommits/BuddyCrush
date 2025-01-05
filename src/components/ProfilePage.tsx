// src/components/ProfilePage.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

/**
 * Example fetchGroups() helper. Adjust the import/path or write inline fetch.
 */
// import { fetchGroups } from "../utils/api";

/** 
 * Type definitions for user & group data
 */
type User = {
  name: string;
  email: string;
  picture: string;
};

type Group = {
  id: number;
  name: string;
  description: string;
  members: { email: string; name: string; picture: string }[];
};

/**
 * Our ProfilePage component does everything internally for demo:
 *  - Fetch user
 *  - Fetch groups
 *  - Determine membership
 *  - Render UI 
 */
export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string>("");

  // On component mount, fetch user & groups
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) Fetch the logged-in user's profile
        const profileResponse = await fetch("http://localhost:5000/api/profile", {
          credentials: "include", // include cookies/session
        });
        if (!profileResponse.ok) {
          throw new Error("Failed to fetch profile");
        }
        const profileData = await profileResponse.json();
        setUser(profileData.user); // e.g. { name, email, picture }

        // 2) Fetch all groups (Replace with your real fetch logic)
        // For example, if you have a custom fetchGroups() helper, use that instead
        const groupsRes = await fetch("http://localhost:5000/api/groups/discover", {
          credentials: "include",
        });
        if (!groupsRes.ok) {
          throw new Error("Failed to fetch groups");
        }
        const groupsData = await groupsRes.json(); // e.g. { groups: [...] }
        setGroups(groupsData.groups);

        // 3) Determine joined groups
        // Filter groups to find where the user is a member
        const userEmail = profileData.user.email;
        const joined = groupsData.groups
          .filter((g: Group) => g.members.some(m => m.email === userEmail))
          .map((g: Group) => g.id);

        setJoinedGroups(new Set(joined));
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data.");
      }
    };

    fetchData();
  }, []);

  /**
   * Logout handler 
   */
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Logout failed");
      }
      // Redirect to home page or login
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Logout failed, see console for details.");
    }
  };

  // Helper to see if a group ID is joined
  const isJoined = (groupId: number) => joinedGroups.has(groupId);

  // Render states:
  if (error) {
    return <div style={styles.errorMsg}>Error: {error}</div>;
  }

  if (!user) {
    return <div style={styles.loading}>Loading profile...</div>;
  }

  return (
    <div style={styles.pageWrapper}>
      {/* -- Top Bar / Header -- */}
      <header style={styles.header}>
        <div style={styles.logoArea}>
          <h1 style={styles.logoText}>Buddy Crush</h1>
        </div>
        <div style={styles.userArea}>
          <img
            src={user.picture}
            alt={`${user.name}'s avatar`}
            style={styles.userAvatar}
          />
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
            <Link href="/new" style={styles.actionButton}>
              Create Group
            </Link>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Discover Groups</h3>
            <p style={styles.cardDesc}>
              Join existing groups and find new buddies to crush your goals.
            </p>
            <Link href="/discover" style={styles.actionButton}>
              Discover Groups
            </Link>
          </div>
        </section>

        {/* Display All Groups (with Joined/Not Joined) */}
        <section style={styles.groupsSection}>
          <h2 style={styles.subheading}>All Groups</h2>
          {groups.length === 0 ? (
            <p style={styles.noGroupsText}>No groups found.</p>
          ) : (
            <div style={styles.groupsGrid}>
              {groups.map((group) => (
                <div key={group.id} style={styles.groupCard}>
                  <h3 style={styles.cardTitle}>{group.name}</h3>
                  <p style={styles.groupDesc}>{group.description}</p>
                  <p style={styles.memberCount}>
                    👥 {group.members.length} members
                  </p>
                  <Link key={group.id} href={`/group/${group.id}`} style={styles.groupLink}>
                    <div style={styles.groupCard}>
                      <h3>Click here to chat!</h3>
                    </div>
                  </Link>
                  {isJoined(group.id) ? (
                    <span style={styles.joinedTag}>Joined</span>
                  ) : (
                    <span style={styles.notJoinedTag}>Not Joined</span>
                  )}
                </div>
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
const styles: { [key: string]: React.CSSProperties } = {
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
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
  },
  groupCard: {
    backgroundColor: "#1c1c1c",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
  },
  groupDesc: {
    color: "#ccc",
    margin: "10px 0",
    minHeight: "48px",
  },
  memberCount: {
    fontSize: "14px",
    color: "#aaa",
    marginBottom: "10px",
  },
  joinedTag: {
    color: "limegreen",
    fontWeight: "bold",
    display: "inline-block",
    border: "1px solid limegreen",
    borderRadius: "4px",
    padding: "3px 6px",
  },
  notJoinedTag: {
    color: "#f44336",
    fontWeight: "bold",
    display: "inline-block",
    border: "1px solid #f44336",
    borderRadius: "4px",
    padding: "3px 6px",
  },
};
