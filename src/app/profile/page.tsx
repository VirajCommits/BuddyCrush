"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfilePage from "../../components/ProfilePage";

type User = {
  name: string;
  email: string;
  picture: string;
};

type Group = {
  id: number;
  name: string;
  description: string;
  members: {
    email: string;
    name: string;
    picture: string;
  }[];
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [error, setError] = useState<string>("");

  // 1) Fetch the user's profile
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/profile", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to fetch profile");
      });
  }, []);

  // 2) Once we have the user, fetch ALL groups from /api/groups/discover,
  // then filter by user membership
  useEffect(() => {
    if (!user) return;

    axios
      .get("http://localhost:5000/api/groups/discover", { withCredentials: true })
      .then((res) => {
        const allGroups: Group[] = res.data.groups || [];
        // Filter out the groups where this user's email is in the members
        const joined = allGroups.filter((g) =>
          g.members.some((m) => m.email === user.email)
        );
        setUserGroups(joined);
      })
      .catch((err) => {
        console.error("Error fetching groups:", err);
      });
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Loading profile...</div>;

  return (
    <ProfilePage
      user={user}
      userGroups={userGroups}
      onLogout={handleLogout}
    />
  );
}
