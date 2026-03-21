import type { Metadata } from "next";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarPlus2, Clock3, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { createAvailabilityAction, deleteAvailabilityAction } from "@/app/dashboard/provider/agenda/actions";
import { Button } from "@/components/ui/button";
import { InputField, SelectField } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Agenda | Painel do Prestador",
  description: "Visão inicial de agenda e disponibilidade do prestador.",
};

type ProviderAgendaPageProps = {
  searchParams: Promise<{
    message?: string;
    serviceId?: string;
  }>;
};

export default async function ProviderAgendaPage({
  searchParams,
}: ProviderAgendaPageProps) {
  const { message, serviceId } = await searchParams;
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
    .select("id, display_name")
    .eq("profile_id", user.id)
    .single();

  const providerProfile = providerProfileResult.data;

  const servicesResult = providerProfile
    ? await supabase
        .from("services")
        .select("id, title, duration_minutes, is_active")
        .eq("provider_profile_id", providerProfile.id)
        .order("created_at", { ascending: false })
    : { data: [], error: null };

  const services = servicesResult.data ?? [];
  const selectedService =
    services.find((service) => service.id === serviceId) ?? services[0] ?? null;

  const availabilityResult = selectedService
    ? await supabase
        .from("service_availability")
        .select("id, start_at, end_at, is_available")
        .eq("service_id", selectedService.id)
        .order("start_at", { ascending: true })
    : { data: [], error: null };

  const availability = availabilityResult.data ?? [];

  return (
    <main id="conteudo" className="page-shell py-16">
      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-slate-950 p-8 text-white">
            <p className="text-sm text-slate-300">Agenda do prestador</p>
            <h1 className="mt-3 font-sans text-4xl font-bold tracking-tight">
              Organize sua disponibilidade por serviço.
            </h1>
            <p className="mt-4 max-w-2xl text-slate-300">
              Os horários criados aqui passam a aparecer no detalhe público do
              serviço para sustentar o fluxo de agendamento.
            </p>
          </div>

          {message ? <Notice>{message}</Notice> : null}

          <div className="space-y-4">
            {selectedService ? (
              availability.length > 0 ? (
                availability.map((slot) => (
                  <article
                    key={slot.id}
                    className="elevated-card rounded-[2rem] border border-border bg-white p-6"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {format(new Date(slot.start_at), "EEEE, dd 'de' MMMM", {
                            locale: ptBR,
                          })}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-sm text-muted-strong">
                          <Clock3 className="h-4 w-4" />
                          {format(new Date(slot.start_at), "HH:mm")} -{" "}
                          {format(new Date(slot.end_at), "HH:mm")}
                        </div>
                      </div>

                      <form action={deleteAvailabilityAction}>
                        <input type="hidden" name="availability_id" value={slot.id} />
                        <input
                          type="hidden"
                          name="service_id"
                          value={selectedService.id}
                        />
                        <Button
                          type="submit"
                          variant="ghost"
                          icon={<Trash2 className="h-4 w-4" />}
                          className="text-danger hover:bg-red-50 hover:text-danger"
                        >
                          Remover horário
                        </Button>
                      </form>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[2rem] border border-dashed border-border bg-white p-8">
                  <p className="text-lg font-semibold text-slate-950">
                    Nenhum horário cadastrado para este serviço.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted-strong">
                    Adicione a primeira janela de atendimento para exibir
                    disponibilidade real ao cliente.
                  </p>
                </div>
              )
            ) : (
              <div className="rounded-[2rem] border border-dashed border-border bg-white p-8">
                <p className="text-lg font-semibold text-slate-950">
                  Crie pelo menos um serviço antes de configurar a agenda.
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-strong">
                  A agenda é organizada por serviço, então o primeiro passo é
                  cadastrar um anúncio no painel.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="elevated-card h-fit rounded-[2rem] border border-border bg-white p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
                Novo horário
              </p>
              <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-slate-950">
                Adicione janelas reais de disponibilidade
              </h2>
            </div>
            <div className="rounded-full bg-primary-soft p-3 text-primary-strong">
              <CalendarPlus2 className="h-5 w-5" />
            </div>
          </div>

          <form action={createAvailabilityAction} className="mt-8 space-y-5">
            <SelectField
              name="service_id"
              label="Serviço"
              defaultValue={selectedService?.id ?? ""}
              hint="Cada horário pertence a um serviço específico."
            >
              {services.length > 0 ? (
                services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title}
                  </option>
                ))
              ) : (
                <option value="">Nenhum serviço disponível</option>
              )}
            </SelectField>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                name="start_at"
                type="datetime-local"
                label="Início"
                required
              />
              <InputField
                name="end_at"
                type="datetime-local"
                label="Fim"
                required
              />
            </div>

            <Button type="submit" disabled={services.length === 0}>
              Salvar horário
            </Button>
          </form>

          {selectedService ? (
            <div className="mt-8 rounded-3xl border border-border bg-surface-soft p-5">
              <p className="text-sm font-semibold text-slate-950">
                Serviço selecionado
              </p>
              <p className="mt-2 text-sm text-muted-strong">
                {selectedService.title} • {selectedService.duration_minutes} min
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
