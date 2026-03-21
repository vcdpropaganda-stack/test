import type { Metadata } from "next";
import Link from "next/link";
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
      className="page-shell flex min-h-[calc(100vh-81px)] items-center py-16"
    >
      <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="elevated-card rounded-[2rem] border border-border bg-slate-950 p-8 text-white">
          <p className="text-sm text-slate-300">Acesso seguro</p>
          <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight">
            Entre para gerenciar agendamentos, serviços e sua operação.
          </h1>
          <p className="mt-4 max-w-md text-slate-300">
            A autenticação já está conectada ao Supabase e pronta para separar
            clientes e prestadores desde a origem.
          </p>
        </section>

        <section className="elevated-card rounded-[2rem] border border-border bg-white p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
              Login
            </p>
            <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-slate-950">
              Bem-vindo de volta
            </h2>
          </div>

          {message ? <div className="mb-6"><Notice>{message}</Notice></div> : null}

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

            <Button fullWidth>Entrar</Button>
          </form>

          <p className="mt-6 text-sm text-muted-strong">
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="font-semibold text-primary-strong">
              Criar cadastro
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
