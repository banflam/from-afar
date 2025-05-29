"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"


export default function PublicProfilePage() {
    const {username } = useParams();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");

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
        </div>
    )
}