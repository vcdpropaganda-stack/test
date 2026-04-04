import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ConversationContext = {
  serviceId: string;
  providerProfileId: string;
  clientId: string;
  bookingId?: string | null;
};

type RawMaybeArray<T> = T | T[] | null;

type RawProfile = RawMaybeArray<{
  full_name?: string | null;
  avatar_url?: string | null;
}>;

type RawService = RawMaybeArray<{
  title?: string | null;
  slug?: string | null;
}>;

type RawProviderProfile = RawMaybeArray<{
  id?: string;
  profile_id?: string;
  display_name?: string | null;
  whatsapp_number?: string | null;
  profile?: RawProfile;
}>;

type RawConversationMessageSender = RawMaybeArray<{
  full_name?: string | null;
  avatar_url?: string | null;
}>;

export type ConversationViewerRole = "client" | "provider" | "admin";

export type ConversationSummaryView = {
  id: string;
  status: "open" | "closed";
  statusLabel: string;
  serviceTitle: string;
  serviceSlug: string | null;
  counterpartName: string;
  counterpartRoleLabel: string;
  counterpartAvatarUrl: string | null;
  counterpartInitials: string;
  lastMessagePreview: string;
  lastMessageAt: string;
  isLastMessageMine: boolean;
};

export type ConversationMessageView = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl: string | null;
  senderInitials: string;
  body: string;
  kind: "text" | "system" | "whatsapp_request" | "whatsapp_share";
  createdAt: string;
  isMine: boolean;
};

export type ConversationDetailView = {
  id: string;
  status: "open" | "closed";
  statusLabel: string;
  serviceTitle: string;
  serviceSlug: string | null;
  counterpartName: string;
  counterpartRoleLabel: string;
  counterpartAvatarUrl: string | null;
  counterpartInitials: string;
  policyNote: string;
  messages: ConversationMessageView[];
};

