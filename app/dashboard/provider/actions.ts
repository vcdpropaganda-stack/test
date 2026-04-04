"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProviderBookingAccess } from "@/lib/server-access";

export async function markBookingCompletedAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "").trim();
  if (!bookingId) {
    redirect("/dashboard/provider?message=Agendamento inválido.");
  }

  const { supabase } = await requireProviderBookingAccess(bookingId);
  const { error } = await supabase
    .from("bookings")
    .update({ status: "completed" })
    .eq("id", bookingId);

  if (error) {
    redirect("/dashboard/provider?message=Não foi possível marcar como concluído.");
  }

  revalidatePath("/dashboard/provider");
  revalidatePath("/dashboard/client/agendamentos");
  redirect("/dashboard/provider?message=Agendamento marcado como concluído.");
}

export async function markBookingConfirmedAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "").trim();
  if (!bookingId) {
    redirect("/dashboard/provider?message=Agendamento inválido.");
  }

  const { supabase } = await requireProviderBookingAccess(bookingId);
  const { error } = await supabase
    .from("bookings")
    .update({ status: "confirmed" })
    .eq("id", bookingId);

  if (error) {
    redirect("/dashboard/provider?message=Não foi possível confirmar o agendamento.");
  }

  revalidatePath("/dashboard/provider");
  revalidatePath("/dashboard/client/agendamentos");
  redirect("/dashboard/provider?message=Agendamento confirmado pelo prestador.");
}
