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
      <head></head>
      <body>
        <h1>
          <Link href="/">From Afar: friends at heart</Link>
        </h1>
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}
