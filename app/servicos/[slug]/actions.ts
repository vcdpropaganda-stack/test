"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "@/lib/server-access";

function buildRedirect(slug: string, message: string) {
  const params = new URLSearchParams({ message });
  return `/servicos/${slug}?${params.toString()}`;
}

async function ensureClientContext(slug?: string) {
  const params = new URLSearchParams({
    message: "Entre para reservar um horário.",
    next: slug ? `/servicos/${slug}` : "/servicos",
  });

  const { supabase, user, role } = await requireAuthenticatedUser({
    loginRedirect: `/login?${params.toString()}`,
  });

  if (role !== "client") {
    redirect("/dashboard/provider");
  }

  return { supabase, user };
}

export async function createBookingAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  const serviceId = String(formData.get("service_id") ?? "").trim();
  const providerProfileId = String(formData.get("provider_profile_id") ?? "").trim();
  const scheduledStart = String(formData.get("scheduled_start") ?? "").trim();
  const scheduledEnd = String(formData.get("scheduled_end") ?? "").trim();
  const totalPriceCents = Number(String(formData.get("total_price_cents") ?? "0"));

  if (!slug || !serviceId || !providerProfileId || !scheduledStart || !scheduledEnd) {
    redirect(buildRedirect(slug || "servicos", "Não foi possível identificar o horário selecionado."));
  }

  const { supabase, user } = await ensureClientContext(slug);

  await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email ?? "",
    full_name: String(user.user_metadata.full_name ?? user.email ?? "Cliente"),
    phone: String(user.user_metadata.phone ?? "").trim() || null,
    role: "client",
  });

  const conflictResult = await supabase
    .from("bookings")
    .select("id")
    .eq("service_id", serviceId)
    .eq("scheduled_start", scheduledStart)
    .eq("scheduled_end", scheduledEnd)
    .in("status", ["pending", "confirmed"])
    .limit(1);

  if ((conflictResult.data?.length ?? 0) > 0) {
    redirect(buildRedirect(slug, "Este horário acabou de ser reservado. Escolha outro horário."));
  }

  const bookingInsertResult = await supabase
    .from("bookings")
    .insert({
      service_id: serviceId,
      client_id: user.id,
      provider_profile_id: providerProfileId,
      scheduled_start: scheduledStart,
      scheduled_end: scheduledEnd,
      total_price_cents: totalPriceCents,
      status: "pending",
    })
    .select("id")
    .single();

  if (bookingInsertResult.error) {
    console.error("createBookingAction insert failed", bookingInsertResult.error);
  }

  const bookingId = bookingInsertResult.data?.id ?? null;

  if (!bookingId) {
    redirect(buildRedirect(slug, "Não foi possível criar o agendamento."));
  }

  revalidatePath(`/servicos/${slug}`);
  revalidatePath("/dashboard/client/agendamentos");
  redirect(`/checkout/${bookingId}`);
}
