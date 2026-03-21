"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { signUpAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { InputField, SelectField } from "@/components/ui/input";

export function SignUpForm() {
  const [role, setRole] = useState<"client" | "provider">("client");
  const displayNameHintId = useId();
  const isProvider = role === "provider";

  return (
    <form action={signUpAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          name="full_name"
          required
          autoComplete="name"
          label="Nome completo"
          placeholder="Seu nome"
        />

        <InputField
          name="phone"
          autoComplete="tel"
          label="Telefone"
          placeholder="(11) 99999-9999"
          hint="Opcional, mas útil para contato e agendamento."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          name="email"
          type="email"
          required
          autoComplete="email"
          label="E-mail"
          placeholder="voce@exemplo.com"
        />

        <InputField
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          label="Senha"
          placeholder="Mínimo de 6 caracteres"
          hint="Use pelo menos 6 caracteres."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          name="role"
          value={role}
          onChange={(event) => setRole(event.target.value as "client" | "provider")}
          label="Perfil"
          hint="Você pode criar conta como cliente ou prestador."
        >
          <option value="client">Cliente</option>
          <option value="provider">Prestador de serviço</option>
        </SelectField>

        {isProvider ? (
          <InputField
            name="display_name"
            label="Nome público"
            placeholder="Ex.: Studio Monarca"
            hint="Se ficar em branco, usaremos seu nome completo."
          />
        ) : (
          <div
            className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm leading-7 text-muted-strong"
            aria-live="polite"
            id={displayNameHintId}
          >
            Para clientes, usaremos apenas seu nome completo na conta. O campo
            de nome público aparece somente para prestadores.
          </div>
        )}
      </div>

      <Button fullWidth className="bg-slate-950 hover:bg-primary-strong">
        Criar conta
      </Button>

      <p className="text-sm text-muted-strong">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-primary-strong">
          Entrar agora
        </Link>
      </p>
    </form>
  );
}
