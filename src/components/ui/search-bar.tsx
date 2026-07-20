"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: "md" | "lg";
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "¿Qué trámite deseas realizar hoy?",
  className,
  size = "lg",
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative w-full max-w-2xl", className)}
      role="search"
    >
      <label htmlFor="smart-search" className="sr-only">
        Buscar trámites y servicios
      </label>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-molina-muted"
        aria-hidden
      />
      <input
        id="smart-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border-0 bg-white/95 pl-12 pr-32 text-molina-ink shadow-xl",
          "placeholder:text-molina-muted backdrop-blur-sm",
          "focus:ring-4 focus:ring-molina-mint/30 transition-shadow duration-200",
          size === "lg" ? "h-14 text-base" : "h-11 text-sm",
        )}
      />
      <button
        type="submit"
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-molina-mint px-5 font-semibold text-white",
          "transition-colors hover:bg-molina-mint-light",
          size === "lg" ? "h-10 text-sm" : "h-8 text-xs",
        )}
      >
        Buscar
      </button>
    </form>
  );
}
