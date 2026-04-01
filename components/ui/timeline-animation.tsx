"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

type SupportedTag = "div" | "p" | "section" | "article" | "span" | "aside";

type TimelineContentProps = {
  as?: SupportedTag;
  children: React.ReactNode;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
  customVariants?: Variants;
  className?: string;
};

const motionComponents = {
  div: motion.div,
  p: motion.p,
  section: motion.section,
  article: motion.article,
  span: motion.span,
  aside: motion.aside,
};

const defaultVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(10px)",
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      delay: index * 0.08,
      ease: "easeOut",
    },
  }),
};

export function TimelineContent({
  as = "div",
  children,
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
}: TimelineContentProps) {
  const [active, setActive] = React.useState(false);
  const localRef = React.useRef<HTMLElement | null>(null);
  const MotionTag = motionComponents[as];

  React.useEffect(() => {
    const node = localRef.current;
    const root = timelineRef?.current ?? null;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      {
        root,
        threshold: 0.15,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [timelineRef]);

  return (
    <MotionTag
      ref={localRef as never}
      custom={animationNum}
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      variants={customVariants ?? defaultVariants}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
