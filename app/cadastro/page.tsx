import type { Metadata } from "next";
import { Notice } from "@/components/ui/notice";
import { SignUpForm } from "@/app/cadastro/sign-up-form";

export const metadata: Metadata = {
  title: "Cadastro | VLservice",
  description:
    "Crie sua conta como cliente ou prestador na plataforma VLservice.",
};

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <main
      id="conteudo"
      className="page-shell flex min-h-[calc(100vh-81px)] items-center py-16"
    >
      <div className="grid w-full gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="elevated-card rounded-[2rem] border border-border bg-white p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
              Cadastro
            </p>
            <h1 className="mt-3 font-sans text-3xl font-bold tracking-tight text-slate-950">
              Crie sua conta inicial no marketplace
            </h1>
          </div>

          {message ? <div className="mb-6"><Notice>{message}</Notice></div> : null}

          <SignUpForm />
        </section>

        <section className="elevated-card rounded-[2rem] border border-border bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),_transparent_35%),linear-gradient(135deg,_#eef2ff,_#f8fafc)] p-8">
          <p className="text-sm text-primary-strong">Separação de perfis</p>
          <h2 className="mt-4 font-sans text-4xl font-bold tracking-tight text-slate-950">
            O onboarding já nasce preparado para cliente e prestador.
          </h2>
          <div className="mt-8 space-y-4">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
              <p className="font-semibold text-slate-950">Cliente</p>
              <p className="mt-2 text-sm text-muted-strong">
                Busca serviços, agenda horários e acompanha pedidos.
              </p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
              <p className="font-semibold text-slate-950">
                Prestador de serviço
              </p>
              <p className="mt-2 text-sm text-muted-strong">
                Publica anúncios, define disponibilidade e gerencia agenda.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
