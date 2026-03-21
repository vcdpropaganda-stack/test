import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin | TESTE",
  description: "Painel administrativo inicial da plataforma TESTE.",
};

export default async function AdminDashboardPage() {
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

  const [profilesResult, servicesResult, bookingsResult] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select(
        `
        id,
        status,
        scheduled_start,
        service:services (title),
        client:profiles (full_name)
      `
      )
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const recentBookings = (bookingsResult.data ?? []).map((booking) => ({
    ...booking,
    service: Array.isArray(booking.service) ? booking.service[0] ?? null : booking.service,
    client: Array.isArray(booking.client) ? booking.client[0] ?? null : booking.client,
  }));

  return (
    <main id="conteudo" className="page-shell py-16">
      <div className="rounded-[2rem] border border-border bg-slate-950 p-8 text-white">
        <p className="text-sm text-slate-300">Admin basico</p>
        <h1 className="mt-3 font-sans text-4xl font-bold tracking-tight">
          Visao inicial de governanca da plataforma
        </h1>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          { label: "Usuarios", value: profilesResult.count ?? 0 },
          { label: "Servicos", value: servicesResult.count ?? 0 },
          { label: "Bookings recentes", value: recentBookings.length },
        ].map((metric) => (
          <section
            key={metric.label}
            className="rounded-[1.5rem] border border-border bg-white p-6"
          >
            <p className="text-sm text-muted">{metric.label}</p>
            <p className="mt-3 font-sans text-3xl font-bold text-slate-950">
              {metric.value}
            </p>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-[2rem] border border-border bg-white p-8">
        <h2 className="font-sans text-3xl font-bold tracking-tight text-slate-950">
          Ultimos agendamentos
        </h2>
        <div className="mt-8 space-y-4">
          {recentBookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-[1.5rem] border border-border bg-surface p-5"
            >
              <p className="font-semibold text-slate-950">
                {booking.service?.title ?? "Servico"}
              </p>
              <p className="mt-2 text-sm text-muted-strong">
                Cliente: {booking.client?.full_name ?? "Cliente"} • Status: {booking.status}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
