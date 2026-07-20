"use client";

import Link from "next/link";
import { PLATAFORMA_DIGITAL_PATH } from "@/lib/routes";
import { isExternalHref } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { usePortalCms } from "@/components/cms/portal-cms";

export function NewsTicker() {
  const { home } = usePortalCms();
  const tickerItems = home.tickerItems;
  const opensBlank = (href: string) =>
    isExternalHref(href) || href.startsWith(PLATAFORMA_DIGITAL_PATH);

  return (
    <Reveal variant="down" durationMs={500} once>
      <div
        className="overflow-hidden border-b border-emerald-900/10 bg-molina-teal py-2 text-white"
        aria-live="polite"
      >
        <div className="flex whitespace-nowrap">
          <div className="animate-ticker flex gap-8 px-4">
            {[...tickerItems, ...tickerItems].map((item, i) => {
              const blank = opensBlank(item.href);
              const className =
                "inline-flex items-center gap-2 text-sm hover:underline";
              const content = (
                <>
                  <span className="rounded bg-molina-mint px-2 py-0.5 text-xs font-bold text-molina-deep">
                    MoliNoticias
                  </span>
                  {item.text}
                </>
              );

              if (isExternalHref(item.href) || blank) {
                return (
                  <a
                    key={`${item.id}-${i}`}
                    href={item.href}
                    target={blank ? "_blank" : undefined}
                    rel={blank ? "noopener noreferrer" : undefined}
                    className={className}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={`${item.id}-${i}`}
                  href={item.href}
                  className={className}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
