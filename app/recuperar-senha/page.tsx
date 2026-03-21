import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { requestPasswordResetAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";

export const metadata: Metadata = {
  title: "Recuperar senha | Vitrine Lojas",
  description: "Solicite um link para redefinir a senha da sua conta na Vitrine Lojas.",
};

export default async function RecuperarSenhaPage({
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
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="elevated-card rounded-[2.2rem] border border-border bg-white p-6 sm:p-8 lg:p-10">
          <p className="text-sm font-semibold tracking-[0.24em] text-primary uppercase">
            Recuperação
          </p>
          <h1 className="mt-3 font-sans text-[2.35rem] leading-[1.02] font-bold tracking-tight text-slate-950 sm:text-[2.8rem]">
            Receba um novo link para redefinir sua senha
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted-strong sm:text-base">
            Digite o mesmo e-mail usado no cadastro. Vamos enviar um link seguro para
            criar uma nova senha.
          </p>

          {message ? (
            <div className="mt-6">
              <Notice>{message}</Notice>
            </div>
          ) : null}

          <form action={requestPasswordResetAction} className="mt-6 space-y-5">
            <InputField
              name="email"
              type="email"
              required
              autoComplete="email"
              label="E-mail"
              placeholder="voce@exemplo.com"
            />

            <Button fullWidth className="min-h-13 text-base">
              Enviar link de recuperação
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-strong">
            Lembrou sua senha?{" "}
            <Link href="/login" className="font-semibold text-primary-strong">
              Voltar para o login
            </Link>
          </p>
        </section>

        <section className="hidden overflow-hidden rounded-[2.2rem] border border-slate-200/70 bg-[linear-gradient(155deg,#020617,#0f172a_52%,#1e1b4b)] p-8 text-white shadow-[0_30px_120px_rgba(15,23,42,0.28)] lg:block lg:p-10">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-slate-100 backdrop-blur-sm">
                <Mail className="h-4 w-4 text-indigo-300" />
                Acesso protegido
              </div>
              <h2 className="mt-6 max-w-xl font-sans text-[2.7rem] leading-[1.02] font-bold tracking-[-0.05em] text-white">
                Recuperação simples, segura e sem ruído.
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">
                O link leva para uma tela dedicada de redefinição, mantendo a conta no
                fluxo certo sem complicar a experiência.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/7 p-5 backdrop-blur-sm">
              <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                Boas práticas
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
                <li>Use o e-mail mais recente recebido.</li>
                <li>Escolha uma senha nova e fácil de memorizar.</li>
                <li>Volte ao login assim que a redefinição for concluída.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
