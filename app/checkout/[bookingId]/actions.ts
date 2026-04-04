"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireClientBookingAccess } from "@/lib/server-access";

export async function confirmBookingAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "").trim();
  const paymentMethod = String(formData.get("payment_method") ?? "demo-card").trim();

  if (!bookingId) {
    redirect("/dashboard/client/agendamentos?message=Checkout inválido.");
  }

  const { supabase, booking } = await requireClientBookingAccess(bookingId, {
    loginRedirect: "/login?message=Entre para concluir o checkout.",
  });

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
    redirect(`/checkout/${bookingId}?message=Não foi possível confirmar o checkout.`);
  }

  revalidatePath(`/checkout/${bookingId}`);
  revalidatePath("/dashboard/client/agendamentos");
  revalidatePath("/servicos");
  redirect("/dashboard/client/agendamentos?message=Pagamento simulado aprovado e agendamento confirmado.");
}
