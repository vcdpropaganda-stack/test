import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getResolvedUserRole } from "@/lib/auth";
import { hasSupabaseEnv, SUPABASE_ENV_MISSING_MESSAGE } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildMessagePath } from "@/lib/utils";

type AuthenticatedContext = {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  user: User;
  role: string | null;
};

type RequireAuthenticatedUserOptions = {
  loginRedirect?: string;
};

type RequireProviderContextOptions = {
  loginRedirect?: string;
  unauthorizedRedirect?: string;
  missingProfileRedirect?: string;
  ensureProfile?: boolean;
};

type ClientBookingAccessOptions = {
  loginRedirect?: string;
  notFoundRedirect?: string;
};

type ProviderBookingAccessOptions = {
  loginRedirect?: string;
  unauthorizedRedirect?: string;
  notFoundRedirect?: string;
};

export async function requireAuthenticatedUser(
  options: RequireAuthenticatedUserOptions = {}
): Promise<AuthenticatedContext> {
  if (!hasSupabaseEnv()) {
    redirect(buildMessagePath(options.loginRedirect ?? "/login", SUPABASE_ENV_MISSING_MESSAGE));
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(options.loginRedirect ?? "/login");
  }

  const role = await getResolvedUserRole(supabase, user);

  return {
    supabase,
    user,
    role,
  };
}

export async function requireProviderContext(
  options: RequireProviderContextOptions = {}
) {
  const {
    supabase,
    user,
    role,
  } = await requireAuthenticatedUser({
    loginRedirect: options.loginRedirect,
  });

  if (role !== "provider") {
    redirect(options.unauthorizedRedirect ?? "/dashboard/client");
  }

  if (options.ensureProfile) {
    const fullName = String(user.user_metadata.full_name ?? user.email ?? "Prestador");
    const displayName = String(user.user_metadata.display_name ?? fullName);
    const phone = String(user.user_metadata.phone ?? "").trim() || null;

    await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email ?? "",
      full_name: fullName,
      phone,
      role: "provider",
    });

    const providerProfileResult = await supabase
      .from("provider_profiles")
      .upsert(
        {
          profile_id: user.id,
          display_name: displayName,
        },
        { onConflict: "profile_id" }
      )
      .select("id, display_name, plan")
      .single();

    if (providerProfileResult.error || !providerProfileResult.data) {
      redirect(
        options.missingProfileRedirect ??
          "/dashboard/provider?message=Não foi possível localizar o perfil do prestador."
      );
    }

    return {
      supabase,
      user,
      role,
      providerProfile: providerProfileResult.data,
    };
  }

  const providerProfileResult = await supabase
    .from("provider_profiles")
    .select("id, display_name, plan")
    .eq("profile_id", user.id)
    .single();

  if (providerProfileResult.error || !providerProfileResult.data) {
    redirect(
      options.missingProfileRedirect ??
        "/dashboard/provider?message=Não foi possível localizar o perfil do prestador."
    );
  }

  return {
    supabase,
    user,
    role,
    providerProfile: providerProfileResult.data,
  };
}

export async function requireClientBookingAccess(
  bookingId: string,
  options: ClientBookingAccessOptions = {}
) {
  const {
    supabase,
    user,
    role,
  } = await requireAuthenticatedUser({
    loginRedirect: options.loginRedirect,
  });

  const bookingResult = await supabase
    .from("bookings")
    .select(
      `
      id,
      client_id,
      provider_profile_id,
      service_id,
      status,
      service:services (
        slug
      )
    `
    )
    .eq("id", bookingId)
    .single();

  if (bookingResult.error || !bookingResult.data || bookingResult.data.client_id !== user.id) {
    redirect(
      options.notFoundRedirect ??
        "/dashboard/client/agendamentos?message=Agendamento não encontrado."
    );
  }

  const service = Array.isArray(bookingResult.data.service)
    ? bookingResult.data.service[0] ?? null
    : bookingResult.data.service;

  return {
    supabase,
    user,
    role,
    booking: {
      ...bookingResult.data,
      service,
    },
  };
}

export async function requireProviderBookingAccess(
  bookingId: string,
  options: ProviderBookingAccessOptions = {}
) {
  const {
    supabase,
    user,
    role,
    providerProfile,
  } = await requireProviderContext({
    loginRedirect: options.loginRedirect,
    unauthorizedRedirect: options.unauthorizedRedirect,
    missingProfileRedirect: options.notFoundRedirect,
  });

  const bookingResult = await supabase
    .from("bookings")
    .select("id, client_id, provider_profile_id, status")
    .eq("id", bookingId)
    .single();

  if (
    bookingResult.error ||
    !bookingResult.data ||
    bookingResult.data.provider_profile_id !== providerProfile.id
  ) {
    redirect(options.notFoundRedirect ?? "/dashboard/provider?message=Agendamento não encontrado.");
  }

  return {
    supabase,
    user,
    role,
    providerProfile,
    booking: bookingResult.data,
  };
}
