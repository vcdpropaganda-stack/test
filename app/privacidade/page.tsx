import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidade | Vitrine Lojas",
  description: "Pagina base de privacidade da plataforma Vitrine Lojas.",
};

export default function PrivacidadePage() {
  return (
    <main id="conteudo" className="page-shell py-16">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-border bg-white p-8">
        <h1 className="font-sans text-4xl font-bold tracking-tight text-slate-950">
          Politica de privacidade
        </h1>
        <p className="mt-6 text-base leading-8 text-muted-strong">
          Esta pagina foi preparada como base institucional para privacidade,
          tratamento de dados, consentimento e operacao segura da plataforma.
        </p>
      </div>
    </main>
  );
}
