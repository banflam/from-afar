"use client";
import { useAuth } from "react-oidc-context";
import Link from "next/link";

export default function HomePage() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "6o2uld1loe0t9f07smc7sb98n1";
    const logoutUri = process.env.NEXT_PUBLIC_LOGOUT_URI;
    if (!logoutUri) {
      throw "logoutUri not set!!";
    }
    const cognitoDomain =
      "https://us-east-2kevkqoqoa.auth.us-east-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  if (auth.isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (auth.error)
    return (
      <p className="text-center text-red-600 mt-10">
        Error: {auth.error.message}
      </p>
    );

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {auth.isAuthenticated ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Welcome, {auth.user?.profile.email}
            </h2>
            <nav className="space-y-2 mb-6">
              <Link
                href="/profile"
                className="block text-blue-600 hover:underline"
              >
                Profile
              </Link>
              <Link
                href="/users"
                className="block text-blue-600 hover:underline"
              >
                Users
              </Link>
              <Link
                href="/inbox"
                className="block text-blue-600 hover:underline"
              >
                Inbox
              </Link>
              <Link
                href="/sent"
                className="block text-blue-600 hover:underline"
              >
                Sent letters
              </Link>
            </nav>
            <button
              onClick={() => auth.removeUser()}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Welcome</h2>
            <button
              onClick={() => auth.signinRedirect()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-4"
            >
              Sign in
            </button>
            <button
              onClick={() => signOutRedirect()}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded"
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </main>
  );
}
