/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
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
  const [groups, setGroups] = useState<Group[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const isJoined = useCallback((groupId: number) => joinedGroups.has(groupId), [joinedGroups]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileRes = await fetch("/api/profile", { credentials: "include" });
        if (!profileRes.ok) throw new Error("Failed to fetch profile.");
        const profileData = await profileRes.json();

        const groupsResponse = await fetchGroups();
        const fetchedGroups = groupsResponse.data.groups;
        setGroups(fetchedGroups);

        if (profileData.user?.email) {
          const joinedIds = fetchedGroups
            .filter((group: Group) => group.members.some((m) => m.email === profileData.user.email))
            .map((g: Group) => g.id);
          setJoinedGroups(new Set(joinedIds));
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
    try {
      await joinGroup(groupId);
      setJoinedGroups((prev) => new Set(prev).add(groupId));
    } catch (err) {
      console.error("Error joining group:", err);
      setError("Failed to join the group.");
    }
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="glass-card p-6 text-center">
          <p className="text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-56 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {groups.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[var(--text-secondary)]">No groups available yet. Create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, idx) => (
            <GroupItem key={group.id} group={group} isJoined={isJoined} handleJoin={handleJoin} delay={idx * 0.05} />
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
}

const GroupItem = memo(function GroupItem({ group, isJoined, handleJoin, delay }: GroupItemProps) {
  return (
    <div
      className="glass-card p-6 flex flex-col justify-between animate-slide-up opacity-0 hover:scale-[1.02] transition-transform duration-300"
      style={{ animationDelay: `${delay}s`, animationFillMode: "forwards", minHeight: "220px" }}
    >
      <div>
        <h3 className="text-lg font-bold text-white mb-2">{group.name}</h3>
        <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {group.members.length} {group.members.length === 1 ? "Member" : "Members"}
        </div>

        {/* Member avatars */}
        <div className="flex items-center mb-4">
          {group.members.slice(0, 5).map((member, index) => (
            <img
              key={index}
              src={member.user_image || "https://via.placeholder.com/32"}
              alt={`${member.name}`}
              width={32} height={32}
              className="rounded-full object-cover border-2 border-[var(--bg-primary)] -ml-2 first:ml-0"
            />
          ))}
          {group.members.length > 5 && (
            <span className="text-xs text-[var(--text-muted)] ml-2">+{group.members.length - 5}</span>
          )}
        </div>

        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">{group.description}</p>
      </div>

      {isJoined(group.id) ? (
        <button disabled className="w-full py-2.5 rounded-xl text-sm font-semibold bg-[var(--success)]/20 text-[var(--success)] cursor-default">
          Joined
        </button>
      ) : (
        <button
          onClick={() => handleJoin(group.id)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold btn-primary"
        >
          Join Group
        </button>
      )}
    </div>
  );
});
