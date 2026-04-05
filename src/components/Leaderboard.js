/* eslint-disable @next/next/no-img-element */
"use client";

export default function LeaderboardComponent({ leaderboard }) {
  if (leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 opacity-60">
        <span className="text-3xl mb-2">🏆</span>
        <p className="text-sm text-[var(--text-muted)]">No completions yet.</p>
      </div>
    );
  }

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}`;
  };

  return (
    <div className="space-y-2">
      {leaderboard.map((user, index) => (
        <div key={user.user_id} className="flex items-center gap-3 py-1.5">
          <span className="text-sm font-bold w-6 text-center">
            {getMedal(index)}
          </span>
          <img
            src={user.user_picture || "https://via.placeholder.com/32"}
            alt={`${user.user_name}'s avatar`}
            width={32} height={32}
            className="rounded-full object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user.user_name}</p>
            <p className="text-xs text-[var(--text-muted)]">{user.completion_count} completions</p>
          </div>
        </div>
      ))}
    </div>
  );
}
