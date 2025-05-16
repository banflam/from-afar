// app/layout.tsx
import { AuthProvider } from "react-oidc-context";
import React from "react";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_XymIyz8DE",
  client_id: "367g3sp8609p8pf8e22p13n3ta",
  redirect_uri: "https://d84l1y8p4kdic.cloudfront.net", // or http://localhost:3000 during dev
  response_type: "code",
  scope: "email openid phone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>
      </body>
    </html>
  );
}
