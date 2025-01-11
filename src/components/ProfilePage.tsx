// src/components/ProfilePage.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import NextImage from 'next/image'; // Added import

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

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string>("");
  const [, setAvatarSrcs] = useState<{ [key: number]: string }>({});

  // On component mount, fetch user & groups
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) Fetch the logged-in user's profile
        const profileResponse = await fetch("http://localhost:5000/api/profile", {
          credentials: "include",
        });
        if (!profileResponse.ok) {
          throw new Error("Failed to fetch profile");
        }
        const profileData = await profileResponse.json();
        setUser(profileData.user); // e.g. { name, email, picture }

        // 2) Fetch all groups from /api/groups/discover
        const groupsRes = await fetch("http://localhost:5000/api/groups/discover", {
          credentials: "include",
        });
        if (!groupsRes.ok) {
          throw new Error("Failed to fetch groups");
        }
        const groupsData = await groupsRes.json(); // e.g. { groups: [...] }
        const allGroups: Group[] = groupsData.groups || [];

        // 3) Determine which groups the user has joined
        const userEmail = profileData.user.email;
        console.log(allGroups, userEmail);
        const joinedIds = allGroups
          .filter((g) => g.members.some((m) => m.email === userEmail))
          .map((g) => g.id);

        setGroups(allGroups);
        setJoinedGroups(new Set(joinedIds));
      } catch (err: unknown) {
        console.error("Error fetching data:", err);
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch data.");
        } else {
          setError("Failed to fetch data.");
        }
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
      window.location.href = "/";
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        alert(`Logout failed: ${err.message}`);
      } else {
        alert("Logout failed. Please try again.");
      }
    }
  };

  // Helper to see if a group ID is joined
  const isJoined = (groupId: number) => joinedGroups.has(groupId);

  /**
   * Handle Image Load Error
   * Sets a fallback image if the original image fails to load
   */
  const handleImageError = (groupId: number) => {
    setAvatarSrcs((prev) => ({
      ...prev,
      [groupId]: "https://via.placeholder.com/40",
    }));
  };

  // Render states:
  if (error) {
    return <div style={styles.errorMsg}>Error: {error}</div>;
  }

  if (!user) {
    return <div style={styles.loading}>Loading profile...</div>;
  }

  // Filter only the groups the user has joined
  const joinedGroupsList = groups.filter((g) => isJoined(g.id));

  return (
    <div style={styles.pageWrapper}>
      {/* -- Top Bar / Header -- */}
      <header style={styles.header}>
        <div style={styles.logoArea}>
          <h1 style={styles.logoText}>Buddy Board</h1>
        </div>
        <div style={styles.userArea}>
          <NextImage
            src={user.picture || "https://via.placeholder.com/40"}
            alt={`${user.name}'s avatar`}
            width={40}
            height={40}
            style={styles.userAvatar}
            onError={() => handleImageError(0)} // Assuming groupId 0 for user avatar
          />
        </div>
      </header>

      <div style={styles.container}>
        {/* Profile Card */}
        <section style={styles.profileCard}>
          <h2 style={styles.welcomeText}>Welcome, {user.name}!</h2>
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

        {/* Display Only the Groups the User Joined */}
        <section style={styles.groupsSection}>
          <h2 style={styles.subheading}>Your Joined Groups</h2>
          {joinedGroupsList.length === 0 ? (
            <p style={styles.noGroupsText}>You have not joined any groups.</p>
          ) : (
            <div style={styles.groupsGrid}>
              {joinedGroupsList.map((group) => (
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
    border: "2px solid #fff",
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
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    borderRadius: "10px",
    padding: "15px",
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
  groupLink: {
    textDecoration: "none",
    color: "inherit",
  },
};
