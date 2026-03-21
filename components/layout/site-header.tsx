import Link from "next/link";
import { signOutAction } from "@/app/auth/actions";
import { VlMonogram } from "@/components/brand/vl-monogram";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const links = [
  { href: "/", label: "Marketplace" },
  { href: "/recursos", label: "Recursos" },
  { href: "/precos", label: "Preços" },
  { href: "/faq", label: "FAQ" },
  { href: "/institucional", label: "Institucional" },
  { href: "/contato", label: "Contato" },
];

export async function SiteHeader() {
  let user = null;

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createSupabaseServerClient();
      const authResult = await supabase.auth.getUser();
      user = authResult.data.user;
    } catch {
      user = null;
    }
  }

  const isAuthenticated = Boolean(user);
  const role = String(user?.user_metadata.role ?? "client");
  const dashboardHref =
    role === "provider" ? "/dashboard/provider" : "/dashboard/client";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:gap-4 lg:px-10">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 rounded-2xl sm:gap-3">
            <VlMonogram className="h-10 w-10 shrink-0 sm:h-12 sm:w-12" />
            <div className="min-w-0">
              <p className="truncate font-sans text-[1.7rem] leading-none font-bold tracking-tight text-slate-950 sm:text-lg">
                Vitrine Lojas
              </p>
              <p className="hidden truncate text-[11px] text-muted sm:block sm:text-xs">
                Marketplace de lojas e serviços
              </p>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-slate-950 px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 hover:bg-primary-strong sm:min-h-11 sm:px-4 sm:py-2.5"
                >
                  Meu painel
                </Link>
                <form action={signOutAction}>
                  <button className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-950 hover:border-primary/35 hover:bg-slate-50 hover:text-primary-strong sm:min-h-11 sm:px-4 sm:py-2.5">
                    Sair
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:border-primary/35 hover:bg-slate-50 hover:text-primary-strong sm:min-h-11 sm:px-4 sm:py-2.5"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 hover:bg-primary-strong sm:min-h-11 sm:px-4 sm:py-2.5"
                >
                  <span className="sm:hidden">Cadastro</span>
                  <span className="hidden sm:inline">Criar conta</span>
                </Link>
              </>
            )}
          </div>
        </div>

        <nav
          aria-label="Navegação principal"
          className="touch-scroll-x flex items-center gap-2 overflow-x-auto rounded-[1.75rem] border border-slate-200 bg-white/92 p-2 elevated-card sm:justify-center"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-slate-800 hover:bg-primary-soft hover:text-primary-strong"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
