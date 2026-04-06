/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useCallback } from "react";

interface GroupRow {
  id: number;
  name: string;
  description: string;
  member_count: number;
}

interface UserRow {
  id: number;
  name: string;
  email: string;
  picture: string | null;
  group_count: number;
}

type Tab = "groups" | "users";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [pw, setPw] = useState("");

  const [tab, setTab] = useState<Tab>("groups");
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const [search, setSearch] = useState("");

  const fetchGroups = useCallback(async (pass: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/groups?pw=${encodeURIComponent(pass)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGroups(data.groups);
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async (pass: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?pw=${encodeURIComponent(pass)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(data.users);
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = async () => {
    setAuthError("");
    try {
      const res = await fetch(`/api/admin/groups?pw=${encodeURIComponent(password)}`);
      if (res.status === 401) {
        setAuthError("Wrong password.");
        return;
      }
      if (!res.ok) {
        setAuthError(`Server error (${res.status}). Try again in a moment.`);
        return;
      }
      const data = await res.json();
      setGroups(data.groups);
      setPw(password);
      setAuthed(true);
      fetchUsers(password);
    } catch {
      setAuthError("Connection failed. Is the backend running?");
    }
  };

  const deleteGroup = async (id: number, name: string) => {
    if (!confirm(`Delete group "${name}" and all its data?`)) return;
    setActionMsg("");
    try {
      const res = await fetch(`/api/admin/groups/${id}?pw=${encodeURIComponent(pw)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setActionMsg(data.message);
      setGroups((prev) => prev.filter((g) => g.id !== id));
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const deleteUser = async (id: number, name: string) => {
    if (!confirm(`Delete user "${name}" and all their data?`)) return;
    setActionMsg("");
    try {
      const res = await fetch(`/api/admin/users/${id}?pw=${encodeURIComponent(pw)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setActionMsg(data.message);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const refresh = () => {
    fetchGroups(pw);
    fetchUsers(pw);
    setActionMsg("");
  };

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase())
  );
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="card p-10 max-w-sm w-full text-center shadow-lg">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">Admin Panel</h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">Enter the admin password to continue</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] mb-4"
          />
          {authError && <p className="text-xs text-[var(--danger)] mb-3">{authError}</p>}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl font-semibold text-sm btn-primary"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="bg-[var(--surface)] border-b border-[var(--border)] shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <h1 className="text-lg font-bold text-[var(--text-primary)]">Admin Panel</h1>
              <p className="text-[11px] text-[var(--text-muted)]">
                {groups.length} groups &middot; {users.length} users
              </p>
            </div>
          </div>
          <button
            onClick={refresh}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--primary)] bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 transition-colors"
          >
            Refresh
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Action message */}
        {actionMsg && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-[var(--success-light)] text-[var(--success)] text-sm font-medium flex items-center justify-between">
            {actionMsg}
            <button onClick={() => setActionMsg("")} className="text-[var(--success)] font-bold ml-4">&times;</button>
          </div>
        )}

        {/* Search + Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tab === "groups" ? "Search groups..." : "Search users..."}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <div className="flex bg-[var(--bg-secondary)] rounded-xl p-1">
            <button
              onClick={() => setTab("groups")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "groups" ? "bg-[var(--primary)] text-white shadow-sm" : "text-[var(--text-secondary)]"}`}
            >
              Groups ({groups.length})
            </button>
            <button
              onClick={() => setTab("users")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "users" ? "bg-[var(--primary)] text-white shadow-sm" : "text-[var(--text-secondary)]"}`}
            >
              Users ({users.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === "groups" ? (
          /* ───── Groups Table ───── */
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg-secondary)] text-[var(--text-muted)] text-xs uppercase tracking-wider">
                    <th className="px-5 py-3 text-left font-semibold">ID</th>
                    <th className="px-5 py-3 text-left font-semibold">Name</th>
                    <th className="px-5 py-3 text-left font-semibold hidden sm:table-cell">Description</th>
                    <th className="px-5 py-3 text-center font-semibold">Members</th>
                    <th className="px-5 py-3 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGroups.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-[var(--text-muted)]">No groups found</td>
                    </tr>
                  ) : (
                    filteredGroups.map((g) => (
                      <tr key={g.id} className="border-t border-[var(--border)] hover:bg-[var(--bg-secondary)]/50 transition-colors">
                        <td className="px-5 py-3 text-[var(--text-muted)] font-mono text-xs">{g.id}</td>
                        <td className="px-5 py-3 font-semibold text-[var(--text-primary)]">{g.name}</td>
                        <td className="px-5 py-3 text-[var(--text-secondary)] truncate max-w-xs hidden sm:table-cell">{g.description}</td>
                        <td className="px-5 py-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold">
                            {g.member_count}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button
                            onClick={() => deleteGroup(g.id, g.name)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--danger)] bg-[var(--danger)]/8 hover:bg-[var(--danger)]/15 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ───── Users Grid ───── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredUsers.length === 0 ? (
              <div className="col-span-full text-center py-12 text-[var(--text-muted)]">No users found</div>
            ) : (
              filteredUsers.map((u) => (
                <div key={u.id} className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                  <img
                    src={u.picture || "https://via.placeholder.com/40"}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 bg-[var(--bg-secondary)]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{u.name}</p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">{u.email}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{u.group_count} group{u.group_count !== 1 ? "s" : ""}</p>
                  </div>
                  <button
                    onClick={() => deleteUser(u.id, u.name)}
                    className="p-1.5 rounded-lg text-[var(--danger)] bg-[var(--danger)]/8 hover:bg-[var(--danger)]/15 transition-colors shrink-0"
                    title="Delete user"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
