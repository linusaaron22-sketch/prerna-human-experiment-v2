"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Film, Clock, IndianRupee } from "lucide-react";
import { useHumanExperimentSession } from "@/lib/human-experiment/useHumanExperimentSession";
type Stage =
  | "intro"
  | "decision-one"
  | "wait-one"
  | "decision-two"
  | "wait-two"
  | "reveal"
  | "real-world"
  | "complete";

type Answer = "STAY" | "LEAVE" | null;

export default function CommitmentExperiment() {
  const [stage, setStage] = useState<Stage>("intro");
const [firstAnswer, setFirstAnswer] = useState<Answer>(null);
const [secondAnswer, setSecondAnswer] = useState<Answer>(null);
const [timeLeft, setTimeLeft] = useState(20);

const session = useHumanExperimentSession();

  // 10-second timer for both decisions
  useEffect(() => {
    if (stage !== "decision-one" && stage !== "decision-two") return;

    setTimeLeft(20);

    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);

          if (stage === "decision-one") {
            setStage("wait-one");
          } else {
            setStage("wait-two");
          }

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage]);

    // Facilitator-controlled final stages.
  // The two decision questions remain locally controlled.
  // Facilitator-controlled final stages.
// The two decision questions remain locally controlled.
useEffect(() => {
  if (session.experiment !== 2) return;

  if (session.stage === "REVEAL") {
    setStage("reveal");
  } else if (session.stage === "DISCUSSION") {
    setStage("real-world");
  } else if (session.stage === "COMPLETE") {
    setStage("complete");
  }
}, [session.experiment, session.stage]);

  const chooseFirstAnswer = (value: "STAY" | "LEAVE") => {
    setFirstAnswer(value);
    setStage("wait-one");
  };

  const chooseSecondAnswer = (value: "STAY" | "LEAVE") => {
    setSecondAnswer(value);
    setStage("wait-two");
  };

  return (
    <main className="min-h-screen bg-[#f8f1e6] text-[#19352c]">
      <div className="mx-auto min-h-screen max-w-[1200px] px-5 py-6 sm:px-8 sm:py-10">

        {/* HEADER */}
        <header className="flex items-start justify-between border-b border-[#19352c]/15 pb-5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#c7542b]">
              ARISE / 2026
            </p>

            <h1 className="mt-2 font-serif text-2xl tracking-wide sm:text-3xl">
              HUMAN EXPERIMENT
            </h1>

            <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.25em] text-[#19352c]/45 sm:text-[8px]">
              Human Behaviour Lab
            </p>
          </div>

          <div className="text-right">
            <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#19352c]/40">
              Experiment
            </p>

            <p className="mt-1 font-mono text-sm font-bold text-[#c7542b]">
              02 / 06
            </p>
          </div>
        </header>

        {/* MAIN */}
        <section className="mx-auto max-w-[1000px] py-12 sm:py-20">

          <AnimatePresence mode="wait">

            {/* =====================================================
                INTRO
            ====================================================== */}
            {stage === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="text-center"
              >
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.35em] text-[#c7542b]">
                  Experiment 02
                </p>

                <h2 className="mt-5 font-serif text-5xl leading-none sm:text-7xl">
                  COMMITMENT
                </h2>

                <p className="mx-auto mt-7 max-w-xl font-serif text-lg leading-8 text-[#19352c]/65 sm:text-xl">
                  When should you walk away?
                </p>

                <div className="mx-auto mt-12 max-w-md border border-[#19352c]/15 bg-[#eee5d5]/40 p-6 text-left">
                  <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#19352c]/40">
                    Before we begin
                  </p>

                  <p className="mt-4 font-serif text-base leading-7">
                    You will face two decisions.
                    <br />
                    <br />
                    Trust your instinct. There is no right or wrong answer.
                  </p>
                </div>

                <button
                  onClick={() => setStage("decision-one")}
                  className="mt-10 rounded-full bg-[#19352c] px-8 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#f8f1e6] transition-transform hover:scale-[1.02]"
                >
                  Begin Experiment
                </button>
              </motion.div>
            )}

            {/* =====================================================
                DECISION ONE
            ====================================================== */}
            {stage === "decision-one" && (
              <motion.div
                key="decision-one"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
              >
                {/* HEADER */}
                <div className="mx-auto max-w-3xl">
                  <div className="flex items-end justify-between border-b border-[#19352c]/10 pb-4">
                    <div>
                      <p className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#c7542b]">
                        Decision Test
                      </p>

                      <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.2em] text-[#19352c]/35">
                        Commitment / 01
                      </p>
                    </div>

                    <p className="font-mono text-[8px] tracking-[0.2em] text-[#19352c]/35">
                      02 — 01
                    </p>
                  </div>
                </div>

                {/* QUESTION */}
                <div className="mt-10 text-center sm:mt-14">
                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#19352c]/40">
                    Imagine this
                  </p>

                  <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-5xl">
                    You paid ₹500 for a movie ticket.
                  </h2>

                  <p className="mx-auto mt-5 max-w-2xl font-serif text-base leading-7 text-[#19352c]/60 sm:text-lg">
                    25 minutes into the movie, you realize it is terrible.
                    <br />
                    You still have 1 hour 45 minutes left.
                  </p>
                </div>

                {/* MOVIE VISUAL */}
                <div className="mx-auto mt-10 max-w-2xl">
                  <div className="relative overflow-hidden border border-[#19352c]/15 bg-[#19352c] p-8 sm:p-12">

                    <div className="absolute left-3 top-3 h-3 w-3 border-l border-t border-[#f8f1e6]/30" />
                    <div className="absolute right-3 top-3 h-3 w-3 border-r border-t border-[#f8f1e6]/30" />
                    <div className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[#f8f1e6]/30" />
                    <div className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#f8f1e6]/30" />

                    <div className="flex flex-col items-center justify-center text-center text-[#f8f1e6]">

                      <Film
                        className="h-12 w-12 opacity-70"
                        strokeWidth={1}
                      />

                      <p className="mt-6 font-mono text-[8px] uppercase tracking-[0.3em] opacity-45">
                        Movie Ticket
                      </p>

                      <p className="mt-3 font-serif text-4xl">
                        ₹500
                      </p>

                      <div className="mt-6 h-px w-full max-w-xs bg-[#f8f1e6]/15" />

                      <div className="mt-6 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.2em] opacity-55">
                        <Clock className="h-3.5 w-3.5" />
                        25 minutes watched
                      </div>

                    </div>
                  </div>
                </div>

                {/* TIMER */}
                <div className="mx-auto mt-8 flex max-w-[420px] flex-col items-center">

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#19352c]/35">
                      Time remaining
                    </span>

                    <motion.span
                      key={timeLeft}
                      initial={{ opacity: 0.4, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`font-mono text-sm font-bold ${
                        timeLeft <= 3
                          ? "text-[#c7542b]"
                          : "text-[#19352c]"
                      }`}
                    >
                      {String(timeLeft).padStart(2, "0")}
                    </motion.span>
                  </div>

                  <div className="mt-3 h-[2px] w-full overflow-hidden bg-[#19352c]/10">
                    <motion.div
                      className="h-full bg-[#c7542b]"
                      animate={{
                        width: `${(timeLeft / 10) * 100}%`,
                      }}
                      transition={{
                        duration: 0.9,
                        ease: "linear",
                      }}
                    />
                  </div>
                </div>

                {/* QUESTION */}
                <div className="mt-10 text-center">
                  <p className="font-serif text-xl sm:text-2xl">
                    What would you do?
                  </p>
                </div>

                {/* ANSWERS */}
                <div className="mx-auto mt-6 grid max-w-xl grid-cols-2 gap-4">

                  <button
                    onClick={() => chooseFirstAnswer("STAY")}
                    className="border border-[#19352c]/20 bg-[#eee5d5] px-5 py-5 font-mono text-xs font-bold tracking-[0.25em] transition-all hover:-translate-y-1 hover:border-[#c7542b]/40 hover:bg-[#f8f1e6]"
                  >
                    STAY
                  </button>

                  <button
                    onClick={() => chooseFirstAnswer("LEAVE")}
                    className="border border-[#19352c]/20 bg-[#eee5d5] px-5 py-5 font-mono text-xs font-bold tracking-[0.25em] transition-all hover:-translate-y-1 hover:border-[#c7542b]/40 hover:bg-[#f8f1e6]"
                  >
                    LEAVE
                  </button>

                </div>
              </motion.div>
            )}

            {/* =====================================================
                WAIT ONE
            ====================================================== */}
            {stage === "wait-one" && (
              <motion.div
                key="wait-one"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="mx-auto max-w-xl border border-[#19352c]/15 bg-[#eee5d5]/40 p-10 sm:p-16">

                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#c7542b]">
                    Decision recorded
                  </p>

                  <h2 className="mt-6 font-serif text-5xl sm:text-7xl">
                    WAIT.
                  </h2>

                  <p className="mx-auto mt-6 max-w-md font-serif text-lg leading-8 text-[#19352c]/60">
                    The experiment is still in progress.
                  </p>

                  <div className="mt-8 h-px bg-[#19352c]/10" />

                  <p className="mt-8 font-mono text-[8px] uppercase tracking-[0.2em] text-[#19352c]/40">
                    Your answer
                  </p>

                  <p className="mt-2 font-mono text-xl font-bold text-[#19352c]">
                    {firstAnswer}
                  </p>

                </div>

                <div className="mt-10 flex flex-col items-center">

                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c7542b]" />

                    <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#19352c]/45">
                      Waiting for facilitator
                    </p>
                  </div>

                  <p className="mt-3 font-serif text-sm italic text-[#19352c]/35">
                    The experiment will continue when everyone is ready.
                  </p>

                </div>
              </motion.div>
            )}

            {/* =====================================================
                DECISION TWO
            ====================================================== */}
            {stage === "decision-two" && (
              <motion.div
                key="decision-two"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
              >

                <div className="mx-auto max-w-3xl">
                  <div className="flex items-end justify-between border-b border-[#19352c]/10 pb-4">

                    <div>
                      <p className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#c7542b]">
                        Decision Test
                      </p>

                      <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.2em] text-[#19352c]/35">
                        Commitment / 02
                      </p>
                    </div>

                    <p className="font-mono text-[8px] tracking-[0.2em] text-[#19352c]/35">
                      02 — 02
                    </p>

                  </div>
                </div>

                <div className="mt-10 text-center sm:mt-14">

                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#19352c]/40">
                    Same movie. Different history.
                  </p>

                  <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-5xl">
                    This time, your friend gave you the ticket.
                  </h2>

                  <p className="mx-auto mt-5 max-w-2xl font-serif text-base leading-7 text-[#19352c]/60 sm:text-lg">
                    You paid <strong className="text-[#19352c]">₹0</strong>.
                    <br />
                    25 minutes in, the movie is still terrible.
                    <br />
                    You still have 1 hour 45 minutes left.
                  </p>

                </div>

                {/* FREE TICKET VISUAL */}
                <div className="mx-auto mt-10 max-w-2xl">

                  <div className="relative overflow-hidden border border-[#19352c]/15 bg-[#eee5d5]/60 p-8 sm:p-12">

                    <div className="absolute left-3 top-3 h-3 w-3 border-l border-t border-[#c7542b]/40" />
                    <div className="absolute right-3 top-3 h-3 w-3 border-r border-t border-[#c7542b]/40" />
                    <div className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[#c7542b]/40" />
                    <div className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#c7542b]/40" />

                    <div className="flex flex-col items-center text-center">

                      <Film
                        className="h-12 w-12 text-[#19352c]/65"
                        strokeWidth={1}
                      />

                      <p className="mt-6 font-mono text-[8px] uppercase tracking-[0.3em] text-[#19352c]/40">
                        Ticket received
                      </p>

                      <p className="mt-3 font-serif text-4xl">
                        ₹0
                      </p>

                      <div className="mt-6 h-px w-full max-w-xs bg-[#19352c]/10" />

                      <div className="mt-6 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.2em] text-[#19352c]/45">
                        <Clock className="h-3.5 w-3.5" />
                        25 minutes watched
                      </div>

                    </div>

                  </div>

                </div>

                {/* TIMER */}
                <div className="mx-auto mt-8 flex max-w-[420px] flex-col items-center">

                  <div className="flex items-center gap-3">

                    <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#19352c]/35">
                      Time remaining
                    </span>

                    <motion.span
                      key={timeLeft}
                      initial={{ opacity: 0.4, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`font-mono text-sm font-bold ${
                        timeLeft <= 3
                          ? "text-[#c7542b]"
                          : "text-[#19352c]"
                      }`}
                    >
                      {String(timeLeft).padStart(2, "0")}
                    </motion.span>

                  </div>

                  <div className="mt-3 h-[2px] w-full overflow-hidden bg-[#19352c]/10">

                    <motion.div
                      className="h-full bg-[#c7542b]"
                      animate={{
                        width: `${(timeLeft / 10) * 100}%`,
                      }}
                      transition={{
                        duration: 0.9,
                        ease: "linear",
                      }}
                    />

                  </div>

                </div>

                <div className="mt-10 text-center">

                  <p className="font-serif text-xl sm:text-2xl">
                    What would you do?
                  </p>

                </div>

                <div className="mx-auto mt-6 grid max-w-xl grid-cols-2 gap-4">

                  <button
                    onClick={() => chooseSecondAnswer("STAY")}
                    className="border border-[#19352c]/20 bg-[#eee5d5] px-5 py-5 font-mono text-xs font-bold tracking-[0.25em] transition-all hover:-translate-y-1 hover:border-[#c7542b]/40 hover:bg-[#f8f1e6]"
                  >
                    STAY
                  </button>

                  <button
                    onClick={() => chooseSecondAnswer("LEAVE")}
                    className="border border-[#19352c]/20 bg-[#eee5d5] px-5 py-5 font-mono text-xs font-bold tracking-[0.25em] transition-all hover:-translate-y-1 hover:border-[#c7542b]/40 hover:bg-[#f8f1e6]"
                  >
                    LEAVE
                  </button>

                </div>

              </motion.div>
            )}

            {/* =====================================================
                WAIT TWO
            ====================================================== */}
            {stage === "wait-two" && (
              <motion.div
                key="wait-two"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >

                <div className="mx-auto max-w-xl border border-[#19352c]/15 bg-[#eee5d5]/40 p-10 sm:p-16">

                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#c7542b]">
                    Final decision recorded
                  </p>

                  <h2 className="mt-6 font-serif text-5xl sm:text-7xl">
                    WAIT.
                  </h2>

                  <p className="mx-auto mt-6 max-w-md font-serif text-lg leading-8 text-[#19352c]/60">
                    Both decisions are now recorded.
                  </p>

                  <div className="mt-8 h-px bg-[#19352c]/10" />

                  <div className="mt-8 grid grid-cols-2 gap-6">

                    <div>
                      <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#19352c]/40">
                        Paid ₹500
                      </p>

                      <p className="mt-2 font-mono text-lg font-bold">
                        {firstAnswer}
                      </p>
                    </div>

                    <div>
                      <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#19352c]/40">
                        Paid ₹0
                      </p>

                      <p className="mt-2 font-mono text-lg font-bold">
                        {secondAnswer}
                      </p>
                    </div>

                  </div>

                </div>

                <div className="mt-10 flex flex-col items-center">

                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c7542b]" />

                    <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#19352c]/45">
                      Waiting for facilitator
                    </p>
                  </div>

                  <p className="mt-3 font-serif text-sm italic text-[#19352c]/35">
                    The reveal will begin when everyone is ready.
                  </p>
                </div>

              </motion.div>
            )}

            {/* =====================================================
                REVEAL
            ====================================================== */}
            {stage === "reveal" && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#c7542b]"
                >
                  The reveal
                </motion.p>

                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-5 font-serif text-4xl leading-tight sm:text-6xl"
                >
                  THE ₹500 IS GONE EITHER WAY.
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mx-auto mt-6 max-w-2xl font-serif text-lg leading-8 text-[#19352c]/60 sm:text-xl"
                >
                  Staying doesn't bring the ₹500 back.
                  <br />
                  Leaving doesn't make you lose another ₹500.
                </motion.p>

                {/* DECISION COMPARISON */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2"
                >

                  <div className="border border-[#19352c]/15 bg-[#eee5d5]/50 p-7 text-left">

                    <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#c7542b]">
                      Situation 01
                    </p>

                    <p className="mt-4 font-serif text-xl">
                      You paid ₹500
                    </p>

                    <div className="mt-6 border-t border-[#19352c]/10 pt-5">

                      <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#19352c]/40">
                        Your decision
                      </p>

                      <p className="mt-2 font-mono text-2xl font-bold">
                        {firstAnswer}
                      </p>

                    </div>

                  </div>

                  <div className="border border-[#19352c]/15 bg-[#eee5d5]/50 p-7 text-left">

                    <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#c7542b]">
                      Situation 02
                    </p>

                    <p className="mt-4 font-serif text-xl">
                      You paid ₹0
                    </p>

                    <div className="mt-6 border-t border-[#19352c]/10 pt-5">

                      <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#19352c]/40">
                        Your decision
                      </p>

                      <p className="mt-2 font-mono text-2xl font-bold">
                        {secondAnswer}
                      </p>

                    </div>

                  </div>

                </motion.div>

                {/* EXPLANATION */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="mx-auto mt-10 max-w-2xl border-l-2 border-[#c7542b] pl-6 text-left"
                >

                  <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#c7542b]">
                    The psychology
                  </p>

                  <p className="mt-4 font-serif text-lg leading-8 text-[#19352c]/70 sm:text-xl">
                    When something we've already invested in starts going
                    badly, that investment can make walking away feel harder.
                  </p>

                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  onClick={() => setStage("real-world")}
                  className="mt-10 flex mx-auto items-center gap-5 bg-[#19352c] px-7 py-4 font-mono text-[9px] font-semibold uppercase tracking-[0.25em] text-[#f8f1e6] transition-colors hover:bg-[#19352c]/90"
                >
                  See It In Real Life
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </motion.button>

              </motion.div>
            )}

            {/* =====================================================
                REAL WORLD
            ====================================================== */}
            {stage === "real-world" && (
              <motion.div
                key="real-world"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >

                <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#c7542b]">
                  Outside the experiment
                </p>

                <h2 className="mt-5 font-serif text-4xl sm:text-6xl">
                  YOU'VE PROBABLY DONE THIS.
                </h2>

                <p className="mx-auto mt-6 max-w-2xl font-serif text-lg leading-8 text-[#19352c]/60">
                  Sunk costs aren't just about money.
                  <br />
                  They can be time, effort, or energy too.
                </p>

                {/* REAL WORLD EXAMPLES */}
                <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">

                  <div className="border border-[#19352c]/15 bg-[#eee5d5]/45 p-7 text-left">
                    <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#c7542b]">
                      01 / Entertainment
                    </p>

                    <h3 className="mt-4 font-serif text-2xl">
                      The movie
                    </h3>

                    <p className="mt-3 font-serif text-sm leading-6 text-[#19352c]/60">
                      "I paid for it, so I might as well finish it."
                    </p>
                  </div>

                  <div className="border border-[#19352c]/15 bg-[#eee5d5]/45 p-7 text-left">
                    <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#c7542b]">
                      02 / Learning
                    </p>

                    <h3 className="mt-4 font-serif text-2xl">
                      The course
                    </h3>

                    <p className="mt-3 font-serif text-sm leading-6 text-[#19352c]/60">
                      "I've already spent ₹20,000 on this course."
                    </p>
                  </div>

                  <div className="border border-[#19352c]/15 bg-[#eee5d5]/45 p-7 text-left">
                    <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#c7542b]">
                      03 / Projects
                    </p>

                    <h3 className="mt-4 font-serif text-2xl">
                      The project
                    </h3>

                    <p className="mt-3 font-serif text-sm leading-6 text-[#19352c]/60">
                      "We've already spent three months building it."
                    </p>
                  </div>

                  <div className="border border-[#19352c]/15 bg-[#eee5d5]/45 p-7 text-left">
                    <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#c7542b]">
                      04 / Subscriptions
                    </p>

                    <h3 className="mt-4 font-serif text-2xl">
                      The subscription
                    </h3>

                    <p className="mt-3 font-serif text-sm leading-6 text-[#19352c]/60">
                      "I've already paid for the year."
                    </p>
                  </div>

                </div>

                {/* KEY QUESTION */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mx-auto mt-12 max-w-2xl border border-[#19352c]/15 bg-[#19352c] p-8 text-left text-[#f8f1e6] sm:p-10"
                >

                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#c7542b]">
                    A better question
                  </p>

                  <p className="mt-5 font-serif text-2xl leading-9 sm:text-3xl">
                    "Knowing what I know now,
                    <br />
                    would I still choose to continue?"
                  </p>

                </motion.div>

                <button
                  onClick={() => setStage("complete")}
                  className="mt-10 flex mx-auto items-center gap-5 bg-[#19352c] px-7 py-4 font-mono text-[9px] font-semibold uppercase tracking-[0.25em] text-[#f8f1e6] transition-colors hover:bg-[#19352c]/90"
                >
                  Complete Experiment
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </button>

              </motion.div>
            )}

            {/* =====================================================
                COMPLETE
            ====================================================== */}
            {stage === "complete" && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >

                <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#c7542b]">
                  Experiment 02
                </p>

                <h2 className="mt-5 font-serif text-5xl sm:text-7xl">
                  COMPLETE.
                </h2>

                <div className="mx-auto mt-10 max-w-xl border border-[#19352c]/15 bg-[#eee5d5]/50 p-8 sm:p-12">

                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#19352c]/40">
                    COMMITMENT
                  </p>

                  <p className="mt-6 font-serif text-2xl leading-9">
                    The past is already spent.
                    <br />
                    <span className="text-[#c7542b]">
                      Your next decision is still yours.
                    </span>
                  </p>

                </div>

                <div className="mt-12">

                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#c7542b]">
                    Physical Pass
                  </p>

                  <h3 className="mt-3 font-serif text-3xl">
                    Add Sticker 02
                  </h3>

                  <p className="mt-3 font-serif text-base text-[#19352c]/55">
                    COMMITMENT
                  </p>

                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </section>
      </div>
    </main>
  );
}