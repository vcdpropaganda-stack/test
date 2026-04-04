"use client";

import * as React from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  BarChart3,
  BriefcaseBusiness,
  CircleHelp,
  FileText,
  Handshake,
  Layers3,
  LifeBuoy,
  MessageSquareText,
  ReceiptText,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { signOutAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { VlMonogram } from "@/components/brand/vl-monogram";
import { cn } from "@/lib/utils";

type LinkItem = {
  title: string;
  href: string;
  description?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type HeaderProps = {
  isAuthenticated: boolean;
  dashboardHref: string;
};

const clientLinks: LinkItem[] = [
  {
    title: "Publicar pedido",
    href: "/pedidos/novo",
    description: "Descreva sua necessidade e receba propostas.",
    icon: Sparkles,
  },
  {
    title: "Explorar pedidos",
    href: "/pedidos",
    description: "Veja como funciona o mural de serviços da plataforma.",
    icon: ReceiptText,
  },
  {
    title: "Comparar propostas",
    href: "/recursos",
    description: "Entenda como escolher o melhor prestador para contratar.",
    icon: BarChart3,
  },
  {
    title: "Ajuda ao cliente",
    href: "/ajuda",
    description: "Tire dúvidas sobre contratação, suporte e segurança.",
    icon: CircleHelp,
  },
];

const providerLinks: LinkItem[] = [
  {
    title: "Mural de pedidos",
    href: "/dashboard/provider/pedidos",
    description: "Encontre jobs compatíveis com sua cidade e categoria.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Como dar lance",
    href: "/recursos",
    description: "Envie propostas mais fortes e aumente sua conversão.",
    icon: MessageSquareText,
  },
  {
    title: "Planos e cobrança",
    href: "/precos",
    description: "Veja os ciclos mensal, trimestral e anual.",
    icon: Layers3,
  },
  {
    title: "Suporte ao prestador",
    href: "/contato",
    description: "Fale com o time sobre operação, plano ou onboarding.",
    icon: LifeBuoy,
  },
];

const companyLinks: LinkItem[] = [
  {
    title: "Segurança e confiança",
    href: "/privacidade",
    description: "Veja como a VLservice protege dados e conversas.",
    icon: Shield,
  },
  {
    title: "Termos e políticas",
    href: "/termos",
    description: "Regras de uso, responsabilidades e operação da plataforma.",
    icon: FileText,
  },
  {
    title: "Parceiros e afiliados",
    href: "/afiliados",
    description: "Amplie alcance da marca com rede de parceiros.",
    icon: Handshake,
  },
  {
    title: "Quem somos",
    href: "/institucional",
    description: "Conheça a visão do produto e a proposta da VLservice.",
    icon: Users,
  },
];

const directLinks = [
  { href: "/precos", label: "Preços" },
  { href: "/faq", label: "FAQ" },
  { href: "/contato", label: "Contato" },
];

export function Header({ isAuthenticated, dashboardHref }: HeaderProps) {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(12);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300",
        scrolled &&
          "border-slate-200/80 bg-[rgba(248,250,252,0.84)] backdrop-blur-2xl"
      )}
    >
      <nav className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <VlMonogram className="h-11 w-11 shrink-0 rounded-[1rem] shadow-[0_12px_24px_rgba(15,23,42,0.1)]" />
            <div className="min-w-0">
              <p className="truncate text-[1.05rem] font-extrabold tracking-[-0.05em] text-slate-950 sm:text-[1.65rem]">
                VLservice
              </p>
              <p className="hidden truncate text-sm text-slate-600 lg:block">
                Pedidos, propostas e contratação local
              </p>
            </div>
          </Link>

          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList className="rounded-full border border-slate-200/90 bg-white/92 p-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="border border-slate-200 bg-slate-100 text-slate-950 hover:border-slate-300 hover:bg-slate-200 hover:text-slate-950 focus:border-slate-300 focus:bg-slate-200 focus:text-slate-950 data-[state=open]:border-slate-300 data-[state=open]:bg-slate-200 data-[state=open]:text-slate-950">
                    Pedidos
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="p-2">
                    <div className="grid w-[34rem] grid-cols-[1.15fr_0.85fr] gap-3">
                      <ul className="grid gap-2 rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-2">
                        {clientLinks.map((item) => (
                          <li key={item.title}>
                            <ListItem {...item} />
                          </li>
                        ))}
                      </ul>
                      <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white shadow-[0_24px_50px_rgba(15,23,42,0.22)]">
                        <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-300">
                          Fluxo master
                        </p>
                        <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em]">
                          Cliente publica a dor. Prestadores enviam propostas.
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-200">
                          A home e o produto inteiro giram em torno de pedidos,
                          não de catálogo.
                        </p>
                        <Link
                          href="/pedidos/novo"
                          className="mt-5 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                        >
                          Publicar pedido
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Prestadores</NavigationMenuTrigger>
                  <NavigationMenuContent className="p-2">
                    <ul className="grid w-[28rem] grid-cols-2 gap-2 rounded-[1.5rem] border border-slate-200 bg-white p-2">
                      {providerLinks.map((item) => (
                        <li key={item.title}>
                          <ListItem {...item} />
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Empresa</NavigationMenuTrigger>
                  <NavigationMenuContent className="p-2">
                    <ul className="grid w-[28rem] grid-cols-2 gap-2 rounded-[1.5rem] border border-slate-200 bg-white p-2">
                      {companyLinks.map((item) => (
                        <li key={item.title}>
                          <ListItem {...item} />
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {directLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink className="px-1" asChild>
                      <Link
                        href={link.href}
                        className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-slate-950"
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href={dashboardHref}>Meu painel</Link>
              </Button>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild size="sm" className="shadow-[0_18px_36px_rgba(79,70,229,0.28)]">
                <Link href="/cadastro">Criar conta</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen((value) => !value)}
          className="md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Alternar menu"
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      <MobileMenu open={open} onClose={() => setOpen(false)}>
        <div className="rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-3">
            <VlMonogram className="h-10 w-10 rounded-[0.95rem]" />
            <div>
              <p className="text-sm font-bold text-slate-950">VLservice</p>
              <p className="text-sm text-slate-600">
                Pedidos, propostas e contratação local
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            Navegação focada em pedido, contratação e operação do prestador.
          </p>
        </div>

        <div className="grid gap-5">
          <MobileSection title="Pedidos" links={clientLinks} onNavigate={() => setOpen(false)} />
          <MobileSection title="Prestadores" links={providerLinks} onNavigate={() => setOpen(false)} />
          <MobileSection title="Empresa" links={companyLinks} onNavigate={() => setOpen(false)} />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {directLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="grid gap-2">
          {isAuthenticated ? (
            <>
              <Button asChild fullWidth>
                <Link href={dashboardHref} onClick={() => setOpen(false)}>
                  Meu painel
                </Link>
              </Button>
              <form action={signOutAction}>
                <button
                  type="submit"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-950"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="outline" fullWidth>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Entrar
                </Link>
              </Button>
              <Button asChild fullWidth>
                <Link href="/cadastro" onClick={() => setOpen(false)}>
                  Criar conta
                </Link>
              </Button>
            </>
          )}
        </div>
      </MobileMenu>
    </header>
  );
}

type MobileMenuProps = {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

function MobileMenu({ open, children, onClose }: MobileMenuProps) {
  if (!open || typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <div
      id="mobile-menu"
      className="fixed inset-0 z-40 bg-[rgba(248,250,252,0.96)] px-4 pb-6 pt-20 backdrop-blur-2xl md:hidden"
    >
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={onClose}
        className="absolute inset-0"
      />
      <div className="relative mx-auto flex h-full max-w-md flex-col gap-4 overflow-y-auto">
        {children}
      </div>
    </div>,
    document.body
  );
}

function MobileSection({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: LinkItem[];
  onNavigate: () => void;
}) {
  return (
    <section className="rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
        {title}
      </p>
      <div className="mt-3 grid gap-2">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              onClick={onNavigate}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <Icon className="h-5 w-5 text-slate-900" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                {item.description ? (
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ListItem({ title, description, icon: Icon, href }: LinkItem) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className="flex gap-3 rounded-[1.15rem] border border-transparent p-3 transition hover:border-slate-200 hover:bg-white"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border border-slate-200 bg-white shadow-sm">
          <Icon className="h-5 w-5 text-slate-950" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-950">{title}</p>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          ) : null}
        </div>
      </Link>
    </NavigationMenuLink>
  );
}

function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > threshold);
    }

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
