import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroSearch } from "@/components/marketplace/hero-search";
import { Button } from "@/components/ui/button";

type SpotlightService = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  city: string | null;
  price: string;
  duration: string;
  imageUrl: string | null;
};

type HomeHeroProps = {
  spotlightServices: SpotlightService[];
  activeServicesCount: number;
};

export function HomeHero({
  spotlightServices,
  activeServicesCount,
}: HomeHeroProps) {
  return (
    <section className="hero-grid relative overflow-hidden border-b border-border bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_52%,#ffffff_100%)]">
      <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-primary/8 to-transparent" />
      <div
        data-float
        data-float-from="-14"
        data-float-to="10"
        className="pointer-events-none absolute left-[-8rem] top-24 h-[24rem] w-[24rem] rounded-full bg-primary/12 blur-3xl"
      />
      <div
        data-float
        data-float-from="-8"
        data-float-to="12"
        className="pointer-events-none absolute right-[-6rem] top-16 h-[28rem] w-[28rem] rounded-full bg-cyan-300/10 blur-3xl"
      />
      <div
        data-float
        data-float-from="-10"
        data-float-to="14"
        className="pointer-events-none absolute bottom-[-10rem] right-[18%] h-[20rem] w-[20rem] rounded-full bg-amber-300/10 blur-3xl"
      />
      <div className="page-shell py-12 lg:py-20">
        <div className="relative z-10 mx-auto max-w-6xl">
          <div
            data-reveal
            className="glass-panel mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 px-4 py-2 text-sm font-semibold text-primary-strong shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            A plataforma certa para encontrar quem faz
          </div>
          <div data-reveal data-reveal-delay="80" className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold tracking-[0.32em] text-primary-strong uppercase">
              Precisa de uma mãozinha? Nós resolvemos. 🤝
            </p>
            <h1 className="mt-5 font-sans text-[3rem] leading-[1.02] font-bold tracking-[-0.05em] text-slate-950 sm:text-[4.1rem] sm:leading-[0.98] lg:text-[5.25rem] lg:leading-[0.96]">
              A plataforma certa
              <span className="block">para encontrar quem faz.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-muted-strong sm:text-xl">
              Quer dar um tapa no visual, consertar o PC ou bombar suas redes
              sociais? Na VL Serviços, você encontra o especialista ideal em minutos.
            </p>
          </div>
          <div data-reveal data-reveal-delay="140" className="mx-auto mt-10 max-w-4xl">
            <HeroSearch initialResults={spotlightServices} variant="light" />
          </div>
          <div className="mx-auto mt-8 grid max-w-5xl gap-3 text-left sm:grid-cols-3">
            <div
              data-reveal
              data-reveal-delay="190"
              className="elevated-card rounded-[1.6rem] border border-white/70 bg-white/88 p-5 backdrop-blur"
            >
              <p className="text-[0.72rem] font-semibold tracking-[0.26em] text-primary-strong uppercase">
                Beleza
              </p>
              <p className="mt-3 text-base leading-7 text-slate-900">
                Manicure e maquiagem.
              </p>
            </div>
            <div
              data-reveal
              data-reveal-delay="240"
              className="elevated-card rounded-[1.6rem] border border-white/70 bg-white/88 p-5 backdrop-blur"
            >
              <p className="text-[0.72rem] font-semibold tracking-[0.26em] text-primary-strong uppercase">
                Casa e Tech
              </p>
              <p className="mt-3 text-base leading-7 text-slate-900">
                Pintores e técnicos de informática.
              </p>
            </div>
            <div
              data-reveal
              data-reveal-delay="290"
              className="elevated-card rounded-[1.6rem] border border-white/70 bg-slate-950 p-5 text-white"
            >
              <p className="text-[0.72rem] font-semibold tracking-[0.26em] text-slate-400 uppercase">
                Negócios
              </p>
              <p className="mt-3 text-base leading-7 text-slate-100">
                Agência de marketing e redes sociais.
              </p>
            </div>
          </div>
          <div
            data-reveal
            data-reveal-delay="340"
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/servicos" className="inline-flex">
              <Button icon={<ArrowRight className="h-4 w-4" />}>
                Explorar marketplace
              </Button>
            </Link>
            <Link href="/dashboard/provider" className="inline-flex">
              <Button variant="secondary">Quero anunciar meus serviços</Button>
            </Link>
          </div>
          <div data-reveal data-reveal-delay="390" className="mt-7 text-center">
            <p className="text-base font-semibold tracking-[0.12em] text-slate-700 uppercase">
              Rápido. Seguro. Profissional.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-3 gap-2 sm:gap-3">
            <div
              data-reveal
              data-reveal-delay="430"
              className="elevated-card rounded-[1.25rem] border border-white/70 bg-white/88 p-3 backdrop-blur sm:rounded-[1.6rem] sm:p-4"
            >
              <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-muted uppercase sm:text-[0.7rem] sm:tracking-[0.22em]">
                Serviços
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:mt-3 sm:text-3xl">
                {activeServicesCount}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-strong sm:text-sm sm:leading-6">
                anúncios com imagem e preço visível
              </p>
            </div>
            <div
              data-reveal
              data-reveal-delay="470"
              className="elevated-card rounded-[1.25rem] border border-white/70 bg-white/88 p-3 backdrop-blur sm:rounded-[1.6rem] sm:p-4"
            >
              <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-muted uppercase sm:text-[0.7rem] sm:tracking-[0.22em]">
                Categorias
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:mt-3 sm:text-3xl">
                10
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-strong sm:text-sm sm:leading-6">
                áreas entre beleza, casa, tech e negócios
              </p>
            </div>
            <div
              data-reveal
              data-reveal-delay="510"
              className="elevated-card rounded-[1.25rem] border border-white/70 bg-slate-950 p-3 text-white sm:rounded-[1.6rem] sm:p-4"
            >
              <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-slate-400 uppercase sm:text-[0.7rem] sm:tracking-[0.22em]">
                Agenda viva
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight sm:mt-3 sm:text-3xl">
                Datas
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-300 sm:text-sm sm:leading-6">
                disponibilidade real por horário
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
