import Link from "next/link";
import { signOutAction } from "@/app/auth/actions";
import { VlMonogram } from "@/components/brand/vl-monogram";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const links = [
  { href: "/", label: "Marketplace" },
  { href: "/recursos", label: "Recursos" },
  { href: "/precos", label: "Precos" },
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3 rounded-2xl">
          <VlMonogram className="h-12 w-12 shrink-0" />
          <div>
            <p className="font-sans text-lg font-bold tracking-tight text-slate-950">
              Vitrine Lojas
            </p>
            <p className="text-xs text-muted">Marketplace premium de lojas e servicos</p>
          </div>
        </Link>

        <nav
          aria-label="Navegacao principal"
          className="hidden items-center gap-2 rounded-full border border-border bg-white/85 px-3 py-2 md:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-primary-soft hover:text-primary-strong"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                href={dashboardHref}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary-strong"
              >
                Meu painel
              </Link>
              <form action={signOutAction}>
                <button className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:border-primary/30 hover:text-primary-strong">
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:border-primary/30 hover:text-primary-strong"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary-strong"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
