import React from "react";

export default function Leaderboard({ leaderboard }) {
  if (leaderboard.length === 0) {
    return <p style={styles.noData}>No completions yet.</p>;
  }

  return (
    <div style={styles.container}>
      <ol style={styles.list}>
        {leaderboard.map((user, index) => (
          <li key={user.user_id} style={styles.listItem}>
            {/* Avatar */}
            <img
              src={user.user_picture}
              alt={user.user_name}
              style={styles.avatar}
            />
            {/* User Info */}
            <div style={styles.userInfo}>
              <span style={styles.userName}>{user.user_name}</span>
              <span style={styles.completionCount}>
                {user.completion_count} completions
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

const styles = {
  container: {
    padding: "1px",
    borderRadius: "8px",
    maxWidth: "500px",
    margin: "3px auto",
  },
  noData: {
    color: "#ddd",
    textAlign: "center",
    fontSize: "14px",
  },
  list: {
    listStyleType: "decimal",
    paddingLeft: "3px",
    margin: "0",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    padding: "5px 0",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "15px",
    objectFit: "cover",
    border: "2px solid #444",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  userName: {
    fontWeight: "600",
    fontSize: "14px",
    color: "#fff",
    marginBottom: "5px",
  },
  completionCount: {
    fontSize: "12px",
    color: "#aaa",
  },
};
