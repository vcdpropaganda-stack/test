import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  browserClient = createBrowserClient(url, anonKey);
  return browserClient;
}
