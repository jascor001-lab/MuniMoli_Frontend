export const PLATAFORMA_DIGITAL_PATH = "/plataforma-digital";

export function plataformaDigitalUrl(options?: {
  hash?: string;
  query?: string;
}): string {
  const params = options?.query
    ? `?q=${encodeURIComponent(options.query)}`
    : "";
  const hash = options?.hash ? `#${options.hash}` : "";
  return `${PLATAFORMA_DIGITAL_PATH}${params}${hash}`;
}

export function openPlataformaDigital(options?: {
  hash?: string;
  query?: string;
}): void {
  window.open(
    plataformaDigitalUrl(options),
    "_blank",
    "noopener,noreferrer",
  );
}
