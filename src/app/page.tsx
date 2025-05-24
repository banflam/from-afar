"use client";
import { useAuth } from "react-oidc-context";
import Link from "next/link";
import { useEffect } from "react";

export default function HomePage() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.access_token) {
      fetch("/api/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.user.access_token}`,
        },
      }).catch((err) => {
        console.error("Error calling /api/profile:", err);
      });
    }
  }, [auth.isAuthenticated, auth.user?.access_token]);

  if (auth.isLoading) return <p>Loading...</p>;
  if (auth.error) return <p>Error: {auth.error.message}</p>;

  if (auth.isAuthenticated) {
    return (
      <div>
        <Link href="/">
          <h1>From Afar: friends at heart</h1>
        </Link>
        <h2>Welcome {auth.user?.profile.email}</h2>
        <Link href="/inbox">Inbox</Link>
        <br></br>
        <Link href="/users">Users -- discover new people!</Link>
        <br></br>
        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  return <button onClick={() => auth.signinRedirect()}>Sign in</button>;
}
