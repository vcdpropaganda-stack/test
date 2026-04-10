"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { format, isSameDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCheck,
  ChevronRight,
  Lock,
  MessageCircleMore,
  Search,
  Shield,
} from "lucide-react";
import { Notice } from "@/components/ui/notice";
import { ChatComposer } from "@/components/chat/chat-composer";
import {
  type ConversationDetailView,
  type ConversationSummaryView,
  type ConversationViewerRole,
} from "@/lib/conversations";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type ChatShellProps = {
  role: ConversationViewerRole;
  conversations: ConversationSummaryView[];
  activeConversation?: ConversationDetailView | null;
  notice?: string | null;
};

type AvatarProps = {
  name: string;
  initials: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
};

function ChatAvatar({ name, initials, imageUrl, size = "md" }: AvatarProps) {
  const dimensions =
    size === "sm"
      ? "h-10 w-10 text-sm"
      : size === "lg"
        ? "h-14 w-14 text-base"
        : "h-12 w-12 text-sm";

  if (imageUrl) {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-full border border-white/70 bg-slate-200 shadow-sm",
          dimensions
        )}
        aria-label={name}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f172a,#334155)] font-semibold tracking-[0.08em] text-white shadow-sm",
        dimensions
      )}
      aria-label={name}
    >
      {initials}
    </div>
  );
}

function formatSidebarTimestamp(value: string) {
  const date = new Date(value);

  if (isToday(date)) {
    return format(date, "HH:mm", { locale: ptBR });
  }

  return format(date, "dd/MM", { locale: ptBR });
}

function formatMessageTimestamp(value: string) {
  return format(new Date(value), "HH:mm", { locale: ptBR });
}

function formatDayLabel(value: string) {
  const date = new Date(value);

  if (isToday(date)) {
    return "Hoje";
  }

  return format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
}

