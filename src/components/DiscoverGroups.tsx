// src/components/DiscoverGroups.tsx
/* eslint-disable @next/next/no-img-element */

"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { fetchGroups, joinGroup } from "../utils/api";
import { FaUsers } from "react-icons/fa";

type User = {
  email: string;
  name: string;
  picture: string;
};

type Member = {
  user_image: string | undefined;
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
  const [, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string>("");
  const [avatarSrcs, setAvatarSrcs] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user joined a group
  const isJoined = useCallback(
    (groupId: number) => joinedGroups.has(groupId),
    [joinedGroups]
  );

  // On mount: fetch profile & groups
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1) Fetch logged-in user
        const profileRes = await fetch("/api/profile", {
          credentials: "include",
        });
        if (!profileRes.ok) {
          throw new Error("Failed to fetch user profile.");
        }
        const profileData = await profileRes.json();
        setUser(profileData.user);

        // 2) Fetch all groups
        const groupsResponse = await fetchGroups();
        const fetchedGroups = groupsResponse.data.groups;
        setGroups(fetchedGroups);

        // 3) Determine which group IDs the user joined
        if (profileData.user?.email) {
          const joinedIds = fetchedGroups
            .filter((group: Group) =>
              group.members.some((m) => m.email === profileData.user.email)
            )
            .map((g: Group) => g.id);
          setJoinedGroups(new Set(joinedIds));
        }

        setLoading(false);
      } catch (err: unknown) {
        console.error("Error fetching data:", err);
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch data.");
        } else {
          setError("Failed to fetch data.");
        }
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Join a group
  const handleJoin = useCallback(
    async (groupId: number) => {
      try {
        await joinGroup(groupId);
        // Update local state
        setJoinedGroups((prev) => new Set(prev).add(groupId));
      } catch (err) {
        console.error("Error joining group:", err);
        setError("Failed to join the group. Please try again later.");
      }
    },
    []
  );

  // Fallback image on error
  const handleImageError = useCallback((groupId: number) => {
    setAvatarSrcs((prev) => ({
      ...prev,
      [groupId]: "https://via.placeholder.com/40",
    }));
  }, []);

  // If there's an error
  if (error) {
    return (
      <div style={styles.errorMsg}>
        <p>Error: {error}</p>
      </div>
    );
  }

  // If loading, show skeleton loaders + loading text
  if (loading) {
    return (
      <>
        {/* Define global blinking keyframes here */}
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
        <div style={styles.container}>
          <div style={styles.loadingText}>Loading...</div>
          <div style={styles.grid}>
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </>
    );
  }

  // Once data is fetched, show actual data
  return (
    <>
      {/* Keep keyframes global if you want them always available */}
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

      <div style={styles.container}>
        <div style={styles.grid}>
          {groups.map((group) => (
            <GroupItem
              key={group.id}
              group={group}
              isJoined={isJoined}
              handleJoin={handleJoin}
              handleImageError={handleImageError}
              avatarSrcs={avatarSrcs}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// ---------------------
// Memoized Child
// ---------------------
interface GroupItemProps {
  group: Group;
  isJoined: (groupId: number) => boolean;
  handleJoin: (groupId: number) => Promise<void>;
  handleImageError: (groupId: number) => void;
  avatarSrcs: { [key: number]: string };
}

const GroupItem = memo(function GroupItem({
  group,
  isJoined,
  handleJoin,
  handleImageError,
  avatarSrcs,
}: GroupItemProps) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>{group.name}</h3>
        <div style={styles.memberCount}>
          <FaUsers style={{ marginRight: "5px" }} />
          {group.members.length}{" "}
          {group.members.length === 1 ? "Member" : "Members"}
        </div>
      </div>

      <div style={styles.avatars}>
        {group.members.slice(0, 5).map((member, index) => (
          <img
            key={index}
            src={
              avatarSrcs[group.id] ||
              member.user_image ||
              "https://via.placeholder.com/40"
            }
            alt={`${member.name}'s avatar`}
            width={40}
            height={40}
            style={styles.avatar}
            onError={() => handleImageError(group.id)}
          />
        ))}
        {group.members.length > 5 && (
          <span style={styles.moreMembers}>+{group.members.length - 5}</span>
        )}
      </div>

      <p style={styles.description}>{group.description}</p>

      {isJoined(group.id) ? (
        <button style={{ ...styles.joinButton, ...styles.joinedButton }} disabled>
          Joined
        </button>
      ) : (
        <button style={styles.joinButton} onClick={() => handleJoin(group.id)}>
          Join
        </button>
      )}
    </div>
  );
});

// ---------------------
// Skeleton Card
// ---------------------
function SkeletonCard() {
  return (
    <div style={styles.skeletonCard}>
      <div style={styles.skeletonHeader}>
        <div style={styles.skeletonTitle} />
        <div style={styles.skeletonSubtitle} />
      </div>
      <div style={styles.skeletonAvatars}>
        <div style={styles.skeletonAvatar} />
        <div style={styles.skeletonAvatar} />
        <div style={styles.skeletonAvatar} />
      </div>
      <div style={styles.skeletonDescription} />
      <div style={styles.skeletonButton} />
    </div>
  );
}

// ---------------------
// Inline Styles
// ---------------------
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "40px 20px",
    maxWidth: "1200px",
    margin: "auto",
    fontFamily: "'Roboto', sans-serif",
  },
  loadingText: {
    textAlign: "center",
    marginBottom: "1rem",
    fontSize: "1.2rem",
    fontStyle: "italic",
    color: "#444",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  card: {
    backgroundColor: "#CCCCFF",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.3s, box-shadow 0.3s",
    minHeight: "200px",
  },
  cardHeader: {
    marginBottom: "15px",
  },
  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#4B4B4B",
    margin: "0 0 10px 0",
  },
  memberCount: {
    display: "flex",
    alignItems: "center",
    fontSize: "0.9rem",
    color: "#777",
  },
  avatars: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    position: "relative",
  },
  avatar: {
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "-10px",
    border: "2px solid #fff",
    boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  moreMembers: {
    fontSize: "0.9rem",
    color: "#555",
    marginLeft: "10px",
  },
  description: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "20px",
    flexGrow: 1,
  },
  joinButton: {
    padding: "10px 20px",
    backgroundColor: "#6A5ACD", // SlateBlue
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "background-color 0.3s, transform 0.3s",
  },
  joinedButton: {
    backgroundColor: "#32CD32", // LimeGreen
    cursor: "not-allowed",
  },
  errorMsg: {
    color: "red",
    textAlign: "center",
    marginTop: "50px",
    fontSize: "1.2rem",
  },

  // Skeleton styles
  skeletonCard: {
    backgroundColor: "#eee",
    overflow: "hidden",
    position: "relative",
    // Use the global blinking keyframes
    animation: "blink 1s ease-in-out infinite",
    borderRadius: "15px",
    padding: "25px",
    minHeight: "200px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  skeletonHeader: {
    marginBottom: "15px",
  },
  skeletonTitle: {
    width: "60%",
    height: "20px",
    backgroundColor: "#ddd",
    borderRadius: "4px",
    marginBottom: "10px",
  },
  skeletonSubtitle: {
    width: "40%",
    height: "15px",
    backgroundColor: "#ddd",
    borderRadius: "4px",
  },
  skeletonAvatars: {
    display: "flex",
    marginBottom: "15px",
  },
  skeletonAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#ddd",
    marginRight: "-10px",
    border: "2px solid #fff",
  },
  skeletonDescription: {
    width: "100%",
    height: "40px",
    backgroundColor: "#ddd",
    borderRadius: "4px",
    marginBottom: "20px",
    flexGrow: 1,
  },
  skeletonButton: {
    width: "30%",
    height: "35px",
    backgroundColor: "#ddd",
    borderRadius: "8px",
  },
};
