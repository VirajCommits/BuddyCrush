/* eslint-disable @next/next/no-img-element */
"use client";

export default function LeaderboardComponent({ leaderboard }) {
  if (leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 opacity-50">
        <svg className="w-10 h-10 text-[var(--text-muted)] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        <p className="text-sm text-[var(--text-muted)]">No completions yet.</p>
      </div>
    );
  }

  const getMedalColor = (index) => {
    if (index === 0) return "text-yellow-400";
    if (index === 1) return "text-gray-300";
    if (index === 2) return "text-amber-600";
    return "text-[var(--text-muted)]";
  };

  return (
    <div className="space-y-2">
      {leaderboard.map((user, index) => (
        <div key={user.user_id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
          <span className={`text-sm font-bold w-6 text-center ${getMedalColor(index)}`}>
            {index < 3 ? ["\u{1F947}", "\u{1F948}", "\u{1F949}"][index] : `${index + 1}`}
          </span>
          <img
            src={user.user_picture || "https://via.placeholder.com/32"}
            alt={`${user.user_name}'s avatar`}
            width={32} height={32}
            className="rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.user_name}</p>
            <p className="text-xs text-[var(--text-muted)]">{user.completion_count} completions</p>
          </div>
        </div>
      ))}
    </div>
  );
}
