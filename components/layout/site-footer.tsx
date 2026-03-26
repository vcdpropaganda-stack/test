import Link from "next/link";
import { VlMonogram } from "@/components/brand/vl-monogram";

const footerGroups = [
  {
    title: "Produto",
    links: [
      { href: "/recursos", label: "Recursos" },
      { href: "/precos", label: "Preços" },
      { href: "/faq", label: "FAQ" },
      { href: "/ajuda", label: "Ajuda" },
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
      { href: "/politica-de-cookies", label: "Cookies" },
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
      <div className="page-shell relative py-7 sm:py-10 lg:py-12">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_1.85fr] lg:gap-8">
          <div
            data-reveal
            className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5 lg:rounded-[1.75rem] lg:p-6"
          >
            <div className="flex items-center gap-3">
              <VlMonogram className="h-11 w-11 shrink-0 sm:h-12 sm:w-12" dark />
              <div className="min-w-0">
                <p className="truncate font-sans text-xl font-bold tracking-tight text-white">
                  VL Serviços
                </p>
                <p className="text-xs font-medium text-slate-300 sm:text-sm">
                  Serviços locais em um só lugar
                </p>
              </div>
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
              Encontre profissionais, compare opções e agende com clareza.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <div className="rounded-[1rem] border border-white/10 bg-slate-900/60 px-3 py-3">
                <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                  Busca
                </p>
                <p className="mt-1.5 text-sm font-semibold text-white">Serviços</p>
              </div>
              <div className="rounded-[1rem] border border-white/10 bg-slate-900/60 px-3 py-3">
                <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                  Agenda
                </p>
                <p className="mt-1.5 text-sm font-semibold text-white">Horários</p>
              </div>
              <div className="rounded-[1rem] border border-white/10 bg-slate-900/60 px-3 py-3">
                <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                  Perfil
                </p>
                <p className="mt-1.5 text-sm font-semibold text-white">Contato</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <nav
                key={group.title}
                data-reveal
                aria-label={group.title}
                className="rounded-[1.15rem] border border-white/10 bg-white/4 p-4 backdrop-blur-sm sm:p-5"
              >
                <p className="text-sm font-semibold tracking-[0.18em] text-white uppercase">
                  {group.title}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-slate-200 sm:mt-4 sm:space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex rounded-full px-1 py-0.5 text-[0.94rem] font-medium text-slate-300 hover:text-white focus-visible:text-white"
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

        <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 text-sm sm:mt-7 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-5">
          <p className="max-w-2xl leading-6 text-slate-400">
            VL Serviços para quem quer encontrar e contratar serviços locais com mais clareza.
          </p>
          <p className="font-medium text-slate-400">© 2026 VL Serviços</p>
        </div>
      </div>
    </footer>
  );
}
