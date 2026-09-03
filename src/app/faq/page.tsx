"use client";

import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { SitePage } from "@/components/SiteShell";
import { faqs } from "@/lib/site-content";

export default function FaqPage() {
  return (
    <SitePage>
      {/* =========================
          HERO
      ========================== */}
      <section className="relative isolate overflow-hidden px-5 pb-12 pt-16 sm:px-6 md:pb-28 md:pt-24">
        {/* Rich atmospheric background */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[#080812]" />

        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(105,82,170,0.28),rgba(105,82,170,0.10)_38%,transparent_72%)] blur-2xl sm:h-[600px] sm:w-[600px]" />

        <div className="pointer-events-none absolute left-1/2 top-[12%] -z-10 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(216,166,74,0.18),transparent_68%)] blur-3xl" />

        {/* Floating particles */}
        <motion.div
          className="pointer-events-none absolute left-[12%] top-[28%] h-1.5 w-1.5 rounded-full bg-aureate/80 shadow-[0_0_18px_rgba(216,166,74,0.8)]"
          animate={{
            y: [0, -12, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="pointer-events-none absolute right-[15%] top-[38%] h-1.5 w-1.5 rounded-full bg-violet/80 shadow-[0_0_18px_rgba(130,100,200,0.8)]"
          animate={{
            y: [0, 10, 0],
            opacity: [0.3, 0.9, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="pointer-events-none absolute left-[25%] top-[52%] h-1 w-1 rounded-full bg-white/60"
          animate={{
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Event badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-aureate/30 bg-aureate/[0.08] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-aureate shadow-[0_0_30px_rgba(216,166,74,0.08)] backdrop-blur-md sm:text-xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            ARISE #3 • 2026
          </motion.div>

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-8 text-[10px] font-semibold uppercase tracking-[0.42em] text-white/45 sm:text-xs"
          >
            Got Questions?
          </motion.p>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mx-auto mt-5 max-w-3xl font-display text-[3.6rem] font-semibold leading-[0.88] tracking-tight text-white sm:text-6xl md:text-8xl"
          >
            We've got
            <span className="block bg-gradient-to-r from-aureate via-[#f4d28b] to-aureate bg-clip-text text-transparent">
              answers.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mx-auto mt-7 max-w-md text-sm leading-7 text-white/55 sm:text-base sm:leading-8"
          >
            Everything you need to know before joining us at ARISE #3.
          </motion.p>
  
        </div>
      </section>

      {/* =========================
          QUESTIONS
      ========================== */}
      <section className="relative -mt-1 overflow-hidden bg-[#080812] px-5 pb-24 sm:px-6 md:pb-32">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-violet/10 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl">
          {/* Section heading */}
          <div className="mb-10 sm:mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-aureate">
              LET'S CLEAR THINGS UP
            </p>

            <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
              You might be wondering...
            </h2>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            {faqs.map(([question, answer], index) => (
              <motion.details
                key={question}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: index * 0.06,
                  duration: 0.5,
                }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-gradient-to-br from-white/[0.07] via-white/[0.035] to-violet/[0.025] shadow-[0_18px_70px_rgba(0,0,0,0.28)] transition-all duration-500 hover:-translate-y-0.5 hover:border-aureate/25 hover:shadow-[0_20px_80px_rgba(216,166,74,0.07)] open:border-aureate/40 open:bg-gradient-to-br open:from-aureate/[0.10] open:via-white/[0.045] open:to-violet/[0.05] open:shadow-[0_20px_90px_rgba(216,166,74,0.10)]"
              >
                {/* Card glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-aureate/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 group-open:opacity-100" />

                {/* Gold accent */}
                <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-transparent via-aureate/40 to-transparent opacity-0 transition-opacity duration-500 group-open:opacity-100" />

                <summary className="relative flex cursor-pointer list-none items-center gap-4 p-5 sm:gap-5 sm:p-6 md:p-7">
                  {/* Number */}
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-aureate/20 bg-aureate/[0.08] text-[11px] font-bold tracking-[0.18em] text-aureate shadow-[inset_0_0_20px_rgba(216,166,74,0.04)] transition-all duration-500 group-open:border-aureate/50 group-open:bg-aureate/15 group-open:shadow-[0_0_25px_rgba(216,166,74,0.12)] sm:h-14 sm:w-14">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Question */}
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-semibold leading-6 text-white transition-colors duration-300 group-hover:text-aureate sm:text-xl md:text-2xl">
                      {question}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-white/45 transition-all duration-500 group-open:rotate-180 group-open:border-aureate/40 group-open:bg-aureate/10 group-open:text-aureate sm:h-11 sm:w-11">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </summary>

                {/* Answer */}
                <div className="relative px-5 pb-6 sm:px-6 sm:pb-7 md:px-7 md:pb-8">
                  <div className="ml-[4.25rem] border-t border-white/10 pt-5 sm:ml-[4.75rem]">
                    <div className="mb-4 h-px w-10 bg-gradient-to-r from-aureate to-transparent" />

                    <p className="max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
                      {answer}
                    </p>
                  </div>
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>
      
<section className="relative overflow-hidden bg-[#080812] px-5 pb-20 pt-16 sm:px-6 md:pb-24 md:pt-20">
  {/* Subtle transition glow */}
  <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-80 -translate-x-1/2 rounded-full bg-aureate/[0.06] blur-[100px]" />

  {/* Soft top transition */}
  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="relative mx-auto max-w-2xl text-center"
  >
    <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-aureate">
      STILL WONDERING?
    </p>

    <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
      Just ask.
    </h2>

    <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/45 sm:text-base">
      Reach out to the ARISE Admin Team if you need any more information.
    </p>

    <div className="mx-auto mt-6 h-px w-12 bg-gradient-to-r from-transparent via-aureate/60 to-transparent" />
  </motion.div>
</section>
    </SitePage>
  );
}