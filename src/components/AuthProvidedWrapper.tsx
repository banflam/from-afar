"use client"; // this makes the component a Client Component

import { AuthProvider } from "react-oidc-context";
import React from "react";
import { cognitoAuthConfig } from "@/lib/auth/config";

export default function AuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
