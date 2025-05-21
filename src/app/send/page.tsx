"use client";
import { useState } from "react";

export default function SendLetterPage() {
  const [recipientId, setRecipientId] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const senderId = "test-sender"; //TODO: replace with actual logged-in user sender-id
  const defaultDelayDays = 3;

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
      setError("Failed to send letter");
    } else {
      setSuccess(true);
      setContent("");
      setRecipientId("");
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
        onChange={(e) => setRecipientId(e.target.value)}
        className="w-full border px-3 py-2 mb-4 rounded"
      />
      <label className="block mb-2 text-sm font-medium">Message</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="w-full border px-3 py-2 rounded mb-4"
      />
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
