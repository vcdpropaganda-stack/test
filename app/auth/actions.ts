"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function buildRedirect(path: string, message: string) {
  const params = new URLSearchParams({ message });
  return `${path}?${params.toString()}`;
}

async function getBaseUrl() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return origin;
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(buildRedirect("/login", "Não foi possível entrar. Verifique o e-mail e a senha."));
  }

  redirect("/dashboard");
}

export async function signUpAction(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "client");
  const phone = String(formData.get("phone") ?? "").trim();
  const displayName =
    String(formData.get("display_name") ?? "").trim() || fullName;

  const baseUrl = await getBaseUrl();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${baseUrl}/auth/confirm?next=/dashboard`,
      data: {
        full_name: fullName,
        role,
        phone,
        display_name: displayName,
      },
    },
  });

  if (error) {
    redirect(buildRedirect("/cadastro", "Não foi possível concluir o cadastro."));
  }

  if (data.session?.user) {
    redirect("/dashboard");
  }

  redirect(
    buildRedirect(
      "/login",
      "Cadastro realizado. Verifique seu e-mail para confirmar a conta."
    )
  );
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
