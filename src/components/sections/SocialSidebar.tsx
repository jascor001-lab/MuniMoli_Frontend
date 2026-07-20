"use client";

import {
  SOCIAL_BRAND_ICONS,
  type SocialBrandId,
} from "@/components/ui/social-icons";
import { cn } from "@/lib/utils";
import { usePortalCms } from "@/components/cms/portal-cms";

export function SocialSidebar({ className }: { className?: string }) {
  const { nav, contacto } = usePortalCms();
  const socialLinks = nav.socialLinks?.length
    ? nav.socialLinks
    : contacto.socialLinks;

  return (
    <aside
      className={cn(
        "pointer-events-none fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 lg:block",
        className,
      )}
      aria-label="Redes sociales oficiales"
    >
      <ul className="pointer-events-auto flex flex-col gap-2 rounded-r-2xl bg-molina-deep/95 p-2 shadow-lg shadow-molina-deep/30 ring-1 ring-white/10 backdrop-blur-sm">
        {socialLinks.map((social) => {
          const Icon = SOCIAL_BRAND_ICONS[social.id as SocialBrandId];
          if (!Icon) return null;
          return (
            <li key={social.id}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.label} — abrir en nueva pestaña`}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition-transform hover:scale-110 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-molina-mint"
              >
                <Icon className="h-5 w-5" title={social.label} />
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
