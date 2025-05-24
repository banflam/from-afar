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
      <Link href="/">
        <h1>From Afar: friends at heart</h1>
      </Link>
      <body>
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}
