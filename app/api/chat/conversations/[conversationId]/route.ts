import { NextResponse } from "next/server";
import { getConversationDetailForViewer, markConversationAsRead } from "@/lib/conversations";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ conversationId: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { conversationId } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const conversation = await getConversationDetailForViewer(supabase, conversationId, user);

  if (!conversation) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await markConversationAsRead(supabase, conversationId, user.id);

  return NextResponse.json({
    conversation,
  });
}
