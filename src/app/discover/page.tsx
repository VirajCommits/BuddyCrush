"use client";

import React from "react";
import DiscoverGroups from "../../components/DiscoverGroups";

export default function DiscoverGroupsPage() {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <button
          style={styles.backButton}
          onClick={() => history.back()}
          aria-label="Go Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="#7C83FD"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={styles.backIcon}
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
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
    display: "flex",
    alignItems: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "10px 15px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#7C83FD", // Subtle blue for the back button
    textDecoration: "none",
    transition: "transform 0.2s, color 0.2s",
  },
  backButtonHover: {
    transform: "scale(1.05)",
    color: "#A1A8FF", // Slightly lighter blue on hover
  },
  backIcon: {
    marginRight: "0px",
    transition: "stroke 0.2s",
  },
  backText: {
    fontSize: "16px",
    fontWeight: "bold",
    transition: "color 0.2s",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#D4D4F5", // Slightly lighter shade for the heading
    flexGrow: 1,
    textAlign: "center",
  },
};
