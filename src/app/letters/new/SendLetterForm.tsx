"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "react-oidc-context";

export default function SendLetterForm() {
  const searchParams = useSearchParams();
  const toParam = searchParams.get("to") || "";
  const auth = useAuth();

  const [recipientId, setRecipientId] = useState(toParam);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [senderId, setSenderId] = useState("");

  const defaultDelayDays = 3;

  useEffect(() => {
    const fetchProfile = async () => {
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

        setSenderId(username);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    fetchProfile();
  }, [auth.user]);

  const handleSend = async () => {
    if (!recipientId || !content) {
      setError("Recipient and content are required");
      return;
    }

    setSending(true);
    setError("");
    setSuccess(false);

    const deliveryTime = new Date(
      Date.now() + defaultDelayDays * 86400000
    ).toISOString();

    const res = await fetch("/api/letters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId,
        recipientId,
        content,
        deliveryTime,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      setError(`Failed to send letter: ${errorText}`);
    } else {
      setSuccess(true);
      setContent("");
      setRecipientId(toParam);
    }
    setSending(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Send a Letter</h1>
      <label className="block mb-2 text-sm font-medium">Recipient ID</label>
      <input
        type="text"
        value={recipientId}
        disabled
        className="w-full border px-3 py-2 mb-4 rounded"
      />
      <label className="block mb-2 text-sm font-medium">Message</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="w-full border px-3 py-2 rounded mb-4"
      ></textarea>
      <button
        onClick={handleSend}
        disabled={sending}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send Letter"}
      </button>
      {success && (
        <p className="text-green-600 mt-4">Letter sent successfully</p>
      )}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
