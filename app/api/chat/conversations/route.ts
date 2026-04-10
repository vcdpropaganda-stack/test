import { NextResponse } from "next/server";
import { getResolvedUserRole } from "@/lib/auth";
import { getConversationListForViewer } from "@/lib/conversations";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const resolvedRole = (await getResolvedUserRole(supabase, user)) ?? "client";
  const role =
    resolvedRole === "provider" || resolvedRole === "admin" ? resolvedRole : "client";
  const conversations = await getConversationListForViewer(supabase, user, role);

  return NextResponse.json({
    role,
    conversations,
  });
}
