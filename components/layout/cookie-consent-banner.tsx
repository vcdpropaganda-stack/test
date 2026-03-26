"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "vl_cookie_consent_v1";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const frame = window.requestAnimationFrame(() => {
        setVisible(true);
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[65] border-t border-white/12 bg-slate-950/96 px-4 py-3 text-white shadow-[0_-12px_45px_rgba(2,6,23,0.44)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <p className="text-xs leading-6 text-slate-200 sm:text-sm">
          A VL Serviços usa cookies para melhorar sua experiência e proteger a
          navegação. Saiba mais em{" "}
          <Link
            href="/politica-de-cookies"
            className="font-semibold text-white underline underline-offset-2"
          >
            Política de Cookies
          </Link>
          ,{" "}
          <Link
            href="/privacidade"
            className="font-semibold text-white underline underline-offset-2"
          >
            Política de Privacidade
          </Link>{" "}
          e{" "}
          <Link
            href="/termos"
            className="font-semibold text-white underline underline-offset-2"
          >
            Termos de Uso
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
            setVisible(false);
          }}
          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full bg-[#ff365f] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(255,54,95,0.36)] transition hover:brightness-105"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
