import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardIndexPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = String(user.user_metadata.role ?? "client");

  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  if (role === "provider") {
    redirect("/dashboard/provider");
  }

  redirect("/dashboard/client");
}
