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

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Intensity in px at full section travel (positive = moves slower / classic parallax) */
  speed?: number;
  as?: "div" | "span";
};

/**
 * Lightweight parallax: element shifts opposite to scroll while in view.
 * Prefer for decorative layers (hero image), not interactive controls.
 */
export function Parallax({
  children,
  className,
  speed = 40,
  as: Tag = "div",
}: ParallaxProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let frame = 0;
    const update = () => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      // -1 at top entering, 0 centered-ish, 1 leaving bottom
      const progress = (viewH / 2 - (rect.top + rect.height / 2)) / viewH;
      setOffset(progress * speed);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, speed]);

  const style: CSSProperties | undefined = reduced
    ? undefined
    : { transform: `translate3d(0, ${offset}px, 0)` };

  return (
    <Tag
      ref={ref as never}
      className={cn(!reduced && "will-change-transform", className)}
      style={style}
    >
      {children}
    </Tag>
  );
}
