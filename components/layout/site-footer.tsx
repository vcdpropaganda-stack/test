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
      <div className="page-shell relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1.8fr] lg:gap-16">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:p-8">
            <div className="flex items-center gap-4">
              <VlMonogram className="h-14 w-14 shrink-0" dark />
              <div>
                <p className="font-sans text-2xl font-bold tracking-tight text-white">
                  Vitrine Lojas
                </p>
                <p className="text-sm font-medium text-slate-300">
                  Plataforma para marketplaces de serviços locais
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-md text-base leading-8 text-slate-200">
              Experiência premium para descoberta, agenda, contratação e operação
              de serviços com mais confiança, contraste e clareza comercial.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.35rem] border border-white/10 bg-slate-900/70 px-4 py-4">
                <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                  Catálogo
                </p>
                <p className="mt-2 text-lg font-semibold text-white">Serviços visuais</p>
              </div>
              <div className="rounded-[1.35rem] border border-white/10 bg-slate-900/70 px-4 py-4">
                <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                  Fluxo
                </p>
                <p className="mt-2 text-lg font-semibold text-white">Agenda e booking</p>
              </div>
              <div className="rounded-[1.35rem] border border-white/10 bg-slate-900/70 px-4 py-4">
                <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                  Base
                </p>
                <p className="mt-2 text-lg font-semibold text-white">Web e mobile</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <nav
                key={group.title}
                aria-label={group.title}
                className="rounded-[1.8rem] border border-white/10 bg-white/4 p-6 backdrop-blur-sm"
              >
                <p className="text-sm font-semibold tracking-[0.18em] text-white uppercase">
                  {group.title}
                </p>
                <ul className="mt-5 space-y-3.5 text-base text-slate-200">
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

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl leading-7 text-slate-300">
            Vitrine Lojas. Base pronta para web e mobile com consistência visual,
            acessibilidade e uma apresentação mais sofisticada para serviços locais.
          </p>
          <p className="font-medium text-slate-400">© 2026 Vitrine Lojas</p>
        </div>
      </div>
    </footer>
  );
}
