import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { updatePasswordAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { SUPABASE_ENV_MISSING_MESSAGE, hasSupabaseEnv } from "@/lib/env";

export const metadata: Metadata = {
  title: "Redefinir senha | VLservice",
  description: "Defina uma nova senha para continuar usando sua conta na VLservice.",
};

export default async function RedefinirSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  const authReady = hasSupabaseEnv();

  return (
    <main
      id="conteudo"
      className="page-shell flex min-h-[calc(100vh-81px)] items-center py-10 lg:py-16"
    >
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.98fr_1.02fr]">
        <section className="elevated-card rounded-[2.2rem] border border-border bg-white p-6 sm:p-8 lg:p-10">
          <p className="text-sm font-semibold tracking-[0.24em] text-primary uppercase">
            Nova senha
          </p>
          <h1 className="mt-3 font-sans text-[2.35rem] leading-[1.02] font-bold tracking-tight text-slate-950 sm:text-[2.8rem]">
            Defina uma nova senha para sua conta
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted-strong sm:text-base">
            Crie uma senha nova e confirme abaixo para concluir a recuperação com
            segurança.
          </p>

          {message ? (
            <div className="mt-6">
              <Notice>{message}</Notice>
            </div>
          ) : !authReady ? (
            <div className="mt-6">
              <Notice>{SUPABASE_ENV_MISSING_MESSAGE}</Notice>
            </div>
          ) : null}

          <form action={updatePasswordAction} className="mt-6 space-y-5">
            <InputField
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              label="Nova senha"
              placeholder="Mínimo de 6 caracteres"
            />
            <InputField
              name="password_confirm"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              label="Confirmar senha"
              placeholder="Digite novamente sua nova senha"
            />

            <Button fullWidth className="min-h-13 text-base">
              Atualizar senha
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-strong">
            Quer voltar sem alterar agora?{" "}
            <Link href="/login" className="font-semibold text-primary-strong">
              Ir para o login
            </Link>
          </p>
        </section>

        <section className="hidden overflow-hidden rounded-[2.2rem] border border-slate-200/70 bg-[linear-gradient(155deg,#020617,#0f172a_52%,#1e1b4b)] p-8 text-white shadow-[0_30px_120px_rgba(15,23,42,0.28)] lg:block lg:p-10">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-slate-100 backdrop-blur-sm">
                <KeyRound className="h-4 w-4 text-indigo-300" />
                Redefinição segura
              </div>
              <h2 className="mt-6 max-w-xl font-sans text-[2.7rem] leading-[1.02] font-bold tracking-[-0.05em] text-white">
                Sua conta continua no fluxo certo, sem fricção desnecessária.
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">
                Ao concluir esta etapa, basta voltar para o login e entrar normalmente com a nova senha.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/7 p-5 backdrop-blur-sm">
              <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                Recomendações
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
                <li>Evite repetir senhas antigas.</li>
                <li>Use uma combinação fácil para você e difícil para terceiros.</li>
                <li>Finalize o processo e faça login em seguida.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
