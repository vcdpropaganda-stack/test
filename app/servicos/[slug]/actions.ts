"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function buildRedirect(slug: string, message: string) {
  const params = new URLSearchParams({ message });
  return `/servicos/${slug}?${params.toString()}`;
}

async function ensureClientContext() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Entre para reservar um horario.");
  }

  const role = String(user.user_metadata.role ?? "client");

  if (role !== "client") {
    redirect("/dashboard/provider");
  }

  const fullName = String(user.user_metadata.full_name ?? user.email ?? "Cliente");
  const phone = String(user.user_metadata.phone ?? "").trim() || null;

  await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email ?? "",
    full_name: fullName,
    phone,
    role: "client",
  });

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
    redirect(buildRedirect(slug || "servicos", "Nao foi possivel identificar o horario selecionado."));
  }

  const { supabase, user } = await ensureClientContext();

  const conflictResult = await supabase
    .from("bookings")
    .select("id")
    .eq("service_id", serviceId)
    .eq("scheduled_start", scheduledStart)
    .eq("scheduled_end", scheduledEnd)
    .in("status", ["pending", "confirmed"])
    .limit(1);

  if ((conflictResult.data ?? []).length > 0) {
    redirect(buildRedirect(slug, "Este horario acabou de ser reservado. Escolha outro slot."));
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

  if (bookingInsertResult.error || !bookingInsertResult.data) {
    redirect(buildRedirect(slug, "Nao foi possivel criar o agendamento."));
  }

  revalidatePath(`/servicos/${slug}`);
  revalidatePath("/dashboard/client/agendamentos");
  redirect(`/checkout/${bookingInsertResult.data.id}`);
}
