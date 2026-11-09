"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Eye,
  Lock,
  MemoryStick,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

const experiments = [
  {
    number: "01",
    title: "Beyond the Habit",
    description: "See beyond what you think.",
    icon: Eye,
    status: "current",
  },
  {
    number: "02",
    title: "The Empty Chair",
    description: "Why we keep going.",
    icon: Target,
    status: "locked",
  },
  {
    number: "03",
    title: "The Sunday Choice",
    description: "Others influence you more than you think.",
    icon: Users,
    status: "locked",
  },
  {
    number: "04",
    title: "The Quiet Connection",
    description: "Your memory isn't perfect.",
    icon: MemoryStick,
    status: "locked",
  },
  {
    number: "05",
    title: "The Living Church",
    description: "Where focus goes, energy flows.",
    icon: Brain,
    status: "locked",
  }
];

export default function ExperimentHero({
  onEnter,
}: {
  onEnter: () => void;
}) {
const [passStarted, setPassStarted] = useState(false);
const [participantId, setParticipantId] = useState("HE-001");
const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const participant =
      params.get("participant") ||
      window.localStorage.getItem(
        "arise-human-experiment-participant"
      ) ||
      "HE-001";

    const normalizedParticipant = participant.toUpperCase();

    setParticipantId(normalizedParticipant);

    window.localStorage.setItem(
      "arise-human-experiment-participant",
      normalizedParticipant
    );
    setProfileUrl(
  `${window.location.origin}/r/${encodeURIComponent(normalizedParticipant)}`
);
  }, []);

  const handleEnter = () => {
    setPassStarted(true);

    window.setTimeout(() => {
      onEnter();
    }, 350);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8f1e6] text-[#19352c]">

      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <header className="border-b border-[#19352c]/10">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-8 sm:py-5 lg:px-12">

          <div>
            <div className="font-sans text-lg font-semibold tracking-[0.22em] sm:text-xl">
              PRERNA
            </div>

            <div className="mt-1 text-[7px] uppercase tracking-[0.28em] text-[#19352c]/55 sm:text-[9px]">
              × Human Experiment
            </div>

          </div>

          <div className="text-right">
            <div className="text-[7px] font-medium uppercase tracking-[0.25em] text-[#19352c]/60 sm:text-[8px]">
              Participant ID
            </div>

            <div className="mt-1 font-mono text-xs font-semibold text-[#c7542b] sm:text-sm">
              {participantId}
            </div>
          </div>

        </div>
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section>
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,0.75fr)] lg:items-center lg:gap-16 lg:px-12 lg:py-20">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="min-w-0 lg:-translate-y-20"
          >

            <div className="mb-5 font-mono text-[9px] font-semibold uppercase tracking-[0.32em] text-[#c7542b] sm:mb-7 sm:text-[10px]">
              ARISE / 2026
            </div>

            <h2 className="mt-3 max-w-full overflow-hidden font-serif text-[clamp(2.5rem,6vw,4rem)] uppercase leading-[0.84] tracking-[-0.045em] sm:mt-5">

              <span className="block">
                HUMAN
              </span>

              <span className="block text-[clamp(2.1rem,5.2vw,3.5rem)] text-[#c7542b] sm:text-[clamp(2.4rem,5vw,3.5rem)]">
                EXPERIMENT
              </span>

            </h2>

            <div className="mt-8 max-w-[650px] sm:mt-10">

              <p className="font-serif text-lg leading-8 text-[#19352c]/65 sm:text-xl sm:leading-9 lg:text-2xl lg:leading-10">
                A short series of experiments designed to reveal something
                about the way you think, choose, remember and respond.
              </p>

              {/* CHECKLIST */}

              <div className="mt-7 space-y-3 sm:mt-8 sm:space-y-4">

                {[
                  "Six short experiments",
                  "No right or wrong answers",
                  "Just your natural response",
                  "Real insights",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 sm:gap-4"
                  >

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#19352c]/20 font-serif text-xs text-[#19352c]/60 sm:h-9 sm:w-9 sm:text-sm">
                      ✓
                    </div>

                    <span className="font-serif text-sm text-[#19352c]/70 sm:text-base lg:text-lg">
                      {item}
                    </span>

                  </div>
                ))}

              </div>

              {/* BUTTON */}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEnter}
                className="mt-8 flex w-full max-w-[500px] items-center justify-between rounded-2xl bg-[#19352c] px-5 py-4 text-left text-[#f8f1e6] sm:mt-10 sm:px-7 sm:py-6"
              >

                <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] sm:text-sm">
                  {passStarted ? "PASS READY" : "GET YOUR PASS"}
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c7542b] sm:h-12 sm:w-12">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>

              </motion.button>

            </div>

          </motion.div>

          {/* =================================================
              PARTICIPANT CARD
          ================================================= */}

          <motion.div
            initial={{ opacity: 0, x: 25, rotate: 1 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
            className="mx-auto w-full max-w-[470px] lg:justify-self-end"
          >

            {/* CARD */}

            <div className="rounded-[22px] border border-[#19352c]/15 bg-[#eee5d5] p-4 shadow-[0_20px_55px_rgba(25,53,44,0.12)] sm:rounded-[26px] sm:p-6">

              {/* CARD HEADER */}

              <div className="flex items-start justify-between border-b border-[#19352c]/15 pb-4 sm:pb-5">

                <div>

                  <div className="font-sans text-base font-semibold tracking-[0.25em] sm:text-xl">
                    ARISE
                  </div>

                  <div className="mt-1 text-[6px] uppercase tracking-[0.25em] text-[#19352c]/50 sm:text-[8px]">
                    × Human Experiment
                  </div>

                  <div className="mt-1 text-[6px] uppercase tracking-[0.22em] text-[#19352c]/35 sm:text-[7px]">
                    Human Behaviour Lab
                  </div>

                </div>

                <div className="text-right">

                  <div className="text-[6px] uppercase tracking-[0.2em] text-[#19352c]/45 sm:text-[7px]">
                    Status
                  </div>

                  <div className="mt-1 font-mono text-[10px] font-bold text-[#c7542b] sm:mt-2 sm:text-xs">
                    {passStarted ? "PASS READY" : "READY"}
                  </div>

                </div>

              </div>

              {/* CARD TITLE */}

              <div className="py-5 sm:py-7">

                <div className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#c7542b] sm:text-[8px]">
                  ARISE / 2026
                </div>

                <h2 className="mt-4 w-full max-w-full overflow-hidden font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[0.86] tracking-[-0.055em]">

                  HUMAN
                  <br />

                  <span className="block max-w-full text-[#c7542b]">
                    EXPERIMENT
                  </span>

                </h2>

              </div>

              {/* PARTICIPANT INFO */}

              <div className="grid grid-cols-2 border-y border-[#19352c]/15 py-4 sm:py-5">

                <div>

                  <div className="mt-1.5 font-mono text-base font-bold text-[#19352c] sm:mt-2 sm:text-lg">
                    Participant
                  </div>

                  <div className="mt-1 font-mono text-sm font-semibold sm:mt-2 sm:text-lg">
                    {participantId}
                  </div>

                </div>

                <div>

                  <div className="text-[6px] uppercase tracking-[0.25em] text-[#19352c]/45 sm:text-[7px]">
                    Experiment
                  </div>

                  <div className="mt-1 font-mono text-sm font-semibold sm:mt-2 sm:text-lg">
                    01 / 06
                  </div>

                </div>

              </div>

              {/* QR AREA */}

              <div className="mt-4 rounded-xl bg-[#19352c] p-4 sm:mt-6 sm:rounded-2xl sm:p-6">

                <div className="mb-3 text-[6px] uppercase tracking-[0.28em] text-[#f8f1e6]/60 sm:mb-5 sm:text-[7px]">
                  Human Behaviour Lab
                </div>

                <div className="flex justify-center">

                  <div className="rounded-lg bg-[#f8f1e6] p-2.5 sm:rounded-xl sm:p-3">

                    {profileUrl ? (
  <QRCodeSVG
    value={profileUrl}
    size={130}
    className="h-[130px] w-[130px] sm:h-[175px] sm:w-[175px]"
    bgColor="#f8f1e6"
    fgColor="#19352c"
    level="H"
  />
) : (
  <div className="h-[130px] w-[130px] sm:h-[175px] sm:w-[175px]" />
)}

                  </div>

                </div>

                <div className="mt-2.5 text-center font-mono text-[6px] uppercase tracking-[0.28em] text-[#f8f1e6]/70 sm:mt-4 sm:text-[8px]">
                  Scan to connect
                </div>

              </div>

              {/* CARD FOOTER */}

              <div className="mt-4 flex items-center justify-between sm:mt-6">

                <div className="font-serif text-xs italic text-[#19352c]/50 sm:text-sm">
                  Six experiments.
                </div>

                <div className="font-serif text-xs italic text-[#19352c]/50 sm:text-sm">
                  Real you.
                </div>

              </div>

            </div>

          </motion.div>

        </div>
      </section>

      {/* =====================================================
          EXPERIMENTS
      ====================================================== */}

      <section className="border-y border-[#19352c]/10 bg-[#eee5d5]/50">

        <div className="mx-auto grid max-w-[1500px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">

          {experiments.map((experiment, index) => {

            const Icon = experiment.icon;
            const isCurrent = experiment.status === "current";

            return (
              <motion.div
                key={experiment.number}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                }}
                className={`relative min-h-[210px] border-b border-[#19352c]/10 p-6 transition-colors sm:min-h-[230px] sm:p-7 lg:border-b-0 lg:border-r ${
                  isCurrent
                    ? "bg-[#f8f1e6]"
                    : "hover:bg-[#f8f1e6]"
                }`}
              >

                {isCurrent && (
                  <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#c7542b]" />
                )}

                <div className="flex items-center justify-between">

                  <span
                    className={`font-mono text-[10px] font-semibold tracking-[0.25em] ${
                      isCurrent
                        ? "text-[#c7542b]"
                        : "text-[#19352c]/30"
                    }`}
                  >
                    {experiment.number}
                  </span>

                  <Icon
                    className={
                      isCurrent
                        ? "h-5 w-5 text-[#c7542b]"
                        : "h-5 w-5 text-[#19352c]/25"
                    }
                    strokeWidth={1.4}
                  />

                </div>

                <h3 className="mt-8 font-sans text-sm font-semibold tracking-[0.15em]">
                  {experiment.title}
                </h3>

                <p className="mt-3 font-serif text-sm leading-6 text-[#19352c]/50">
                  {experiment.description}
                </p>

                <div className="absolute bottom-6 left-6 sm:left-7">

                  {isCurrent ? (

                    <span className="font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-[#c7542b]">
                      Current
                    </span>

                  ) : (

                    <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-[#19352c]/30">
                      <Lock className="h-3 w-3" />
                      Locked
                    </span>

                  )}

                </div>

              </motion.div>
            );
          })}

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="mx-auto flex max-w-[1500px] flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-10 lg:px-12">

        <p className="font-serif text-sm italic text-[#19352c]/40 sm:text-base">
          The greatest discovery is knowing yourself.
        </p>

        <div className="flex items-center gap-3 font-mono text-[6px] uppercase tracking-[0.25em] text-[#19352c]/30 sm:text-[7px]">
          <span>ARISE</span>
          <span>•</span>
          <span>Human Behaviour Lab</span>
          <span>•</span>
          <span>2026</span>
        </div>

      </footer>

    </main>
  );
}