"use client";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

type Profile = {
  email: string;
  username: string;
  city: string;
  gender: string;
  bio: string;
  dateOfBirth: string; //ISO string
  latitude: number | null;
  longitude: number | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const auth = useAuth();

  useEffect(() => {
    const token = auth.user?.access_token;

    if (!token) return;

    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile");
        setLoading(false);
      });

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setProfile((prev) =>
            prev
              ? {
                  ...prev,
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                }
              : null
          );
        },
        (err) => {
          console.warn("Geolocation error:", err);
        }
      );
    }
  }, [auth.user]);

  const handleChange = (field: keyof Profile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    const token = auth.user?.access_token;

    if (!token) {
      setError("Not authenticated");
      setSaving(false);
      return;
    }

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    if (!res.ok) {
      setError("Failed to save profile");
    }

    setSaving(false);
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!profile) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <label className="block mb-2 text-sm">City</label>
      <input
        type="text"
        value={profile.city}
        onChange={(e) => handleChange("city", e.target.value)}
        className="border px-3 py-2 mb-4 w-full rounded"
      ></input>

      <label className="block mb-2 text-sm">Gender</label>
      <select
        value={profile.gender}
        onChange={(e) => handleChange("gender", e.target.value)}
        className="border px-3 py-2 mb-4 w-full rounded"
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <label className="block mb-2 text-sm">Username</label>
      <input
        type="text"
        value={profile.username}
        onChange={(e) => handleChange("username", e.target.value)}
        className="border px-3 py-2 mb-4 w-full rounded"
      />

      <label className="block mb-2 text-sm">Date of Birth</label>
      <input
        type="date"
        value={profile.dateOfBirth}
        onChange={(e) => handleChange("dateOfBirth", e.target.value)}
        className="border px-3 py-2 mb-4 w-full rounded"
      />

      {profile.latitude && profile.longitude && (
        <p className="text-sm text-gray-500 mb-4">
          Location detected: {profile.latitude.toFixed(3)},{" "}
          {profile.longitude.toFixed(3)}
        </p>
      )}

      <label className="block mb-2 text-sm">Bio</label>
      <textarea
        value={profile.bio}
        onChange={(e) => handleChange("bio", e.target.value)}
        rows={4}
        className="border px-3 py-2 mb-4 w-full rounded"
      ></textarea>
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
