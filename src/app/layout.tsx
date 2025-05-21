import "./globals.css";
import React from "react";
import AuthProviderWrapper from "@/components/AuthProvidedWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}
