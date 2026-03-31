import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function getResolvedUserRole(
  supabase: SupabaseClient,
  user: User | null
) {
  if (!user) {
    return null;
  }

  const metadataRole = String(user.user_metadata.role ?? "").trim();

  if (metadataRole === "admin" || metadataRole === "provider" || metadataRole === "client") {
    return metadataRole;
  }

  const profileResult = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileResult.data?.role) {
    return String(profileResult.data.role);
  }

  return String(user.user_metadata.role ?? "client");
}
