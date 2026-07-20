"use client";

import Link from "next/link";
import { Calendar, ExternalLink } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import { Card, CardContent } from "@/components/ui/card";
import { cn, isExternalHref } from "@/lib/utils";
import type { NewsCategory, NewsItem } from "@/types/portal";

export const NEWS_CATEGORY_COLORS: Record<NewsCategory, string> = {
  Obras: "bg-blue-100 text-blue-800",
  Cultura: "bg-purple-100 text-purple-800",
  Seguridad: "bg-red-100 text-red-800",
  Deportes: "bg-orange-100 text-orange-800",
  General: "bg-slate-100 text-slate-800",
};

type NewsCardProps = {
  item: NewsItem;
  className?: string;
  featured?: boolean;
};

export function NewsCard({ item, className, featured = false }: NewsCardProps) {
  const href = item.href ?? `/noticias/${item.slug}`;
  const external = isExternalHref(href);

  const body = (
    <Card
      className={cn(
        "group h-full overflow-hidden transition-shadow hover:shadow-lg",
        featured && "sm:flex sm:flex-row",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          featured
            ? "aspect-[16/10] sm:aspect-auto sm:w-2/5 sm:min-h-[220px]"
            : "aspect-[16/10]",
        )}
      >
        <SafeImage
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={
            featured
              ? "(max-width: 640px) 100vw, 40vw"
              : "(max-width: 768px) 100vw, 25vw"
          }
        />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold",
            NEWS_CATEGORY_COLORS[item.category],
          )}
        >
          {item.category}
        </span>
      </div>
      <CardContent
        className={cn("flex flex-col p-5", featured && "sm:w-3/5 sm:justify-center")}
      >
        <div className="flex items-center gap-1.5 text-xs text-molina-muted">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(`${item.publishedAt}T12:00:00`).toLocaleDateString("es-PE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          {external && (
            <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-60" aria-hidden />
          )}
        </div>
        <h3
          className={cn(
            "mt-2 font-bold text-molina-ink group-hover:text-molina-teal",
            featured ? "line-clamp-3 text-lg lg:text-xl" : "line-clamp-2",
          )}
        >
          {item.title}
        </h3>
        <p
          className={cn(
            "mt-2 text-sm text-molina-muted",
            featured ? "line-clamp-3" : "line-clamp-2",
          )}
        >
          {item.excerpt}
        </p>
        <span className="mt-3 text-sm font-semibold text-molina-teal group-hover:underline">
          Leer más →
        </span>
      </CardContent>
    </Card>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className="block h-full">
      {body}
    </Link>
  );
}
