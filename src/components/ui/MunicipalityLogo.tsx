import Image from "next/image";
import { cn } from "@/lib/utils";

type MunicipalityLogoProps = {
  /** "light" = fondo claro (logo a color); "dark" = fondo oscuro (logo blanco) */
  variant?: "light" | "dark";
  className?: string;
  height?: number;
  priority?: boolean;
};

const LOGO_ASSETS = {
  light: {
    src: "/images/brand/logo-munimolina-color.svg",
    width: 245,
    height: 44,
  },
  dark: {
    src: "/images/brand/logo-munimolina.svg",
    width: 159,
    height: 28,
  },
} as const;

export function MunicipalityLogo({
  variant = "light",
  className,
  height,
  priority = false,
}: MunicipalityLogoProps) {
  const asset = LOGO_ASSETS[variant];
  const displayHeight = height ?? asset.height;
  const displayWidth = Math.round((displayHeight / asset.height) * asset.width);

  return (
    <Image
      src={asset.src}
      alt="Municipalidad Distrital de La Molina"
      width={displayWidth}
      height={displayHeight}
      unoptimized
      priority={priority}
      className={cn("h-auto w-auto shrink-0", className)}
      style={{ height: displayHeight, width: "auto", maxWidth: "100%" }}
    />
  );
}
