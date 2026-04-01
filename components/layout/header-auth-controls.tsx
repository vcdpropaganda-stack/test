"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOutAction } from "@/app/auth/actions";
import { MobileHeaderMenu } from "@/components/layout/mobile-header-menu";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type HeaderAuthControlsProps = {
  links: Array<{ href: string; label: string }>;
  initialAuth?: AuthSnapshot;
};

type AuthSnapshot = {
  isAuthenticated: boolean;
  dashboardHref: string;
};

function getDashboardHref(role: string | null | undefined) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "provider") return "/dashboard/provider/pedidos";
  return "/dashboard/client/pedidos";
}

export function HeaderAuthControls({ links, initialAuth }: HeaderAuthControlsProps) {
  const [auth, setAuth] = useState<AuthSnapshot>(
    initialAuth ?? {
      isAuthenticated: false,
      dashboardHref: "/dashboard/client",
    }
  );

  useEffect(() => {
    const supabase = hasSupabaseEnv() ? createSupabaseBrowserClient() : null;

    if (!supabase) {
      return;
    }
    const sb = supabase;

    let alive = true;

    async function hydrateAuth() {
      const sessionResult = await sb.auth.getSession();
      const user = sessionResult.data.session?.user ?? null;

      if (!alive) {
        return;
      }

      setAuth({
        isAuthenticated: Boolean(user),
        dashboardHref: getDashboardHref(
          user ? String(user.user_metadata.role ?? "client") : "client"
        ),
      });
    }

    void hydrateAuth();

    const { data } = sb.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setAuth({
        isAuthenticated: Boolean(user),
        dashboardHref: getDashboardHref(
          user ? String(user.user_metadata.role ?? "client") : "client"
        ),
      });
    });

    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="hidden shrink-0 items-center gap-2 self-center md:flex">
        {auth.isAuthenticated ? (
          <>
            <Link
              href={auth.dashboardHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] transition hover:bg-slate-900"
            >
              Meu painel
            </Link>
            <form action={signOutAction}>
              <button className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950">
                Sair
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(99,102,241,0.24)] transition hover:-translate-y-0.5 hover:bg-primary-strong"
            >
              <span className="sm:hidden">Cadastro</span>
              <span className="hidden sm:inline">Criar conta</span>
            </Link>
          </>
        )}
      </div>

      <div className="justify-self-end md:hidden">
        <MobileHeaderMenu
          links={links}
          isAuthenticated={auth.isAuthenticated}
          dashboardHref={auth.dashboardHref}
        />
      </div>
    </>
  );
}
