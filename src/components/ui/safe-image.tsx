"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const IMAGE_FALLBACK = "/images/placeholder.svg";

type SafeImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
  fallbackSrc?: string;
};

export function SafeImage({
  src,
  alt,
  fallbackSrc = IMAGE_FALLBACK,
  className,
  onError,
  unoptimized,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [useGradient, setUseGradient] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setUseGradient(false);
  }, [src]);

  const isSvg =
    currentSrc.endsWith(".svg") || fallbackSrc.endsWith(".svg");

  if (useGradient) {
    return (
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-molina-deep via-molina-teal to-emerald-800",
          className,
        )}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      unoptimized={unoptimized ?? isSvg}
      className={className}
      onError={(e) => {
        onError?.(e);
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        } else {
          setUseGradient(true);
        }
      }}
    />
  );
}
