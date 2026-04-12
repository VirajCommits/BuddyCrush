"use client";

import React from "react";
import { AuthProvider } from "../context/AuthContext";
import ReactQueryProvider from "./ReactQueryProvider";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Pal Crush - Crush Your Goals Together</title>
        <meta name="description" content="Join accountability groups, track habits, and compete on leaderboards with friends." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
