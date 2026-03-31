import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type HomeHeroCategory = {
  id: string;
  name: string;
  slug: string;
};

type HomeHeroProps = {
  featuredCategories: HomeHeroCategory[];
  categoryCount: number;
};

export function HomeHero({
  featuredCategories,
  categoryCount,
}: HomeHeroProps) {
  return (
    <section className="hero-grid relative overflow-hidden border-b border-border bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_48%,#ffffff_100%)]">
      <div className="absolute inset-x-0 top-0 h-56 bg-linear-to-b from-primary/10 to-transparent" />
      <div
        data-float
        data-float-from="-14"
        data-float-to="10"
        className="pointer-events-none absolute left-[-10rem] top-20 h-[26rem] w-[26rem] rounded-full bg-primary/12 blur-3xl"
      />
      <div
        data-float
        data-float-from="-8"
        data-float-to="12"
        className="pointer-events-none absolute right-[-8rem] top-14 h-[28rem] w-[28rem] rounded-full bg-cyan-300/12 blur-3xl"
      />
      <div
        data-float
        data-float-from="-10"
        data-float-to="14"
        className="pointer-events-none absolute bottom-[-11rem] right-[18%] h-[20rem] w-[20rem] rounded-full bg-amber-300/12 blur-3xl"
      />

      <div className="page-shell py-14 lg:py-22">
        <div className="relative z-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)] lg:items-center">
          <div>
            <div
              data-reveal
              className="glass-panel mb-6 flex w-fit items-center gap-2 rounded-full border border-primary/15 px-4 py-2 text-sm font-semibold text-primary-strong shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              Peça um serviço e receba propostas
            </div>

            <div data-reveal data-reveal-delay="80" className="max-w-3xl">
              <p className="text-sm font-semibold tracking-[0.32em] text-primary-strong uppercase">
                Cliente publica a necessidade. Profissional responde com lance.
              </p>
              <h1 className="mt-5 font-sans text-[3.15rem] leading-[1.01] font-bold tracking-[-0.05em] text-slate-950 sm:text-[4.2rem] sm:leading-[0.98] lg:text-[5rem] lg:leading-[0.94]">
                Qual serviço
                <span className="block">você precisa resolver hoje?</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-strong sm:text-xl">
                A home agora começa pela necessidade do cliente, como no
                GetNinjas: você escolhe o tipo de serviço, descreve o problema
                e recebe propostas para comparar com calma.
              </p>
            </div>

            <div
              data-reveal
              data-reveal-delay="140"
              className="mt-8 flex flex-col items-start gap-4 sm:flex-row"
            >
              <Link href="/pedidos/novo" className="inline-flex">
                <Button icon={<ArrowRight className="h-4 w-4" />}>
                  Preciso de um serviço
                </Button>
              </Link>
              <Link href="/dashboard/provider/pedidos" className="inline-flex">
                <Button variant="secondary">Sou prestador, ver pedidos</Button>
              </Link>
            </div>

            <div data-reveal data-reveal-delay="220" className="mt-10 max-w-2xl">
              <p className="text-[0.72rem] font-semibold tracking-[0.24em] text-muted uppercase">
                Escolha por tipo de serviço
              </p>
              {featuredCategories.length > 0 ? (
                <>
                  <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {featuredCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/pedidos/novo?category=${encodeURIComponent(category.id)}`}
                        className="group flex items-center justify-between border-b border-slate-300/80 py-3 text-sm font-medium text-slate-900 transition hover:border-primary/45 hover:text-primary-strong"
                      >
                        <span>{category.name}</span>
                        <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-primary-strong" />
                      </Link>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted-strong">
                    Mais de {categoryCount} categorias já podem virar pedido com
                    poucos toques.
                  </p>
                </>
              ) : (
                <p className="mt-4 text-sm leading-7 text-muted-strong">
                  Mesmo sem escolher categoria agora, você já pode abrir um
                  pedido livre e receber propostas relevantes.
                </p>
              )}
            </div>
          </div>

          <div data-reveal data-reveal-delay="180">
            <div className="relative overflow-hidden rounded-[2.4rem] border border-white/70 bg-white/84 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.12)] backdrop-blur lg:p-8">
              <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-primary/10 to-transparent" />
              <div className="relative">
                <p className="text-[0.72rem] font-semibold tracking-[0.24em] text-primary-strong uppercase">
                  Pedido guiado
                </p>
                <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-slate-950">
                  O cliente entra pelo problema, não pelo catálogo.
                </h2>
                <p className="mt-4 text-base leading-7 text-muted-strong">
                  A home deixa de ser catálogo de prestadores e vira a porta de
                  entrada para publicar a necessidade.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                      <ClipboardList className="h-5 w-5 text-primary-strong" />
                      <p className="text-sm font-semibold text-slate-950">
                        1. Escolha o tipo de serviço
                      </p>
                    </div>
                    <p className="mt-2 pl-8 text-sm leading-7 text-muted-strong">
                      Categoria, cidade e contexto do problema entram primeiro.
                    </p>
                  </div>

                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                      <MessageSquareText className="h-5 w-5 text-primary-strong" />
                      <p className="text-sm font-semibold text-slate-950">
                        2. Receba propostas comparáveis
                      </p>
                    </div>
                    <p className="mt-2 pl-8 text-sm leading-7 text-muted-strong">
                      Preço, prazo, mensagem e reputação aparecem no mesmo lugar.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-primary-strong" />
                      <p className="text-sm font-semibold text-slate-950">
                        3. Converse e contrate com clareza
                      </p>
                    </div>
                    <p className="mt-2 pl-8 text-sm leading-7 text-muted-strong">
                      O chat fica dentro do pedido e a decisão nasce da comparação
                      entre as propostas.
                    </p>
                  </div>
                </div>

                <div className="mt-8 rounded-[1.8rem] bg-slate-950 p-5 text-white">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary-200" />
                    <p className="text-sm font-semibold">
                      Fluxo pensado para demanda local e mobile-first
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    O pedido nasce simples no celular, sobe para o mural e
                    entrega contexto suficiente para o profissional decidir se
                    vale dar lance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
