"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { CSSProperties, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import GroupCard from "../../components/GroupCard";

interface User {
  name: string;
  email: string;
  picture: string;
}

interface Group {
  id: number;
  name: string;
  members: Array<{ email: string }>;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  // Separate loading state for joined groups only
  const [joinedGroups, setJoinedGroups] = useState<Group[]>([]);
  const [joinedGroupsLoading, setJoinedGroupsLoading] = useState(true);

  const [error, setError] = useState("");
  const router = useRouter();

  // 1) Fetch user profile (immediately displayed once loaded)
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/api/profile", {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch profile");
      }
    })();
  }, []);

  // 2) Fetch joined groups (uses separate loading state)
  useEffect(() => {
    (async () => {
      if (!user) return; // Wait until user is set
      try {
        const response = await axios.get("/api/groups/discover", {
          withCredentials: true,
        });
        const allGroups: Group[] = response.data.groups || [];
        const joined = allGroups.filter((g) =>
          g.members.some((m) => m.email === user.email)
        );
        setJoinedGroups(joined);
      } catch (err) {
        console.error("Error fetching groups:", err);
      } finally {
        setJoinedGroupsLoading(false); // Stop skeleton in either success or fail
      }
    })();
  }, [user]);

  // Logout Handler
  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed, see console for details.");
    }
  };

  // Error State
  if (error) {
    return <div style={styles.errorMsg}>Error: {error}</div>;
  }

  // If user not loaded yet, you could show a quick fallback:
  if (!user) {
    return (
      <div style={styles.loadingWrapper}>
        <p style={styles.loadingText}>Loading profile...</p>
      </div>
    );
  }

  // ---------------------
  // Actual Page Content
  // ---------------------
  return (
    <>
      {/* Only needed if you want a blinking effect for the skeleton */}
      <style jsx global>{`
        @keyframes blink {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>

      <div style={styles.pageWrapper}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.logoText}>Buddy Board</h1>
          <div style={styles.userArea}>
            <img
              src={user.picture || "https://via.placeholder.com/40"}
              alt={`${user.name} avatars`}
              width={40}
              height={40}
              style={styles.headerAvatar}
            />
          </div>
        </header>

        <div style={styles.container}>
          {/* Profile Card */}
          <section style={styles.profileCard}>
            <h2 style={styles.welcomeText}>Welcome, {user.name}!</h2>
            <img
              src={user.picture || "https://via.placeholder.com/140"}
              alt={`${user.name}'s avatar`}
              width={140}
              height={140}
              style={styles.avatar}
            />
            <p style={styles.emailText}>Email: {user.email}</p>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Log Out
            </button>
          </section>

          {/* Create/Discover Groups Cards */}
          <section style={styles.cardRow}>
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

          {/* Joined Groups Section (with partial skeleton) */}
          <section style={styles.groupsSection}>
            <h2 style={styles.subheading}>Your Joined Groups</h2>
            {joinedGroupsLoading ? (
              <GroupsSkeleton />
            ) : joinedGroups.length === 0 ? (
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
    </>
  );
}

/* --------------------------------------------
   Skeleton for the "Joined Groups" only
-------------------------------------------- */
function GroupsSkeleton() {
  return (
    <div style={styles.groupsGrid}>
      {/* Render 2-3 skeleton group cards to mimic layout */}
      {[...Array(2)].map((_, i) => (
        <div key={i} style={styles.skeletonGroupCard} />
      ))}
    </div>
  );
}

/* --------------------------------------------
   Dark-themed inline styles
-------------------------------------------- */
const styles: { [key: string]: CSSProperties } = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#121212",
    color: "#EAEAEA",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Roboto', sans-serif",
  },
  header: {
    backgroundColor: "#1B1B2F",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
  },
  logoText: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    margin: 0,
  },
  userArea: {
    display: "flex",
    alignItems: "center",
  },
  headerAvatar: {
    borderRadius: "50%",
    objectFit: "cover",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  profileCard: {
    backgroundColor: "#1F1F3A",
    borderRadius: "12px",
    padding: "30px",
    textAlign: "center",
    boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
  },
  welcomeText: {
    fontSize: "1.5rem",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  avatar: {
    borderRadius: "50%",
    objectFit: "cover",
    width: "140px",
    height: "140px",
    marginBottom: "20px",
  },
  emailText: {
    marginBottom: "20px",
    color: "#ccc",
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#FF4B5C",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  cardRow: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#1F1F3A",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
    flex: "1 1 250px",
    maxWidth: "300px",
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "10px",
  },
  cardDesc: {
    color: "#ccc",
    marginBottom: "15px",
    fontSize: "14px",
  },
  actionButton: {
    display: "inline-block",
    padding: "10px 18px",
    backgroundColor: "#007BFF",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  groupsSection: {
    marginTop: "20px",
  },
  subheading: {
    fontSize: "1.4rem",
    marginBottom: "16px",
    fontWeight: "bold",
  },
  noGroupsText: {
    color: "#ccc",
    textAlign: "center",
    fontSize: "14px",
  },
  groupsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },

  // Skeleton placeholders for joined groups
  skeletonGroupCard: {
    backgroundColor: "#2A2A4A",
    borderRadius: "10px",
    height: "120px",
    animation: "blink 1.2s ease-in-out infinite",
  },

  // Minimal loading fallback for user profile
  loadingWrapper: {
    minHeight: "100vh",
    backgroundColor: "#121212",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ccc",
    fontSize: "1rem",
    fontFamily: "sans-serif",
    fontStyle: "italic",
  },
};
