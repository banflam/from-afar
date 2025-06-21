"use client";

import { useEffect, useState } from "react";
import { Letter } from "@/types/Letter";
import { useAuth } from "react-oidc-context";

function formatTimeDiff(deliveryTime: Date) {
  const diff = deliveryTime.getTime() - Date.now();
  if (diff <= 0) return "Now";

  const mins = Math.floor(diff / 60000) % 60;
  const hours = Math.floor(diff / 3600000) % 24;
  const days = Math.floor(diff / 86400000);

  return `${days} days ${hours} hours ${mins} minutes`;
}

export default function InboxPage() {
  const [tab, setTab] = useState<"incoming" | "unread" | "read">("incoming");
  const auth = useAuth();

  const [recipientId, setRecipientId] = useState("");
  const [letters, setLetters] = useState<{
    incoming: Letter[];
    unread: Letter[];
    read: Letter[];
  }>({ incoming: [], unread: [], read: [] });
  useEffect(() => {
    const fetchProfileAndInbox = async () => {
      if (!auth.user?.access_token) return;

      try {
        const res = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${auth.user.access_token}`,
          },
        });

        const data = await res.json();
        const username = data.username;

        if (!username) {
          console.error("Username missing from profile response");
          return;
        }

        setRecipientId(username);

        const inboxRes = await fetch(`/api/inbox?recipientId=${username}`);
        const inboxData = await inboxRes.json();
        setLetters(inboxData);
      } catch (err) {
        console.error("Failed to load profile/inbox", err);
      }
    };

    fetchProfileAndInbox();
  }, [auth.user]);

  if (!auth.user) {
    return <p className="p-4">Loading inbox...</p>;
  }
  const markAsRead = async (id: string) => {
    await fetch(`/api/letters/${id}/read`, { method: "PATCH" });

    const res = await fetch(`/api/inbox?recipientId=${recipientId}`);
    const data = await res.json();
    setLetters(data);
  };

  const selected = letters[tab];

  return (
    <div className="min-h-screen bg-paper px-4 py-8">
      <h1 className="max-w-3xl mx-auto">Inbox</h1>

      <div className="flex gap-3 mb-6">
        {(["incoming", "unread", "read"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded ${
              tab === t ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)} ({letters[t].length})
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {selected.length === 0 && (
          <p className="text-gray-500 font-serif">No letters</p>
        )}

        {selected.map((letter) => (
          <div
            key={letter.letter_id}
            className="bg-white border border-gray-200 p-4 rounded-3xl shadow-sm p-5 transition hover:shadow-md"
          >
            <div className="font-medium text-postal-red">
              From: {letter.senderId} - Sent:{" "}
              {new Date(letter.createdAt).toLocaleString()}
            </div>

            {tab !== "incoming" && (
              <div className="mt-4 text-orange-600 font-medium italic">
                {letter.content}
              </div>
            )}

            {tab === "incoming" && (
              <div className="text-xs text-orange-500 mt-2">
                Arriving in: {formatTimeDiff(new Date(letter.deliveryTime))}
              </div>
            )}

            {tab === "unread" && (
              <button
                onClick={() => markAsRead(letter.letter_id)}
                className="mt-2 bg-green-500 text-white px-3 py-1 text-sm rounded"
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
