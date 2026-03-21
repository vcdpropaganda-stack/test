import { Check, ChevronRight, Star } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  client: { full_name?: string | null } | null;
};

type ServiceDetailHighlightsProps = {
  reviewsCount: number | undefined;
  reviews: Review[] | undefined;
  reviewHighlights: string[];
};

export function ServiceDetailHighlights({
  reviewsCount,
  reviews,
  reviewHighlights,
}: ServiceDetailHighlightsProps) {
  return (
    <>
      <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-8">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <h2 className="font-sans text-[1.9rem] leading-tight font-bold tracking-[-0.03em] text-slate-950 sm:text-2xl sm:tracking-tight">
            Resumo do serviço
          </h2>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
            O que está incluso
          </span>
        </div>
        <ul className="mt-5 space-y-4 text-base leading-8 text-muted-strong sm:mt-6">
          <li className="flex items-start gap-3">
            <Check className="mt-1 h-5 w-5 text-emerald-500" />
            Apresentação visual forte com imagem real do serviço.
          </li>
          <li className="flex items-start gap-3">
            <Check className="mt-1 h-5 w-5 text-emerald-500" />
            Preço-base, duração estimada e reputação visível.
          </li>
          <li className="flex items-start gap-3">
            <Check className="mt-1 h-5 w-5 text-emerald-500" />
            Contexto do prestador, localidade e agenda disponível.
          </li>
          <li className="flex items-start gap-3">
            <Check className="mt-1 h-5 w-5 text-emerald-500" />
            Jornada pensada para conversão, clareza comercial e prova social.
          </li>
        </ul>
      </div>

      <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
              Avaliações
            </p>
            <h2 className="mt-2 font-sans text-[1.9rem] leading-tight font-bold tracking-[-0.03em] text-slate-950 sm:text-2xl sm:tracking-tight">
              O que clientes valorizam neste perfil
            </h2>
          </div>
          <span className="hidden items-center gap-2 text-sm font-semibold text-slate-950 sm:inline-flex">
            Ver tudo
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[1.5rem] border border-border bg-surface p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600 text-lg font-semibold text-white">
                C
              </div>
              <div>
                <p className="font-semibold text-slate-950">Cliente verificado</p>
                <p className="text-sm text-muted-strong">{reviewsCount ?? 0} avaliações publicadas</p>
              </div>
            </div>
            <p className="mt-5 text-lg leading-8 text-slate-800">
              {reviews?.[0]?.comment ||
                "Atendimento muito bem estruturado, com resposta rápida, boa comunicação e sensação clara de serviço bem conduzido do começo ao fim."}
            </p>
          </article>
          <div className="rounded-[1.5rem] border border-border bg-slate-50 p-6">
            <p className="font-semibold text-slate-950">Destaques recorrentes</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-strong">
              {reviewHighlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Star className="mt-0.5 h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
