"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type RevealVariant = "up" | "down" | "left" | "right" | "scale" | "fade";

const HIDDEN: Record<RevealVariant, string> = {
  up: "opacity-0 translate-y-10",
  down: "opacity-0 -translate-y-10",
  left: "opacity-0 translate-x-10",
  right: "opacity-0 -translate-x-10",
  scale: "opacity-0 scale-95",
  fade: "opacity-0",
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delayMs?: number;
  durationMs?: number;
  once?: boolean;
  /** Fraction of element that must be visible (0–1) */
  threshold?: number;
  as?: "div" | "section" | "article" | "aside" | "li";
};

export function Reveal({
  children,
  className,
  variant = "up",
  delayMs = 0,
  durationMs = 700,
  once = true,
  threshold = 0.12,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, reduced, threshold]);

  const style: CSSProperties | undefined = reduced
    ? undefined
    : {
        transitionDuration: `${durationMs}ms`,
        transitionDelay: visible ? `${delayMs}ms` : "0ms",
      };

  return (
    <Tag
      ref={ref as never}
      className={cn(
        !reduced && "will-change-transform transition-[opacity,transform] ease-out",
        !reduced && !visible && HIDDEN[variant],
        !reduced && visible && "opacity-100 translate-x-0 translate-y-0 scale-100",
        className,
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}
