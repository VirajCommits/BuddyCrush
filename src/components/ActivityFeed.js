/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function ActivityFeed({ activity = [] }) {
  if (!Array.isArray(activity) || activity.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 opacity-50">
        <svg className="w-10 h-10 text-[var(--text-muted)] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p className="text-sm text-[var(--text-muted)]">No recent activity.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activity.map((item, index) => (
        <div key={index} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
          <img
            src={item.user_picture || "https://via.placeholder.com/32"}
            alt={`${item.user_name}'s avatar`}
            width={32} height={32}
            className="rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{item.user_name}</p>
            <p className="text-xs text-[var(--text-muted)]">
              Completed {item.days_ago > 0 ? `${item.days_ago} day(s) ago` : "today"}
            </p>
          </div>
          {item.days_ago === 0 && (
            <span className="text-xs bg-[var(--success)]/20 text-[var(--success)] px-2 py-0.5 rounded-full font-medium">
              Today
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
