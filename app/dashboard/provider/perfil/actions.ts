"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProviderContext } from "@/lib/server-access";
import { slugify } from "@/lib/text";

function buildRedirect(message: string) {
  const params = new URLSearchParams({ message });
  return `/dashboard/provider/perfil?${params.toString()}`;
}

export async function updateProviderProfileAction(formData: FormData) {
  const displayName = String(formData.get("display_name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const state = String(formData.get("state") ?? "").trim() || null;
  const rawSlug = String(formData.get("public_slug") ?? "").trim();
  const whatsappNumber = String(formData.get("whatsapp_number") ?? "").trim() || null;
  const publicSlug = slugify(rawSlug || displayName);

  if (!displayName) {
    redirect(buildRedirect("Informe o nome público do prestador."));
  }

  const { supabase, user } = await requireProviderContext({
    missingProfileRedirect: buildRedirect("Não foi possível atualizar o perfil."),
  });

  const { error } = await supabase
    .from("provider_profiles")
    .update({
      display_name: displayName,
      public_slug: publicSlug,
      bio,
      city,
      state,
      whatsapp_number: whatsappNumber,
    })
    .eq("profile_id", user.id);

  if (error) {
    redirect(buildRedirect("Não foi possível atualizar o perfil."));
  }

  revalidatePath("/dashboard/provider/perfil");
  revalidatePath("/dashboard/provider");
  revalidatePath("/servicos");
  revalidatePath("/prestadores");
  redirect(buildRedirect("Perfil atualizado com sucesso."));
}
