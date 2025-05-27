"use client"; // this makes the component a Client Component

import { AuthProvider } from "react-oidc-context";
import React from "react";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_kevkQoqOa",
  client_id: "6o2uld1loe0t9f07smc7sb98n1",
  redirect_uri: "https://d84l1y8p4kdic.cloudfront.net",
  response_type: "code",
  scope: "phone openid email",
};

export default function AuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
