"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import anime, { type AnimeInstance } from "animejs/lib/anime.es.js";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MotionOrchestrator() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    const floatNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-float]")
    );

    revealNodes.forEach((node) => {
      if (node.dataset.motionPrepared === "true") {
        return;
      }

      node.dataset.motionPrepared = "true";
      node.style.opacity = "0";
      node.style.transform = "translate3d(0, 28px, 0) scale(0.985)";
      node.style.filter = "blur(10px)";
      node.style.willChange = "transform, opacity, filter";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const node = entry.target as HTMLElement;
          observer.unobserve(node);

          anime.remove(node);
          anime({
            targets: node,
            opacity: [0, 1],
            translateY: [Number(node.dataset.revealY ?? 28), 0],
            scale: [0.985, 1],
            duration: Number(node.dataset.revealDuration ?? 760),
            delay: Number(node.dataset.revealDelay ?? 0),
            easing: "easeOutExpo",
            begin: () => {
              node.style.filter = "blur(10px)";
            },
            update: (anim: AnimeInstance) => {
              if (anim.progress > 20) {
                node.style.filter = "blur(0px)";
              }
            },
            complete: () => {
              node.style.filter = "";
              node.style.willChange = "";
            },
          });
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealNodes.forEach((node) => observer.observe(node));

    floatNodes.forEach((node, index) => {
      anime.remove(node);
      anime({
        targets: node,
        translateY: [
          Number(node.dataset.floatFrom ?? -6),
          Number(node.dataset.floatTo ?? 10),
        ],
        scale: [1, Number(node.dataset.floatScale ?? 1.035)],
        duration: 3200 + index * 450,
        delay: index * 180,
        easing: "easeInOutSine",
        direction: "alternate",
        loop: true,
      });
    });

    return () => {
      observer.disconnect();
      anime.remove(revealNodes);
      anime.remove(floatNodes);
    };
  }, [pathname]);

  return null;
}
