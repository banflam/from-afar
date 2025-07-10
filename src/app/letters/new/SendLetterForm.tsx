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
  const [showConfirm, setShowConfirm] = useState(false);

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

  const deliveryDate = new Date(Date.now() + defaultDelayDays * 86400000);

  const formatDeliveryTime = () => {
    const now = new Date();
    const diffMs = deliveryDate.getTime() - now.getTime();
    const mins = Math.floor(diffMs / (1000 * 60)) % 60;
    const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const parts = [];
    if (days) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
    if (hours) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    if (mins) parts.push(`${mins} minute${mins !== 1 ? "s" : ""}`);

    return parts.join(", ");
  };

  const confirmAndSend = async () => {
    setSending(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/letters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId,
        recipientId,
        content,
        deliveryTime: deliveryDate.toISOString(),
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
    setShowConfirm(false);
  };

  const handleSendClick = () => {
    if (!recipientId || !content) {
      setError("Recipient and content are required");
      return;
    }
    setError("");
    setShowConfirm(true);
  };

  return (
    <div className="p-6 max-w-xl mx-auto relative">
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
        onClick={handleSendClick}
        disabled={sending}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send Letter"}
      </button>

      {success && (
        <p className="text-green-600 mt-4">Letter sent successfully</p>
      )}
      {error && <p className="text-red-600 mt-4">{error}</p>}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-2">Confirm Send</h2>
            <p className="mb-4">
              This letter will be delivered in{" "}
              <strong>{formatDeliveryTime()}</strong>. Are you sure you want to
              send it?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmAndSend}
                disabled={sending}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {sending ? "Sending..." : "Yes, Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
