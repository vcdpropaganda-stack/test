"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { signOutAction } from "@/app/auth/actions";

type MobileHeaderMenuProps = {
  links: Array<{ href: string; label: string }>;
  isAuthenticated: boolean;
  dashboardHref: string;
};

export function MobileHeaderMenu({
  links,
  isAuthenticated,
  dashboardHref,
}: MobileHeaderMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const original = document.body.style.overflow;

    if (open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] md:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
          />
          <div className="absolute inset-x-3 top-[calc(env(safe-area-inset-top)+0.75rem)] rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.2)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold tracking-[0.16em] uppercase text-muted">
                Menu
              </p>
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-4 grid grid-cols-2 gap-2" aria-label="Navegação principal mobile">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white"
                  >
                    Meu painel
                  </Link>
                  <form action={signOutAction}>
                    <button className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950">
                      Sair
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastro"
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white"
                  >
                    Cadastro
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
