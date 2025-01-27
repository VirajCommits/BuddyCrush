/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import GroupCard from "./GroupCard";
import { fetchGroups, checkHabitCompletion } from "../utils/api";

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [habitStatusMap, setHabitStatusMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroupsAndStatuses = async () => {
      try {
        setLoading(true);

        // Fetch all groups
        const { data: groupData } = await fetchGroups();
        setGroups(groupData.groups);

        // Fetch habit completion statuses for all groups in parallel
        const habitStatuses = await Promise.all(
          groupData.groups.map((group) => checkHabitCompletion(group.id))
        );

        // Map group IDs to their completion statuses
        const statusMap = groupData.groups.reduce((map, group, index) => {
          map[group.id] = habitStatuses[index].data.completed;
          return map;
        }, {});

        setHabitStatusMap(statusMap);
      } catch (err) {
        console.error("Error fetching groups or statuses:", err);
        setError("Failed to fetch group data.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupsAndStatuses();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading groups...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            alreadyCompleted={habitStatusMap[group.id] || false}
          />
        ))
      )}
    </div>
  );
}
