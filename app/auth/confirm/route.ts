import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { SUPABASE_ENV_MISSING_MESSAGE, hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildMessagePath } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!hasSupabaseEnv()) {
    redirect(`${origin}${buildMessagePath("/login", SUPABASE_ENV_MISSING_MESSAGE)}`);
  }

  const supabase = await createSupabaseServerClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      redirect(`${origin}${next}`);
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as
        | "signup"
        | "invite"
        | "magiclink"
        | "recovery"
        | "email_change"
        | "email",
      token_hash: tokenHash,
    });

    if (!error) {
      redirect(`${origin}${next}`);
    }
  }

  redirect(`${origin}/login?message=Link+de+confirma%C3%A7%C3%A3o+inv%C3%A1lido+ou+expirado.`);
}
