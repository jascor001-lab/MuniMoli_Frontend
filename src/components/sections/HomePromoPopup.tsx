"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import { usePortalCms } from "@/components/cms/portal-cms";
import { cn } from "@/lib/utils";
import type { HomePromoPopupItem } from "@/types/portal";

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function PopupLink({
  item,
  className,
  style,
  children,
  onNavigate,
}: {
  item: HomePromoPopupItem;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  const href = item.href || "/";
  const external = isExternalHref(href) || item.openInNewTab;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
        onClick={onNavigate}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} style={style} onClick={onNavigate}>
      {children}
    </Link>
  );
}

export function HomePromoPopup() {
  const { home } = usePortalCms();
  const enabled = home.promoPopupsEnabled !== false;
  const items = (home.promoPopups ?? []).filter(
    (item) => item.enabled !== false && item.imageUrl,
  );
  const railItems = items.filter((item) => item.placement !== "feature");
  const featureItems = items.filter((item) => item.placement === "feature");

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [featureIndex, setFeatureIndex] = useState(0);
  const [slideKey, setSlideKey] = useState(0);

  useEffect(() => {
    if (!enabled || items.length === 0) return;
    const timer = window.setTimeout(() => setOpen(true), 280);
    return () => window.clearTimeout(timer);
  }, [enabled, items.length]);

  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 280);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const goFeature = useCallback(
    (delta: number) => {
      const len = featureItems.length;
      if (len <= 1) return;
      setFeatureIndex((i) => (i + delta + len) % len);
      setSlideKey((k) => k + 1);
    },
    [featureItems.length],
  );

  if ((!open && !closing) || items.length === 0) return null;

  const feature = featureItems[featureIndex] ?? featureItems[0];

  return (
    <div
      className={cn(
        "fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-8",
        closing && "pointer-events-none",
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Promociones municipales"
    >
      <button
        type="button"
        className={cn(
          "absolute inset-0 bg-black/75 backdrop-blur-sm animate-popup-backdrop",
          closing && "opacity-0 transition-opacity duration-300",
        )}
        aria-label="Cerrar popup"
        onClick={close}
      />

      <div
        className={cn(
          "relative z-10 flex max-h-[90vh] items-center gap-3 sm:gap-5",
          closing &&
            "translate-y-4 scale-[0.96] opacity-0 transition-all duration-300 ease-in",
        )}
      >
        {railItems.length > 0 ? (
          <aside className="hidden h-[min(78vh,640px)] w-[118px] shrink-0 flex-col justify-between gap-2.5 sm:flex md:w-[140px]">
            {railItems.map((item, index) => (
              <PopupLink
                key={item.id}
                item={item}
                onNavigate={close}
                className="group relative min-h-0 flex-1 animate-popup-rail overflow-hidden rounded-2xl bg-white shadow-xl transition hover:scale-[1.03] hover:shadow-2xl"
                style={
                  {
                    animationDelay: `${120 + index * 90}ms`,
                  } as React.CSSProperties
                }
              >
                <SafeImage
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="140px"
                />
                <span className="sr-only">{item.title}</span>
              </PopupLink>
            ))}
          </aside>
        ) : null}

        <div className="relative w-[min(100vw-1.5rem,380px)] animate-popup-feature sm:w-[420px]">
          <button
            type="button"
            onClick={close}
            className="absolute -right-2 -top-2 z-30 flex h-8 w-8 animate-popup-close items-center justify-center rounded-full bg-white text-slate-800 shadow-lg transition hover:scale-110 hover:bg-slate-100 sm:-right-3 sm:-top-3 sm:h-9 sm:w-9"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
          </button>

          {feature ? (
            <div className="relative h-[min(78vh,640px)] overflow-hidden rounded-2xl bg-white shadow-2xl">
              <PopupLink
                key={`${feature.id}-${slideKey}`}
                item={feature}
                onNavigate={close}
                className="absolute inset-0 block animate-popup-slide"
              >
                <SafeImage
                  src={feature.imageUrl}
                  alt={feature.title}
                  fill
                  className="object-cover"
                  sizes="420px"
                  priority
                />
              </PopupLink>

              {featureItems.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => goFeature(-1)}
                    className="absolute left-2 top-[28%] z-20 flex h-8 w-8 items-center justify-center text-white drop-shadow-md transition hover:scale-110 sm:left-3"
                    aria-label="Promoción anterior"
                  >
                    <ChevronLeft className="h-8 w-8" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => goFeature(1)}
                    className="absolute right-2 top-[28%] z-20 flex h-8 w-8 items-center justify-center text-white drop-shadow-md transition hover:scale-110 sm:right-3"
                    aria-label="Promoción siguiente"
                  >
                    <ChevronRight className="h-8 w-8" strokeWidth={2.5} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                    {featureItems.map((item, i) => (
                      <button
                        key={item.id}
                        type="button"
                        aria-label={`Ver ${item.title}`}
                        onClick={() => {
                          setFeatureIndex(i);
                          setSlideKey((k) => k + 1);
                        }}
                        className={cn(
                          "h-2 rounded-full bg-white shadow transition-all",
                          i === featureIndex
                            ? "w-5 opacity-100"
                            : "w-2 opacity-50 hover:opacity-80",
                        )}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          ) : null}

          {railItems.length > 0 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:hidden">
              {railItems.map((item, index) => (
                <PopupLink
                  key={item.id}
                  item={item}
                  onNavigate={close}
                  className="relative h-[72px] w-[72px] shrink-0 animate-popup-rail overflow-hidden rounded-xl bg-white shadow-md"
                  style={
                    {
                      animationDelay: `${160 + index * 70}ms`,
                    } as React.CSSProperties
                  }
                >
                  <SafeImage
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                </PopupLink>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
