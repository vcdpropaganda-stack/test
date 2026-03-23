"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDbPool } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function buildRedirect(slug: string, message: string) {
  const params = new URLSearchParams({ message });
  return `/servicos/${slug}?${params.toString()}`;
}

async function ensureClientContext(slug?: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const params = new URLSearchParams({
      message: "Entre para reservar um horário.",
      next: slug ? `/servicos/${slug}` : "/servicos",
    });
    redirect(`/login?${params.toString()}`);
  }

  const pool = getDbPool();
  const profileResult = await pool.query(
    "select role from public.profiles where id = $1 limit 1",
    [user.id]
  );
  const role =
    (profileResult.rows[0] as { role?: string | null } | undefined)?.role ??
    String(user.user_metadata.role ?? "client");

  if (role !== "client") {
    redirect("/dashboard/provider");
  }

  return { supabase, user };
}

export async function createBookingAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  const serviceId = String(formData.get("service_id") ?? "").trim();
  const providerProfileId = String(formData.get("provider_profile_id") ?? "").trim();
  const scheduledStart = String(formData.get("scheduled_start") ?? "").trim();
  const scheduledEnd = String(formData.get("scheduled_end") ?? "").trim();
  const totalPriceCents = Number(String(formData.get("total_price_cents") ?? "0"));

  if (!slug || !serviceId || !providerProfileId || !scheduledStart || !scheduledEnd) {
    redirect(buildRedirect(slug || "servicos", "Não foi possível identificar o horário selecionado."));
  }

  const { user } = await ensureClientContext(slug);
  const pool = getDbPool();
  const client = await pool.connect();
  let bookingId: string | null = null;

  try {
    await client.query("begin");

    await client.query(
      `
      insert into public.profiles (id, email, full_name, phone, role)
      values ($1, $2, $3, $4, 'client')
      on conflict (id)
      do update set
        email = excluded.email,
        full_name = excluded.full_name,
        phone = excluded.phone,
        role = 'client'
      `,
      [
        user.id,
        user.email ?? "",
        String(user.user_metadata.full_name ?? user.email ?? "Cliente"),
        String(user.user_metadata.phone ?? "").trim() || null,
      ]
    );

    const conflictResult = await client.query(
      `
      select id
      from public.bookings
      where service_id = $1
        and scheduled_start = $2::timestamptz
        and scheduled_end = $3::timestamptz
        and status in ('pending', 'confirmed')
      limit 1
      `,
      [serviceId, scheduledStart, scheduledEnd]
    );

    if (conflictResult.rows.length > 0) {
      await client.query("rollback");
      redirect(
        buildRedirect(slug, "Este horário acabou de ser reservado. Escolha outro horário.")
      );
    }

    const bookingInsertResult = await client.query(
      `
      insert into public.bookings (
        service_id,
        client_id,
        provider_profile_id,
        scheduled_start,
        scheduled_end,
        total_price_cents,
        status
      )
      values ($1, $2, $3, $4::timestamptz, $5::timestamptz, $6, 'pending')
      returning id
      `,
      [
        serviceId,
        user.id,
        providerProfileId,
        scheduledStart,
        scheduledEnd,
        totalPriceCents,
      ]
    );

    bookingId =
      (bookingInsertResult.rows[0] as { id?: string } | undefined)?.id ?? null;
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    console.error("createBookingAction insert failed", error);
  } finally {
    client.release();
  }

  if (!bookingId) {
    redirect(buildRedirect(slug, "Não foi possível criar o agendamento."));
  }

  revalidatePath(`/servicos/${slug}`);
  revalidatePath("/dashboard/client/agendamentos");
  redirect(`/checkout/${bookingId}`);
}
