import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SocialSidebar } from "@/components/sections/SocialSidebar";
import { SafeImage } from "@/components/ui/safe-image";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { NEWS_CATEGORY_COLORS } from "@/components/sections/NewsCard";
import { getNoticiasCmsContent } from "@/lib/cms/portal-content";
import type { NewsItem } from "@/types/portal";

type Props = { params: Promise<{ slug: string }> };

function getNews(): NewsItem[] {
  const cms = getNoticiasCmsContent();
  return cms.items?.length ? cms.items : [];
}

export function generateStaticParams() {
  return getNews().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getNews().find((n) => n.slug === slug);
  if (!item) return { title: "Noticia" };
  return {
    title: `${item.title} | Noticias | Municipalidad de La Molina`,
    description: item.excerpt,
  };
}

export default async function NoticiaDetallePage({ params }: Props) {
  const { slug } = await params;
  const item = getNews().find((n) => n.slug === slug);
  if (!item) notFound();

  const body =
    (item as NewsItem & { body?: string }).body?.trim() || item.excerpt;

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <main>
        <article>
          <section className="relative border-b border-emerald-900/10">
            <div className="relative aspect-[21/9] max-h-[420px] w-full overflow-hidden bg-slate-200">
              <SafeImage
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-molina-deep/80 via-molina-deep/20 to-transparent" />
            </div>
            <div className="mx-auto max-w-3xl px-4">
              <div className="relative -mt-16 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:-mt-20 sm:p-8">
                <Reveal variant="up">
                  <Link
                    href="/noticias"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-molina-teal hover:text-molina-mint"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a noticias
                  </Link>
                  <Badge
                    className={`mt-4 ${NEWS_CATEGORY_COLORS[item.category]}`}
                  >
                    {item.category}
                  </Badge>
                  <h1 className="mt-3 text-2xl font-bold leading-tight text-molina-deep sm:text-3xl">
                    {item.title}
                  </h1>
                  <p className="mt-3 flex items-center gap-1.5 text-sm text-molina-muted">
                    <Calendar className="h-4 w-4" />
                    {new Date(`${item.publishedAt}T12:00:00`).toLocaleDateString(
                      "es-PE",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                </Reveal>
              </div>
            </div>
          </section>

          <section className="py-10 lg:py-14">
            <div className="mx-auto max-w-3xl px-4">
              <Reveal variant="up">
                <div className="space-y-4 text-base leading-8 text-molina-ink">
                  {body.split(/\n+/).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
