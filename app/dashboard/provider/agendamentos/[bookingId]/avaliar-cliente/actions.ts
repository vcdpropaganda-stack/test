"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProviderBookingAccess } from "@/lib/server-access";

export async function createClientReviewAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "").trim();
  const rating = Number(String(formData.get("rating") ?? "0"));
  const comment = String(formData.get("comment") ?? "").trim() || null;

  if (!bookingId || rating < 1 || rating > 5) {
    redirect("/dashboard/provider?message=Avaliação do cliente inválida.");
  }

  const { supabase, providerProfile, booking } = await requireProviderBookingAccess(bookingId);

  if (booking.status !== "completed") {
    redirect("/dashboard/provider?message=Esse cliente não pode ser avaliado ainda.");
  }

  const { error } = await supabase.from("client_reviews").upsert(
    {
      booking_id: booking.id,
      client_id: booking.client_id,
      provider_profile_id: providerProfile.id,
      rating,
      comment,
    },
    { onConflict: "booking_id" }
  );

  if (error) {
    redirect("/dashboard/provider?message=Não foi possível salvar a avaliação do cliente.");
  }

  revalidatePath("/dashboard/provider");
  redirect("/dashboard/provider?message=Avaliação do cliente enviada com sucesso.");
}
