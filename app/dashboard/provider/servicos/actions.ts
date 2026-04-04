"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProviderContext } from "@/lib/server-access";
import { slugify } from "@/lib/text";

function buildRedirect(message: string) {
  const params = new URLSearchParams({ message });
  return `/dashboard/provider/servicos?${params.toString()}`;
}

export async function upsertServiceAction(formData: FormData) {
  const serviceId = String(formData.get("service_id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceInput = String(formData.get("price_brl") ?? "").trim().replace(",", ".");
  const durationInput = String(formData.get("duration_minutes") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim() || null;
  const imageFile = formData.get("cover_image_file");
  const isActive = formData.get("is_active") === "on";

  if (!title || !description) {
    redirect(buildRedirect("Preencha o título e a descrição do serviço."));
  }

  const priceNumber = Number(priceInput);
  const durationMinutes = Number(durationInput);

  if (Number.isNaN(priceNumber) || priceNumber < 0) {
    redirect(buildRedirect("Informe um preço válido em reais."));
  }

  if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
    redirect(buildRedirect("Informe uma duração válida em minutos."));
  }

  const { supabase, providerProfile, user } = await requireProviderContext({
    ensureProfile: true,
    missingProfileRedirect: buildRedirect("Não foi possível preparar o perfil do prestador."),
  });

  const baseSlug = slugify(title);
  const slug = serviceId ? baseSlug : `${baseSlug}-${Date.now().toString().slice(-6)}`;
  let finalCoverImageUrl = coverImageUrl;

  if (imageFile instanceof File && imageFile.size > 0) {
    const extension = imageFile.name.includes(".")
      ? imageFile.name.split(".").pop()
      : "jpg";
    const filePath = `${user.id}/${randomUUID()}.${extension}`;
    const uploadResult = await supabase.storage
      .from("service-images")
      .upload(filePath, imageFile, {
        upsert: false,
        contentType: imageFile.type || "image/jpeg",
      });

    if (uploadResult.error) {
      redirect(buildRedirect("Não foi possível enviar a imagem do serviço."));
    }

    const publicUrlResult = supabase.storage
      .from("service-images")
      .getPublicUrl(filePath);
    finalCoverImageUrl = publicUrlResult.data.publicUrl;
  }

  const payload = {
    provider_profile_id: providerProfile.id,
    title,
    slug,
    description,
    cover_image_url: finalCoverImageUrl,
    price_cents: Math.round(priceNumber * 100),
    duration_minutes: durationMinutes,
    is_active: isActive,
  };

  const result = serviceId
    ? await supabase
        .from("services")
        .update(payload)
        .eq("id", serviceId)
        .select("id")
        .single()
    : await supabase.from("services").insert(payload).select("id").single();

  if (result.error) {
    console.error("upsertServiceAction failed", {
      serviceId,
      providerProfileId: providerProfile.id,
      userId: user.id,
      error: result.error,
    });

    const genericFailureMessage = result.error.code
      ? `Não foi possível salvar o serviço. Código: ${result.error.code}.`
      : "Não foi possível salvar o serviço.";

    redirect(
      buildRedirect(
        result.error.message.includes("Service limit reached")
          ? "Seu plano atual atingiu o limite de serviços."
          : genericFailureMessage
      )
    );
  }

  revalidatePath("/dashboard/provider/servicos");
  redirect(buildRedirect(serviceId ? "Serviço atualizado com sucesso." : "Serviço criado com sucesso."));
}

export async function deleteServiceAction(formData: FormData) {
  const serviceId = String(formData.get("service_id") ?? "").trim();

  if (!serviceId) {
    redirect(buildRedirect("Serviço inválido para exclusão."));
  }

  const { supabase } = await requireProviderContext({
    ensureProfile: true,
    missingProfileRedirect: buildRedirect("Não foi possível preparar o perfil do prestador."),
  });
  const { error } = await supabase.from("services").delete().eq("id", serviceId);

  if (error) {
    redirect(buildRedirect("Não foi possível excluir o serviço."));
  }

  revalidatePath("/dashboard/provider/servicos");
  redirect(buildRedirect("Serviço removido com sucesso."));
}
