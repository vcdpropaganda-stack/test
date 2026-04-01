import Link from "next/link";
import { VlMonogram } from "@/components/brand/vl-monogram";
import { HeaderAuthControls } from "@/components/layout/header-auth-controls";
import { getResolvedUserRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const links = [
  { href: "/pedidos", label: "Pedidos" },
  { href: "/servicos", label: "Catálogo" },
  { href: "/recursos", label: "Recursos" },
  { href: "/precos", label: "Preços" },
  { href: "/faq", label: "FAQ" },
  { href: "/ajuda", label: "Ajuda" },
  { href: "/contato", label: "Contato" },
];

function getDashboardHref(role: string | null | undefined) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "provider") return "/dashboard/provider/pedidos";
  return "/dashboard/client/pedidos";
}

export async function SiteHeader() {
  let initialAuth = {
    isAuthenticated: false,
    dashboardHref: "/dashboard/client",
  };

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const role = await getResolvedUserRole(supabase, user);

    initialAuth = {
      isAuthenticated: Boolean(user),
      dashboardHref: getDashboardHref(role),
    };
  } catch {
    initialAuth = {
      isAuthenticated: false,
      dashboardHref: "/dashboard/client",
    };
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/75 bg-[rgba(248,250,252,0.86)] backdrop-blur-xl supports-[padding:max(0px)]:pt-[max(env(safe-area-inset-top),0px)]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:min-h-[5.5rem] lg:gap-6 lg:px-10">
        <div className="min-w-0 shrink-0">
          <Link
            href="/"
            data-reveal
            data-reveal-delay="40"
            className="flex min-w-0 items-center gap-3 rounded-2xl"
          >
            <VlMonogram className="h-10 w-10 shrink-0 rounded-[1rem] sm:h-11 sm:w-11" />
            <div className="min-w-0 overflow-hidden">
              <p className="truncate font-sans text-base leading-none font-bold tracking-[-0.04em] text-slate-950 sm:text-[1.65rem] sm:leading-none">
                VLservice
              </p>
              <p className="hidden truncate text-xs leading-tight text-slate-500 lg:block">
                Pedidos, propostas e contratação local
              </p>
            </div>
          </Link>
        </div>

        <nav
          data-reveal
          data-reveal-delay="100"
          aria-label="Navegação principal"
          className="hidden min-w-0 flex-1 items-center justify-center lg:flex"
        >
          <div className="flex items-center gap-1 rounded-full border border-slate-200/85 bg-white/88 p-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">
            {links.map((link) => {
              const isPrimary = link.href === "/pedidos";

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
                    isPrimary
                      ? "bg-slate-950 text-white shadow-[0_14px_28px_rgba(15,23,42,0.16)] hover:bg-slate-900"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="ml-auto shrink-0">
          <HeaderAuthControls links={links} initialAuth={initialAuth} />
        </div>
      </div>
    </header>
  );
}
