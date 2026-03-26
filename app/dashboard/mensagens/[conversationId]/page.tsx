import type { Metadata } from "next";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { redirect } from "next/navigation";
import { sendConversationMessageAction } from "@/app/dashboard/mensagens/actions";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { TextareaField } from "@/components/ui/textarea";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Conversa | VL Serviços",
  description: "Conversa interna entre cliente e prestador.",
};

type ConversationDetailPageProps = {
  params: Promise<{ conversationId: string }>;
  searchParams: Promise<{ message?: string }>;
};

export default async function ConversationDetailPage({
  params,
  searchParams,
}: ConversationDetailPageProps) {
  const { conversationId } = await params;
  const { message } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const conversationResult = await supabase
    .from("conversations")
    .select(
      `
      id,
      client_id,
      provider_profile_id,
      service:services(title, slug),
      client:profiles(full_name),
      provider_profile:provider_profiles(profile_id, display_name, whatsapp_number)
    `
    )
    .eq("id", conversationId)
    .single();

  if (conversationResult.error || !conversationResult.data) {
    redirect("/dashboard/mensagens?message=Conversa não encontrada.");
  }

  const conversation = {
    ...conversationResult.data,
    service: Array.isArray(conversationResult.data.service)
      ? conversationResult.data.service[0] ?? null
      : conversationResult.data.service,
    client: Array.isArray(conversationResult.data.client)
      ? conversationResult.data.client[0] ?? null
      : conversationResult.data.client,
    provider_profile: Array.isArray(conversationResult.data.provider_profile)
      ? conversationResult.data.provider_profile[0] ?? null
      : conversationResult.data.provider_profile,
  };

  const isClient = conversation.client_id === user.id;
  const isProvider = conversation.provider_profile?.profile_id === user.id;

  if (!isClient && !isProvider) {
    redirect("/dashboard/mensagens?message=Acesso negado à conversa.");
  }

  const messagesResult = await supabase
    .from("conversation_messages")
    .select("id, sender_id, kind, body, created_at, sender:profiles(full_name)")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  const messages = (messagesResult.data ?? []).map((item) => ({
    ...item,
    sender: Array.isArray(item.sender) ? item.sender[0] ?? null : item.sender,
  }));

  return (
    <main id="conteudo" className="page-shell py-10 sm:py-16">
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
            <p className="text-sm text-muted-strong">Conversa sobre</p>
            <h1 className="mt-2 font-sans text-3xl font-bold tracking-tight text-slate-950">
              {conversation.service?.title ?? "Serviço"}
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted-strong">
              {isClient
                ? `Prestador: ${conversation.provider_profile?.display_name ?? "Prestador"}`
                : `Cliente: ${conversation.client?.full_name ?? "Cliente"}`}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/dashboard/mensagens" className="inline-flex">
                <Button variant="secondary">Voltar para mensagens</Button>
              </Link>
              {conversation.service?.slug ? (
                <Link href={`/servicos/${conversation.service.slug}`} className="inline-flex">
                  <Button variant="ghost">Abrir serviço</Button>
                </Link>
              ) : null}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-950">Contato e alinhamento</p>
            <p className="mt-3 text-sm leading-7 text-muted-strong">
              Todo o histórico desta conversa fica registrado com data e horário. Por segurança, números e
              contatos diretos são mascarados automaticamente.
            </p>
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
              Política ativa: envio de telefone, WhatsApp e contato externo é bloqueado no chat.
            </div>
          </div>
        </aside>

        <section className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
          {message ? (
            <div className="mb-5">
              <Notice>{message}</Notice>
            </div>
          ) : null}
          <div className="max-h-[56vh] space-y-3 overflow-y-auto rounded-[1.5rem] border border-slate-100 bg-slate-50/65 p-3 sm:p-4">
            {messages.length > 0 ? (
              messages.map((msg) => {
                const isMine = msg.sender_id === user.id;
                return (
                  <article
                    key={msg.id}
                    className={`max-w-[92%] rounded-[1.5rem] px-4 py-3 ${
                      isMine
                        ? "ml-auto bg-primary text-white"
                        : msg.kind === "whatsapp_share"
                          ? "bg-emerald-50 text-slate-950"
                          : "bg-slate-100 text-slate-950"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">
                      {msg.kind === "whatsapp_request"
                        ? "Pedido de WhatsApp"
                        : msg.kind === "whatsapp_share"
                          ? "WhatsApp compartilhado"
                          : msg.sender?.full_name ?? "Mensagem"}
                    </p>
                    <p className="mt-2 text-sm leading-7 whitespace-pre-wrap">{msg.body}</p>
                    <p className="mt-2 text-[11px] opacity-70">
                      {format(new Date(msg.created_at), "dd/MM 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </p>
                  </article>
                );
              })
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-border bg-surface p-6">
                <p className="font-semibold text-slate-950">Nenhuma mensagem ainda.</p>
                <p className="mt-3 text-sm leading-7 text-muted-strong">
                  Envie a primeira mensagem para começar o alinhamento.
                </p>
              </div>
            )}
          </div>

          <form action={sendConversationMessageAction} className="mt-6 space-y-4">
            <input type="hidden" name="conversation_id" value={conversationId} />
            <TextareaField
              name="body"
              label="Nova mensagem"
              placeholder="Escreva sua mensagem. Contatos diretos serão ocultados automaticamente."
              hint="Este chat é monitorado e mantém histórico completo da conversa."
              rows={4}
              required
            />
            <Button type="submit">Enviar mensagem</Button>
          </form>
        </section>
      </div>
    </main>
  );
}
