// src/app/discover/page.tsx
"use client";

import React from "react";
import DiscoverGroups from "../../components/DiscoverGroups";

export default function DiscoverGroupsPage() {
  return (
    <div style={styles.pageContainer}>
      <button style={styles.backButton} onClick={() => history.back()}>
        &lt; BACK
      </button>

      <h1 style={styles.heading}>Discover Groups</h1>
      <DiscoverGroups />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    maxWidth: "1200px",
    margin: "50px auto",
    padding: "20px",
    backgroundColor: "#121212",
    color: "#fff",
    borderRadius: "10px",
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#bbb",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "20px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "30px",
    textAlign: "center",
  },
};
