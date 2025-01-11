"use client";

import React, { useState, useEffect } from "react";
import { fetchGroups, joinGroup, createGroup } from "../utils/api";
import DiscoverGroups from "../components/DiscoverGroups";
import CreateGroup from "../components/CreateGroup";

export default function HomePage() {
  const [groups, setGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState(new Set());
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the logged-in user's profile
        const profileResponse = await fetch("https://buddy-board-88fd54c902d8.herokuapp.com/api/profile", {
          credentials: "include",
        });
        const profileData = await profileResponse.json();
        setUserEmail(profileData.user.email);

        // Fetch initial groups data
        const groupsResponse = await fetchGroups();
        setGroups(groupsResponse.data.groups);

        // Determine joined groups
        const joined = groupsResponse.data.groups
          .filter((group) =>
            group.members.some((member) => member.email === profileData.user.email)
          )
          .map((group) => group.id);
        setJoinedGroups(new Set(joined));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCreateGroup = async (newGroup) => {
    try {
      const response = await createGroup(newGroup);
      setGroups((prev) => [...prev, response.data.group]); // Add new group to the list
      alert("Group created successfully!");
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group.");
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await joinGroup(groupId);
      setJoinedGroups((prev) => new Set(prev).add(groupId));
      alert("Successfully joined the group!");
    } catch (error) {
      console.error("Error joining group:", error);
      alert("Failed to join the group.");
    }
  };

  return (
    <div>
      <h1>Buddy Board</h1>
      <CreateGroup onCreate={handleCreateGroup} />
      <DiscoverGroups
        groups={groups}
        joinedGroups={joinedGroups}
        onJoin={handleJoinGroup}
        userEmail={userEmail}
      />
    </div>
  );
}
