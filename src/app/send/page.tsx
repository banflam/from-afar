import { useState } from "react";

export default function SendLetterPage() {
  const [recipientId, setRecipientId] = useState("");
  const [content, setContent] = usetState("");
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
  };

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
}
