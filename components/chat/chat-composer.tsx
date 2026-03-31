"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { SendHorizontal, Shield } from "lucide-react";
import { sendConversationMessageAction } from "@/app/dashboard/mensagens/actions";

type ChatComposerProps = {
  conversationId: string;
};

function ComposerSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-slate-950 shadow-[0_18px_38px_rgba(37,211,102,0.28)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={pending ? "Enviando mensagem" : "Enviar mensagem"}
    >
      <SendHorizontal className="h-5 w-5" />
    </button>
  );
}

function resizeTextarea(textarea: HTMLTextAreaElement | null) {
  if (!textarea) {
    return;
  }

  textarea.style.height = "0px";
  textarea.style.height = `${Math.min(textarea.scrollHeight, 176)}px`;
}

export function ChatComposer({ conversationId }: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    resizeTextarea(textareaRef.current);
  }, []);

  return (
    <form
      action={sendConversationMessageAction}
      className="border-t border-slate-200 bg-white/92 px-3 py-3 backdrop-blur-xl sm:px-5 sm:py-4"
    >
      <input type="hidden" name="conversation_id" value={conversationId} />
      <div className="flex items-end gap-3 rounded-[1.8rem] border border-slate-200 bg-slate-50/90 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <textarea
          ref={textareaRef}
          name="body"
          required
          rows={1}
          placeholder="Escreva uma mensagem. Enter envia, Shift+Enter quebra linha."
          className="max-h-44 min-h-[1.6rem] w-full resize-none bg-transparent px-1 text-[15px] leading-6 text-slate-900 outline-none placeholder:text-slate-500"
          onInput={(event) => resizeTextarea(event.currentTarget)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <ComposerSubmitButton />
      </div>
      <div className="mt-2 flex items-center gap-2 px-2 text-[11px] text-slate-500">
        <Shield className="h-3.5 w-3.5" />
        Contatos diretos sao mascarados automaticamente por seguranca.
      </div>
    </form>
  );
}
