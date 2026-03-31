"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getResolvedUserRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function buildRedirect(path: string, message: string) {
  const params = new URLSearchParams({ message });
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${params.toString()}`;
}

function buildNewJobPath(categoryId?: string) {
  if (!categoryId) {
    return "/pedidos/novo";
  }

  const params = new URLSearchParams({ category: categoryId });
  return `/pedidos/novo?${params.toString()}`;
}

function slugifyValue(input: string) {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseCurrencyToCents(value: string) {
  const normalized = value.trim().replace(/\./g, "").replace(",", ".");

  if (!normalized) {
    return null;
  }

  const numericValue = Number(normalized);

  if (Number.isNaN(numericValue) || numericValue < 0) {
    return Number.NaN;
  }

  return Math.round(numericValue * 100);
}

function buildBidSuccessMessage(result: {
  was_existing_bid: boolean;
  used_free_allowance: boolean;
  free_remaining_today: number;
  paid_credits_remaining: number;
  purchased_new_pack: boolean;
}) {
  if (result.was_existing_bid) {
    return "Lance atualizado com sucesso. Essa edição não consumiu um novo crédito.";
  }

  if (result.used_free_allowance) {
    if (result.free_remaining_today > 0) {
      return `Lance enviado com sucesso. Restam ${result.free_remaining_today} lances grátis hoje.`;
    }

    return "Lance enviado com sucesso. Você usou seu último lance grátis de hoje.";
  }

  if (result.purchased_new_pack) {
    return `Lance enviado com sucesso. Um pacote de 20 lances por R$ 10 foi liberado para você e restam ${result.paid_credits_remaining} créditos pagos.`;
  }

  return `Lance enviado com sucesso. Restam ${result.paid_credits_remaining} créditos no seu pacote pago.`;
}

function mapSubmitBidErrorToMessage(errorMessage: string, fallbackSlug: string) {
  switch (errorMessage) {
    case "provider_profile_not_found":
      return buildRedirect("/dashboard/provider", "Complete seu perfil para começar a dar lances.");
    case "provider_not_allowed":
      return buildRedirect("/dashboard/provider/pedidos", "Você não tem permissão para enviar este lance.");
    case "job_not_found":
      return buildRedirect("/pedidos", "Esse pedido não está mais disponível.");
    case "own_job_bid_not_allowed":
      return buildRedirect(`/pedidos/${fallbackSlug}`, "Você não pode dar lance no próprio pedido.");
    case "job_closed":
      return buildRedirect(`/pedidos/${fallbackSlug}`, "Esse pedido não está mais aberto para lances.");
    case "invalid_amount":
      return buildRedirect(`/pedidos/${fallbackSlug}`, "Informe um valor válido para a proposta.");
    case "invalid_estimated_days":
      return buildRedirect(`/pedidos/${fallbackSlug}`, "O prazo estimado precisa ser um número positivo.");
    case "invalid_message":
      return buildRedirect(`/pedidos/${fallbackSlug}`, "Escreva uma mensagem curta explicando sua proposta.");
    default:
      return buildRedirect(`/pedidos/${fallbackSlug}`, "Não foi possível enviar seu lance agora.");
  }
}

type SubmitProviderJobBidResult = {
  bid_id: string;
  job_slug: string;
  was_existing_bid: boolean;
  used_free_allowance: boolean;
  free_remaining_today: number;
  paid_credits_remaining: number;
  purchased_new_pack: boolean;
  pack_price_cents: number;
};

const createJobSchema = z
  .object({
    category_id: z.string().trim().optional(),
    title: z.string().trim().min(8, "Use um título com pelo menos 8 caracteres."),
    description: z
      .string()
      .trim()
      .min(30, "Descreva melhor a necessidade para receber propostas melhores."),
    city: z.string().trim().min(2, "Informe a cidade do atendimento."),
    neighborhood: z.string().trim().optional(),
    budget_min_brl: z.string().trim().optional(),
    budget_max_brl: z.string().trim().optional(),
    desired_deadline_at: z.string().trim().optional(),
  })
  .superRefine((value, ctx) => {
    const budgetMinCents = parseCurrencyToCents(value.budget_min_brl ?? "");
    const budgetMaxCents = parseCurrencyToCents(value.budget_max_brl ?? "");

    if (Number.isNaN(budgetMinCents)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O orçamento mínimo precisa ser um número válido.",
        path: ["budget_min_brl"],
      });
    }

    if (Number.isNaN(budgetMaxCents)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O orçamento máximo precisa ser um número válido.",
        path: ["budget_max_brl"],
      });
    }

    if (
      budgetMinCents !== null &&
      budgetMaxCents !== null &&
      !Number.isNaN(budgetMinCents) &&
      !Number.isNaN(budgetMaxCents) &&
      budgetMaxCents < budgetMinCents
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O orçamento máximo não pode ser menor que o mínimo.",
        path: ["budget_max_brl"],
      });
    }
  });

const submitBidSchema = z.object({
  job_id: z.string().uuid(),
  amount_brl: z.string().trim().min(1, "Informe o valor da proposta."),
  estimated_days: z.string().trim().optional(),
  message: z
    .string()
    .trim()
    .min(12, "Escreva uma mensagem curta explicando sua proposta."),
});

const acceptBidSchema = z.object({
  job_id: z.string().uuid(),
  bid_id: z.string().uuid(),
});

export async function createJobAction(formData: FormData) {
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const newJobPath = buildNewJobPath(categoryId || undefined);
  const parsed = createJobSchema.safeParse({
    category_id: categoryId,
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    city: String(formData.get("city") ?? ""),
    neighborhood: String(formData.get("neighborhood") ?? ""),
    budget_min_brl: String(formData.get("budget_min_brl") ?? ""),
    budget_max_brl: String(formData.get("budget_max_brl") ?? ""),
    desired_deadline_at: String(formData.get("desired_deadline_at") ?? ""),
  });

  if (!parsed.success) {
    redirect(
      buildRedirect(
        newJobPath,
        parsed.error.issues[0]?.message ?? "Não foi possível publicar seu pedido."
      )
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(newJobPath)}`);
  }

  const role = await getResolvedUserRole(supabase, user);

  if (role !== "client" && role !== "admin") {
    redirect(buildRedirect("/dashboard/provider/pedidos", "Somente clientes publicam pedidos."));
  }

  const budgetMinCents = parseCurrencyToCents(parsed.data.budget_min_brl ?? "");
  const budgetMaxCents = parseCurrencyToCents(parsed.data.budget_max_brl ?? "");
  const deadline = parsed.data.desired_deadline_at
    ? new Date(parsed.data.desired_deadline_at).toISOString()
    : null;
  const slug = `${slugifyValue(parsed.data.title)}-${Date.now().toString().slice(-6)}`;

  const insertResult = await supabase
    .from("jobs")
    .insert({
      client_id: user.id,
      category_id: parsed.data.category_id || null,
      title: parsed.data.title,
      slug,
      description: parsed.data.description,
      city: parsed.data.city,
      neighborhood: parsed.data.neighborhood || null,
      budget_min_cents: budgetMinCents,
      budget_max_cents: budgetMaxCents,
      desired_deadline_at: deadline,
      expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    })
    .select("slug")
    .single();

  if (insertResult.error || !insertResult.data) {
    console.error("createJobAction failed", {
      userId: user.id,
      error: insertResult.error,
    });
    redirect(buildRedirect("/pedidos/novo", "Não foi possível publicar seu pedido agora."));
  }

  revalidatePath("/");
  revalidatePath("/pedidos");
  revalidatePath("/dashboard/client");
  revalidatePath("/dashboard/client/pedidos");

  redirect(
    buildRedirect(
      `/pedidos/${insertResult.data.slug}`,
      "Pedido publicado com sucesso. Agora é só aguardar os lances."
    )
  );
}

