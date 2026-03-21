import Link from "next/link";
import { Check, ChevronRight, Clock3, MapPin, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/marketplace";

type ServiceDetailSidebarProps = {
  priceCents: number;
  durationMinutes: number;
  availabilityCount: number;
  providerName: string;
  providerBio: string | null | undefined;
  providerPlan: string | null | undefined;
  averageRating: number | null | undefined;
  reviewsCount: number | undefined;
  location: string;
};

function formatPlan(plan: string | null | undefined) {
  if (plan === "pro") return "Profissional";
  if (plan === "premium") return "Completo";
  return "Essencial";
}

export function ServiceDetailSidebar({
  priceCents,
  durationMinutes,
  availabilityCount,
  providerName,
  providerBio,
  providerPlan,
  averageRating,
  reviewsCount,
  location,
}: ServiceDetailSidebarProps) {
  const completePrice = Math.round(priceCents * 1.45);
  const standardPrice = Math.round(priceCents * 1.2);

  return (
    <aside className="order-first space-y-4 lg:order-none lg:sticky lg:top-28 lg:self-start lg:space-y-6">
      <div className="overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:rounded-[2rem]">
        <div className="grid grid-cols-3 border-b border-border bg-slate-50 text-[0.72rem] sm:text-sm">
          {[
            { label: "Essencial", price: priceCents },
            { label: "Intermediário", price: standardPrice },
            { label: "Completo", price: completePrice },
          ].map((pack, index) => (
            <div
              key={pack.label}
              className={`px-2 py-3 text-center font-semibold sm:px-4 sm:py-4 ${
                index === 0
                  ? "border-b-2 border-slate-950 bg-white text-slate-950"
                  : "text-slate-400"
              }`}
            >
              {pack.label}
            </div>
          ))}
        </div>
        <div className="p-5 sm:p-8">
          <p className="text-[2.3rem] font-bold tracking-tight text-slate-950 sm:text-4xl">
            {formatPrice(priceCents)}
          </p>
          <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
            Solução com foco em clareza comercial, presença visual forte e uma entrega pronta para gerar confiança desde o primeiro contato.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-3 text-sm font-semibold text-slate-700 sm:gap-x-5">
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              {durationMinutes} min
            </span>
            <span className="inline-flex items-center gap-2">
              <ChevronRight className="h-4 w-4" />1 revisão inicial
            </span>
          </div>

          <ul className="mt-6 space-y-3 text-sm leading-7 text-muted-strong">
            <li className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 text-slate-950" />
              Briefing e alinhamento do escopo.
            </li>
            <li className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 text-slate-950" />
              Execução com apresentação visual clara.
            </li>
            <li className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 text-slate-950" />
              Ajustes para entrega mais clara ao cliente.
            </li>
            <li className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 text-slate-950" />
              Agendamento integrado pelo marketplace.
            </li>
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            {availabilityCount > 0 ? (
              <Link href="#agenda" className="block">
                <span className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 hover:bg-primary-strong">
                  Selecionar data e horário
                </span>
              </Link>
            ) : (
              <Button disabled fullWidth>
                Sem horários no momento
              </Button>
            )}
            <Link href="/contato" className="block">
              <span className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-50">
                Falar com a equipe
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-base font-semibold text-white sm:h-14 sm:w-14 sm:text-lg">
            {providerName.slice(0, 1)}
          </div>
          <div>
            <p className="text-sm text-muted-strong">Prestador</p>
            <h2 className="font-sans text-[1.9rem] leading-tight font-bold tracking-[-0.03em] text-slate-950 sm:text-3xl sm:tracking-tight">
              {providerName}
            </h2>
          </div>
        </div>
        <div className="mt-6 grid gap-3 text-sm text-slate-700">
          <p className="inline-flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            {averageRating ? `${averageRating.toFixed(1)} de média` : "Novo perfil"}
          </p>
          <p className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-primary-strong" />
            {durationMinutes} min
          </p>
          <p className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary-strong" />
            {location}
          </p>
          <p className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Plano {formatPlan(providerPlan)}
          </p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-8">
        <p className="text-sm font-semibold text-slate-950">Biografia do prestador</p>
        <p className="mt-3 text-sm leading-7 text-muted-strong">
          {providerBio ||
            "Este perfil ainda não adicionou uma biografia detalhada. O marketplace já está preparado para evoluir esse bloco depois."}
        </p>
      </div>

      <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-8">
        <p className="text-sm font-semibold text-slate-950">Reputação</p>
        <p className="mt-3 text-3xl font-bold text-slate-950">
          {averageRating ? averageRating.toFixed(1) : "--"}
        </p>
        <p className="mt-2 text-sm text-muted-strong">{reviewsCount ?? 0} avaliações publicadas</p>
      </div>
    </aside>
  );
}
