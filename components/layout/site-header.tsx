import Link from "next/link";
import { signOutAction } from "@/app/auth/actions";
import { VlMonogram } from "@/components/brand/vl-monogram";
import { MobileHeaderMenu } from "@/components/layout/mobile-header-menu";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const links = [
  { href: "/", label: "Marketplace" },
  { href: "/recursos", label: "Recursos" },
  { href: "/precos", label: "Preços" },
  { href: "/faq", label: "FAQ" },
  { href: "/ajuda", label: "Ajuda" },
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
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[padding:max(0px)]:pt-[max(env(safe-area-inset-top),0px)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 sm:px-6 sm:py-3 lg:gap-4 lg:px-10">
        <div className="flex min-h-[3.5rem] items-center justify-between gap-3 md:min-h-[3.75rem]">
          <Link
            href="/"
            data-reveal
            data-reveal-delay="40"
            className="flex min-w-0 max-w-[calc(100%-4.25rem)] items-center self-center gap-2 rounded-2xl sm:max-w-none sm:gap-3"
          >
            <VlMonogram className="h-7 w-7 shrink-0 rounded-[0.9rem] sm:h-12 sm:w-12" />
            <div className="min-w-0 overflow-hidden">
              <p className="truncate font-sans text-[0.8rem] leading-none font-bold tracking-[-0.03em] text-slate-950 sm:text-lg sm:leading-[1.15] sm:tracking-tight">
                Vitrine Lojas
              </p>
              <p className="hidden truncate text-[0.74rem] leading-tight text-muted md:block md:text-xs">
                Serviços locais em um só lugar
              </p>
            </div>
          </Link>

          <div className="hidden shrink-0 items-center gap-2 self-center md:flex">
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-primary-strong/10 bg-primary px-3 py-2 text-sm font-semibold !text-white shadow-lg shadow-primary/25 hover:bg-primary-strong hover:!text-white sm:min-h-11 sm:px-4 sm:py-2.5"
                >
                  Meu painel
                </Link>
                <form action={signOutAction}>
                  <button className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-950 hover:border-primary/35 hover:bg-slate-50 hover:text-primary-strong sm:min-h-11 sm:px-4 sm:py-2.5">
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
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-primary-strong/10 bg-primary px-4 py-2 text-sm font-semibold !text-white shadow-lg shadow-primary/25 hover:bg-primary-strong hover:!text-white sm:min-h-11 sm:px-4 sm:py-2.5"
                >
                  <span className="sm:hidden">Cadastro</span>
                  <span className="hidden sm:inline">Criar conta</span>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <MobileHeaderMenu
              links={links}
              isAuthenticated={isAuthenticated}
              dashboardHref={dashboardHref}
            />
          </div>
        </div>

        <nav
          data-reveal
          data-reveal-delay="100"
          aria-label="Navegação principal"
          className="touch-scroll-x hidden items-center gap-2 overflow-x-auto rounded-[1.75rem] border border-slate-200 bg-white/92 p-2 elevated-card md:flex md:justify-center"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-semibold whitespace-nowrap text-slate-800 hover:bg-primary-soft hover:text-primary-strong sm:px-4 sm:py-2.5"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
