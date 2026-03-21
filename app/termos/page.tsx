import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos | Vitrine Lojas",
  description: "Pagina base de termos de uso da plataforma Vitrine Lojas.",
};

export default function TermosPage() {
  return (
    <main id="conteudo" className="page-shell py-16">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-border bg-white p-8">
        <h1 className="font-sans text-4xl font-bold tracking-tight text-slate-950">
          Termos de uso
        </h1>
        <p className="mt-6 text-base leading-8 text-muted-strong">
          Esta pagina serve como estrutura inicial para regras do marketplace,
          conduta de usuarios, operacao de pagamentos e responsabilidades da
          plataforma.
        </p>
      </div>
    </main>
  );
}
