"use client";

import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { NAV_SECTIONS } from "@/data/portal-data";
import { MunicipalityLogo } from "@/components/ui/MunicipalityLogo";
import {
  SOCIAL_BRAND_ICONS,
  resolveSocialBrandId,
  type SocialBrandId,
} from "@/components/ui/social-icons";
import { Reveal } from "@/components/ui/reveal";
import { isExternalHref } from "@/lib/utils";
import { usePortalCms } from "@/components/cms/portal-cms";

export function Footer() {
  const { nav, contacto } = usePortalCms();
  const contact = contacto.contact;
  const socialLinks = nav.socialLinks?.length
    ? nav.socialLinks
    : contacto.socialLinks;
  const externalLinks = nav.externalLinks as Record<string, string>;

  return (
    <footer className="border-t border-white/10 bg-molina-deep text-emerald-100/80">
      <Reveal variant="up" durationMs={800} className="mx-auto max-w-7xl px-4 py-6 lg:py-7">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <MunicipalityLogo variant="dark" height={32} className="max-w-[160px]" />
            <p className="mt-2 text-xs leading-relaxed text-emerald-100/70">
              Municipalidad Distrital de La Molina. {contact.hours}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {socialLinks.map((social, index) => {
                const brandId = resolveSocialBrandId(
                  social.id,
                  social.label,
                  social.href,
                );
                const Icon = brandId
                  ? SOCIAL_BRAND_ICONS[brandId as SocialBrandId]
                  : null;
                if (!Icon) return null;
                return (
                  <a
                    key={`${brandId}-${index}`}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white transition-transform hover:scale-105"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" title={social.label} />
                  </a>
                );
              })}
            </div>
          </div>

          {NAV_SECTIONS.map((section) => (
            <div key={section.id}>
              <h3 className="text-sm font-bold text-white">{section.label}</h3>
              <ul className="mt-2 space-y-1.5">
                {section.children?.map((child) => {
                  const external = isExternalHref(child.href);
                  const className =
                    "text-xs transition-colors hover:text-molina-mint-light";
                  return (
                    <li key={`${section.id}-${child.label}`}>
                      {external ? (
                        <a
                          href={child.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={className}
                        >
                          {child.label}
                        </a>
                      ) : (
                        <Link href={child.href} className={className}>
                          {child.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-bold text-white">Contacto</h3>
            <ul className="mt-2 space-y-2 text-xs">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-molina-mint-light" />
                <Link href="/contacto" className="hover:text-molina-mint-light">
                  {contact.address}
                </Link>
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-molina-mint-light" />
                <a
                  href={`tel:${contact.phone.replace(/\D/g, "")}`}
                  className="hover:text-molina-mint-light"
                >
                  {contact.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-4 text-[11px] text-emerald-100/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Municipalidad Distrital de La Molina.
            Todos los derechos reservados.
          </p>
          <div className="flex gap-3">
            <Link href="/privacidad" className="hover:text-white">
              Política de privacidad
            </Link>
            <Link href="/accesibilidad" className="hover:text-white">
              Accesibilidad web
            </Link>
            <a
              href={externalLinks.transparencia}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              PTE
            </a>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
