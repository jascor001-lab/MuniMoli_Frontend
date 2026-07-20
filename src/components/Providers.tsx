"use client";

import type { ReactNode } from "react";
import { SsoProvider } from "@/components/auth/SsoProvider";
import { PortalCmsProvider } from "@/components/cms/portal-cms";
import type { PortalCmsBundle } from "@/lib/cms/portal-content";

export function Providers({
  children,
  cms,
}: {
  children: ReactNode;
  cms?: PortalCmsBundle | null;
}) {
  return (
    <SsoProvider>
      <PortalCmsProvider value={cms}>{children}</PortalCmsProvider>
    </SsoProvider>
  );
}
