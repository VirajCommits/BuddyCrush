// components/Leaderboard.js

import React from "react";

export default function Leaderboard({ leaderboard }) {
  if (leaderboard.length === 0) {
    return <p style={styles.noData}>No completions yet.</p>;
  }

  return (
    <div style={styles.container}>
      <h3>Leaderboard</h3>
      <ol style={styles.list}>
        {leaderboard.map((user, index) => (
          <li key={user.user_id} style={styles.listItem}>
            <img
              src={user.user_picture}
              alt={user.user_name}
              style={styles.avatar}
            />
            <span style={styles.userName}>{user.user_name}</span>
            <span style={styles.completionCount}>
              {user.completion_count} completions
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const styles = {
  container: {
    padding: "10px",
  },
  noData: {
    color: "#ccc",
  },
  list: {
    listStyleType: "decimal",
    paddingLeft: "20px",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  avatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    marginRight: "10px",
    objectFit: "cover",
  },
  userName: {
    flex: 1,
    color: "#fff",
  },
  completionCount: {
    fontWeight: "bold",
    color: "#fff",
  },
};
