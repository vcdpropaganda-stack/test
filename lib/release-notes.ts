export type ReleaseNote = {
  id: string;
  versionLabel: string;
  title: string;
  dateIso: string;
  dateLabel: string;
  summary: string;
  changes: string[];
};

export const releaseNotes: ReleaseNote[] = [
  {
    id: "2026-04-10-chat-admin-realtime",
    versionLabel: "v2026.04.10",
    title: "Chat global, admin operacional e realtime",
    dateIso: "2026-04-10",
    dateLabel: "10 de abril de 2026",
    summary:
      "Nova rodada de operação com chat flutuante, moderação administrativa, auditoria e atualização quase em tempo real das conversas.",
    changes: [
      "Chat global estilo WhatsApp nas áreas autenticadas do dashboard.",
      "Inbox admin com filtros, moderação por motivo e trilha de auditoria.",
      "Sincronização quase em tempo real das conversas com Supabase Realtime.",
      "Persistência de leitura e base de governança para moderação de conversas.",
    ],
  },
  {
    id: "2026-04-04-demo-ux",
    versionLabel: "v2026.04.04",
    title: "Demo interna, hardening visual e correções do hero",
    dateIso: "2026-04-04",
    dateLabel: "4 de abril de 2026",
    summary:
      "Rodada de acabamento da demo com melhorias visuais, seed completo e validação dos fluxos principais.",
    changes: [
      "Blindagem de contraste nos CTAs principais e no header.",
      "Correção do hero com fallback local para prova social e imagens mais estáveis.",
      "Seed demo completo com contas fake, pedidos, propostas, chat, bookings, reviews e créditos.",
      "Documentação da demo, roteiro de apresentação e scripts de verificação/reset.",
    ],
  },
];

export const latestRelease = releaseNotes[0];

export function getReleaseHref(release: ReleaseNote) {
  return `/atualizacoes#${release.id}`;
}
