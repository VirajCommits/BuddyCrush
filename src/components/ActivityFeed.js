import React from "react";

export default function ActivityFeed({ activity = [] }) {
  if (!Array.isArray(activity) || activity.length === 0) {
    return <p style={styles.noData}>No recent activity.</p>;
  }

  return (
    <div style={styles.container}>
      <ul style={styles.list}>
        {activity.map((item, index) => (
          <li key={index} style={styles.listItem}>
            {/* Avatar */}
            <img
              src={item.user_picture}
              alt={item.user_name}
              style={styles.avatar}
            />
            {/* User Info */}
            <div style={styles.userInfo}>
              <span style={styles.userName}>{item.user_name}</span>
              <span style={styles.completed}>
                Completed{" "}
                {item.days_ago > 0
                  ? `${item.days_ago} day(s) ago`
                  : "today"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    borderRadius: "8px",
    maxWidth: "1000px",
    margin: "20px auto",
  },
  noData: {
    color: "#ddd",
    textAlign: "center",
    fontSize: "14px",
  },
  list: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "10px",
    objectFit: "cover", // Ensure the image fits within the avatar
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontWeight: "600",
    fontSize: "14px",
    color: "#fff",
    marginBottom: "3px", // Added spacing between name and time
  },
  completed: {
    fontSize: "12px",
    color: "#aaa",
  },
};