export async function submitJobBidAction(formData: FormData) {
  const parsed = submitBidSchema.safeParse({
    job_id: String(formData.get("job_id") ?? ""),
    amount_brl: String(formData.get("amount_brl") ?? ""),
    estimated_days: String(formData.get("estimated_days") ?? ""),
    message: String(formData.get("message") ?? ""),
  });

  if (!parsed.success) {
    redirect(
      buildRedirect(
        "/pedidos",
        parsed.error.issues[0]?.message ?? "Não foi possível enviar seu lance."
      )
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/provider/pedidos");
  }

  const role = await getResolvedUserRole(supabase, user);

  if (role !== "provider" && role !== "admin") {
    redirect(buildRedirect("/dashboard/client", "Somente prestadores podem enviar lances."));
  }

  const providerProfileResult = await supabase
    .from("provider_profiles")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!providerProfileResult.data) {
    redirect(buildRedirect("/dashboard/provider", "Complete seu perfil para começar a dar lances."));
  }

  const jobResult = await supabase
    .from("jobs")
    .select("id, slug, client_id, status, expires_at")
    .eq("id", parsed.data.job_id)
    .maybeSingle();

  if (!jobResult.data) {
    redirect(buildRedirect("/pedidos", "Esse pedido não está mais disponível."));
  }

  if (jobResult.data.client_id === user.id) {
    redirect(buildRedirect(`/pedidos/${jobResult.data.slug}`, "Você não pode dar lance no próprio pedido."));
  }

  if (
    (jobResult.data.status !== "open" && jobResult.data.status !== "has_bids") ||
    new Date(jobResult.data.expires_at).getTime() <= Date.now()
  ) {
    redirect(buildRedirect(`/pedidos/${jobResult.data.slug}`, "Esse pedido não está mais aberto para lances."));
  }

  const amountCents = parseCurrencyToCents(parsed.data.amount_brl);
  const estimatedDays = parsed.data.estimated_days ? Number(parsed.data.estimated_days) : null;

  if (amountCents === null || Number.isNaN(amountCents)) {
    redirect(buildRedirect(`/pedidos/${jobResult.data.slug}`, "Informe um valor válido para a proposta."));
  }

  if (estimatedDays !== null && (!Number.isInteger(estimatedDays) || estimatedDays <= 0)) {
    redirect(buildRedirect(`/pedidos/${jobResult.data.slug}`, "O prazo estimado precisa ser um número positivo."));
  }

  const bidResult = await supabase
    .rpc("submit_provider_job_bid", {
      job_uuid: parsed.data.job_id,
      provider_profile_uuid: providerProfileResult.data.id,
      amount_cents_input: amountCents,
      estimated_days_input: estimatedDays,
      message_input: parsed.data.message,
    })
    .single<SubmitProviderJobBidResult>();

  if (bidResult.error || !bidResult.data) {
    console.error("submitJobBidAction failed", {
      userId: user.id,
      jobId: parsed.data.job_id,
      providerProfileId: providerProfileResult.data.id,
      error: bidResult.error,
    });
    redirect(
      mapSubmitBidErrorToMessage(
        bidResult.error?.message ?? "",
        jobResult.data.slug
      )
    );
  }

  revalidatePath("/");
  revalidatePath("/pedidos");
  revalidatePath(`/pedidos/${jobResult.data.slug}`);
  revalidatePath("/dashboard/provider");
  revalidatePath("/dashboard/provider/pedidos");
  revalidatePath("/dashboard/client/pedidos");

  redirect(
    buildRedirect(
      `/pedidos/${jobResult.data.slug}`,
      buildBidSuccessMessage(bidResult.data)
    )
  );
}

