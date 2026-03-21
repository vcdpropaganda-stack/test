import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";

export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return createBrowserClient(url, anonKey);
}
