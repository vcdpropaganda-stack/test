import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { updateProviderProfileAction } from "@/app/dashboard/provider/perfil/actions";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { ShareLinkButton } from "@/components/shared/share-link-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Perfil do Prestador | Vitrine Lojas",
  description: "Edição do perfil público do prestador.",
};

type ProviderProfilePageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function ProviderProfilePage({
  searchParams,
}: ProviderProfilePageProps) {
  const { message } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profileResult = await supabase
    .from("provider_profiles")
    .select("display_name, public_slug, bio, city, state, plan, whatsapp_number")
    .eq("profile_id", user.id)
    .single();

  if (profileResult.error || !profileResult.data) {
    redirect("/dashboard/provider?message=Perfil do prestador não encontrado.");
  }

  const profile = profileResult.data;
  const publicProfileUrl = profile.public_slug
    ? `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://vitrinelojas-fawn.vercel.app"}/prestadores/${profile.public_slug}`
    : null;

  return (
    <main id="conteudo" className="page-shell py-16">
      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-border bg-slate-950 p-8 text-white">
          <p className="text-sm text-slate-300">Perfil público</p>
          <h1 className="mt-3 font-sans text-4xl font-bold tracking-tight">
            Ajuste a forma como os clientes enxergam sua marca.
          </h1>
          <p className="mt-4 text-slate-300">
            Nome público, bio e localização agora influenciam diretamente a
            vitrine e o detalhe do serviço.
          </p>
          <p className="mt-6 rounded-full bg-white/10 px-4 py-2 text-sm">
            Plano atual: {profile.plan}
          </p>
          {publicProfileUrl ? (
            <div className="mt-6">
              <p className="text-sm text-slate-300">Perfil público</p>
              <Link
                href={`/prestadores/${profile.public_slug}`}
                className="mt-2 inline-flex text-sm font-semibold text-white underline-offset-4 hover:underline"
              >
                /prestadores/{profile.public_slug}
              </Link>
            </div>
          ) : null}
        </section>

        <section className="rounded-[2rem] border border-border bg-white p-8">
          {message ? <div className="mb-6"><Notice>{message}</Notice></div> : null}
          <form action={updateProviderProfileAction} className="space-y-5">
            <InputField
              name="display_name"
              label="Nome público"
              defaultValue={profile.display_name}
              required
            />
            <InputField
              name="public_slug"
              label="Slug público"
              defaultValue={profile.public_slug ?? ""}
              hint="Esse trecho aparece no link compartilhável do seu perfil."
            />
            <div>
              <label htmlFor="bio" className="mb-2 block text-sm font-medium text-slate-800">
                Bio do prestador
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={6}
                defaultValue={profile.bio ?? ""}
                className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-slate-950 outline-none hover:border-primary/30 focus:border-primary"
                placeholder="Conte sua especialidade, diferenciais e experiência."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField name="city" label="Cidade" defaultValue={profile.city ?? ""} />
              <InputField name="state" label="Estado" defaultValue={profile.state ?? ""} />
            </div>
            <InputField
              name="whatsapp_number"
              label="WhatsApp"
              defaultValue={profile.whatsapp_number ?? ""}
              hint="Use com DDD. Ele será compartilhado somente quando você aprovar o contato."
            />
            {publicProfileUrl ? (
              <div className="rounded-[1.5rem] border border-border bg-surface p-4">
                <p className="text-sm font-semibold text-slate-950">Compartilhe seu perfil</p>
                <p className="mt-2 text-sm text-muted-strong">{publicProfileUrl}</p>
                <div className="mt-4">
                  <ShareLinkButton
                    url={publicProfileUrl}
                    title={`Perfil de ${profile.display_name} na Vitrine Lojas`}
                    text="Veja este prestador na Vitrine Lojas"
                  />
                </div>
              </div>
            ) : null}
            <Button type="submit">Salvar perfil</Button>
          </form>
        </section>
      </div>
    </main>
  );
}
