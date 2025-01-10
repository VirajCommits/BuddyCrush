"use client";

import React from "react";
import DiscoverGroups from "../../components/DiscoverGroups";

export default function DiscoverGroupsPage() {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => history.back()}>
          &lt; BACK
        </button>
        <h1 style={styles.heading}>Discover accountability groups</h1>
      </div>
      <DiscoverGroups />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    padding: "10px",
    backgroundColor: "#2E2B3C", // Bluish-greyish-purplish background
    minHeight: "100vh",
    fontFamily: "'Roboto', sans-serif",
    color: "#fff", // Text color adjusted for dark background
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  backButton: {
    background: "#fff",
    border: "none",
    color: "#7C83FD", // Subtle blue for the back button
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "0",
    marginRight: "10px",
    textDecoration: "underline",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#D4D4F5", // Slightly lighter shade for the heading
    flexGrow: 1,
    textAlign: "center",
  },
};
