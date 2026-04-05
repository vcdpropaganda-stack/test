"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SUPABASE_ENV_MISSING_MESSAGE, hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function ensureAdmin() {
  if (!hasSupabaseEnv()) {
    redirect(`/login?message=${encodeURIComponent(SUPABASE_ENV_MISSING_MESSAGE)}`);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profileResult = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profileResult.data?.role ?? user.user_metadata.role;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return supabase;
}

function revalidateAdminSurfaces() {
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/provider");
  revalidatePath("/dashboard/client");
  revalidatePath("/dashboard/client/agendamentos");
  revalidatePath("/dashboard/provider/servicos");
  revalidatePath("/dashboard/provider/agenda");
  revalidatePath("/servicos");
  revalidatePath("/");
}

export async function updateProviderAction(formData: FormData) {
  const providerProfileId = String(formData.get("provider_profile_id") ?? "").trim();
  const intent = String(formData.get("intent") ?? "").trim();

  if (!providerProfileId || !intent) {
    redirect("/dashboard/admin?message=Ação administrativa inválida.");
  }

  const supabase = await ensureAdmin();

  if (intent === "verify" || intent === "unverify") {
    const { error } = await supabase
      .from("provider_profiles")
      .update({ is_verified: intent === "verify" })
      .eq("id", providerProfileId);

    if (error) {
      redirect("/dashboard/admin?message=Não foi possível atualizar a verificação do prestador.");
    }

    revalidateAdminSurfaces();
    redirect(
      `/dashboard/admin?message=${encodeURIComponent(
        intent === "verify"
          ? "Prestador marcado como verificado."
          : "Selo de verificação removido."
      )}`
    );
  }

  if (intent === "plan") {
    const plan = String(formData.get("plan") ?? "").trim();

    if (!["basic", "pro", "premium"].includes(plan)) {
      redirect("/dashboard/admin?message=Plano inválido.");
    }

    const { error } = await supabase
      .from("provider_profiles")
      .update({ plan })
      .eq("id", providerProfileId);

    if (error) {
      redirect("/dashboard/admin?message=Não foi possível atualizar o plano.");
    }

    revalidateAdminSurfaces();
    redirect("/dashboard/admin?message=Plano do prestador atualizado.");
  }

  redirect("/dashboard/admin?message=Ação administrativa desconhecida.");
}

export async function updateServiceModerationAction(formData: FormData) {
  const serviceId = String(formData.get("service_id") ?? "").trim();
  const intent = String(formData.get("intent") ?? "").trim();

  if (!serviceId || !intent) {
    redirect("/dashboard/admin?message=Ação de serviço inválida.");
  }

  const supabase = await ensureAdmin();

  if (intent === "activate" || intent === "deactivate") {
    const { error } = await supabase
      .from("services")
      .update({ is_active: intent === "activate" })
      .eq("id", serviceId);

    if (error) {
      redirect("/dashboard/admin?message=Não foi possível atualizar o anúncio.");
    }

    revalidateAdminSurfaces();
    redirect(
      `/dashboard/admin?message=${encodeURIComponent(
        intent === "activate"
          ? "Anúncio ativado com sucesso."
          : "Anúncio pausado com sucesso."
      )}`
    );
  }

  if (intent === "feature") {
    const rawRank = String(formData.get("featured_rank") ?? "").trim();
    const featuredRank = rawRank ? Number(rawRank) : null;

    if (rawRank && (!Number.isInteger(featuredRank) || featuredRank! < 1 || featuredRank! > 99)) {
      redirect("/dashboard/admin?message=Ranking de destaque inválido.");
    }

    const { error } = await supabase
      .from("services")
      .update({ featured_rank: featuredRank })
      .eq("id", serviceId);

    if (error) {
      redirect("/dashboard/admin?message=Não foi possível atualizar o destaque do anúncio.");
    }

    revalidateAdminSurfaces();
    redirect(
      `/dashboard/admin?message=${encodeURIComponent(
        featuredRank
          ? "Destaque editorial atualizado."
          : "Anúncio removido da seleção em destaque."
      )}`
    );
  }

  redirect("/dashboard/admin?message=Ação de serviço desconhecida.");
}

export async function updateBookingAdminAction(formData: FormData) {
  const bookingId = String(formData.get("booking_id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!bookingId || !status) {
    redirect("/dashboard/admin?message=Agendamento inválido.");
  }

  if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
    redirect("/dashboard/admin?message=Status inválido para o agendamento.");
  }

  const supabase = await ensureAdmin();
  const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId);

  if (error) {
    redirect("/dashboard/admin?message=Não foi possível atualizar o agendamento.");
  }

  revalidateAdminSurfaces();
  redirect("/dashboard/admin?message=Agendamento atualizado com sucesso.");
}
