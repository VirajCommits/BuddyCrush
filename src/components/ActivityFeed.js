// components/ActivityFeed.js

import React from "react";

export default function ActivityFeed({ activity }) {
  if (activity.length === 0) {
    return <p style={styles.noData}>No recent activity.</p>;
  }

  return (
    <div style={styles.container}>
      <h3>Recent Activity</h3>
      <ul style={styles.list}>
        {activity.map((item, index) => (
          <li key={index} style={styles.listItem}>
            <img
              src={item.user_picture}
              alt={item.user_name}
              style={styles.avatar}
            />
            <span style={styles.userName}>{item.user_name}</span>
            <span style={styles.completed}>
              Completed {item.days_ago > 0 ? `${item.days_ago} day(s) ago` : "today"}
            </span>
          </li>
        ))}
      </ul>
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
    listStyleType: "none",
    paddingLeft: "0",
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
  completed: {
    fontWeight: "bold",
    color: "#fff",
  },
};
