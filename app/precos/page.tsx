import type { Metadata } from "next";
import PricingSection4 from "@/components/ui/pricing-section-4";

export const metadata: Metadata = {
  title: "Preços | VLservice",
  description:
    "Plano único da VLservice com cobrança mensal, trimestral ou anual para prestadores de serviço.",
};

export default function PricingPage() {
  return <PricingSection4 />;
}
