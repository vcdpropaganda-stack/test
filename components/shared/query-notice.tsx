"use client";

import { useSearchParams } from "next/navigation";
import { Notice } from "@/components/ui/notice";

export function QueryNotice() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  if (!message) {
    return null;
  }

  return <Notice>{message}</Notice>;
}
