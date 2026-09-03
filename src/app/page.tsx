"use client";

import { motion } from "framer-motion";
import { Bell, BookOpen, CalendarDays, MapPin, Navigation, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import Countdown from "@/components/Countdown";
import { SiteFooter, SiteNav } from "@/components/SiteShell";
import { eventDetails } from "@/lib/site-content";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-midnight bg-gold-radial">
      <SiteNav />

      <section className="relative flex min-h-[calc(100svh-4rem)] items-center px-4 pb-8 pt-24 sm:px-6 md:min-h-screen md:px-8 md:pb-20 md:pt-32 lg:px-12">
        <div className="absolute inset-0 bg-violet-radial" />
        <div className="absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-violet/10 blur-3xl" />
        <div className="absolute left-[14%] top-[28%] h-80 w-80 rounded-full bg-aureate/10 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-[60vh] w-px -rotate-12 light-ray" />
        <div className="absolute left-[12%] top-[24%] h-2 w-2 rounded-full bg-aureate particle" />
        <div className="absolute right-[20%] top-[18%] h-1.5 w-1.5 rounded-full bg-white particle [animation-delay:1.4s]" />
        <div className="absolute bottom-[20%] right-[10%] h-2 w-2 rounded-full bg-violet particle [animation-delay:2.2s]" />
        <div className="absolute bottom-[34%] left-[36%] h-1.5 w-1.5 rounded-full bg-aureate particle [animation-delay:3s]" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-7 md:gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-aureate/30 bg-aureate/10 px-3 py-2 text-xs text-aureate shadow-glow md:mb-9 md:gap-3 md:px-4 md:text-sm">
              <Sparkles className="h-4 w-4" /> Christian Youth Event
            </div>
            <p className="mb-3 font-display text-2xl font-semibold text-aureate md:mb-5 md:text-3xl">{eventDetails.theme}</p>
            <h1 className="relative max-w-4xl font-display text-5xl font-bold leading-[0.85] tracking-normal text-white drop-shadow-[0_0_55px_rgba(216,166,74,0.18)] sm:text-7xl lg:text-9xl">
              ARISE
            </h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-white/84 sm:text-lg md:mt-10 md:text-2xl md:leading-8">
              "Inspiring the youth to arise, learn God's Word, and live their faith with purpose."
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-10">
              <Link href="/register" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-aureate px-6 py-3 font-semibold text-midnight shadow-glow transition hover:-translate-y-0.5 hover:bg-white md:px-7 md:py-4">
                <Bell className="h-5 w-5" /> Register Now
              </Link>
              <Link href="/about" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/16 px-6 py-3 font-semibold text-white/90 transition hover:border-aureate/70 hover:text-aureate md:px-7 md:py-4">
                <BookOpen className="h-5 w-5" /> Explore ARISE
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="mt-6 max-w-2xl rounded-2xl border border-aureate/20 bg-white/[0.045] p-4 shadow-glow backdrop-blur-xl md:mt-10 md:p-6"
            >
              <div className="mb-4 h-px w-20 bg-gradient-to-r from-aureate to-transparent md:mb-5 md:w-24" />
              <p className="font-display text-xl font-semibold leading-7 text-white md:text-2xl md:leading-9">"{eventDetails.verse.replaceAll('"', "")}"</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-aureate md:mt-4 md:text-sm md:tracking-[0.24em]">{eventDetails.verseReference}</p>
            </motion.div>
            
          </motion.div>
          

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="grid gap-4 md:gap-5">
            <HeroCard icon={<MapPin className="h-6 w-6" />} eyebrow="Venue" title="Dharavi Church of Christ" glow="gold">
              <p className="text-white/70">Mumbai, Maharashtra</p>
              <p className="mt-4 leading-7 text-white/62">
                A place where youth gather to learn, connect, grow, and be encouraged through a shared experience.
              </p>
              <Link href="/contact" className="mt-5 inline-flex items-center gap-2 rounded-full border border-aureate/35 px-4 py-2 text-sm font-semibold text-aureate transition hover:bg-aureate hover:text-midnight">
                <Navigation className="h-4 w-4" /> Get Directions
              </Link>
            </HeroCard>

            <HeroCard icon={<Sparkles className="h-6 w-6" />} eyebrow="ARISE #3 2026 THEME" title="Choosing Jesus Every Day" glow="mystery">
          <div className="mt-3 h-px w-20 bg-gradient-to-r from-aureate/70 to-transparent" />
         <p className="mt-4 font-semibold text-white">Choosing Jesus Everyday.</p>
        <p className="mt-2 text-sm leading-6 text-white/58">Luke 9:23</p>
        </HeroCard>

            <HeroCard icon={<CalendarDays className="h-6 w-6" />} eyebrow="Registration Status" title="Registration Open" glow="purple">
  <p className="leading-7 text-white/66">Registrations are now open for ARISE #3. We would love to have you join us!</p>
</HeroCard>
          </motion.div>
        </div>
      </section>
          

      {/* Countdown Section */}

      <section className="relative overflow-hidden py-24">

        <div className="mx-auto max-w-5xl px-6">

          <div className="mb-10 text-center">

            <p className="text-xs uppercase tracking-[0.55em] text-aureate/80">
              THE WAIT IS ALMOST OVER
            </p>

          </div>

          <Countdown />

        </div>

      </section>

      <SiteFooter />

    
    </main>
  );
}

function HeroCard({
  icon,
  eyebrow,
  title,
  children,
  glow
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  children: ReactNode;
  glow: "gold" | "purple" | "mystery";
}) {
  const glowClass = glow === "gold" ? "shadow-glow" : glow === "purple" ? "shadow-violet" : "shadow-[0_0_70px_rgba(216,166,74,0.16)]";

  return (
    <motion.article whileHover={{ y: -5 }} className={`glass rounded-3xl border-white/10 p-4 shadow-[0_18px_70px_rgba(0,0,0,0.22)] md:p-6 ${glowClass}`}>
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-aureate/20 bg-aureate/10 text-aureate md:h-12 md:w-12">
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{eyebrow}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">{title}</h2>
        </div>
      </div>
      <div className="mt-4 md:mt-5">{children}</div>
    </motion.article>
  );
}
