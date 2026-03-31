import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

type HomeServiceCategoriesProps = {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

export function HomeServiceCategories({
  categories,
}: HomeServiceCategoriesProps) {
  return (
    <section
      id="servicos-populares"
      className="border-b border-border bg-[linear-gradient(180deg,#ffffff,rgba(238,242,255,0.55))]"
    >
      <div className="page-shell grid gap-10 py-18 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div>
          <SectionHeading
            eyebrow="Escolha o serviço"
            title="Comece pela sua necessidade, não por um catálogo de anúncios"
            description="Em vez de navegar por um catálogo na home, o cliente escolhe o tipo de serviço e já entra no pedido com a categoria certa."
          />

          <p className="mt-6 max-w-xl text-sm leading-7 text-muted-strong">
            Esse desenho aproxima a jornada do modelo do GetNinjas: primeiro a
            necessidade, depois as propostas, e só então a contratação.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/pedidos/novo" className="inline-flex">
              <Button>Publicar pedido livre</Button>
            </Link>
            <Link href="/pedidos" className="inline-flex">
              <Button variant="secondary">Ver mural de pedidos</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-x-8 sm:grid-cols-2">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/pedidos/novo?category=${encodeURIComponent(category.id)}`}
                className="group flex items-center gap-4 border-b border-slate-200/90 py-4 transition hover:border-primary/35"
              >
                <span className="min-w-10 text-[0.7rem] font-semibold tracking-[0.22em] text-muted uppercase">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-base font-semibold text-slate-950 transition group-hover:text-primary-strong sm:text-lg">
                  {category.name}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-primary-strong" />
              </Link>
            ))
          ) : (
            <div className="rounded-[1.8rem] border border-dashed border-slate-300 bg-white/80 p-6 text-sm leading-7 text-muted-strong sm:col-span-2">
              As categorias ainda podem crescer, mas a jornada principal já está
              pronta: publicar o pedido, receber propostas e contratar sem
              depender de catálogo na home.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
