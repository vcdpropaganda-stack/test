import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Afiliados | Vitrine Lojas",
  description:
    "Landing page inicial do programa de afiliados da Vitrine Lojas para captacao de parceiros e canais.",
};

export default function AfiliadosPage() {
  return (
    <main id="conteudo" className="page-shell py-16">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <span className="w-fit rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary-strong">
            Programa de Afiliados
          </span>
          <h1 className="mt-6 max-w-3xl font-sans text-5xl font-bold tracking-tight text-slate-950">
            Indique prestadores e clientes para a Vitrine Lojas e transforme alcance em
            receita recorrente.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-strong">
            Landing pensada para creators, agencias, parceiros de aquisicao e
            afiliados premium com narrativa clara e visual refinado.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contato" className="inline-flex">
              <Button>Quero me tornar afiliado</Button>
            </Link>
            <Link href="/" className="inline-flex">
              <Button variant="secondary">Voltar para a home</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {[
            "Comissao por indicacao validada",
            "Materiais premium de campanha",
            "Landing pronta para performance",
          ].map((item) => (
            <div
              key={item}
              className="elevated-card rounded-3xl border border-border bg-white p-6 text-sm font-medium text-slate-950"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
