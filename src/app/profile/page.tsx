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

  console.log("A: Entered the Profile Page function");

  const handleSave = async () => {
    console.log("B: handleSave function invoked");
    if (!auth.user?.access_token) {
      console.log("Access token missing");
      setError("Missing auth token");
      return;
    }

    if (!profile) {
      console.log("No profile data?");
      setError("No profile data");
      return;
    }

    if (profile.latitude == null || profile.longitude == null) {
      setError("Location not yet available, please allow location access");
      setSaving(false);
      return;
    }

    setSaving(true);
    setError("");

    const token = auth.user?.access_token;

    if (!token) {
      console.log("TOKEN MISSING");
      setError("Not authenticated");
      setSaving(false);
      return;
    }

    console.log("C: FETCHING THE API/PROFILE (CALL TO IT)");
    console.log("profile to be sent:", profile);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.user.access_token}`,
      },
      body: JSON.stringify(profile),
    });

    console.log("D: FINISHED FETCHING THE PROFILE");
    console.log("res is:", res);
    if (!res.ok) {
      setError("Failed to save profile");
    }

    setSaving(false);
  };

  useEffect(() => {
    const token = auth.user?.access_token;
    if (!token) return;

    const loadProfileWithLocation = async () => {
      try {
        const res = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!("geolocation" in navigator)) {
          setError("Geolocation not supported");
          setLoading(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            setProfile({
              ...data,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
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
        console.error("Failed to load profile", err);
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
        value={profile.gender || ""}
        onChange={(e) => handleChange("gender", e.target.value)}
        className="border px-3 py-2 mb-4 w-full rounded"
      >
        <option value="" disabled>
          Select gender
        </option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <label className="block mb-2 text-sm">Username</label>
      <input
        type="text"
        value={profile.username || ""}
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
        disabled={
          saving || profile?.latitude == null || profile?.longitude == null
        }
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