function unwrapRelation<T>(value: RawMaybeArray<T> | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function clampText(value: string, maxLength = 88) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}...`;
}

export function getConversationStatusLabel(status: "open" | "closed") {
  return status === "closed" ? "Encerrada" : "Ativa";
}

export function getMessagePreviewLabel(
  kind: "text" | "system" | "whatsapp_request" | "whatsapp_share",
  body: string | null | undefined
) {
  if (kind === "whatsapp_request") {
    return "Solicitacao de contato registrada";
  }

  if (kind === "whatsapp_share") {
    return "Contato direto bloqueado pela politica";
  }

  if (kind === "system") {
    return clampText(body ?? "Atualizacao do sistema", 72);
  }

  return clampText(body ?? "", 84) || "Conversa iniciada";
}

export function getParticipantInitials(name: string) {
  const parts = name
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return "VL";
  }

  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }

  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

async function getProviderProfileIdForUser(
  supabase: SupabaseClient,
  userId: string
) {
  const providerProfileResult = await supabase
    .from("provider_profiles")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();

  return providerProfileResult.data?.id ?? null;
}

export async function getConversationListForViewer(
  supabase: SupabaseClient,
  viewer: User,
  role: ConversationViewerRole
) {
  let providerProfileId: string | null = null;

  if (role === "provider") {
    providerProfileId = await getProviderProfileIdForUser(supabase, viewer.id);

    if (!providerProfileId) {
      return [] as ConversationSummaryView[];
    }
  }

  let query = supabase
    .from("conversations")
    .select(
      `
      id,
      client_id,
      provider_profile_id,
      status,
      created_at,
      updated_at,
      service:services(title, slug),
      client:profiles(full_name, avatar_url),
      provider_profile:provider_profiles(
        id,
        profile_id,
        display_name,
        whatsapp_number,
        profile:profiles(full_name, avatar_url)
      )
    `
    )
    .order("updated_at", { ascending: false });

  if (role === "client") {
    query = query.eq("client_id", viewer.id);
  } else if (role === "provider" && providerProfileId) {
    query = query.eq("provider_profile_id", providerProfileId);
  }

  const conversationsResult = await query;
  const conversationRecords = (conversationsResult.data ?? []).map((conversation) => {
    const service = unwrapRelation(conversation.service as RawService);
    const client = unwrapRelation(conversation.client as RawProfile);
    const providerProfile = unwrapRelation(
      conversation.provider_profile as RawProviderProfile
    );
    const providerLinkedProfile = unwrapRelation(
      providerProfile?.profile as RawProfile | undefined
    );

    return {
      id: conversation.id,
      client_id: conversation.client_id,
      provider_profile_id: conversation.provider_profile_id,
      status: conversation.status as "open" | "closed",
      updated_at: conversation.updated_at,
      service,
      client,
      providerProfile,
      providerLinkedProfile,
    };
  });

  const conversationIds = conversationRecords.map((conversation) => conversation.id);
  const lastMessagesResult =
    conversationIds.length > 0
      ? await supabase
          .from("conversation_messages")
          .select("conversation_id, sender_id, kind, body, created_at")
          .in("conversation_id", conversationIds)
          .order("created_at", { ascending: false })
      : { data: [], error: null };

  const lastMessageMap = new Map<
    string,
    {
      sender_id: string;
      kind: "text" | "system" | "whatsapp_request" | "whatsapp_share";
      body: string | null;
      created_at: string;
    }
  >();

  for (const message of lastMessagesResult.data ?? []) {
    if (!lastMessageMap.has(message.conversation_id)) {
      lastMessageMap.set(message.conversation_id, {
        sender_id: message.sender_id,
        kind: message.kind,
        body: message.body,
        created_at: message.created_at,
      });
    }
  }

  return conversationRecords.map((conversation) => {
    const isProviderViewer =
      role === "provider" && conversation.providerProfile?.profile_id === viewer.id;
    const counterpartName = isProviderViewer
      ? conversation.client?.full_name ?? "Cliente"
      : conversation.providerProfile?.display_name ?? "Prestador";
    const counterpartAvatarUrl = isProviderViewer
      ? conversation.client?.avatar_url ?? null
      : conversation.providerLinkedProfile?.avatar_url ?? null;
    const lastMessage = lastMessageMap.get(conversation.id);

    return {
      id: conversation.id,
      status: conversation.status,
      statusLabel: getConversationStatusLabel(conversation.status),
      serviceTitle: conversation.service?.title ?? "Conversa da plataforma",
      serviceSlug: conversation.service?.slug ?? null,
      counterpartName,
      counterpartRoleLabel: isProviderViewer ? "Cliente" : "Prestador",
      counterpartAvatarUrl,
      counterpartInitials: getParticipantInitials(counterpartName),
      lastMessagePreview: getMessagePreviewLabel(
        lastMessage?.kind ?? "system",
        lastMessage?.body ?? "Conversa iniciada"
      ),
      lastMessageAt: lastMessage?.created_at ?? conversation.updated_at,
      isLastMessageMine: lastMessage?.sender_id === viewer.id,
    } satisfies ConversationSummaryView;
  });
}

export async function getConversationDetailForViewer(
  supabase: SupabaseClient,
  conversationId: string,
  viewer: User
) {
  const conversationResult = await supabase
    .from("conversations")
    .select(
      `
      id,
      status,
      client_id,
      provider_profile_id,
      service:services(title, slug),
      client:profiles(full_name, avatar_url),
      provider_profile:provider_profiles(
        id,
        profile_id,
        display_name,
        whatsapp_number,
        profile:profiles(full_name, avatar_url)
      )
    `
    )
    .eq("id", conversationId)
    .maybeSingle();

  if (conversationResult.error || !conversationResult.data) {
    return null;
  }

  const service = unwrapRelation(conversationResult.data.service as RawService);
  const client = unwrapRelation(conversationResult.data.client as RawProfile);
  const providerProfile = unwrapRelation(
    conversationResult.data.provider_profile as RawProviderProfile
  );
  const providerLinkedProfile = unwrapRelation(
    providerProfile?.profile as RawProfile | undefined
  );
  const isClient = conversationResult.data.client_id === viewer.id;
  const isProvider = providerProfile?.profile_id === viewer.id;

  if (!isClient && !isProvider) {
    return null;
  }

  const messagesResult = await supabase
    .from("conversation_messages")
    .select(
      `
      id,
      sender_id,
      kind,
      body,
      created_at,
      sender:profiles(full_name, avatar_url)
    `
    )
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  const counterpartName = isClient
    ? providerProfile?.display_name ?? "Prestador"
    : client?.full_name ?? "Cliente";
  const counterpartAvatarUrl = isClient
    ? providerLinkedProfile?.avatar_url ?? null
    : client?.avatar_url ?? null;

  const messages = (messagesResult.data ?? []).map((message) => {
    const sender = unwrapRelation(message.sender as RawConversationMessageSender);
    const senderName =
      message.kind === "system"
        ? "Sistema"
        : message.kind === "whatsapp_request"
          ? "Solicitacao de contato"
          : message.kind === "whatsapp_share"
            ? "Contato direto"
            : sender?.full_name ??
              (message.sender_id === viewer.id ? "Voce" : counterpartName);

    return {
      id: message.id,
      senderId: message.sender_id,
      senderName,
      senderAvatarUrl: sender?.avatar_url ?? null,
      senderInitials: getParticipantInitials(senderName),
      body: message.body ?? "",
      kind: message.kind,
      createdAt: message.created_at,
      isMine: message.sender_id === viewer.id,
    } satisfies ConversationMessageView;
  });

  return {
    id: conversationResult.data.id,
    status: conversationResult.data.status as "open" | "closed",
    statusLabel: getConversationStatusLabel(
      conversationResult.data.status as "open" | "closed"
    ),
    serviceTitle: service?.title ?? "Conversa da plataforma",
    serviceSlug: service?.slug ?? null,
    counterpartName,
    counterpartRoleLabel: isClient ? "Prestador" : "Cliente",
    counterpartAvatarUrl,
    counterpartInitials: getParticipantInitials(counterpartName),
    policyNote:
      "Por seguranca, numeros, WhatsApp e contatos externos sao mascarados automaticamente.",
    messages,
  } satisfies ConversationDetailView;
}

export async function ensureConversation({
  serviceId,
  providerProfileId,
  clientId,
  bookingId = null,
}: ConversationContext) {
  const supabase = await createSupabaseServerClient();

  if (bookingId) {
    const existingByBooking = await supabase
      .from("conversations")
      .select("id")
      .eq("booking_id", bookingId)
      .limit(1)
      .maybeSingle();

    if (existingByBooking.data?.id) {
      return existingByBooking.data.id;
    }
  }

  const existing = await supabase
    .from("conversations")
    .select("id, booking_id")
    .eq("service_id", serviceId)
    .eq("provider_profile_id", providerProfileId)
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing.data?.id) {
    if (bookingId && !existing.data.booking_id) {
      const updated = await supabase
        .from("conversations")
        .update({ booking_id: bookingId })
        .eq("id", existing.data.id);

      if (updated.error) {
        console.error("ensureConversation update failed", {
          conversationId: existing.data.id,
          bookingId,
          error: updated.error,
        });
        throw new Error("conversation_update_failed");
      }
    }

    return existing.data.id;
  }

  if (!bookingId) {
    const providerPlanResult = await supabase
      .from("provider_profiles")
      .select("plan")
      .eq("id", providerProfileId)
      .maybeSingle();

    const providerPlan = providerPlanResult.data?.plan ?? "basic";
    const limitsResult = await supabase
      .from("subscription_limits")
      .select("max_quote_requests_per_month")
      .eq("plan", providerPlan)
      .maybeSingle();

    const monthlyLimit = limitsResult.data?.max_quote_requests_per_month ?? null;

    if (monthlyLimit !== null) {
      const now = new Date();
      const monthStartUtc = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0)
      );

      const monthlyQuotesCount = await supabase
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .eq("provider_profile_id", providerProfileId)
        .is("booking_id", null)
        .gte("created_at", monthStartUtc.toISOString());

      if ((monthlyQuotesCount.count ?? 0) >= monthlyLimit) {
        throw new Error("provider_monthly_quote_limit_reached");
      }
    }
  }

  const created = await supabase
    .from("conversations")
    .insert({
      service_id: serviceId,
      provider_profile_id: providerProfileId,
      client_id: clientId,
      booking_id: bookingId,
    })
    .select("id")
    .single();

  if (created.error || !created.data) {
    console.error("ensureConversation create failed", {
      serviceId,
      providerProfileId,
      clientId,
      bookingId,
      error: created.error,
    });
    throw new Error("conversation_create_failed");
  }

  return created.data.id;
}
