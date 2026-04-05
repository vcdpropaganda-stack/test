import type { ReactNode } from "react";
import { ConfigurationNotice } from "@/components/shared/configuration-notice";
import { hasSupabaseEnv } from "@/lib/env";

export default function CheckoutLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!hasSupabaseEnv()) {
    return (
      <ConfigurationNotice
        title="Checkout temporariamente indisponível"
        description="O fluxo de confirmação de agendamento depende do Supabase para validar sua sessão e carregar a reserva com segurança."
        primaryHref="/login"
        primaryLabel="Ir para o login"
        secondaryHref="/"
        secondaryLabel="Voltar para a home"
      />
    );
  }

  return children;
}
