"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createClientReviewAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "").trim();
  const rating = Number(String(formData.get("rating") ?? "0"));
  const comment = String(formData.get("comment") ?? "").trim() || null;

  if (!bookingId || rating < 1 || rating > 5) {
    redirect("/dashboard/provider?message=Avaliação do cliente inválida.");
  }

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
    .select("id, client_id, provider_profile_id, status")
    .eq("id", bookingId)
    .single();

  if (
    bookingResult.error ||
    !bookingResult.data ||
    bookingResult.data.provider_profile_id !== providerResult.data.id ||
    bookingResult.data.status !== "completed"
  ) {
    redirect("/dashboard/provider?message=Esse cliente não pode ser avaliado ainda.");
  }

  const { error } = await supabase.from("client_reviews").upsert(
    {
      booking_id: bookingResult.data.id,
      client_id: bookingResult.data.client_id,
      provider_profile_id: providerResult.data.id,
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
