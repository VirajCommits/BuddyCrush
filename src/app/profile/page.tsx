// src/app/profile/page.tsx
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
  members: any[]; // or define a proper type
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // 1) Fetch the user's profile
    axios
      .get("http://localhost:5000/api/profile", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to fetch profile");
      });
  }, []);

  // 2) Once the user is loaded, fetch the groups
  useEffect(() => {
    if (!user) return;

    axios
      .get("http://localhost:5000/api/profile/groups", { withCredentials: true })
      .then((res) => {
        setUserGroups(res.data.groups || []);
      })
      .catch((err) => {
        console.error("Error fetching user groups:", err);
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
