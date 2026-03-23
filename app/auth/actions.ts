"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getResolvedUserRole } from "@/lib/auth";
import { getSupabaseEnv } from "@/lib/env";
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
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(buildRedirect("/login", "Não foi possível entrar. Verifique o e-mail e a senha."));
  }

  const user = data.user;
  const role = await getResolvedUserRole(supabase, user);

  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  if (role === "provider") {
    redirect("/dashboard/provider");
  }

  redirect("/dashboard/client");
}

export async function signUpAction(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "client");
  const phone = String(formData.get("phone") ?? "").trim();
  const isProvider = role === "provider";
  const displayName = isProvider
    ? String(formData.get("display_name") ?? "").trim() || fullName
    : fullName;

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

export async function resendConfirmationAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect(buildRedirect("/login", "Informe seu e-mail para reenviar a confirmação."));
  }

  const baseUrl = await getBaseUrl();
  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) {
    redirect(buildRedirect("/login", "O ambiente ainda não está pronto para reenviar confirmações."));
  }

  const supabase = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${baseUrl}/auth/confirm?next=/dashboard`,
    },
  });

  if (error) {
    redirect(
      buildRedirect(
        "/login",
        "Não foi possível reenviar o link agora. Confira o e-mail informado e tente novamente."
      )
    );
  }

  redirect(
    buildRedirect(
      "/login",
      "Enviamos um novo link de confirmação. Verifique seu e-mail mais recente."
    )
  );
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect(buildRedirect("/recuperar-senha", "Informe seu e-mail para recuperar a senha."));
  }

  const baseUrl = await getBaseUrl();
  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) {
    redirect(
      buildRedirect(
        "/recuperar-senha",
        "O ambiente ainda não está pronto para redefinição de senha."
      )
    );
  }

  const supabase = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/confirm?next=/redefinir-senha`,
  });

  if (error) {
    redirect(
      buildRedirect(
        "/recuperar-senha",
        "Não foi possível enviar o link de recuperação agora. Tente novamente."
      )
    );
  }

  redirect(
    buildRedirect(
      "/login",
      "Enviamos um link para redefinir sua senha. Verifique seu e-mail."
    )
  );
}

export async function updatePasswordAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("password_confirm") ?? "");

  if (password.length < 6) {
    redirect(buildRedirect("/redefinir-senha", "Use uma senha com pelo menos 6 caracteres."));
  }

  if (password !== passwordConfirm) {
    redirect(buildRedirect("/redefinir-senha", "As senhas não coincidem."));
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(buildRedirect("/login", "Seu link de recuperação expirou. Solicite um novo."));
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirect(
      buildRedirect(
        "/redefinir-senha",
        "Não foi possível atualizar sua senha. Tente novamente."
      )
    );
  }

  redirect(buildRedirect("/login", "Senha redefinida com sucesso. Faça seu login."));
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
