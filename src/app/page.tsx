// app/page.tsx
"use client";
import { useAuth } from "react-oidc-context";

export default function HomePage() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "367g3sp8609p8pf8e22p13n3ta";
    const logoutUri = "http://localhost:3000"; // change for production
    const cognitoDomain = "https://us-east-2xymiyz8de.auth.us-east-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) return <p>Loading...</p>;
  if (auth.error) return <p>Error: {auth.error.message}</p>;

  if (auth.isAuthenticated) {
    return (
      <div>
        <h1>Welcome {auth.user?.profile.email}</h1>
        <button onClick={() => signOutRedirect()}>Sign out</button>
      </div>
    );
  }

  return <button onClick={() => auth.signinRedirect()}>Sign in</button>;
}
