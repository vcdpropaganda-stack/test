"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function buildRedirect(message: string, serviceId?: string) {
  const params = new URLSearchParams({ message });

  if (serviceId) {
    params.set("serviceId", serviceId);
  }

  return `/dashboard/provider/agenda?${params.toString()}`;
}

async function ensureProviderContext() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = String(user.user_metadata.role ?? "client");

  if (role !== "provider") {
    redirect("/dashboard/client");
  }

  const providerProfileResult = await supabase
    .from("provider_profiles")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (providerProfileResult.error || !providerProfileResult.data) {
    redirect(buildRedirect("Nao foi possivel localizar o perfil do prestador."));
  }

  return {
    supabase,
    providerProfileId: providerProfileResult.data.id,
  };
}

export async function createAvailabilityAction(formData: FormData) {
  const serviceId = String(formData.get("service_id") ?? "").trim();
  const startAt = String(formData.get("start_at") ?? "").trim();
  const endAt = String(formData.get("end_at") ?? "").trim();

  if (!serviceId || !startAt || !endAt) {
    redirect(buildRedirect("Preencha servico, inicio e fim.", serviceId || undefined));
  }

  const startDate = new Date(startAt);
  const endDate = new Date(endAt);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    redirect(buildRedirect("Informe datas validas para a agenda.", serviceId));
  }

  if (endDate <= startDate) {
    redirect(buildRedirect("O horario final precisa ser maior que o inicial.", serviceId));
  }

  const { supabase, providerProfileId } = await ensureProviderContext();
  const serviceCheck = await supabase
    .from("services")
    .select("id")
    .eq("id", serviceId)
    .eq("provider_profile_id", providerProfileId)
    .single();

  if (serviceCheck.error || !serviceCheck.data) {
    redirect(buildRedirect("Este servico nao pertence ao prestador autenticado.", serviceId));
  }

  const { error } = await supabase.from("service_availability").insert({
    service_id: serviceId,
    start_at: startDate.toISOString(),
    end_at: endDate.toISOString(),
    is_available: true,
  });

  if (error) {
    redirect(buildRedirect("Nao foi possivel salvar este horario.", serviceId));
  }

  revalidatePath("/dashboard/provider/agenda");
  revalidatePath("/servicos");
  redirect(buildRedirect("Horario adicionado com sucesso.", serviceId));
}

export async function deleteAvailabilityAction(formData: FormData) {
  const availabilityId = String(formData.get("availability_id") ?? "").trim();
  const serviceId = String(formData.get("service_id") ?? "").trim();

  if (!availabilityId) {
    redirect(buildRedirect("Horario invalido para exclusao.", serviceId || undefined));
  }

  const { supabase, providerProfileId } = await ensureProviderContext();
  const { error } = await supabase
    .from("service_availability")
    .delete()
    .eq("id", availabilityId)
    .in(
      "service_id",
      (
        await supabase
          .from("services")
          .select("id")
          .eq("provider_profile_id", providerProfileId)
      ).data?.map((service) => service.id) ?? []
    );

  if (error) {
    redirect(buildRedirect("Nao foi possivel remover o horario.", serviceId || undefined));
  }

  revalidatePath("/dashboard/provider/agenda");
  revalidatePath("/servicos");
  redirect(buildRedirect("Horario removido com sucesso.", serviceId || undefined));
}
