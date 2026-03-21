"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ShareLinkButtonProps = {
  url: string;
  title: string;
  text: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function ShareLinkButton({
  url,
  title,
  text,
  variant = "secondary",
  className,
}: ShareLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ url, title, text });
        return;
      } catch {
        // fallback to clipboard below
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={handleShare}
      icon={<Share2 className="h-4 w-4" />}
    >
      {copied ? "Link copiado" : "Compartilhar perfil"}
    </Button>
  );
}
