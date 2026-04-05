import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createJobAction } from "@/app/pedidos/actions";
import { ConfigurationNotice } from "@/components/shared/configuration-notice";
import { getResolvedUserRole } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { InputField, SelectField } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { TextareaField } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Publicar Pedido | VLservice",
  description:
    "Descreva sua necessidade e receba propostas de prestadores relevantes.",
};

type NewJobPageProps = {
  searchParams: Promise<{
    message?: string;
    category?: string;
  }>;
};

export default async function NewJobPage({ searchParams }: NewJobPageProps) {
  const { message, category } = await searchParams;

  if (!hasSupabaseEnv()) {
    return (
      <ConfigurationNotice
        eyebrow="Novo pedido"
        title="Publicação temporariamente indisponível"
        description="Esta tela depende da autenticação e das categorias do marketplace para publicar pedidos com segurança."
        primaryHref="/login"
        primaryLabel="Ir para o login"
        secondaryHref="/pedidos"
        secondaryLabel="Voltar ao mural"
      />
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const selectedCategoryId = typeof category === "string" ? category.trim() : "";

  if (!user) {
    const nextPath = selectedCategoryId
      ? `/pedidos/novo?category=${encodeURIComponent(selectedCategoryId)}`
      : "/pedidos/novo";

    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  const role = await getResolvedUserRole(supabase, user);

  if (role === "provider") {
    redirect("/dashboard/provider/pedidos");
  }

  const categoriesResult = await supabase
    .from("service_categories")
    .select("id, name")
    .order("name", { ascending: true });

  const categories = categoriesResult.data ?? [];
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const defaultDeadline = new Date();
  defaultDeadline.setDate(defaultDeadline.getDate() + 7);

  return (
    <main id="conteudo" className="page-shell py-10 sm:py-14">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold tracking-[0.24em] text-primary-strong uppercase">
          Novo pedido
        </p>
        <h1 className="mt-3 font-sans text-4xl font-bold tracking-tight text-slate-950">
          Publique sua dor em poucos minutos
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-strong">
          Explique o problema, informe a cidade e dê contexto suficiente para os
          prestadores responderem com um lance objetivo.
        </p>

        {message ? <div className="mt-6"><Notice>{message}</Notice></div> : null}

        <form action={createJobAction} className="mt-8 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              name="category_id"
              label="Categoria"
              defaultValue={selectedCategoryId}
              hint="Ajuda o pedido a aparecer para prestadores relevantes."
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </SelectField>

            <InputField
              name="title"
              label="Título do pedido"
              required
              placeholder="Ex.: Preciso reformar o banheiro do apartamento"
              hint="Use uma frase objetiva, como se estivesse abrindo um job."
            />
          </div>

          <TextareaField
            name="description"
            label="Descreva a necessidade"
            required
            rows={7}
            placeholder="Explique o problema, o que já tentou, o contexto do local e o resultado esperado."
            hint="Quanto melhor o contexto, melhor a qualidade dos lances."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              name="city"
              label="Cidade"
              required
              placeholder="Ex.: São Paulo"
            />
            <InputField
              name="neighborhood"
              label="Bairro"
              placeholder="Ex.: Vila Mariana"
              hint="Opcional, mas ajuda no matching local."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <InputField
              name="budget_min_brl"
              label="Orçamento mínimo"
              placeholder="300"
              hint="Opcional"
            />
            <InputField
              name="budget_max_brl"
              label="Orçamento máximo"
              placeholder="1500"
              hint="Opcional"
            />
            <InputField
              name="desired_deadline_at"
              type="date"
              label="Prazo desejado"
              defaultValue={defaultDeadline.toISOString().slice(0, 10)}
              min={minDate.toISOString().slice(0, 10)}
            />
          </div>

          <div className="rounded-[1.5rem] border border-border bg-surface-soft p-5">
            <p className="text-sm font-semibold text-slate-950">
              Publicação automática por 72 horas
            </p>
            <p className="mt-2 text-sm leading-7 text-muted-strong">
              O pedido nasce aberto no mural, recebe lances e depois você escolhe a
              melhor proposta para contratar.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit">Publicar pedido agora</Button>
          </div>
        </form>
      </section>
    </main>
  );
}
