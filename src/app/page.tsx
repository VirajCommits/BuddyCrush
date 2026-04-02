"use client";

import React from "react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] overflow-hidden relative">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-[40%] right-[-10%] w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-[-5%] left-[30%] w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-8 py-5">
        <h1 className="text-2xl font-bold gradient-text">BuddyCrush</h1>
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-white/10 border border-white/10 hover:bg-white/20 hover:border-white/20 transition-all duration-300"
        >
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6 py-20">
        <div className="animate-slide-up max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-[var(--text-secondary)] mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            100% Free &middot; Join 500+ goal crushers
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Crush Your Goals{" "}
            <span className="gradient-text">Together</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Create or join <span className="text-[var(--primary-light)] font-semibold">accountability groups</span>,
            track daily habits, compete on leaderboards, and chat with friends who share your ambitions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="btn-primary text-lg px-10 py-4 rounded-full flex items-center gap-2 no-underline animate-pulse-glow"
            >
              Get Started
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/discover"
              className="px-10 py-4 rounded-full text-lg font-semibold text-white border border-white/20 hover:bg-white/10 transition-all duration-300 no-underline"
            >
              Explore Groups
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-4xl w-full">
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            title="Group Up"
            description="Find people who share your goals and hold each other accountable."
            delay="0.1s"
          />
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
            title="Track Habits"
            description="Mark daily completions and watch your streak grow with visual progress."
            delay="0.2s"
          />
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            title="Compete & Chat"
            description="Climb the leaderboard and motivate each other through real-time group chat."
            delay="0.3s"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-[var(--text-muted)] text-sm">
        Built with dedication &middot; BuddyCrush &copy; {new Date().getFullYear()}
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
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div
      className="glass-card p-6 text-center animate-slide-up opacity-0 hover:scale-105 transition-transform duration-300 cursor-default"
      style={{ animationDelay: delay, animationFillMode: "forwards" }}
    >
      <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/20 flex items-center justify-center mx-auto mb-4 text-[var(--primary-light)]">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
    </div>
  );
}
