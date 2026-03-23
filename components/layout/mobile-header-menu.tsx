"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CircleHelp,
  LayoutGrid,
  Menu,
  Phone,
  ReceiptText,
  Sparkles,
  X,
} from "lucide-react";
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
  const topLinks = links.slice(0, 4);
  const bottomLinks = links.slice(4);

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
        className="inline-flex h-11 w-11 items-center justify-center rounded-[1.35rem] border border-white/70 bg-white/80 text-slate-950 shadow-[0_16px_34px_rgba(15,23,42,0.12)] backdrop-blur-xl"
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
          <div className="absolute inset-x-3 top-[calc(env(safe-area-inset-top)+0.75rem)] overflow-hidden rounded-[1.9rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.94))] p-4 shadow-[0_28px_90px_rgba(15,23,42,0.24)] backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.7rem] font-semibold tracking-[0.22em] uppercase text-primary-strong/75">
                  Navegação
                </p>
                <p className="mt-1 text-lg font-bold tracking-tight text-slate-950">
                  Vitrine Lojas
                </p>
                <p className="text-sm text-muted-strong">
                  Encontre quem faz, sem ruído.
                </p>
              </div>
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-[1.15rem] border border-slate-200 bg-white/90 text-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {topLinks.map((link, index) => {
                const icons = [LayoutGrid, Sparkles, ReceiptText, CircleHelp];
                const Icon = icons[index] ?? LayoutGrid;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-[1.35rem] border border-white/80 bg-white/88 px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)]"
                  >
                    <Icon className="h-4 w-4 text-primary-strong" />
                    <p className="mt-3 text-[0.95rem] font-semibold text-slate-950">
                      {link.label}
                    </p>
                  </Link>
                );
              })}
            </div>

            <div className="mt-3 rounded-[1.45rem] border border-white/80 bg-white/88 p-2 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
              {bottomLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-[1rem] px-3 py-3 text-[0.95rem] font-semibold text-slate-900 ${
                    index > 0 ? "border-t border-slate-100" : ""
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-muted">›</span>
                </Link>
              ))}
            </div>

            <div className="mt-3 rounded-[1.45rem] border border-white/80 bg-[linear-gradient(135deg,rgba(99,102,241,0.10),rgba(255,255,255,0.92))] p-3">
              <div className="flex items-center gap-2 text-primary-strong">
                <Phone className="h-4 w-4" />
                <p className="text-sm font-semibold">Acesso e atalhos</p>
              </div>
              <p className="mt-1 text-[0.82rem] leading-5 text-muted-strong">
                Entre ou crie sua conta para gerenciar anúncios, conversas e agenda.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(99,102,241,0.28)]"
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
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(99,102,241,0.28)]"
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
