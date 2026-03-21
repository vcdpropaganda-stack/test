import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, ShieldCheck, Sparkles } from "lucide-react";
import { signInAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";

export const metadata: Metadata = {
  title: "Entrar | Vitrine Lojas",
  description: "Acesse sua conta de cliente ou prestador na plataforma Vitrine Lojas.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <main
      id="conteudo"
      className="page-shell flex min-h-[calc(100vh-81px)] items-center py-10 lg:py-16"
    >
      <div className="grid w-full gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
        <section className="order-2 relative hidden overflow-hidden rounded-[2.4rem] border border-slate-200/70 bg-[linear-gradient(155deg,#020617,#0f172a_50%,#1e1b4b)] p-8 text-white shadow-[0_30px_120px_rgba(15,23,42,0.28)] lg:order-1 lg:block lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.32),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.16),transparent_28%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-slate-100 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-indigo-300" />
              Acesso seguro
            </div>
            <h1 className="mt-6 max-w-xl font-sans text-[2.8rem] leading-[1.02] font-bold tracking-[-0.05em] text-white sm:text-[3.6rem] sm:leading-[0.98]">
              Volte para a sua operação com clareza e controle.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              Agenda, serviços, reservas e jornada do cliente em uma interface
              pensada para ser elegante, confiável e fácil de operar.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/7 p-4 backdrop-blur-sm">
                <CalendarClock className="h-5 w-5 text-indigo-300" />
                <p className="mt-4 text-lg font-semibold text-white">Agenda viva</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Visualize horários, reservas e próximos atendimentos.
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/7 p-4 backdrop-blur-sm">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                <p className="mt-4 text-lg font-semibold text-white">Acesso segregado</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Cliente e prestador entram em fluxos próprios desde a origem.
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/7 p-4 backdrop-blur-sm">
                <ArrowRight className="h-5 w-5 text-amber-300" />
                <p className="mt-4 text-lg font-semibold text-white">Fluxo direto</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Entre, confirme e siga para o painel certo sem ruído.
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-white/7 p-5 backdrop-blur-sm">
              <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                Vitrine Lojas
              </p>
              <p className="mt-3 max-w-lg text-base leading-7 text-slate-200">
                Uma base SaaS preparada para transformar marketplace de serviços
                em produto com apresentação mais clara, conversão melhor e
                leitura muito mais clara.
              </p>
            </div>
          </div>
        </section>

        <section className="order-1 elevated-card-strong relative overflow-hidden rounded-[2.2rem] border border-slate-200/80 bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)] sm:p-8 lg:order-2 lg:rounded-[2.4rem] lg:p-10">
          <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(224,231,255,0.55),transparent)]" />
          <div className="relative">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-[0.24em] text-primary uppercase">
                  Login
                </p>
                <h2 className="mt-3 font-sans text-[2.35rem] leading-[1.02] font-bold tracking-tight text-slate-950 sm:text-[2.8rem]">
                  Bem-vindo de volta
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-strong sm:text-base sm:leading-7">
                  Entre com seu e-mail para acessar sua área, acompanhar pedidos
                  ou gerenciar seu catálogo.
                </p>
              </div>
              <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 sm:block">
                Cliente ou prestador
              </div>
            </div>

            {message ? (
              <div className="mb-6">
                <Notice>{message}</Notice>
              </div>
            ) : (
              <div className="mb-6 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm leading-6 text-muted-strong">
                Use o mesmo e-mail que recebeu o link de confirmação para entrar
                com segurança.
              </div>
            )}

            <form action={signInAction} className="space-y-5">
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
                autoComplete="current-password"
                label="Senha"
                placeholder="Sua senha"
              />

              <Button fullWidth className="min-h-13 text-base">
                Entrar
              </Button>
            </form>

            <div className="mt-8 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm leading-7 text-muted-strong">
              Se o link de confirmação expirou, faça um novo cadastro com o mesmo
              e-mail para receber um novo acesso.
            </div>

            <p className="mt-6 text-sm text-muted-strong">
              Ainda não tem conta?{" "}
              <Link href="/cadastro" className="font-semibold text-primary-strong">
                Criar cadastro
              </Link>
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 lg:hidden">
              <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-primary uppercase">
                Acesso rápido
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-strong">
                Cliente e prestador usam o mesmo login. Depois da entrada, cada perfil segue para sua área correta.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
