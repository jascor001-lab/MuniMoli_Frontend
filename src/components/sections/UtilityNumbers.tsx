"use client";

import { UTILITY_LINES } from "@/data/portal-data";
import { Reveal } from "@/components/ui/reveal";

export function UtilityNumbers() {
  return (
    <section
      className="bg-white py-10 lg:py-12"
      aria-labelledby="utility-numbers-heading"
    >
      <div className="mx-auto max-w-7xl px-4">
        <Reveal variant="up">
          <h2
            id="utility-numbers-heading"
            className="text-center text-xl font-bold text-molina-ink lg:text-2xl"
          >
            Números de utilidad
          </h2>
        </Reveal>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {UTILITY_LINES.map((line, index) => (
            <Reveal
              key={line.label}
              variant="up"
              delayMs={80 + index * 90}
            >
              <a
                href={`tel:${line.number.replace(/[^\d+]/g, "")}`}
                className="block rounded-sm bg-molina-deep px-5 py-4 font-medium text-white shadow-sm transition-colors hover:bg-molina-teal"
              >
                <p className="text-sm font-medium">
                  {line.label}:{" "}
                  <span className="font-bold">{line.number}</span>
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
