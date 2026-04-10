"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckCheck,
  MessageCircleMore,
  Minimize2,
  RefreshCw,
  Search,
  SendHorizontal,
  Shield,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ConversationDetailView,
  ConversationSummaryView,
  ConversationViewerRole,
} from "@/lib/conversations";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ConversationsResponse = {
  role: ConversationViewerRole;
  conversations: ConversationSummaryView[];
};

type ConversationDetailResponse = {
  conversation: ConversationDetailView;
};

function formatTimestamp(value: string) {
  const date = new Date(value);
  return isToday(date)
    ? format(date, "HH:mm", { locale: ptBR })
    : format(date, "dd/MM", { locale: ptBR });
}

function formatBubbleTimestamp(value: string) {
  return format(new Date(value), "HH:mm", { locale: ptBR });
}

function getInitials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "VL";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
}

const CHAT_OPEN_STORAGE_KEY = "vlservice-chat-open";
const CHAT_MINIMIZED_STORAGE_KEY = "vlservice-chat-minimized";
const CHAT_ACTIVE_STORAGE_KEY = "vlservice-chat-active-conversation";

export function DashboardChatWidget() {
  const pathname = usePathname();
  const shouldHide = pathname.startsWith("/dashboard/mensagens");
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(CHAT_OPEN_STORAGE_KEY) === "true";
  });
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(CHAT_MINIMIZED_STORAGE_KEY) === "true";
  });
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [role, setRole] = useState<ConversationViewerRole>("client");
  const [conversations, setConversations] = useState<ConversationSummaryView[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationDetailView | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(CHAT_ACTIVE_STORAGE_KEY);
  });
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const supabaseRef = useRef<ReturnType<typeof createSupabaseBrowserClient> | null>(null);

  const resizeTextarea = useCallback((element: HTMLTextAreaElement | null) => {
    if (!element) {
      return;
    }

    element.style.height = "0px";
    element.style.height = `${Math.min(element.scrollHeight, 112)}px`;
  }, []);

  const unreadTotal = useMemo(
    () => conversations.reduce((acc, conversation) => acc + conversation.unreadCount, 0),
    [conversations]
  );

  const filteredConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalizedQuery) return conversations;
    return conversations.filter((conversation) =>
      [
        conversation.counterpartName,
        conversation.counterpartRoleLabel,
        conversation.serviceTitle,
        conversation.lastMessagePreview,
      ]
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(normalizedQuery)
    );
  }, [conversations, query]);

  const loadConversations = useCallback(async (preferConversationId?: string | null) => {
    setIsLoadingList(true);
    const response = await fetch("/api/chat/conversations", { cache: "no-store" });
    if (!response.ok) {
      setIsLoadingList(false);
      return;
    }

    const data = (await response.json()) as ConversationsResponse;
    setRole(data.role);
    setConversations(data.conversations);
    setIsLoadingList(false);

    const nextActiveId =
      preferConversationId ??
      activeConversationId ??
      activeConversation?.id ??
      data.conversations[0]?.id ??
      null;

    const hasNextConversation = data.conversations.some(
      (conversation) => conversation.id === nextActiveId
    );

    setActiveConversationId(
      hasNextConversation ? nextActiveId : (data.conversations[0]?.id ?? null)
    );
  }, [activeConversation?.id, activeConversationId]);

  const loadConversation = useCallback(async (conversationId: string) => {
    setIsLoadingConversation(true);
    const response = await fetch(`/api/chat/conversations/${conversationId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      setActiveConversation(null);
      setIsLoadingConversation(false);
      return;
    }

    const data = (await response.json()) as ConversationDetailResponse;
    setActiveConversation(data.conversation);
    setIsLoadingConversation(false);
  }, []);

  async function handleSendMessage() {
    if (!activeConversationId || !draft.trim() || isSending) {
      return;
    }

    setIsSending(true);
    setNotice(null);
    const response = await fetch("/api/chat/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: activeConversationId,
        body: draft,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { error?: string; redacted?: boolean }
      | null;

    setIsSending(false);

    if (!response.ok) {
      setNotice("Nao foi possivel enviar a mensagem agora.");
      return;
    }

    setDraft("");
    if (payload?.redacted) {
      setNotice("Contato externo mascarado automaticamente para proteger a conversa.");
    }
    await Promise.all([
      loadConversations(activeConversationId),
      loadConversation(activeConversationId),
    ]);
  }

  useEffect(() => {
    window.localStorage.setItem(CHAT_OPEN_STORAGE_KEY, String(isOpen));
  }, [isOpen]);

  useEffect(() => {
    window.localStorage.setItem(CHAT_MINIMIZED_STORAGE_KEY, String(isMinimized));
  }, [isMinimized]);

  useEffect(() => {
    if (activeConversationId) {
      window.localStorage.setItem(CHAT_ACTIVE_STORAGE_KEY, activeConversationId);
    }
  }, [activeConversationId]);

  useEffect(() => {
    if (!isOpen || shouldHide) return;
    const initialTimeout = window.setTimeout(() => {
      void loadConversations(activeConversationId);
    }, 0);
    const interval = window.setInterval(() => {
      void loadConversations(activeConversationId);
    }, 12000);
    return () => {
      window.clearTimeout(initialTimeout);
      window.clearInterval(interval);
    };
  }, [isOpen, shouldHide, activeConversationId, loadConversations]);

  useEffect(() => {
    if (!isOpen || !activeConversationId || shouldHide) return;
    const initialTimeout = window.setTimeout(() => {
      void loadConversation(activeConversationId);
    }, 0);
    const interval = window.setInterval(() => {
      void loadConversation(activeConversationId);
    }, 5000);
    return () => {
      window.clearTimeout(initialTimeout);
      window.clearInterval(interval);
    };
  }, [isOpen, activeConversationId, shouldHide, loadConversation]);

  useEffect(() => {
    if (!isOpen || shouldHide) {
      return;
    }

    try {
      supabaseRef.current ??= createSupabaseBrowserClient();
    } catch {
      return;
    }

    const supabase = supabaseRef.current;
    const channel = supabase
      .channel(`dashboard-chat-widget-${activeConversationId ?? "list"}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversation_messages",
        },
        () => {
          void loadConversations(activeConversationId);
          if (activeConversationId) {
            void loadConversation(activeConversationId);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        () => {
          void loadConversations(activeConversationId);
          if (activeConversationId) {
            void loadConversation(activeConversationId);
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [isOpen, shouldHide, activeConversationId, loadConversation, loadConversations]);

  useEffect(() => {
    if (!threadRef.current) return;
    threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [activeConversation?.messages.length, activeConversation?.id]);

  useEffect(() => {
    resizeTextarea(textareaRef.current);
  }, [draft, resizeTextarea]);

  if (shouldHide) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen((current) => !current);
          setIsMinimized(false);
        }}
        className="fixed right-5 bottom-5 z-40 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#25d366] text-slate-950 shadow-[0_20px_50px_rgba(37,211,102,0.35)] transition hover:scale-[1.02]"
        aria-label="Abrir chat"
      >
        <MessageCircleMore className="h-7 w-7" />
        {unreadTotal > 0 ? (
          <span className="absolute -top-1 -right-1 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white">
            {unreadTotal > 99 ? "99+" : unreadTotal}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <section
          className={cn(
            "fixed right-5 bottom-24 z-40 flex w-[min(96vw,29rem)] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]",
            isMinimized ? "h-auto" : "h-[min(78vh,44rem)]"
          )}
        >
          <div className="flex w-full flex-col">
            <header className="flex items-center gap-3 border-b border-slate-200 bg-[linear-gradient(135deg,#075e54,#128c7e)] px-4 py-4 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 font-semibold">
                {role === "admin" ? "AD" : role === "provider" ? "PR" : "CL"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Chat da plataforma</p>
                <p className="truncate text-xs text-emerald-50/90">
                  {role === "admin"
                    ? "Acesso total a clientes, prestadores e conversas"
                    : "Historico salvo e moderacao ativa"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (activeConversationId) {
                    void Promise.all([
                      loadConversations(activeConversationId),
                      loadConversation(activeConversationId),
                    ]);
                    return;
                  }

                  void loadConversations(activeConversationId);
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
                aria-label="Atualizar chat"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized((current) => !current)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
                aria-label="Minimizar chat"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
                aria-label="Fechar chat"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {!isMinimized ? (
              <div className="grid min-h-0 flex-1 md:grid-cols-[15rem_minmax(0,1fr)]">
                <aside className="border-b border-slate-200 bg-slate-50 md:border-r md:border-b-0">
                  <div className="border-b border-slate-200 px-3 py-3">
                    <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-500">
                      <Search className="h-4 w-4" />
                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Buscar"
                        className="w-full bg-transparent text-sm text-slate-900 outline-none"
                      />
                    </label>
                  </div>
                  <div className="max-h-[16rem] overflow-y-auto md:max-h-none md:h-full">
                    {isLoadingList && conversations.length === 0 ? (
                      <p className="px-4 py-6 text-sm text-slate-500">Carregando conversas...</p>
                    ) : filteredConversations.length > 0 ? (
                      filteredConversations.map((conversation) => (
                        <button
                          key={conversation.id}
                          type="button"
                          onClick={() => {
                            setActiveConversationId(conversation.id);
                            setNotice(null);
                          }}
                          className={cn(
                            "flex w-full items-start gap-3 border-b border-slate-100 px-3 py-3 text-left transition hover:bg-white",
                            activeConversationId === conversation.id && "bg-white"
                          )}
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                            {getInitials(conversation.counterpartName)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-sm font-semibold text-slate-950">
                                {conversation.counterpartName}
                              </p>
                              <span className="text-[11px] text-slate-400">
                                {formatTimestamp(conversation.lastMessageAt)}
                              </span>
                            </div>
                            <p className="truncate text-xs text-slate-500">
                              {conversation.serviceTitle}
                            </p>
                            <div className="mt-1 flex items-center gap-1">
                              {conversation.isLastMessageMine ? (
                                <CheckCheck className="h-3.5 w-3.5 text-sky-500" />
                              ) : null}
                              <p className="truncate text-xs text-slate-500">
                                {conversation.lastMessagePreview}
                              </p>
                            </div>
                          </div>
                          {conversation.unreadCount > 0 ? (
                            <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[11px] font-bold text-white">
                              {conversation.unreadCount}
                            </span>
                          ) : null}
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-6 text-sm text-slate-500">
                        Nenhuma conversa encontrada.
                      </p>
                    )}
                  </div>
                </aside>

                <div className="flex min-h-0 flex-1 flex-col">
                  {activeConversation ? (
                    <>
                      <div className="border-b border-slate-200 bg-white px-4 py-3">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {activeConversation.counterpartName}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {activeConversation.counterpartRoleLabel} em {activeConversation.serviceTitle}
                        </p>
                      </div>

                      <div
                        ref={threadRef}
                        className="flex-1 overflow-y-auto bg-[#efeae2] px-3 py-4"
                      >
                        {isLoadingConversation && activeConversation.messages.length === 0 ? (
                          <p className="text-sm text-slate-500">Carregando conversa...</p>
                        ) : activeConversation.messages.length > 0 ? (
                          <div className="space-y-3">
                            {activeConversation.messages.map((message) =>
                              message.kind === "text" ? (
                                <div
                                  key={message.id}
                                  className={cn(
                                    "flex",
                                    message.isMine ? "justify-end" : "justify-start"
                                  )}
                                >
                                  <article
                                    className={cn(
                                      "max-w-[88%] rounded-[1.35rem] px-4 py-3 text-sm shadow-sm",
                                      message.isMine
                                        ? "bg-[#d9fdd3] text-slate-900"
                                        : "bg-white text-slate-900"
                                    )}
                                  >
                                    <p className="whitespace-pre-wrap">{message.body}</p>
                                    <p className="mt-2 text-right text-[11px] text-slate-500">
                                      {formatBubbleTimestamp(message.createdAt)}
                                    </p>
                                  </article>
                                </div>
                              ) : (
                                <div key={message.id} className="flex justify-center">
                                  <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-center text-[11px] font-medium text-slate-600">
                                    {message.body}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-500">
                            A conversa esta pronta para comecar.
                          </div>
                        )}
                      </div>

                      <div className="border-t border-slate-200 bg-white px-4 py-2 text-[11px] text-slate-500">
                        <div className="flex items-center gap-2">
                          <Shield className="h-3.5 w-3.5" />
                          {activeConversation.policyNote}
                        </div>
                        {notice ? <p className="mt-2 text-amber-700">{notice}</p> : null}
                      </div>

                      <div className="border-t border-slate-200 bg-white px-3 py-3">
                        <div className="flex items-end gap-2 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-3 py-3">
                          <textarea
                            ref={textareaRef}
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            rows={1}
                            disabled={activeConversation.status === "closed"}
                            placeholder={
                              activeConversation.status === "closed"
                                ? "Conversa encerrada pelo administrador."
                                : "Escreva uma mensagem"
                            }
                            className="max-h-28 min-h-[1.6rem] w-full resize-none bg-transparent text-sm text-slate-900 outline-none"
                            onInput={(event) => resizeTextarea(event.currentTarget)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault();
                                void handleSendMessage();
                              }
                            }}
                          />
                          <button
                            type="button"
                            disabled={isSending || activeConversation.status === "closed"}
                            onClick={() => void handleSendMessage()}
                            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-slate-950 disabled:opacity-50"
                            aria-label="Enviar mensagem"
                          >
                            <SendHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="text-[11px] text-slate-500">
                            {activeConversation.statusLabel}
                          </span>
                          <Link
                            href={activeConversationId ? `/dashboard/mensagens/${activeConversationId}` : "/dashboard/mensagens"}
                            className="text-[11px] font-semibold text-primary-strong"
                          >
                            Abrir inbox completa
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-slate-500">
                      Selecione uma conversa para continuar.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white px-4 py-3 text-sm text-slate-600">
                Chat minimizado. {unreadTotal > 0 ? `${unreadTotal} mensagem(ns) pendente(s).` : "Nenhuma pendencia no momento."}
              </div>
            )}
          </div>
        </section>
      ) : null}
    </>
  );
}
