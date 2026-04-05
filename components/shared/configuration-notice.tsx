import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { SUPABASE_ENV_MISSING_MESSAGE } from "@/lib/env";

type ConfigurationNoticeProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function ConfigurationNotice({
  eyebrow = "Ambiente em configuração",
  title,
  description,
  primaryHref = "/",
  primaryLabel = "Voltar para a home",
  secondaryHref,
  secondaryLabel,
}: ConfigurationNoticeProps) {
  return (
    <main id="conteudo" className="page-shell py-10 sm:py-14">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold tracking-[0.24em] text-primary-strong uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-sans text-4xl font-bold tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="mt-4 text-base leading-8 text-muted-strong">{description}</p>

        <div className="mt-6">
          <Notice>{SUPABASE_ENV_MISSING_MESSAGE}</Notice>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={primaryHref} className="inline-flex">
            <Button>{primaryLabel}</Button>
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link href={secondaryHref} className="inline-flex">
              <Button variant="secondary">{secondaryLabel}</Button>
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
