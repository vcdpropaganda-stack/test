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
  "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
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
        avatars: [
          "https://i.pravatar.cc/160?img=12",
          "https://i.pravatar.cc/160?img=23",
          "https://i.pravatar.cc/160?img=32",
          "https://i.pravatar.cc/160?img=41",
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
