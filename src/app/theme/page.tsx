"use client";

import { motion } from "framer-motion";
import { ArrowDown, Cross, Sparkles } from "lucide-react";
import { SitePage } from "@/components/SiteShell";
import { themeHighlights } from "@/lib/site-content";

export default function ThemePage() {
  return (
    <SitePage>
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative isolate overflow-hidden px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-24 lg:px-12">
        {/* Background image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/theme-bg.png')" }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 z-0 bg-black/65" />

        {/* Golden atmospheric glow */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_25%,rgba(216,166,74,0.28),transparent_55%)]" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 z-0 h-48 bg-gradient-to-t from-[#080812] to-transparent" />

        {/* Decorative glow */}
        <div className="absolute left-1/2 top-0 z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-aureate/10 blur-[100px] sm:h-96 sm:w-96" />

        {/* Light rays */}
        <div className="absolute left-1/2 top-0 z-0 h-[550px] w-px -rotate-[15deg] bg-gradient-to-b from-aureate/30 via-aureate/5 to-transparent" />

        <div className="absolute left-1/2 top-0 z-0 h-[550px] w-px rotate-[15deg] bg-gradient-to-b from-aureate/25 via-aureate/5 to-transparent" />

        {/* Animated particles */}
<motion.div
  className="absolute left-[12%] top-[30%] z-10 h-2 w-2 rounded-full bg-aureate shadow-[0_0_20px_rgba(216,166,74,0.9)]"
  animate={{
    y: [0, -20, 0],
    opacity: [0.3, 1, 0.3],
  }}
  transition={{
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  }}
/>

<motion.div
  className="absolute right-[14%] top-[38%] z-10 h-1.5 w-1.5 rounded-full bg-aureate shadow-[0_0_18px_rgba(216,166,74,0.9)]"
  animate={{
    y: [0, 18, 0],
    opacity: [0.2, 1, 0.2],
  }}
  transition={{
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
    delay: 1,
  }}
/>

<motion.div
  className="absolute left-[25%] top-[60%] z-10 h-1 w-1 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.8)]"
  animate={{
    opacity: [0.2, 0.9, 0.2],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
    delay: 0.5,
  }}
/>

<motion.div
  className="absolute right-[25%] top-[65%] z-10 h-1 w-1 rounded-full bg-aureate shadow-[0_0_14px_rgba(216,166,74,0.9)]"
  animate={{
    opacity: [0.2, 1, 0.2],
  }}
  transition={{
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
    delay: 2,
  }}
/>
        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-aureate/25 bg-black/30 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-aureate backdrop-blur-md sm:px-4 sm:text-xs sm:tracking-[0.28em]"
          >
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ARISE #3 • 2026
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-6 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/55 sm:text-xs"
          >
            Theme Reveal
          </motion.p>

        {/* THEME TITLE */}
<div className="relative mx-auto mt-4 max-w-[420px] sm:max-w-2xl md:max-w-5xl">

  {/* Main golden aura */}
  <motion.div
    className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-aureate/20 blur-[70px] sm:h-56"
    animate={{
      opacity: [0.35, 0.65, 0.35],
      scale: [0.92, 1.08, 0.92],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  {/* Stronger glow behind Every Day */}
  <motion.div
    className="pointer-events-none absolute left-1/2 top-[68%] h-28 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-aureate/25 blur-[55px]"
    animate={{
      opacity: [0.25, 0.7, 0.25],
      scale: [0.9, 1.12, 0.9],
    }}
    transition={{
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  {/* Floating light particles */}
  <motion.div
    className="absolute left-[8%] top-[25%] h-1.5 w-1.5 rounded-full bg-aureate shadow-[0_0_14px_rgba(216,166,74,0.9)]"
    animate={{
      y: [0, -18, 0],
      opacity: [0.3, 1, 0.3],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  <motion.div
    className="absolute right-[8%] top-[55%] h-1 w-1 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
    animate={{
      y: [0, 14, 0],
      opacity: [0.2, 0.9, 0.2],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1,
    }}
  />

  {/* TITLE */}
  <motion.h1
    initial={{ opacity: 0, y: 24, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{
      delay: 0.15,
      duration: 0.9,
      ease: "easeOut",
    }}
    className="relative z-10 font-display text-[3.2rem] font-semibold leading-[0.92] tracking-tight text-white drop-shadow-[0_5px_35px_rgba(216,166,74,0.18)] sm:text-6xl md:text-8xl"
  >
    <motion.span
      animate={{
        textShadow: [
          "0 0 20px rgba(255,255,255,0.05)",
          "0 0 45px rgba(216,166,74,0.22)",
          "0 0 20px rgba(255,255,255,0.05)",
        ],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      Choosing Jesus
    </motion.span>

    {/* Gold title */}
    <motion.span
      className="relative mt-2 block text-aureate"
      animate={{
        textShadow: [
          "0 0 15px rgba(216,166,74,0.25)",
          "0 0 45px rgba(216,166,74,0.65)",
          "0 0 15px rgba(216,166,74,0.25)",
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      Every Day
    </motion.span>
  </motion.h1>
</div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mx-auto mt-6 max-w-[340px] text-sm leading-6 text-white/75 drop-shadow-md sm:max-w-xl sm:text-lg sm:leading-8"
          >
            Following Jesus isn't just a one-time decision. It's a choice we
            are called to make every single day.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-9 flex flex-col items-center gap-2 text-white/45"
          >
            <span className="text-[9px] uppercase tracking-[0.3em]">
              Explore the theme
            </span>

            <ArrowDown className="h-4 w-4 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          THE HEART OF ARISE
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#080812] px-4 py-16 sm:px-6 md:py-24">
        {/* Subtle glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-aureate/10 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl">
          {/* Heading */}
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-aureate sm:text-xs">
              THE HEART OF ARISE
            </p>

            <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl md:text-6xl">
              The choice is daily.
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/50 sm:text-base">
              Following Jesus is more than a decision we make once. It is a
              choice we make every day.
            </p>
          </div>

          {/* =====================================================
              KEY VERSE
          ===================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mt-10 overflow-hidden rounded-3xl border border-aureate/20 bg-white/[0.045] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] sm:mt-12 sm:p-9 md:p-12"
          >
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-aureate/10 blur-3xl" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-aureate/25 bg-aureate/10 text-aureate">
                <Cross className="h-6 w-6" />
              </div>

              <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.3em] text-aureate">
                KEY VERSE
              </p>

              <blockquote className="mt-5 max-w-3xl font-display text-3xl font-semibold leading-[1.15] text-white sm:text-4xl md:text-5xl">
                “Take up your cross daily and follow Me.”
              </blockquote>

              <div className="mt-7 h-px w-14 bg-aureate/60" />

              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-aureate">
                LUKE 9:23
              </p>
            </div>
          </motion.div>

          {/* =====================================================
              THREE DAILY CHOICES
          ===================================================== */}
          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
            {/* CHOOSE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-aureate/20 bg-white/5 p-6 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-[0.3em] text-aureate">
                  01
                </span>

                <div className="h-px w-10 bg-aureate/40" />
              </div>

              <h3 className="mt-8 font-display text-3xl font-semibold text-white">
                Choose
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/55">
                Choose Jesus when you have a choice to make.
              </p>

              <div className="mt-7 h-px w-12 bg-aureate/60" />
            </motion.div>

            {/* FOLLOW */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-[0.3em] text-aureate">
                  02
                </span>

                <div className="h-px w-10 bg-aureate/30" />
              </div>

              <h3 className="mt-8 font-display text-3xl font-semibold text-white">
                Follow
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/55">
                Follow Him when the path becomes difficult.
              </p>

              <div className="mt-7 h-px w-12 bg-aureate/50" />
            </motion.div>

            {/* LIVE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-[0.3em] text-aureate">
                  03
                </span>

                <div className="h-px w-10 bg-aureate/30" />
              </div>

              <h3 className="mt-8 font-display text-3xl font-semibold text-white">
                Live
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/55">
                Live your faith when nobody is watching.
              </p>

              <div className="mt-7 h-px w-12 bg-aureate/50" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          WHAT WE'LL EXPLORE
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#080812] px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-aureate sm:text-xs">
              WHAT WE'LL EXPLORE
            </p>

            <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
              More than a theme.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
            {themeHighlights.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-aureate/30 hover:bg-aureate/[0.04] sm:p-6"
              >
                <div className="mb-4 h-px w-10 bg-aureate/60" />

                <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
                  {item}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CLOSING
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#080812] px-4 py-24 sm:px-6 md:py-32">
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aureate/10 blur-[100px]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-aureate sm:text-xs">
            ARISE #3
          </p>

          <h2 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl md:text-7xl">
            The choice is yours.
          </h2>

          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/50 sm:text-base md:max-w-xl md:text-lg">
            Not tomorrow. Not someday.{" "}
            <span className="text-white">Today.</span>
          </p>

          <div className="mx-auto mt-7 h-px w-20 bg-gradient-to-r from-transparent via-aureate to-transparent" />
        </div>
      </section>
    </SitePage>
  );
}