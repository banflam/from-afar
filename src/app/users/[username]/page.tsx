"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type PublicProfile = {
  username: string;
  age: number;
  bio: string;
  gender: string;
  city: string;
  state?: string;
  country?: string;
};

export default function PublicProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/users/${username}`)
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(() => setError("Failed to load this persons profile"));
  }, [username]);

  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (!profile) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{profile.username}</h1>
      <p className="text-sm text-gray-700 mb-1">
        Age: {profile.age} ---- {profile.gender}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        Location: {profile.city}, {profile.state}, {profile.country}
      </p>
      <p className="mt-4">{profile.bio}</p>
      <button
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => {
          router.push(`/letters/new?to=${profile.username}`);
        }}
      >
        Send Letter
      </button>
    </div>
  );
}
