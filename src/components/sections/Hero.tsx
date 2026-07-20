"use client";

import { useCallback, useEffect, useState } from "react";
import { SafeImage } from "@/components/ui/safe-image";
import { Parallax } from "@/components/ui/parallax";
import { Reveal } from "@/components/ui/reveal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePortalCms } from "@/components/cms/portal-cms";

export function Hero() {
  const { home } = usePortalCms();
  const slides = home.heroSlides;
  const [current, setCurrent] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      const len = Math.max(slides.length, 1);
      setCurrent((index + len) % len);
    },
    [slides.length],
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => goTo(current + 1), 7000);
    return () => clearInterval(timer);
  }, [current, goTo, slides.length]);

  const slide = slides[current] ?? slides[0];
  if (!slide) return null;

  return (
    <section className="relative bg-molina-deep" aria-label="Presentación principal">
      <div className="relative h-[320px] overflow-hidden sm:h-[400px] lg:h-[480px]">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              i === current ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={i !== current}
          >
            <Parallax speed={55} className="absolute inset-[-12%] h-[124%] w-full">
              <SafeImage
                src={s.imageUrl}
                alt={s.title}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
              />
            </Parallax>
            <div className="absolute inset-0 bg-gradient-to-l from-black/55 via-black/25 to-black/10" />
          </div>
        ))}

        <div className="absolute inset-0 z-10 flex items-end justify-start px-4 pb-16 sm:items-center sm:justify-end sm:px-6 sm:pb-0 lg:px-16">
          <Reveal
            key={slide.id}
            variant="left"
            delayMs={80}
            className="max-w-md text-left sm:text-right"
          >
            <h2 className="text-xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              {slide.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
              {slide.subtitle}
            </p>
            {slide.ctaOpenInNewTab && (
              <a
                href={slide.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-lg bg-molina-mint px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-molina-mint/30 transition-all hover:scale-[1.03] hover:bg-molina-mint-light"
              >
                {slide.ctaLabel}
              </a>
            )}
          </Reveal>
        </div>

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            aria-label="Diapositiva anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-1.5" role="tablist" aria-label="Carrusel principal">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Ir a diapositiva ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  "rounded-full transition-all",
                  i === current
                    ? "h-2.5 w-6 bg-white"
                    : "h-2.5 w-2.5 border border-white/70 bg-transparent hover:bg-white/40",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(current + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            aria-label="Diapositiva siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
