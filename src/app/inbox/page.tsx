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

  return `${days}d ${hours}h ${mins}m`;
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
  console.log("Inbox recipientId:", recipientId);
  console.log("Auth profile:", auth.user?.profile);
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
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inbox</h1>

      <div className="flex gap-4 mb-6">
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

      <div className="space-y-4">
        {selected.length === 0 && <p className="text-gray-500">No letters</p>}

        {selected.map((letter) => (
          <div key={letter.letter_id} className="border p-4 rounded shadow">
            <div className="text-sm text-gray-500">
              From: {letter.senderId} - Sent:{" "}
              {new Date(letter.createdAt).toLocaleString()}
            </div>

            {tab !== "incoming" && (
              <div className="mt-2 text-gray-800 whitespace-pre-wrap">
                {letter.content}
              </div>
            )}

            {tab === "incoming" && (
              <div className="text-xs text-orange-500 mt-2">
                Available in: {formatTimeDiff(new Date(letter.deliveryTime))}
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
