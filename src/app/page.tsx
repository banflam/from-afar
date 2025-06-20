"use client";
import { useAuth } from "react-oidc-context";
import Link from "next/link";

export default function HomePage() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "6o2uld1loe0t9f07smc7sb98n1";
    const logoutUri = "https://from-afar.vercel.app/";
    const cognitoDomain =
      "https://us-east-2kevkqoqoa.auth.us-east-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  if (auth.isLoading) return <p>Loading...</p>;
  if (auth.error) return <p>Error: {auth.error.message}</p>;

  if (auth.isAuthenticated) {
    return (
      <div>
        <h2>Welcome {auth.user?.profile.email}</h2>
        <Link href="/profile">Profile</Link>
        <br></br>
        <Link href="/users">Users</Link>
        <br></br>
        <Link href="/inbox">Inbox</Link>
        <br></br>
        <Link href="/sent">Sent letters</Link>
        <br></br>
        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <br></br>
      <button onClick={() => signOutRedirect()}>Sign out</button>
    </div>
  );
}
