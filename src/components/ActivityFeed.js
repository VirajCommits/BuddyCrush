/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function ActivityFeed({ activity = [] }) {
  if (!Array.isArray(activity) || activity.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 opacity-60">
        <span className="text-3xl mb-2">⚡</span>
        <p className="text-sm text-[var(--text-muted)]">No recent activity.</p>
      </div>
    );
  }

  const formatTimeAgo = (daysAgo) => {
    if (daysAgo === 0) return null;
    if (daysAgo === 1) return "yesterday";
    if (daysAgo < 7) return `${daysAgo} days ago`;
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} week(s) ago`;
    return `${Math.floor(daysAgo / 30)} month(s) ago`;
  };

  return (
    <div className="space-y-2">
      {activity.map((item, index) => (
        <div key={index} className="flex items-center gap-3 py-1.5">
          <img
            src={item.user_picture || "https://via.placeholder.com/32"}
            alt={`${item.user_name}'s avatar`}
            width={32} height={32}
            className="rounded-full object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{item.user_name}</p>
            <p className="text-xs text-[var(--text-muted)]">
              {item.days_ago === 0
                ? "Completed a minute ago"
                : `Completed ${formatTimeAgo(item.days_ago)}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
