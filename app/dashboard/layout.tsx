import type { ReactNode } from "react";
import { DashboardChatWidget } from "@/components/chat/dashboard-chat-widget";
import { ConfigurationNotice } from "@/components/shared/configuration-notice";
import { hasSupabaseEnv } from "@/lib/env";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!hasSupabaseEnv()) {
    return (
      <ConfigurationNotice
        title="Painel temporariamente indisponível"
        description="As áreas autenticadas do marketplace precisam da configuração pública do Supabase para carregar sessões, dados e permissões com segurança."
        primaryHref="/login"
        primaryLabel="Ir para o login"
        secondaryHref="/"
        secondaryLabel="Voltar para a home"
      />
    );
  }

  return (
    <>
      {children}
      <DashboardChatWidget />
    </>
  );
}
