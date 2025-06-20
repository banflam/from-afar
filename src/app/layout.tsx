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
      <body>
        <h1>
          <Link href="/">From Afar: Friends at heart</Link>
        </h1>
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}
