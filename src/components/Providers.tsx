"use client";

import type { ReactNode } from "react";
import { SsoProvider } from "@/components/auth/SsoProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <SsoProvider>{children}</SsoProvider>;
}
