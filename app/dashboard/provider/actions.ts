"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function ensureProviderBookingAccess(bookingId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const providerResult = await supabase
    .from("provider_profiles")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (providerResult.error || !providerResult.data) {
    redirect("/dashboard/client");
  }

  const bookingResult = await supabase
    .from("bookings")
    .select("id, provider_profile_id")
    .eq("id", bookingId)
    .single();

  if (
    bookingResult.error ||
    !bookingResult.data ||
    bookingResult.data.provider_profile_id !== providerResult.data.id
  ) {
    redirect("/dashboard/provider?message=Agendamento nao encontrado.");
  }

  return { supabase };
}

export async function markBookingCompletedAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "").trim();
  if (!bookingId) {
    redirect("/dashboard/provider?message=Agendamento invalido.");
  }

  const { supabase } = await ensureProviderBookingAccess(bookingId);
  const { error } = await supabase
    .from("bookings")
    .update({ status: "completed" })
    .eq("id", bookingId);

  if (error) {
    redirect("/dashboard/provider?message=Nao foi possivel marcar como concluido.");
  }

  revalidatePath("/dashboard/provider");
  revalidatePath("/dashboard/client/agendamentos");
  redirect("/dashboard/provider?message=Agendamento marcado como concluido.");
}

export async function markBookingConfirmedAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "").trim();
  if (!bookingId) {
    redirect("/dashboard/provider?message=Agendamento invalido.");
  }

  const { supabase } = await ensureProviderBookingAccess(bookingId);
  const { error } = await supabase
    .from("bookings")
    .update({ status: "confirmed" })
    .eq("id", bookingId);

  if (error) {
    redirect("/dashboard/provider?message=Nao foi possivel confirmar o agendamento.");
  }

  revalidatePath("/dashboard/provider");
  revalidatePath("/dashboard/client/agendamentos");
  redirect("/dashboard/provider?message=Agendamento confirmado pelo prestador.");
}
