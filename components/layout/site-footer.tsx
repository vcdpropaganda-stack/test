import Link from "next/link";

const footerGroups = [
  {
    title: "Produto",
    links: [
      { href: "/recursos", label: "Recursos" },
      { href: "/precos", label: "Precos" },
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
      { href: "/termos", label: "Termos" },
      { href: "/login", label: "Entrar" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-slate-950 text-white">
      <div className="page-shell py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-bold text-slate-950">
                T
              </div>
              <div>
                <p className="font-sans text-xl font-bold tracking-tight">TESTE</p>
                <p className="text-sm text-slate-400">
                  SaaS para marketplaces de servicos locais
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
              Design clean, operacao escalavel e uma experiencia pensada para
              confianca, conversao e acessibilidade desde o primeiro clique.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <p className="text-sm font-semibold text-white">{group.title}</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-400">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="hover:text-white focus-visible:text-white"
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

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-slate-500">
          TESTE. Base SaaS pronta para web e mobile com consistencia visual e
          acessibilidade.
        </div>
      </div>
    </footer>
  );
}
