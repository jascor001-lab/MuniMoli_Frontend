/**
 * Configuración SSO — patrón similar a la Plataforma Digital de Miraflores.
 * Las URLs se definen en variables de entorno para cada ambiente.
 */
export const SSO_CONFIG = {
  issuerUrl: process.env.NEXT_PUBLIC_SSO_ISSUER_URL ?? "",
  clientId: process.env.NEXT_PUBLIC_SSO_CLIENT_ID ?? "munimol-portal",
  loginUrl:
    process.env.NEXT_PUBLIC_SSO_LOGIN_URL ?? "/api/auth/login",
  logoutUrl:
    process.env.NEXT_PUBLIC_SSO_LOGOUT_URL ?? "/api/auth/logout",
  callbackUrl:
    process.env.NEXT_PUBLIC_SSO_CALLBACK_URL ?? "/api/auth/callback",
} as const;

export interface SsoSession {
  userId: string;
  displayName: string;
  email: string;
  documentType: "DNI" | "RUC" | "CE";
  documentNumber: string;
  accessToken: string;
}

const SESSION_KEY = "munimol_sso_session";

export function getStoredSession(): SsoSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SsoSession) : null;
  } catch {
    return null;
  }
}

export function storeSession(session: SsoSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

/** Construye la URL de inicio de sesión SSO con retorno al trámite solicitado. */
export function buildLoginUrl(returnTo: string): string {
  const base = SSO_CONFIG.loginUrl;
  const params = new URLSearchParams({
    client_id: SSO_CONFIG.clientId,
    return_to: returnTo,
  });

  if (SSO_CONFIG.issuerUrl) {
    params.set("issuer", SSO_CONFIG.issuerUrl);
  }

  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}${params.toString()}`;
}

/** Redirige al proveedor SSO (o simula sesión en desarrollo). */
export function initiateSsoLogin(returnTo: string): void {
  if (process.env.NODE_ENV === "development" && !SSO_CONFIG.issuerUrl) {
    storeSession({
      userId: "dev-user",
      displayName: "Vecino Demo",
      email: "vecino@demo.lamolina.gob.pe",
      documentType: "DNI",
      documentNumber: "12345678",
      accessToken: "dev-token",
    });
    window.location.href = returnTo;
    return;
  }

  window.location.href = buildLoginUrl(returnTo);
}

/** Abre una aplicación externa pasando el token SSO como en Miraflores. */
export function openAuthenticatedApp(appUrl: string, accessToken: string): void {
  const url = new URL(appUrl, window.location.origin);
  url.searchParams.set("sso_token", accessToken);
  window.location.href = url.toString();
}

export function buildLogoutUrl(): string {
  const params = new URLSearchParams({
    client_id: SSO_CONFIG.clientId,
    post_logout_redirect_uri: window.location.origin,
  });
  const base = SSO_CONFIG.logoutUrl;
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}${params.toString()}`;
}
