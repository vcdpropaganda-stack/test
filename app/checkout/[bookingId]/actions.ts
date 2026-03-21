"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function ensureClientBookingAccess(bookingId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Entre para concluir o checkout.");
  }

  const bookingResult = await supabase
    .from("bookings")
    .select("id, client_id, service_id, status")
    .eq("id", bookingId)
    .single();

  if (bookingResult.error || !bookingResult.data || bookingResult.data.client_id !== user.id) {
    redirect("/dashboard/client/agendamentos?message=Agendamento nao encontrado.");
  }

  return {
    supabase,
    booking: bookingResult.data,
  };
}

export async function confirmBookingAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "").trim();
  const paymentMethod = String(formData.get("payment_method") ?? "demo-card").trim();

  if (!bookingId) {
    redirect("/dashboard/client/agendamentos?message=Checkout invalido.");
  }

  const { supabase, booking } = await ensureClientBookingAccess(bookingId);

  if (booking.status === "cancelled") {
    redirect("/dashboard/client/agendamentos?message=Este agendamento foi cancelado.");
  }

  const { error } = await supabase
    .from("bookings")
    .update({
      status: "confirmed",
      stripe_payment_intent_id: `prototype_${paymentMethod}_${bookingId.slice(0, 8)}`,
    })
    .eq("id", bookingId);

  if (error) {
    redirect(`/checkout/${bookingId}?message=Nao foi possivel confirmar o checkout.`);
  }

  revalidatePath(`/checkout/${bookingId}`);
  revalidatePath("/dashboard/client/agendamentos");
  revalidatePath("/servicos");
  redirect("/dashboard/client/agendamentos?message=Pagamento fake aprovado e agendamento confirmado.");
}
