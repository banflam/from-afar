import { useEffect, useState } from "react";

type Profile = {
  username: string;
  city: string;
  gender: string;
  bio: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, []);
  
  const handleChange = (field: keyof Profile, value: string) => {
    if (!profile) return;
    setProfile({...profile, [field]: value});
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    
    const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(profile),
    });
    
    if (!res.ok) {
        setError("Failed to save profile");
    }
    
    setSaving(false);
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!profile) return <p className="p-4 text-red-500">{error}</p>
  
  

}
