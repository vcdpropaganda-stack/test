import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
};

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & FieldProps;
type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & FieldProps;

const baseFieldClassName =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-slate-950 placeholder:text-muted outline-none hover:border-primary/30 focus:border-primary";

export function InputField({
  label,
  hint,
  error,
  id,
  className,
  ...props
}: InputFieldProps) {
  const fieldId = id ?? props.name;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-2 block text-sm font-medium text-slate-800"
      >
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(baseFieldClassName, error && "border-danger", className)}
        {...props}
      />
      {hint ? (
        <p id={`${fieldId}-hint`} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${fieldId}-error`} className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({
  label,
  hint,
  error,
  id,
  className,
  children,
  ...props
}: SelectFieldProps) {
  const fieldId = id ?? props.name;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-2 block text-sm font-medium text-slate-800"
      >
        {label}
      </label>
      <select
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(baseFieldClassName, error && "border-danger", className)}
        {...props}
      >
        {children}
      </select>
      {hint ? (
        <p id={`${fieldId}-hint`} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${fieldId}-error`} className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