function SystemMessageBubble({
  kind,
  body,
}: {
  kind: ConversationDetailView["messages"][number]["kind"];
  body: string;
}) {
  const tone =
    kind === "whatsapp_request"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : kind === "whatsapp_share"
        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
        : "border-white/80 bg-white/88 text-slate-700";

  return (
    <div className="mx-auto max-w-xl px-4">
      <div
        className={cn(
          "rounded-full border px-4 py-2 text-center text-xs font-medium shadow-sm",
          tone
        )}
      >
        {body}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
}: {
  message: ConversationDetailView["messages"][number];
}) {
  if (message.kind !== "text") {
    return <SystemMessageBubble kind={message.kind} body={message.body} />;
  }

  return (
    <div className={cn("flex px-2 sm:px-4", message.isMine ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[88%] items-end gap-2", message.isMine && "flex-row-reverse")}>
        {!message.isMine ? (
          <ChatAvatar
            name={message.senderName}
            initials={message.senderInitials}
            imageUrl={message.senderAvatarUrl}
            size="sm"
          />
        ) : null}

        <article
          className={cn(
            "relative rounded-[1.35rem] px-4 py-3 text-[15px] leading-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)]",
            message.isMine
              ? "bg-[#d9fdd3] text-slate-900"
              : "bg-white text-slate-900"
          )}
        >
          <span
            className={cn(
              "absolute top-3 h-3.5 w-3.5 rotate-45",
              message.isMine
                ? "right-[-0.28rem] bg-[#d9fdd3]"
                : "left-[-0.28rem] bg-white"
            )}
          />
          <p className="relative whitespace-pre-wrap">{message.body}</p>
          <div
            className={cn(
              "relative mt-2 flex items-center gap-1 text-[11px]",
              message.isMine ? "justify-end text-slate-500" : "justify-end text-slate-400"
            )}
          >
            <span>{formatMessageTimestamp(message.createdAt)}</span>
            {message.isMine ? <CheckCheck className="h-3.5 w-3.5 text-[#34b7f1]" /> : null}
          </div>
        </article>
      </div>
    </div>
  );
}

function ConversationThread({
  activeConversation,
  notice,
}: {
  activeConversation: ConversationDetailView;
  notice?: string | null;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeConversation.id, activeConversation.messages.length]);

  return (
    <section className="flex min-h-[70svh] flex-1 flex-col bg-[#efeae2]">
      <header className="border-b border-slate-200 bg-white/88 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/mensagens"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 lg:hidden"
            aria-label="Voltar para a lista de conversas"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <ChatAvatar
            name={activeConversation.counterpartName}
            initials={activeConversation.counterpartInitials}
            imageUrl={activeConversation.counterpartAvatarUrl}
          />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-950">
              {activeConversation.counterpartName}
            </p>
            <p className="truncate text-sm text-slate-500">
              {activeConversation.counterpartRoleLabel} em {activeConversation.serviceTitle}
            </p>
          </div>
          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {activeConversation.statusLabel}
            </span>
            {activeConversation.serviceSlug ? (
              <Link
                href={`/servicos/${activeConversation.serviceSlug}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-300"
              >
                Abrir servico
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      {notice ? (
        <div className="px-3 pt-3 sm:px-5 sm:pt-4">
          <Notice>{notice}</Notice>
        </div>
      ) : null}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-1 py-4 [background-image:radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] [background-position:0_0] [background-size:24px_24px] [content-visibility:auto] sm:px-3"
      >
        <div className="space-y-3 pb-4">
          {activeConversation.messages.length > 0 ? (
            activeConversation.messages.map((message, index) => {
              const previous = activeConversation.messages[index - 1];
              const showDayDivider =
                !previous ||
                !isSameDay(new Date(previous.createdAt), new Date(message.createdAt));

              return (
                <div key={message.id} className="space-y-3">
                  {showDayDivider ? (
                    <div className="flex justify-center px-4">
                      <div className="rounded-full bg-white/88 px-4 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
                        {formatDayLabel(message.createdAt)}
                      </div>
                    </div>
                  ) : null}
                  <MessageBubble message={message} />
                </div>
              );
            })
          ) : (
            <div className="flex h-full items-center justify-center px-6 py-16">
              <div className="max-w-md rounded-[2rem] border border-white/80 bg-white/88 p-8 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white">
                  <MessageCircleMore className="h-6 w-6" />
                </div>
                <p className="mt-5 text-lg font-semibold text-slate-950">
                  Nenhuma mensagem ainda
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  A conversa ja esta pronta para alinhamento. Envie a primeira mensagem e mantenha tudo dentro da plataforma.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white/88 px-4 py-2 text-[11px] text-slate-500 backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5" />
          {activeConversation.policyNote}
        </div>
      </div>
      <ChatComposer conversationId={activeConversation.id} />
    </section>
  );
}

function EmptyThread() {
  return (
    <section className="hidden flex-1 items-center justify-center bg-[linear-gradient(180deg,#f8fafc,#eef2ff)] lg:flex">
      <div className="max-w-lg px-10 text-center">
        <div className="mx-auto inline-flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[2rem] bg-slate-950 text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
          <MessageCircleMore className="h-8 w-8" />
        </div>
        <h2 className="mt-6 font-sans text-3xl font-bold tracking-tight text-slate-950">
          Escolha uma conversa para continuar o atendimento
        </h2>
        <p className="mt-4 text-base leading-8 text-slate-600">
          A lista ao lado funciona como inbox operacional. Abra uma thread para responder com contexto, historico e protecao de contato.
        </p>
      </div>
    </section>
  );
}

export function ChatShell({
  role,
  conversations,
  activeConversation,
  notice,
}: ChatShellProps) {
  const [liveConversations, setLiveConversations] = useState(conversations);
  const [liveActiveConversation, setLiveActiveConversation] = useState(activeConversation ?? null);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase("pt-BR"));

  useEffect(() => {
    setLiveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    setLiveActiveConversation(activeConversation ?? null);
  }, [activeConversation]);

  useEffect(() => {
    if (!liveActiveConversation?.id) {
      return;
    }

    const activeConversationId = liveActiveConversation.id;
    let ignore = false;
    let supabase;

    try {
      supabase = createSupabaseBrowserClient();
    } catch {
      return;
    }

    async function refreshConversations() {
      const response = await fetch("/api/chat/conversations", { cache: "no-store" });

      if (!response.ok || ignore) {
        return;
      }

      const data = (await response.json()) as {
        conversations: ConversationSummaryView[];
      };

      if (!ignore) {
        setLiveConversations(data.conversations);
      }
    }

    async function refreshActiveConversation() {
      const response = await fetch(`/api/chat/conversations/${activeConversationId}`, {
        cache: "no-store",
      });

      if (!response.ok || ignore) {
        return;
      }

      const data = (await response.json()) as {
        conversation: ConversationDetailView;
      };

      if (!ignore) {
        setLiveActiveConversation(data.conversation);
      }
    }

    const channel = supabase
      .channel(`chat-shell-${liveActiveConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversation_messages",
          filter: `conversation_id=eq.${activeConversationId}`,
        },
        () => {
          void refreshConversations();
          void refreshActiveConversation();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `id=eq.${activeConversationId}`,
        },
        () => {
          void refreshConversations();
          void refreshActiveConversation();
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      void supabase.removeChannel(channel);
    };
  }, [liveActiveConversation?.id]);

  const filteredConversations = deferredQuery
    ? liveConversations.filter((conversation) =>
        [
          conversation.serviceTitle,
          conversation.counterpartName,
          conversation.lastMessagePreview,
          conversation.counterpartRoleLabel,
        ]
          .join(" ")
          .toLocaleLowerCase("pt-BR")
          .includes(deferredQuery)
      )
    : liveConversations;

  const moderationBanner = useMemo(() => {
    if (!liveActiveConversation?.moderationReason) {
      return null;
    }

    if (liveActiveConversation.moderationStatus === "restricted") {
      return {
        className: "border-amber-200 bg-amber-50 text-amber-900",
        text: `Conversa sob restrição administrativa: ${liveActiveConversation.moderationReason}`,
      };
    }

    if (liveActiveConversation.moderationStatus === "flagged") {
      return {
        className: "border-rose-200 bg-rose-50 text-rose-900",
        text: `Conversa sinalizada pela administração: ${liveActiveConversation.moderationReason}`,
      };
    }

    return {
      className: "border-emerald-200 bg-emerald-50 text-emerald-900",
      text: `Atualização administrativa registrada: ${liveActiveConversation.moderationReason}`,
    };
  }, [liveActiveConversation]);

  return (
    <main id="conteudo" className="page-shell py-4 sm:py-6">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.10)]">
        <div className="grid min-h-[calc(100svh-9rem)] lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside
            className={cn(
              "flex min-h-[70svh] flex-col border-r border-slate-200 bg-[#f7f8fa]",
              activeConversation && "hidden lg:flex"
            )}
          >
            <div className="border-b border-slate-200 bg-white px-4 py-5 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.72rem] font-semibold tracking-[0.24em] text-slate-500 uppercase">
                    Inbox
                  </p>
                  <h1 className="mt-2 font-sans text-3xl font-bold tracking-tight text-slate-950">
                    Mensagens
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    {role === "provider"
                      ? "Converse com clientes em um fluxo de atendimento mais natural."
                      : "Acompanhe respostas de prestadores sem sair da plataforma."}
                  </p>
                </div>
                <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {liveConversations.length} thread(s)
                </div>
              </div>

              <label className="mt-4 flex items-center gap-3 rounded-[1.3rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500">
                <Search className="h-4 w-4 shrink-0" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar conversa, servico ou pessoa"
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500"
                  aria-label="Buscar conversas"
                />
              </label>

              {notice && !liveActiveConversation ? (
                <div className="mt-4">
                  <Notice>{notice}</Notice>
                </div>
              ) : null}
            </div>

            <div className="flex-1 overflow-y-auto p-2 [content-visibility:auto]">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => {
                  const isActive = liveActiveConversation?.id === conversation.id;

                  return (
                    <Link
                      key={conversation.id}
                      href={`/dashboard/mensagens/${conversation.id}`}
                      className={cn(
                        "mb-1.5 flex items-start gap-3 rounded-[1.5rem] px-3 py-3 transition",
                        isActive
                          ? "bg-[#e9f2ff] shadow-[inset_0_0_0_1px_rgba(59,130,246,0.12)]"
                          : "hover:bg-white"
                      )}
                    >
                      <ChatAvatar
                        name={conversation.counterpartName}
                        initials={conversation.counterpartInitials}
                        imageUrl={conversation.counterpartAvatarUrl}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-950">
                              {conversation.counterpartName}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-slate-500">
                              {conversation.serviceTitle}
                            </p>
                          </div>
                          <div className="shrink-0 text-[11px] text-slate-400">
                            {formatSidebarTimestamp(conversation.lastMessageAt)}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          {conversation.isLastMessageMine ? (
                            <CheckCheck className="h-3.5 w-3.5 shrink-0 text-[#34b7f1]" />
                          ) : null}
                          <p className="truncate text-sm text-slate-500">
                            {conversation.lastMessagePreview}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <span className="text-[11px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
                            {conversation.counterpartRoleLabel}
                          </span>
                          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500 shadow-sm">
                            {conversation.statusLabel}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-slate-300" />
                    </Link>
                  );
                })
              ) : (
                <div className="px-3 py-8 text-center">
                  <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                    <Search className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-base font-semibold text-slate-950">
                    {liveConversations.length > 0 ? "Nenhuma conversa encontrada" : "Sua inbox esta vazia"}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    {liveConversations.length > 0
                      ? "Tente outro termo de busca para localizar a thread certa."
                      : "Assim que um cliente ou prestador iniciar contato, a conversa aparece aqui."}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 bg-white px-4 py-3 text-[11px] text-slate-500 sm:px-5">
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" />
                Historico seguro, moderacao ativa e contexto salvo na plataforma.
              </div>
            </div>
          </aside>

          {liveActiveConversation ? (
            <div className="flex min-h-0 flex-1 flex-col">
              {moderationBanner ? (
                <div className="px-3 pt-3 sm:px-5 sm:pt-4">
                  <div
                    className={cn(
                      "rounded-[1.2rem] border px-4 py-3 text-sm",
                      moderationBanner.className
                    )}
                  >
                    {moderationBanner.text}
                  </div>
                </div>
              ) : null}
              <ConversationThread activeConversation={liveActiveConversation} notice={notice} />
            </div>
          ) : (
            <EmptyThread />
          )}
        </div>
      </div>
    </main>
  );
}
