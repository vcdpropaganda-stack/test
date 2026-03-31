import type { Metadata } from "next";
import { InputField } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contato | VLservice",
  description:
    "Canal de contato inicial para parceiros, clientes e prestadores da VLservice.",
};

export default function ContatoPage() {
  return (
    <main id="conteudo" className="page-shell py-16">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-border bg-slate-950 p-8 text-white">
          <p className="text-sm font-semibold tracking-[0.22em] text-slate-300 uppercase">
            Contato
          </p>
          <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight">
            Fale com o time para parcerias, implantação ou dúvidas sobre o produto.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
            A página já está pronta para virar canal comercial, suporte
            dedicado, onboarding e atendimento institucional.
          </p>
        </section>

        <section className="elevated-card rounded-[2rem] border border-border bg-white p-8">
          <form className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Nome" name="name" placeholder="Seu nome" />
              <InputField
                label="E-mail"
                name="email"
                type="email"
                placeholder="voce@empresa.com"
              />
            </div>
            <InputField
              label="Assunto"
              name="subject"
              placeholder="Parceria, suporte, vendas..."
            />
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-slate-950 outline-none hover:border-primary/30 focus:border-primary"
                placeholder="Como podemos ajudar?"
              />
            </div>
            <Button fullWidth>Enviar mensagem</Button>
          </form>
        </section>
      </div>
    </main>
  );
}
