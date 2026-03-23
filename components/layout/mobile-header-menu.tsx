"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
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
            className="absolute inset-0 bg-slate-950/36 backdrop-blur-md"
          />
          <div className="absolute inset-x-0 top-0 overflow-hidden rounded-b-[2rem] border-b border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,247,255,0.96))] px-4 pb-6 pt-[calc(env(safe-area-inset-top)+0.85rem)] shadow-[0_28px_90px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
            <div className="mx-auto max-w-md">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[0.68rem] font-semibold tracking-[0.24em] uppercase text-primary-strong/70">
                    Menu
                  </p>
                  <p className="mt-1 text-[1.1rem] font-bold tracking-[-0.03em] text-slate-950">
                    Navegue pela Vitrine
                  </p>
                  <p className="mt-1 max-w-[16rem] text-sm leading-6 text-muted-strong">
                    Encontre serviços, ajuda e atalhos sem perder o contexto.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Fechar menu"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[1.15rem] border border-white/70 bg-white/90 text-slate-950 shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2.5">
                {topLinks.map((link, index) => {
                  const icons = [LayoutGrid, Sparkles, ReceiptText, CircleHelp];
                  const Icon = icons[index] ?? LayoutGrid;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-[1.35rem] border border-white/80 bg-white/92 px-4 py-3.5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:border-primary/20 hover:bg-white"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Icon className="h-4 w-4 text-primary-strong" />
                        <ArrowRight className="h-4 w-4 text-slate-300" />
                      </div>
                      <p className="mt-3 text-[0.95rem] font-semibold text-slate-950">
                        {link.label}
                      </p>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {bottomLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-[1.35rem] border border-white/80 bg-white/88 px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:border-primary/20 hover:bg-white ${
                      index === bottomLinks.length - 1 ? "col-span-2" : ""
                    }`}
                  >
                    <p className="text-[0.9rem] font-semibold text-slate-900">
                      {link.label}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="mt-4 rounded-[1.5rem] border border-white/80 bg-[linear-gradient(135deg,rgba(99,102,241,0.12),rgba(255,255,255,0.92))] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                <div className="flex items-center gap-2 text-primary-strong">
                  <Phone className="h-4 w-4" />
                  <p className="text-sm font-semibold">Acesso rápido</p>
                </div>
                <p className="mt-2 text-[0.84rem] leading-6 text-muted-strong">
                  Entre para continuar sua reserva, falar com prestadores e acompanhar seus pedidos.
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
        </div>
      ) : null}
    </>
  );
}
