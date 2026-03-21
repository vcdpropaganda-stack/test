function getOptionalEnv(name: string) {
  return process.env[name];
}

export function getSupabaseEnv() {
  const anonKey =
    getOptionalEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
    getOptionalEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY");

  return {
    url: getOptionalEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey,
    databaseUrl: getOptionalEnv("DATABASE_URL"),
  };
}
