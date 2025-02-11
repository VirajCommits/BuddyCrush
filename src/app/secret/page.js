"use client";

import React, { useEffect, useState } from "react";

export default function SecretTrackingPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/secret-tracking");
        const data = await res.json();
        let loggedInUsers = data.logged_in_users || [];

        // If each user has a login_time, sort descending (latest first)
        if (loggedInUsers.length && loggedInUsers[0].login_time) {
          loggedInUsers.sort(
            (a, b) => new Date(b.login_time) - new Date(a.login_time)
          );
        }
        setUsers(loggedInUsers);
      } catch (error) {
        console.error("Error fetching secret tracking data:", error);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Logged In Users(Total User Count:43)
      </h1>
      {users.length === 0 ? (
        <p style={{ textAlign: "center" }}>No users have logged in yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((user) => (
            <li
              key={user.email}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={user.picture}
                alt={user.name}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  marginRight: "1rem",
                  objectFit: "cover",
                }}
              />
              <div>
                <h2 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem" }}>
                  {user.name}
                </h2>
                <p style={{ margin: 0, color: "#555" }}>{user.email}</p>
                {user.login_time && (
                  <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#888" }}>
                    Logged in: {new Date(user.login_time).toLocaleString()}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
