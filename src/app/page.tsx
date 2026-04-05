"use client";

import React from "react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] overflow-hidden relative">
      {/* Subtle background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-[var(--primary)]/8 rounded-full blur-3xl animate-float" />
        <div className="absolute top-[40%] right-[-10%] w-96 h-96 bg-[var(--accent)]/6 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-[-5%] left-[30%] w-80 h-80 bg-[var(--accent-warm)]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-8 py-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Pal Crush</h1>
        </div>
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-full text-sm font-semibold text-[var(--text-primary)] bg-[var(--surface)] border border-[var(--border)] hover:shadow-md transition-all duration-300 no-underline"
        >
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6 py-20">
        <div className="animate-slide-up max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-secondary)] mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            100% Free &middot; Join 500+ goal crushers
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-[var(--text-primary)]">
            Crush Your Goals{" "}
            <span className="gradient-text">Together</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Create or join <span className="text-[var(--primary)] font-semibold">accountability groups</span>,
            track daily habits, compete on leaderboards, and chat with friends who share your ambitions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="btn-primary text-lg px-10 py-4 rounded-full flex items-center gap-2 no-underline"
            >
              Get Started
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/discover"
              className="px-10 py-4 rounded-full text-lg font-semibold text-[var(--text-primary)] border border-[var(--border)] bg-[var(--surface)] hover:shadow-md transition-all duration-300 no-underline"
            >
              Explore Groups
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-4xl w-full">
          <FeatureCard
            icon="👥"
            title="Group Up"
            description="Find people who share your goals and hold each other accountable."
            delay="0.1s"
          />
          <FeatureCard
            icon="✅"
            title="Track Habits"
            description="Mark daily completions and watch your streak grow with visual progress."
            delay="0.2s"
          />
          <FeatureCard
            icon="⚡"
            title="Compete & Chat"
            description="Climb the leaderboard and motivate each other through real-time group chat."
            delay="0.3s"
          />
        </div>
      </main>

      <footer className="relative z-10 text-center py-8 text-[var(--text-muted)] text-sm">
        Built with dedication &middot; Pal Crush &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: string;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div
      className="card p-6 text-center animate-slide-up opacity-0 hover:scale-[1.02] transition-transform duration-300 cursor-default"
      style={{ animationDelay: delay, animationFillMode: "forwards" }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
    </div>
  );
}
