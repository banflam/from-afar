"use client";

import { useEffect, useState } from "react";

import { Letter } from "@/types/Letter";

export default function InboxPage() {
  const [tab, setTab] = useState<"incoming" | "unread" | "read">("incoming");
  const [letters, setLetters] = useState<{
    incoming: Letter[];
    unread: Letter[];
    read: Letter[];
  }>({ incoming: [], unread: [], read: [] });

  const recipientId = "test-recipient"; //TODO: replace with read user ID in the future

  useEffect(() => {
    fetch(`/api/inbox?recipientId=${recipientId}`)
      .then((res) => res.json())
      .then((data) => setLetters(data));
  }, []);
  
}

function formatTimeDiff(deliveryTime: Date) {
  const diff = deliveryTime.getTime() - Date.now();
  if (diff <= 0) return "Now";

  const mins = Math.floor(diff / 60000) % 60;
  const hours = Math.floor(diff / 3600000) % 24;
  const days = Math.floor(diff / 86400000);

  return `${days}d ${hours}h ${mins}m`;
}
