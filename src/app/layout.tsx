// src/app/layout.tsx
"use client";

import React from "react";
import { AuthProvider } from "../context/AuthContext";
import ReactQueryProvider from "./ReactQueryProvider";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>BuddyCrush - Crush Your Goals Together</title>
        <meta name="description" content="Join accountability groups, track habits, and compete on leaderboards with friends." />
      </head>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <ReactQueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
