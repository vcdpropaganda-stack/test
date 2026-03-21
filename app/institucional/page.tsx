import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Institucional | Vitrine Lojas",
  description:
    "Apresentação institucional da plataforma Vitrine Lojas para clientes, prestadores e parceiros.",
};

export default function InstitucionalPage() {
  return (
    <main id="conteudo" className="page-shell py-16">
      <section className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
        <div>
          <span className="w-fit rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            Institucional
          </span>
          <h1 className="mt-6 max-w-3xl font-sans text-5xl font-bold tracking-tight text-slate-950">
            Uma plataforma pensada para confiança, velocidade operacional e escala.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-strong">
            A Vitrine Lojas nasce para parecer uma empresa de produto madura: limpa,
            objetiva e preparada para clientes, prestadores, parceiros e
            futuras extensões mobile.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/dashboard/provider" className="inline-flex">
              <Button>Explorar painel</Button>
            </Link>
            <Link href="/contato" className="inline-flex">
              <Button variant="secondary">Falar com o time</Button>
            </Link>
          </div>
        </div>
        <div className="elevated-card rounded-[2rem] border border-border bg-white p-8">
          <p className="text-sm text-muted-strong">Princípios do produto</p>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-muted-strong">
            <li>Clareza visual antes de ornamentação.</li>
            <li>Fluxos simples, previsíveis e acessíveis.</li>
            <li>Arquitetura pensada para escala e consistencia entre plataformas.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
