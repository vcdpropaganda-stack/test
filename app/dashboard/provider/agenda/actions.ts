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
    redirect(buildRedirect("Não foi possível localizar o perfil do prestador."));
  }

  return {
    supabase,
    providerProfileId: providerProfileResult.data.id,
  };
}

function getLocalHourAndMinute(value: string) {
  const match = value.match(/T(\d{2}):(\d{2})/);

  if (!match) {
    return null;
  }

  return {
    hour: Number(match[1]),
    minute: Number(match[2]),
  };
}

export async function createAvailabilityAction(formData: FormData) {
  const serviceId = String(formData.get("service_id") ?? "").trim();
  const startAt = String(formData.get("start_at") ?? "").trim();
  const endAt = String(formData.get("end_at") ?? "").trim();

  if (!serviceId || !startAt || !endAt) {
    redirect(buildRedirect("Preencha o serviço, o início e o fim.", serviceId || undefined));
  }

  const startDate = new Date(startAt);
  const endDate = new Date(endAt);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    redirect(buildRedirect("Informe datas válidas para a agenda.", serviceId));
  }

  if (endDate <= startDate) {
    redirect(buildRedirect("O horário final precisa ser maior que o inicial.", serviceId));
  }

  const startTime = getLocalHourAndMinute(startAt);
  const endTime = getLocalHourAndMinute(endAt);

  if (!startTime || !endTime) {
    redirect(buildRedirect("Informe horários válidos no formato local.", serviceId));
  }

  const startMinutes = startTime.hour * 60 + startTime.minute;
  const endMinutes = endTime.hour * 60 + endTime.minute;
  const businessStart = 8 * 60;
  const businessEnd = 18 * 60;

  if (startMinutes < businessStart || endMinutes > businessEnd) {
    redirect(
      buildRedirect(
        "Todos os serviços devem ser agendados em horário comercial, das 08:00 às 18:00 (GMT-3).",
        serviceId
      )
    );
  }

  const { supabase, providerProfileId } = await ensureProviderContext();
  const serviceCheck = await supabase
    .from("services")
    .select("id")
    .eq("id", serviceId)
    .eq("provider_profile_id", providerProfileId)
    .single();

  if (serviceCheck.error || !serviceCheck.data) {
    redirect(buildRedirect("Este serviço não pertence ao prestador autenticado.", serviceId));
  }

  const { error } = await supabase.from("service_availability").insert({
    service_id: serviceId,
    start_at: startDate.toISOString(),
    end_at: endDate.toISOString(),
    is_available: true,
  });

  if (error) {
    redirect(buildRedirect("Não foi possível salvar este horário.", serviceId));
  }

  revalidatePath("/dashboard/provider/agenda");
  revalidatePath("/servicos");
  redirect(buildRedirect("Horário adicionado com sucesso.", serviceId));
}

export async function deleteAvailabilityAction(formData: FormData) {
  const availabilityId = String(formData.get("availability_id") ?? "").trim();
  const serviceId = String(formData.get("service_id") ?? "").trim();

  if (!availabilityId) {
    redirect(buildRedirect("Horário inválido para exclusão.", serviceId || undefined));
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
    redirect(buildRedirect("Não foi possível remover o horário.", serviceId || undefined));
  }

  revalidatePath("/dashboard/provider/agenda");
  revalidatePath("/servicos");
  redirect(buildRedirect("Horário removido com sucesso.", serviceId || undefined));
}
