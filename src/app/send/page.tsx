import { useState } from "react";

export default function SendLetterPage() {
  const [recipientId, setRecipientId] = useState("");
  const [content, setContent] = usetState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const senderId = "test-sender"; //TODO: replace with actual logged-in user sender-id
  const defaultDelayDays = 3;
}
