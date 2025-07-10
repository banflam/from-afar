import "./globals.css";
import React from "react";
import AuthProviderWrapper from "@/components/AuthProvidedWrapper";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-md px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              {/* Replace below span with an actual logo image if you have one */}
              <span className="text-blue-600 text-2xl font-bold tracking-tight">
                From Afar
              </span>
              <span className="text-sm text-gray-600 italic">Friends at heart</span>
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-4xl mx-auto mt-8 px-6">
          <AuthProviderWrapper>{children}</AuthProviderWrapper>
        </main>
      </body>
    </html>
  );
}
