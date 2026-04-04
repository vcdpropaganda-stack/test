"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgramCard {
  image: string;
  category: string;
  title: string;
  href: string;
}

interface MetricItem {
  value: string;
  label: string;
}

interface PulseFitHeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  disclaimer?: string;
  socialProof?: {
    avatars: string[];
    text: string;
  };
  metrics?: MetricItem[];
  programs?: ProgramCard[];
  className?: string;
}

export function PulseFitHero({
  eyebrow = "Marketplace de pedidos",
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  disclaimer,
  socialProof,
  metrics = [],
  programs = [],
  className,
}: PulseFitHeroProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[calc(100vh-5rem)] w-full flex-col overflow-hidden border-b border-border",
        className
      )}
      style={{
        background:
          "linear-gradient(180deg, #E8F0FF 0%, #F5F9FF 45%, #FFFFFF 100%)",
      }}
      role="banner"
      aria-label="Hero principal"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(67,56,202,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 bg-[linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.68),transparent)]" />

      <div className="relative z-10 flex flex-1 flex-col px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-18">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center"
        >
          <div className="max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/88 px-4 py-2 text-sm font-semibold text-primary-strong shadow-[0_12px_36px_rgba(99,102,241,0.12)] backdrop-blur">
              <Sparkles className="h-4 w-4" />
              {eyebrow}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mx-auto mt-7 max-w-5xl text-balance font-sans text-[2.9rem] leading-[0.98] font-bold tracking-[-0.06em] text-slate-950 sm:text-[4.2rem] lg:text-[5.8rem]"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28 }}
              className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl"
            >
              {subtitle}
            </motion.p>

            {(primaryAction || secondaryAction) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.38 }}
                className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                {primaryAction ? (
                  <Link
                    href={primaryAction.href}
                    className="inline-flex min-h-14 items-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-[0_18px_44px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-900"
                  >
                    {primaryAction.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}

                {secondaryAction ? (
                  <Link
                    href={secondaryAction.href}
                    className="inline-flex min-h-14 items-center rounded-full border border-slate-300 bg-white/84 px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white"
                  >
                    {secondaryAction.label}
                  </Link>
                ) : null}
              </motion.div>
            )}

            {disclaimer ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.52 }}
                className="mt-5 text-sm font-medium text-slate-500"
              >
                {disclaimer}
              </motion.p>
            ) : null}

            {socialProof ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.62 }}
                className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <div className="flex -space-x-3">
                  {socialProof.avatars.map((avatar, index) => (
                    <Image
                      key={`${avatar}-${index}`}
                      src={avatar}
                      alt={`Perfil ${index + 1}`}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-600">
                  {socialProof.text}
                </span>
              </motion.div>
            ) : null}

            {metrics.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.74 }}
                className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3"
              >
                {metrics.map((metric) => (
                  <div
                    key={`${metric.value}-${metric.label}`}
                    className="rounded-[1.5rem] border border-white/70 bg-white/75 px-5 py-4 text-left shadow-[0_12px_28px_rgba(15,23,42,0.06)] backdrop-blur"
                  >
                    <p className="text-xl font-bold tracking-[-0.04em] text-slate-950">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            ) : null}
          </div>
        </motion.div>

        {programs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 64 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="relative z-10 mt-12 w-full overflow-hidden pb-3 pt-2 lg:mt-16"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-[linear-gradient(90deg,#ffffff_0%,rgba(255,255,255,0)_100%)] sm:w-36" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-[linear-gradient(270deg,#ffffff_0%,rgba(255,255,255,0)_100%)] sm:w-36" />

            <motion.div
              className="flex items-center gap-5 pl-4 sm:pl-6 lg:pl-8"
              animate={{ x: [0, -(programs.length * 292)] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: Math.max(programs.length * 4.2, 18),
                  ease: "linear",
                },
              }}
            >
              {[...programs, ...programs].map((program, index) => (
                <Link
                  key={`${program.title}-${index}`}
                  href={program.href}
                  className="group relative h-[360px] w-[280px] flex-shrink-0 overflow-hidden rounded-[2rem] shadow-[0_20px_50px_rgba(15,23,42,0.16)]"
                >
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    sizes="280px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.02),rgba(2,6,23,0.78))]" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="text-[11px] font-semibold tracking-[0.22em] text-white/72 uppercase">
                      {program.category}
                    </span>
                    <h3 className="mt-2 text-2xl font-semibold leading-tight text-white">
                      {program.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </motion.div>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
