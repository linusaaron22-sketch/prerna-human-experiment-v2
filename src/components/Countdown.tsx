"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-09-05T09:00:00+05:30");
const START_DATE = new Date("2026-07-01T00:00:00+05:30"); // Change if needed

function getCountdown() {
  const now = new Date().getTime();
  const distance = EVENT_DATE.getTime() - now;

  if (distance <= 0) {
    return {
      finished: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      progress: 100,
    };
  }

  const total = EVENT_DATE.getTime() - START_DATE.getTime();
  const elapsed = now - START_DATE.getTime();

  const progress = Math.min(
    Math.max((elapsed / total) * 100, 0),
    100
  );

  return {
    finished: false,
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
    progress,
  };
}

export default function Countdown() {
  const [mounted, setMounted] = useState(false);

const [time, setTime] = useState({
  finished: false,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  progress: 0,
});

  useEffect(() => {
  setMounted(true);

  setTime(getCountdown());

  const interval = setInterval(() => {
    setTime(getCountdown());
  }, 1000);

  return () => clearInterval(interval);
}, []);
if (!mounted) {
  return null;
} 
  if (time.finished) {
    return (
      <section className="glass rounded-3xl border border-aureate/20 p-10 text-center">
        <div className="text-6xl">🎉</div>

        <h2 className="mt-6 font-display text-5xl text-white">
          Welcome to ARISE!
        </h2>

        <p className="mt-4 text-white/70">
          Today is the day.
        </p>
      </section>
    );
  }

  return (
    <section className="glass rounded-3xl border border-white/10 p-8">

      <p className="text-center text-xs uppercase tracking-[0.45em] text-aureate">
        Countdown for Arise #3
      </p>

      <div className="mt-8 text-center">

        <div className="font-sans text-8xl font-black leading-none text-white">
          {time.days}
        </div>

        <div className="mt-3 text-lg uppercase tracking-[0.5em] text-aureate">
          Days
        </div>

      </div>

      {/* Progress Bar */}

      <div className="mt-10">

        <div className="h-4 overflow-hidden rounded-full bg-white/10">

          <div
            className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFD86B] to-[#FFE8A3] transition-all duration-700"
            style={{ width: `${time.progress}%` }}
          />

        </div>

      </div>

      <div className="mt-3 flex justify-between text-xs uppercase tracking-[0.25em] text-white/40">
        <span>Now </span>
        <span>ARISE</span>
      </div>

      <div className="mt-10 flex items-center justify-center gap-6">

        <div className="text-center">
          <div className="font-sans text-3xl font-bold text-white">
            {String(time.hours).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.3em] text-aureate">
            Hours
          </div>
        </div>

        <div className="text-aureate text-xl">•</div>

        <div className="text-center">
          <div className="font-sans text-3xl font-bold text-white">
            {String(time.minutes).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.3em] text-aureate">
            Minutes
          </div>
        </div>

        <div className="text-aureate text-xl">•</div>

        <div className="text-center">
          <div className="font-sans text-3xl font-bold text-white">
            {String(time.seconds).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.3em] text-aureate">
            Seconds
          </div>
        </div>

      </div>

      <p className="mt-10 text-center text-white/60">
        Every day brings us one step closer.
      </p>

    </section>
  );
}