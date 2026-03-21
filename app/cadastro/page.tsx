import type { Metadata } from "next";
import Link from "next/link";
import { signUpAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { InputField, SelectField } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";

export const metadata: Metadata = {
  title: "Cadastro | Vitrine Lojas",
  description:
    "Crie sua conta como cliente ou prestador na plataforma Vitrine Lojas.",
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

          <form action={signUpAction} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                name="full_name"
                required
                autoComplete="name"
                label="Nome completo"
                placeholder="Seu nome"
              />

              <InputField
                name="phone"
                autoComplete="tel"
                label="Telefone"
                placeholder="(11) 99999-9999"
                hint="Opcional, mas util para contato e agendamento."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                name="email"
                type="email"
                required
                autoComplete="email"
                label="E-mail"
                placeholder="voce@exemplo.com"
              />

              <InputField
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                label="Senha"
                placeholder="Minimo de 6 caracteres"
                hint="Use pelo menos 6 caracteres."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                name="role"
                defaultValue="client"
                label="Perfil"
                hint="Voce pode criar conta como cliente ou prestador."
              >
                <option value="client">Cliente</option>
                <option value="provider">Prestador de servico</option>
              </SelectField>

              <InputField
                name="display_name"
                label="Nome publico do prestador"
                placeholder="Ex.: Studio Monarca"
                hint="Se ficar em branco, usaremos seu nome."
              />
            </div>

            <Button fullWidth className="bg-slate-950 hover:bg-primary-strong">
              Criar conta
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-strong">
            Ja tem conta?{" "}
            <Link href="/login" className="font-semibold text-primary-strong">
              Entrar agora
            </Link>
          </p>
        </section>

        <section className="elevated-card rounded-[2rem] border border-border bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),_transparent_35%),linear-gradient(135deg,_#eef2ff,_#f8fafc)] p-8">
          <p className="text-sm text-primary-strong">Separacao de perfis</p>
          <h2 className="mt-4 font-sans text-4xl font-bold tracking-tight text-slate-950">
            O onboarding ja nasce preparado para cliente e prestador.
          </h2>
          <div className="mt-8 space-y-4">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
              <p className="font-semibold text-slate-950">Cliente</p>
              <p className="mt-2 text-sm text-muted-strong">
                Busca servicos, agenda horarios e acompanha pedidos.
              </p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
              <p className="font-semibold text-slate-950">
                Prestador de servico
              </p>
              <p className="mt-2 text-sm text-muted-strong">
                Publica anuncios, define disponibilidade e gerencia agenda.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
