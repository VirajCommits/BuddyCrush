// src/components/DiscoverGroups.tsx

"use client";

import { useEffect, useState } from "react";
import { fetchGroups, joinGroup } from "../utils/api"; // or however you fetch data

type User = {
  email: string;
  name: string;
  picture: string;
};

type Member = {
  email: string;
  name: string;
  picture: string;
};

type Group = {
  id: number;
  name: string;
  description: string;
  members: Member[];
};

export default function DiscoverGroups() {
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string>("");

  // Helper function to check if user already joined a group
  const isJoined = (groupId: number) => joinedGroups.has(groupId);

  /**
   * On mount:
   * 1) Fetch the logged-in user from /api/profile
   * 2) Fetch all groups via fetchGroups()
   * 3) Determine which group IDs the user is in, store them in joinedGroups
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) Fetch the logged-in user
        const profileRes = await fetch("http://localhost:5000/api/profile", {
          credentials: "include",
        });
        if (!profileRes.ok) {
          throw new Error("Failed to fetch user profile.");
        }
        const profileData = await profileRes.json();
        setUser(profileData.user);

        // 2) Fetch all groups
        const groupsResponse = await fetchGroups(); 
        // e.g., groupsResponse.data.groups = [{id, name, members: [...]}, ...]
        const fetchedGroups = groupsResponse.data.groups;
        setGroups(fetchedGroups);

        // 3) Determine which group IDs the user has joined
        if (profileData.user?.email) {
          const joined = fetchedGroups
            .filter((group: Group) =>
              group.members.some((m) => m.email === profileData.user.email)
            )
            .map((g) => g.id);

          setJoinedGroups(new Set(joined));
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data.");
      }
    };

    fetchData();
  }, []);

  /**
   * Handle joining a group:
   * - If successful, add the groupId to joinedGroups so the UI updates
   */
  const handleJoin = async (groupId: number) => {
    try {
      await joinGroup(groupId); // POST request to join the group
      alert("Successfully joined the group!");
      setJoinedGroups((prev) => new Set(prev).add(groupId)); // update local state
    } catch (error) {
      console.error("Error joining group:", error);
      alert("Failed to join the group.");
    }
  };

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "50px" }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Discover Groups</h2>
      <div style={styles.grid}>
        {groups.map((group) => (
          <div key={group.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>{group.name}</h3>
              <span style={styles.memberCount}>
                👥 {group.members.length}{" "}
                {group.members.length === 1 ? "member" : "members"}
              </span>
            </div>
            <div style={styles.avatars}>
              {group.members.slice(0, 5).map((member, index) => (
                <img
                  key={index}
                  src={member.picture}
                  alt={member.name}
                  style={styles.avatar}
                />
              ))}
              {group.members.length > 5 && (
                <span style={styles.moreMembers}>
                  +{group.members.length - 5}
                </span>
              )}
            </div>
            <p style={styles.description}>{group.description}</p>

            {/* Show 'Joined' label or 'Join' button */}
            {isJoined(group.id) ? (
              <span style={styles.joinedTag}>Joined</span>
            ) : (
              <button
                style={styles.joinButton}
                onClick={() => handleJoin(group.id)}
              >
                Join
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "auto",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
    color: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#1c1c1c",
    borderRadius: "10px",
    padding: "20px",
    color: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardHeader: {
    marginBottom: "15px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  memberCount: {
    fontSize: "14px",
    color: "#aaa",
    marginBottom: "5px",
  },
  avatars: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  },
  avatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    marginRight: "5px",
    border: "2px solid #fff",
    objectFit: "cover",
  },
  moreMembers: {
    fontSize: "14px",
    color: "#aaa",
    marginLeft: "5px",
  },
  description: {
    fontSize: "14px",
    color: "#ddd",
    marginBottom: "20px",
  },
  joinButton: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
  joinedTag: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "5px",
    backgroundColor: "#28a745",
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
};
