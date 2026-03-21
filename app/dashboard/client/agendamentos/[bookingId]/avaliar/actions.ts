"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createReviewAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "").trim();
  const rating = Number(String(formData.get("rating") ?? "0"));
  const comment = String(formData.get("comment") ?? "").trim() || null;

  if (!bookingId || rating < 1 || rating > 5) {
    redirect("/dashboard/client/agendamentos?message=Avaliação inválida.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const bookingResult = await supabase
    .from("bookings")
    .select("id, client_id, service_id, provider_profile_id, status")
    .eq("id", bookingId)
    .single();

  if (
    bookingResult.error ||
    !bookingResult.data ||
    bookingResult.data.client_id !== user.id ||
    bookingResult.data.status !== "completed"
  ) {
    redirect("/dashboard/client/agendamentos?message=Este agendamento não pode ser avaliado.");
  }

  const { error } = await supabase.from("reviews").upsert(
    {
      booking_id: bookingResult.data.id,
      service_id: bookingResult.data.service_id,
      client_id: user.id,
      provider_profile_id: bookingResult.data.provider_profile_id,
      rating,
      comment,
    },
    { onConflict: "booking_id" }
  );

  if (error) {
    redirect("/dashboard/client/agendamentos?message=Não foi possível salvar a avaliação.");
  }

  revalidatePath("/dashboard/client/agendamentos");
  revalidatePath("/servicos");
  redirect("/dashboard/client/agendamentos?message=Avaliação enviada com sucesso.");
}
