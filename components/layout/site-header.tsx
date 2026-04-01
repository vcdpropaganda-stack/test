import { Header } from "@/components/ui/header-3";
import { getResolvedUserRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getDashboardHref(role: string | null | undefined) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "provider") return "/dashboard/provider/pedidos";
  return "/dashboard/client/pedidos";
}

export async function SiteHeader() {
  let initialAuth = {
    isAuthenticated: false,
    dashboardHref: "/dashboard/client",
  };

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const role = await getResolvedUserRole(supabase, user);

    initialAuth = {
      isAuthenticated: Boolean(user),
      dashboardHref: getDashboardHref(role),
    };
  } catch {
    initialAuth = {
      isAuthenticated: false,
      dashboardHref: "/dashboard/client",
    };
  }

  return (
    <Header
      isAuthenticated={initialAuth.isAuthenticated}
      dashboardHref={initialAuth.dashboardHref}
    />
  );
}
