import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { CmsSessionUser } from "@/lib/cms/permissions";

export const CMS_COOKIE = "munimol_cms_session";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 horas

function secret(): string {
  return (
    process.env.CMS_AUTH_SECRET ||
    process.env.AUTH_SECRET ||
    "munimol-cms-dev-secret-change-me"
  );
}

type SessionPayload = CmsSessionUser & { exp: number };

function encode(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function decode(token: string): SessionPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret())
    .update(body)
    .digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (!payload?.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createSessionToken(user: CmsSessionUser): string {
  return encode({
    ...user,
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  });
}

export function readSessionFromToken(token: string | undefined): CmsSessionUser | null {
  if (!token) return null;
  const payload = decode(token);
  if (!payload) return null;
  const { exp: _exp, ...user } = payload;
  return user;
}

export async function getCmsSession(): Promise<CmsSessionUser | null> {
  const jar = await cookies();
  return readSessionFromToken(jar.get(CMS_COOKIE)?.value);
}

export function sessionCookieOptions(token: string) {
  return {
    name: CMS_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

export function clearSessionCookieOptions() {
  return {
    name: CMS_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}
