import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { deleteServiceAction, upsertServiceAction } from "@/app/dashboard/provider/servicos/actions";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Serviços | Painel do Prestador",
  description: "Gestão inicial de serviços no painel do prestador.",
};

type ProviderServicesPageProps = {
  searchParams: Promise<{
    message?: string;
    serviceId?: string;
  }>;
};

export default async function ProviderServicesPage({
  searchParams,
}: ProviderServicesPageProps) {
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
    .select("id, display_name, plan")
    .eq("profile_id", user.id)
    .maybeSingle();

  const providerProfile = providerProfileResult.data;

  const servicesResult = providerProfile
    ? await supabase
        .from("services")
        .select(
          "id, title, description, price_cents, duration_minutes, cover_image_url, is_active, created_at"
        )
        .eq("provider_profile_id", providerProfile.id)
        .order("created_at", { ascending: false })
    : { data: [], error: null };

  const services = servicesResult.data ?? [];
  const selectedService =
    serviceId && services.length > 0
      ? services.find((service) => service.id === serviceId) ?? null
      : null;

  return (
    <main id="conteudo" className="page-shell py-16">
      <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-slate-950 p-8 text-white">
            <p className="text-sm text-slate-300">Gestão de serviços</p>
            <h1 className="mt-3 font-sans text-4xl font-bold tracking-tight">
              Publique, edite e organize seus serviços em um fluxo real.
            </h1>
            <p className="mt-4 max-w-2xl text-slate-300">
              Seus serviços agora são persistidos no Supabase, respeitando o
              perfil do prestador e os limites do plano.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="rounded-full bg-white/10 px-3 py-2">
                Plano: {providerProfile?.plan ?? "basic"}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-2">
                Serviços cadastrados: {services.length}
              </span>
            </div>
          </div>

          {message ? <Notice>{message}</Notice> : null}

          <div className="space-y-4">
            {services.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-border bg-white p-8">
                <p className="text-lg font-semibold text-slate-950">
                  Nenhum serviço cadastrado ainda.
                </p>
                <p className="mt-3 max-w-lg text-sm leading-7 text-muted-strong">
                  Crie o primeiro serviço para aparecer no marketplace e
                  preparar sua agenda de atendimento.
                </p>
              </div>
            ) : (
              services.map((service) => (
                <article
                  key={service.id}
                  className="elevated-card rounded-[2rem] border border-border bg-white p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-950">
                          {service.title}
                        </h2>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            service.is_active
                              ? "bg-success/10 text-green-800"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {service.is_active ? "Ativo" : "Pausado"}
                        </span>
                      </div>
                      <p className="max-w-2xl text-sm leading-7 text-muted-strong">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-700">
                        <span className="rounded-full bg-surface-soft px-3 py-2">
                          R$ {(service.price_cents / 100).toFixed(2).replace(".", ",")}
                        </span>
                        <span className="rounded-full bg-surface-soft px-3 py-2">
                          {service.duration_minutes} min
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/dashboard/provider/servicos?serviceId=${service.id}`}
                        className="inline-flex"
                      >
                        <Button variant="secondary" icon={<Pencil className="h-4 w-4" />}>
                          Editar
                        </Button>
                      </Link>
                      <form action={deleteServiceAction}>
                        <input type="hidden" name="service_id" value={service.id} />
                        <Button
                          type="submit"
                          variant="ghost"
                          icon={<Trash2 className="h-4 w-4" />}
                          className="text-danger hover:bg-red-50 hover:text-danger"
                        >
                          Excluir
                        </Button>
                      </form>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="elevated-card h-fit rounded-[2rem] border border-border bg-white p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
                {selectedService ? "Editar serviço" : "Novo serviço"}
              </p>
              <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-slate-950">
                {selectedService
                  ? "Atualize seu anuncio com clareza"
                  : "Crie um serviço pronto para vender"}
              </h2>
            </div>
            {!selectedService ? (
              <div className="rounded-full bg-primary-soft p-3 text-primary-strong">
                <Plus className="h-5 w-5" />
              </div>
            ) : null}
          </div>

          <form action={upsertServiceAction} className="mt-8 space-y-5">
            <input
              type="hidden"
              name="service_id"
              value={selectedService?.id ?? ""}
            />

            <InputField
              name="title"
              label="Título do serviço"
              required
              defaultValue={selectedService?.title ?? ""}
              placeholder="Ex.: Limpeza residencial completa"
              hint="Use um título objetivo e fácil de encontrar."
            />

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                defaultValue={selectedService?.description ?? ""}
                className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-slate-950 placeholder:text-muted outline-none hover:border-primary/30 focus:border-primary"
                placeholder="Descreva o que está incluso, o diferencial e como o serviço funciona."
              />
              <p className="mt-2 text-sm text-muted">
                Uma boa descrição melhora a conversão e reduz dúvidas.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                name="price_brl"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={
                  selectedService
                    ? (selectedService.price_cents / 100).toFixed(2)
                    : ""
                }
                label="Preço em reais"
                placeholder="149.90"
              />

              <InputField
                name="duration_minutes"
                type="number"
                min="15"
                step="15"
                required
                defaultValue={selectedService?.duration_minutes ?? 60}
                label="Duração em minutos"
                placeholder="60"
              />
            </div>

            <InputField
              name="cover_image_url"
              type="url"
              defaultValue={selectedService?.cover_image_url ?? ""}
              label="URL da imagem de capa"
              placeholder="https://..."
              hint="Opcional por enquanto. Depois podemos ligar isso ao Supabase Storage."
            />

            <div>
              <label
                htmlFor="cover_image_file"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Upload da imagem
              </label>
              <input
                id="cover_image_file"
                name="cover_image_file"
                type="file"
                accept="image/*"
                aria-label="Upload da imagem de capa do serviço"
                className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-slate-950 outline-none hover:border-primary/30 focus:border-primary"
              />
              <p className="mt-2 text-sm text-muted">
                Se enviar um arquivo, ele terá prioridade sobre a URL manual.
              </p>
            </div>

            <label
              htmlFor="is_active"
              className="flex items-start gap-3 rounded-2xl border border-border bg-surface-soft px-4 py-4"
            >
              <input
                id="is_active"
                type="checkbox"
                name="is_active"
                defaultChecked={selectedService?.is_active ?? true}
                aria-label="Serviço ativo no marketplace"
                className="mt-1 h-4 w-4 rounded border-border"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-950">
                  Serviço ativo no marketplace
                </span>
                <span className="mt-1 block text-sm text-muted-strong">
                  Desative se quiser manter o cadastro salvo sem exibir para os clientes.
                </span>
              </span>
            </label>

            <div className="flex flex-wrap gap-3">
              <Button type="submit">
                {selectedService ? "Salvar alterações" : "Criar serviço"}
              </Button>
              {selectedService ? (
                <Link href="/dashboard/provider/servicos" className="inline-flex">
                  <Button variant="secondary">Cancelar edição</Button>
                </Link>
              ) : null}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