export async function acceptJobBidAction(formData: FormData) {
  const parsed = acceptBidSchema.safeParse({
    job_id: String(formData.get("job_id") ?? ""),
    bid_id: String(formData.get("bid_id") ?? ""),
  });

  if (!parsed.success) {
    redirect(buildRedirect("/dashboard/client/pedidos", "Não foi possível contratar esta proposta."));
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/client/pedidos");
  }

  const role = await getResolvedUserRole(supabase, user);

  if (role !== "client" && role !== "admin") {
    redirect(buildRedirect("/dashboard/provider/pedidos", "Somente clientes contratam propostas."));
  }

  const jobResult = await supabase
    .from("jobs")
    .select("id, slug, client_id")
    .eq("id", parsed.data.job_id)
    .maybeSingle();

  if (!jobResult.data) {
    redirect(buildRedirect("/dashboard/client/pedidos", "Esse pedido não foi encontrado."));
  }

  if (jobResult.data.client_id !== user.id && role !== "admin") {
    redirect(buildRedirect(`/pedidos/${jobResult.data.slug}`, "Você não tem permissão para contratar este lance."));
  }

  const bidResult = await supabase
    .from("job_bids")
    .select("id, provider_profile_id")
    .eq("id", parsed.data.bid_id)
    .eq("job_id", parsed.data.job_id)
    .maybeSingle();

  if (!bidResult.data) {
    redirect(buildRedirect(`/pedidos/${jobResult.data.slug}`, "A proposta escolhida não foi encontrada."));
  }

  await supabase
    .from("job_bids")
    .update({ status: "rejected" })
    .eq("job_id", parsed.data.job_id)
    .neq("id", parsed.data.bid_id);

  const acceptedResult = await supabase
    .from("job_bids")
    .update({ status: "accepted" })
    .eq("id", parsed.data.bid_id)
    .eq("job_id", parsed.data.job_id);

  const jobUpdateResult = await supabase
    .from("jobs")
    .update({
      status: "in_progress",
      hired_bid_id: parsed.data.bid_id,
    })
    .eq("id", parsed.data.job_id);

  if (acceptedResult.error || jobUpdateResult.error) {
    console.error("acceptJobBidAction failed", {
      userId: user.id,
      jobId: parsed.data.job_id,
      bidId: parsed.data.bid_id,
      acceptedError: acceptedResult.error,
      jobUpdateError: jobUpdateResult.error,
    });
    redirect(buildRedirect(`/pedidos/${jobResult.data.slug}`, "Não foi possível contratar esta proposta agora."));
  }

  revalidatePath("/");
  revalidatePath("/pedidos");
  revalidatePath(`/pedidos/${jobResult.data.slug}`);
  revalidatePath("/dashboard/client");
  revalidatePath("/dashboard/client/pedidos");
  revalidatePath("/dashboard/provider");
  revalidatePath("/dashboard/provider/pedidos");

  redirect(buildRedirect(`/pedidos/${jobResult.data.slug}`, "Prestador contratado com sucesso."));
}
