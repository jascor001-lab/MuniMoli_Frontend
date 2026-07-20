"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FieldLabel({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-1.5">
      <span className="block text-sm font-semibold text-molina-deep">
        {children}
      </span>
      {hint ? (
        <span className="mt-0.5 block text-xs text-molina-muted">{hint}</span>
      ) : null}
    </div>
  );
}

export function TextInput({
  label,
  hint,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-molina-mint focus:ring-2 focus:ring-molina-mint/20"
      />
    </label>
  );
}

export function TextArea({
  label,
  hint,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-molina-mint focus:ring-2 focus:ring-molina-mint/20"
      />
    </label>
  );
}

export function SelectField({
  label,
  hint,
  value,
  onChange,
  options,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-molina-mint focus:ring-2 focus:ring-molina-mint/20"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ToggleField({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1"
      />
      <span>
        <span className="block text-sm font-semibold text-molina-deep">
          {label}
        </span>
        {hint ? (
          <span className="mt-0.5 block text-xs text-molina-muted">{hint}</span>
        ) : null}
      </span>
    </label>
  );
}

export function EditorCard({
  title,
  subtitle,
  children,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5",
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-molina-deep">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-xs text-molina-muted">{subtitle}</p>
          ) : null}
        </div>
        {actions}
      </div>
      <div className="space-y-3">{children}</div>
    </article>
  );
}

export function SectionTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-full px-3.5 py-2 text-sm font-semibold transition",
            active === tab.id
              ? "bg-molina-deep text-white"
              : "bg-white text-molina-deep ring-1 ring-slate-200 hover:bg-slate-50",
          )}
        >
          {tab.label}
          {typeof tab.count === "number" ? (
            <span className="ml-1.5 opacity-70">({tab.count})</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
