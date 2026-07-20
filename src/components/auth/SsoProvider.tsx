"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  SSO_CONFIG,
  buildLogoutUrl,
  clearSession,
  getStoredSession,
  initiateSsoLogin,
  openAuthenticatedApp,
  type SsoSession,
} from "@/lib/sso";

interface SsoContextValue {
  session: SsoSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (returnTo?: string) => void;
  signOut: () => void;
  openApp: (appUrl: string) => void;
}

const SsoContext = createContext<SsoContextValue | null>(null);

export function SsoProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SsoSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSession(getStoredSession());
    setIsLoading(false);
  }, []);

  const signIn = useCallback((returnTo = window.location.href) => {
    initiateSsoLogin(returnTo);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
    if (process.env.NODE_ENV === "development" && !SSO_CONFIG.issuerUrl) {
      return;
    }
    window.location.href = buildLogoutUrl();
  }, []);

  const openApp = useCallback(
    (appUrl: string) => {
      if (!session) {
        initiateSsoLogin(appUrl);
        return;
      }
      openAuthenticatedApp(appUrl, session.accessToken);
    },
    [session],
  );

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: !!session,
      isLoading,
      signIn,
      signOut,
      openApp,
    }),
    [session, isLoading, signIn, signOut, openApp],
  );

  return <SsoContext.Provider value={value}>{children}</SsoContext.Provider>;
}

export function useSso(): SsoContextValue {
  const ctx = useContext(SsoContext);
  if (!ctx) {
    throw new Error("useSso debe usarse dentro de SsoProvider");
  }
  return ctx;
}
