// src/app/layout.tsx
"use client";

import React from "react";
import { AuthProvider } from "../context/AuthContext";
import ReactQueryProvider from "./ReactQueryProvider"; // Import the new provider

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider> {/* ✅ Wrap inside ReactQueryProvider */}
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
