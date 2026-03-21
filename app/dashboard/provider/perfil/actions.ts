"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function buildRedirect(message: string) {
  const params = new URLSearchParams({ message });
  return `/dashboard/provider/perfil?${params.toString()}`;
}

export async function updateProviderProfileAction(formData: FormData) {
  const displayName = String(formData.get("display_name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const state = String(formData.get("state") ?? "").trim() || null;

  if (!displayName) {
    redirect(buildRedirect("Informe o nome publico do prestador."));
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("provider_profiles")
    .update({
      display_name: displayName,
      bio,
      city,
      state,
    })
    .eq("profile_id", user.id);

  if (error) {
    redirect(buildRedirect("Nao foi possivel atualizar o perfil."));
  }

  revalidatePath("/dashboard/provider/perfil");
  revalidatePath("/dashboard/provider");
  revalidatePath("/servicos");
  redirect(buildRedirect("Perfil atualizado com sucesso."));
}
