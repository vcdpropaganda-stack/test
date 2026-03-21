import Link from "next/link";
import { VlMonogram } from "@/components/brand/vl-monogram";

const footerGroups = [
  {
    title: "Produto",
    links: [
      { href: "/recursos", label: "Recursos" },
      { href: "/precos", label: "Preços" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/institucional", label: "Institucional" },
      { href: "/afiliados", label: "Afiliados" },
      { href: "/contato", label: "Contato" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacidade", label: "Privacidade" },
      { href: "/lgpd", label: "LGPD" },
      { href: "/termos", label: "Termos" },
      { href: "/responsabilidades", label: "Responsabilidades" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_24%)]" />
      <div className="page-shell relative py-10 sm:py-14 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr] lg:gap-12">
          <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6 lg:rounded-[2rem] lg:p-8">
            <div className="flex items-center gap-3">
              <VlMonogram className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" dark />
              <div className="min-w-0">
                <p className="truncate font-sans text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Vitrine Lojas
                </p>
                <p className="text-xs font-medium text-slate-300 sm:text-sm">
                  Plataforma para marketplaces de serviços locais
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-200 sm:text-base sm:leading-8">
              Experiência clara para descoberta, agenda, contratação e operação
              de serviços com mais confiança, contraste e clareza comercial.
            </p>
            <div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-3">
              <div className="rounded-[1.2rem] border border-white/10 bg-slate-900/70 px-3 py-3.5 sm:px-4 sm:py-4">
                <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                  Catálogo
                </p>
                <p className="mt-2 text-sm font-semibold text-white sm:text-lg">Serviços visuais</p>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-slate-900/70 px-3 py-3.5 sm:px-4 sm:py-4">
                <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                  Fluxo
                </p>
                <p className="mt-2 text-sm font-semibold text-white sm:text-lg">Agenda e booking</p>
              </div>
              <div className="col-span-2 rounded-[1.2rem] border border-white/10 bg-slate-900/70 px-3 py-3.5 sm:col-span-1 sm:px-4 sm:py-4">
                <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                  Base
                </p>
                <p className="mt-2 text-sm font-semibold text-white sm:text-lg">Web e mobile</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {footerGroups.map((group) => (
              <nav
                key={group.title}
                aria-label={group.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/4 p-5 backdrop-blur-sm sm:p-6"
              >
                <p className="text-sm font-semibold tracking-[0.18em] text-white uppercase">
                  {group.title}
                </p>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-200 sm:mt-5 sm:space-y-3.5 sm:text-base">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex rounded-full px-1 py-1 font-medium text-slate-200 hover:text-white focus-visible:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-6">
          <p className="max-w-2xl leading-6 text-slate-300 sm:leading-7">
            Vitrine Lojas. Base pronta para web e mobile com consistência visual,
            acessibilidade e uma apresentação mais sofisticada para serviços locais.
          </p>
          <p className="font-medium text-slate-400">© 2026 Vitrine Lojas</p>
        </div>
      </div>
    </footer>
  );
}
