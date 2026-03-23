import { redirect } from "next/navigation";
import { getResolvedUserRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardIndexPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = await getResolvedUserRole(supabase, user);

  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  if (role === "provider") {
    redirect("/dashboard/provider");
  }

  redirect("/dashboard/client");
}
