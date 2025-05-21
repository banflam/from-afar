// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import "./globals.css";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_XymIyz8DE",
  client_id: "367g3sp8609p8pf8e22p13n3ta",
  redirect_uri: "https://d84l1y8p4kdic.cloudfront.net",
  response_type: "code",
  scope: "email openid phone",
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
