import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { sendConversationMessage } from "@/lib/chat";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | { conversationId?: string; body?: string }
    | null;

  const conversationId = String(payload?.conversationId ?? "").trim();
  const body = String(payload?.body ?? "");

  if (!conversationId || !body.trim()) {
    return NextResponse.json({ error: "message_invalid" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await sendConversationMessage(supabase, user, conversationId, body);
    revalidatePath(`/dashboard/mensagens/${conversationId}`);
    revalidatePath("/dashboard/mensagens");
    revalidatePath("/dashboard/admin");
    return NextResponse.json({
      success: true,
      redacted: result.moderation.wasRedacted,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "message_send_failed" },
      { status: 400 }
    );
  }
}
