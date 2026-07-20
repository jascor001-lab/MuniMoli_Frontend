import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Detecta URLs absolutas (http/https) para abrirlas como enlace externo */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
