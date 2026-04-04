import { PulseFitHero } from "@/components/ui/pulse-fit-hero";

type HomeHeroCategory = {
  id: string;
  name: string;
  slug: string;
};

type HomeHeroProps = {
  featuredCategories: HomeHeroCategory[];
  categoryCount: number;
};

const fallbackImages = [
  "/service-images/limpeza.jpg",
  "/service-images/tecnologia.jpg",
  "/service-images/maquiagem.jpg",
  "/service-images/consultoria.jpg",
  "/service-images/marketing.jpg",
  "/service-images/workspace.jpg",
] as const;

function getCategoryImage(index: number) {
  return fallbackImages[index % fallbackImages.length];
}

export function HomeHero({
  featuredCategories,
  categoryCount,
}: HomeHeroProps) {
  const programs = featuredCategories.slice(0, 6).map((category, index) => ({
    image: getCategoryImage(index),
    category: "PEDIDO POPULAR",
    title: category.name,
    href: `/pedidos/novo?category=${encodeURIComponent(category.id)}`,
  }));

  return (
    <PulseFitHero
      eyebrow="Pedido primeiro. Catálogo depois."
      title="Descreva o que precisa resolver e receba propostas de quem faz."
      subtitle={`A VLservice organiza a jornada como um marketplace de pedidos: o cliente entra pelo problema, publica a necessidade e compara lances com clareza. Mais de ${categoryCount} categorias já podem virar pedido.`}
      primaryAction={{
        label: "Preciso de um serviço",
        href: "/pedidos/novo",
      }}
      secondaryAction={{
        label: "Sou prestador, ver pedidos",
        href: "/dashboard/provider/pedidos",
      }}
      disclaimer="Sem catálogo como porta de entrada. A home já leva direto para o pedido."
      socialProof={{
        people: [
          { name: "Mariana Souza" },
          { name: "Lucas Pereira" },
          { name: "Fernanda Lima" },
          { name: "Rafael Gomes" },
        ],
        text: "Clientes publicam a dor. Prestadores respondem com proposta.",
      }}
      metrics={[
        { value: `${categoryCount}+`, label: "categorias prontas para pedido" },
        { value: "3 passos", label: "publicar, comparar e contratar" },
        { value: "mobile-first", label: "fluxo leve para celular" },
      ]}
      programs={programs}
    />
  );
}
