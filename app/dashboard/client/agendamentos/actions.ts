"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireClientBookingAccess } from "@/lib/server-access";

export async function cancelBookingAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "").trim();

  if (!bookingId) {
    redirect("/dashboard/client/agendamentos?message=Agendamento inválido.");
  }

  const { supabase } = await requireClientBookingAccess(bookingId);

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

  await requireClientBookingAccess(bookingId);
  redirect(`/checkout/${bookingId}`);
}

export async function rebookBookingAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "").trim();

  if (!bookingId) {
    redirect("/dashboard/client/agendamentos?message=Reagendamento inválido.");
  }

  const { booking } = await requireClientBookingAccess(bookingId);

  if (!booking.service?.slug) {
    redirect("/dashboard/client/agendamentos?message=Serviço de origem não encontrado.");
  }

  redirect(`/servicos/${booking.service.slug}?message=Escolha um novo horário para reagendar.`);
}
