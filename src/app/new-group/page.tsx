"use client";

import React from "react";
import axios from "axios";
import CreateGroup from "../../components/CreateGroup";

export default function NewGroupPage() {
  const handleCreateGroup = async (newGroupData: { name: string; description: string }) => {
    try {
      // Example: POST to your backend
      // Adjust the endpoint as needed
      const response = await axios.post(
        "http://localhost:5000/api/groups/create",
        newGroupData,
        { withCredentials: true } // Ensures cookies are sent
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group.");
    }
  };

  return (
    <CreateGroup onCreate={handleCreateGroup} />
  );
}
