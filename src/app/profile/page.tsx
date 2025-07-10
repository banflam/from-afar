"use client";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

type Profile = {
  email: string;
  username: string;
  city: string;
  gender: string;
  bio: string;
  dateOfBirth: string;
  latitude: number | null;
  longitude: number | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const auth = useAuth();

  const handleSave = async () => {
    if (!auth.user?.access_token || !profile) {
      setError("Missing auth token or profile");
      return;
    }

    if (profile.latitude == null || profile.longitude == null) {
      setError("Location not available. Please allow location access.");
      return;
    }

    setSaving(true);
    setError("");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.user.access_token}`,
      },
      body: JSON.stringify(profile),
    });

    if (!res.ok) setError("Failed to save profile");
    setSaving(false);
  };

  useEffect(() => {
    const token = auth.user?.access_token;
    if (!token) return;

    const loadProfileWithLocation = async () => {
      try {
        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!navigator.geolocation) {
          setError("Geolocation not supported");
          setLoading(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setProfile({
              ...data,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
            setLoading(false);
          },
          (err) => {
            console.warn("Geolocation error:", err);
            setError("Geolocation permission denied or failed.");
            setLoading(false);
          }
        );
      } catch (err) {
        console.error("Load profile failed:", err);
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    loadProfileWithLocation();
  }, [auth.user]);

  const handleChange = (field: keyof Profile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!profile)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Profile</h1>

      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            value={profile.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            value={profile.gender || ""}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={profile.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {profile.latitude && profile.longitude && (
          <p className="text-sm text-gray-500">
            Location: {profile.latitude.toFixed(3)},{" "}
            {profile.longitude.toFixed(3)}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            rows={4}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={
            saving || profile.latitude == null || profile.longitude == null
          }
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {error && (
          <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
