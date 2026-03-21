"use client";

import { useEffect } from "react";

function buildFriendlyMessage(errorCode: string | null) {
  if (errorCode === "otp_expired") {
    return "O link de confirmação expirou. Use o e-mail mais recente ou faça um novo cadastro para receber outro link.";
  }

  return "Não foi possível validar o link de autenticação. Tente novamente.";
}

export function AuthErrorHandler() {
  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const hash = currentUrl.hash.startsWith("#")
      ? new URLSearchParams(currentUrl.hash.slice(1))
      : new URLSearchParams();

    const search = currentUrl.searchParams;
    const error = search.get("error") ?? hash.get("error");
    const errorCode = search.get("error_code") ?? hash.get("error_code");

    if (error !== "access_denied" && !errorCode) {
      return;
    }

    const message = buildFriendlyMessage(errorCode);
    const loginUrl = new URL("/login", window.location.origin);
    loginUrl.searchParams.set("message", message);
    window.location.replace(loginUrl.toString());
  }, []);

  return null;
}
