const DEFAULT_API = "http://localhost:3001/api";

export function getNestApiBaseUrl(): string {
  return (
    process.env.NEST_API_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API
  );
}

export function isNestApiEnabled(): boolean {
  const flag = process.env.USE_NEST_API?.trim().toLowerCase();
  if (flag === "0" || flag === "false" || flag === "off") return false;
  return true;
}

export async function nestFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  if (!isNestApiEnabled()) return null;
  const url = `${getNestApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
