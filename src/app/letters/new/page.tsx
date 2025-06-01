"use client";
export const dynamic = "force-dynamic"; // trying to tell NextJS to not statically pre-render this page
import { Suspense } from "react";
import SendLetterForm from "./SendLetterForm";

export default function SendLetterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SendLetterForm />
    </Suspense>
  );
}
