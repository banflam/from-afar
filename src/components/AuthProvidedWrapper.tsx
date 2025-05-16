"use client"; // this makes the component a Client Component

import { AuthProvider } from "react-oidc-context";
import React from "react";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_XymIyz8DE",
  client_id: "367g3sp8609p8pf8e22p13n3ta",
  redirect_uri: "http://localhost:3000", // or your production domain
  response_type: "code",
  scope: "openid email phone",
};

export default function AuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
