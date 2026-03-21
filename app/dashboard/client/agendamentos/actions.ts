"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function ensureBookingOwner(bookingId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const bookingResult = await supabase
    .from("bookings")
    .select(
      `
      id,
      client_id,
      status,
      service:services (
        slug
      )
    `
    )
    .eq("id", bookingId)
    .single();

  if (bookingResult.error || !bookingResult.data || bookingResult.data.client_id !== user.id) {
    redirect("/dashboard/client/agendamentos?message=Agendamento não encontrado.");
  }

  const service = Array.isArray(bookingResult.data.service)
    ? bookingResult.data.service[0] ?? null
    : bookingResult.data.service;

  return {
    supabase,
    booking: {
      ...bookingResult.data,
      service,
    },
  };
}

export async function cancelBookingAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "").trim();

  if (!bookingId) {
    redirect("/dashboard/client/agendamentos?message=Agendamento inválido.");
  }

  const { supabase } = await ensureBookingOwner(bookingId);

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  if (error) {
    redirect("/dashboard/client/agendamentos?message=Não foi possível cancelar o agendamento.");
  }

  revalidatePath("/dashboard/client/agendamentos");
  revalidatePath("/servicos");
  redirect("/dashboard/client/agendamentos?message=Agendamento cancelado com sucesso.");
}

export async function goToCheckoutAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "").trim();

  if (!bookingId) {
    redirect("/dashboard/client/agendamentos?message=Checkout inválido.");
  }

  await ensureBookingOwner(bookingId);
  redirect(`/checkout/${bookingId}`);
}

export async function rebookBookingAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "").trim();

  if (!bookingId) {
    redirect("/dashboard/client/agendamentos?message=Reagendamento inválido.");
  }

  const { booking } = await ensureBookingOwner(bookingId);

  if (!booking.service?.slug) {
    redirect("/dashboard/client/agendamentos?message=Serviço de origem não encontrado.");
  }

  redirect(`/servicos/${booking.service.slug}?message=Escolha um novo horário para reagendar.`);
}
