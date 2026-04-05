/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { fetchGroups, joinGroup } from "../utils/api";

type Member = {
  user_image: string | undefined;
  email: string;
  name: string;
  picture: string;
};

type Group = {
  id: number;
  name: string;
  description: string;
  members: Member[];
};

export default function DiscoverGroups() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<Set<number>>(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const isJoined = useCallback((groupId: number) => joinedGroups.has(groupId), [joinedGroups]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const groupsResponse = await fetchGroups();
        const fetchedGroups = groupsResponse.data.groups;
        setGroups(fetchedGroups);

        try {
          const profileRes = await fetch("/api/profile", { credentials: "include" });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            if (profileData.user?.email) {
              setIsLoggedIn(true);
              const joinedIds = fetchedGroups
                .filter((group: Group) => group.members.some((m) => m.email === profileData.user.email))
                .map((g: Group) => g.id);
              setJoinedGroups(new Set(joinedIds));
            }
          }
        } catch {
          /* not logged in – that's fine */
        }
      } catch (err: unknown) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleJoin = useCallback(async (groupId: number) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    try {
      await joinGroup(groupId);
      setJoinedGroups((prev) => new Set(prev).add(groupId));
      await queryClient.invalidateQueries({ queryKey: ["joinedGroups"] });
    } catch (err) {
      console.error("Error joining group:", err);
      setError("Failed to join the group.");
    }
  }, [queryClient, isLoggedIn, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="card p-6 text-center">
          <p className="text-[var(--danger)]">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-56 rounded-[20px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {groups.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">🔍</span>
          <p className="text-[var(--text-secondary)]">No groups available yet. Create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, idx) => (
            <GroupItem key={group.id} group={group} isJoined={isJoined} handleJoin={handleJoin} delay={idx * 0.05} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      )}
    </div>
  );
}

interface GroupItemProps {
  group: Group;
  isJoined: (groupId: number) => boolean;
  handleJoin: (groupId: number) => Promise<void>;
  delay: number;
  isLoggedIn: boolean;
}

const GroupItem = memo(function GroupItem({ group, isJoined, handleJoin, delay, isLoggedIn }: GroupItemProps) {
  return (
    <div
      className="card p-6 flex flex-col justify-between animate-slide-up opacity-0 hover:shadow-md transition-shadow duration-300"
      style={{ animationDelay: `${delay}s`, animationFillMode: "forwards", minHeight: "220px" }}
    >
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">{group.name}</h3>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-3">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          {group.members.length} {group.members.length === 1 ? "Member" : "Members"}
        </div>

        <div className="flex items-center mb-4">
          {group.members.slice(0, 5).map((member, index) => (
            <img
              key={index}
              src={member.user_image || "https://via.placeholder.com/32"}
              alt={`${member.name}`}
              width={30} height={30}
              className="rounded-full object-cover border-2 border-[var(--surface)] -ml-2 first:ml-0"
            />
          ))}
          {group.members.length > 5 && (
            <span className="text-xs text-[var(--text-muted)] ml-2">+{group.members.length - 5}</span>
          )}
        </div>

        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">{group.description}</p>
      </div>

      {isJoined(group.id) ? (
        <div className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--success-light)] text-[var(--success)]">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          Joined
        </div>
      ) : (
        <button
          onClick={() => handleJoin(group.id)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold btn-primary"
        >
          {isLoggedIn ? "Join Group" : "Sign in to Join"}
        </button>
      )}
    </div>
  );
});
