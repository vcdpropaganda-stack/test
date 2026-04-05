function getOptionalEnv(name: string) {
  return process.env[name];
}

export const SUPABASE_ENV_MISSING_MESSAGE =
  "O ambiente do Supabase ainda não está configurado nesta implantação.";

export function hasSupabaseEnv() {
  const url = getOptionalEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey =
    getOptionalEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
    getOptionalEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY");

  return Boolean(url && anonKey);
}

export function getSupabaseEnv() {
  const anonKey =
    getOptionalEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
    getOptionalEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY");

  return {
    url: getOptionalEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey,
  };
}
