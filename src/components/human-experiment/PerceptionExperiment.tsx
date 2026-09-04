"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ArrowRight } from "lucide-react";
import { useHumanExperimentSession } from "@/lib/human-experiment/useHumanExperimentSession";
import { supabase } from "@/lib/supabase";
type Stage =
  | "intro"
  | "question"
  | "wait"
  | "same-bonus"
  | "reveal"
  | "complete";

export default function PerceptionExperiment() {
    const [stage, setStage] = useState<Stage>("intro");
  const [hasAnswered, setHasAnswered] = useState(false);

  const session = useHumanExperimentSession();
  const isLocked = session.status === "PAUSED";

  const participantKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem(
          "arise-human-experiment-participant"
        ) ||
        new URLSearchParams(window.location.search).get(
          "participant"
        ) ||
        "AR-001"
      : "AR-001";

  // Save participant ID locally
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      "arise-human-experiment-participant",
      participantKey
    );
  }, [participantKey]);

  // Register participant in Supabase
  const registerParticipant = async () => {
    if (!supabase) return;
    if (!session.sessionId) return;

    const { data: existing, error: existingError } =
      await supabase
        .from("experiment_participants")
        .select("id")
        .eq("session_id", session.sessionId)
        .eq("participant_key", participantKey)
        .maybeSingle();

    if (existingError) {
      console.error(
        "FAILED TO CHECK PARTICIPANT:",
        existingError
      );
      return;
    }

    if (existing) return;

    const { error } = await supabase
      .from("experiment_participants")
      .insert({
        session_id: session.sessionId,
        participant_key: participantKey,
        display_name: participantKey,
        status: "READY",
        connected: true,
        current_experiment: 1,
      });

    if (error) {
  console.error(
    "PARTICIPANT REGISTRATION FAILED:",
    JSON.stringify(error, null, 2)
  );

  console.error("message:", error.message);
  console.error("code:", error.code);
  console.error("details:", error.details);
  console.error("hint:", error.hint);
} else {
  console.log(
    "PARTICIPANT REGISTERED:",
    participantKey
  );
}
};

useEffect(() => {
    if (!session.sessionId) return;

    void registerParticipant();
  }, [session.sessionId]);
    
  const submitParticipantAnswer = async (
  value: "A" | "B" | "SAME"
) => {
  if (!supabase) return;
  if (!session.sessionId) return;

  const { error } = await supabase
    .from("experiment_participants")
    .update({
      answer: value,
      status: "ANSWERED",
      submitted_at: new Date().toISOString(),
      connected: true,
      current_experiment: 1,
    })
    .eq("session_id", session.sessionId)
    .eq("participant_key", participantKey);

  if (error) {
    console.error("FAILED TO SUBMIT ANSWER:", error);
    return;
  }

  console.log("ANSWER SUBMITTED:", participantKey, value);
};
      useEffect(() => {
    if (session.experiment !== 1) return;

    const stageMap: Record<string, Stage> = {
      INTRO: "intro",
      START: "question",
      QUESTION: "question",
      WAIT: "wait",
      REVEAL: "reveal",
      DISCUSSION: "reveal",
      COMPLETE: "complete",
    };

    const nextStage = stageMap[session.stage];

if (nextStage) {
  setStage(nextStage);
}
  }, [session.experiment, session.stage]);

  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
}, [stage]);
  const [answer, setAnswer] = useState<"A" | "B" | "SAME" | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  useEffect(() => {
  if (session.experiment !== 1) return;
  if (session.stage !== "QUESTION") return;
  if (!session.timerStartedAt) return;

  const updateTimer = () => {
    const elapsed = Date.now() - session.timerStartedAt!;
    const remaining = Math.max(
      0,
      Math.ceil((session.timerDuration - elapsed) / 1000)
    );

    setTimeLeft(remaining);
  };

  updateTimer();

  const interval = window.setInterval(updateTimer, 250);

  return () => window.clearInterval(interval);
}, [
  session.experiment,
  session.stage,
  session.timerStartedAt,
  session.timerDuration,
]);

const chooseAnswer = (value: "A" | "B" | "SAME") => {
  if (isLocked) return;
  if (hasAnswered) return;

  setAnswer(value);
  setHasAnswered(true);

  void submitParticipantAnswer(value);

  if (value === "SAME") {
    setStage("same-bonus");
    return;
  }

  setStage("wait");
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
              01 / 06
            </p>
          </div>
        </header>

        {/* MAIN EXPERIENCE */}
        <section className="mx-auto max-w-[1000px] py-12 sm:py-20">

          <AnimatePresence mode="wait">

            {/* =========================
                INTRO
            ========================== */}
            {stage === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="text-center"
              >
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.35em] text-[#c7542b]">
                  Experiment 01
                </p>

                <h2 className="mt-5 font-serif text-5xl leading-none sm:text-7xl">
                  PERCEPTION
                </h2>

                <p className="mx-auto mt-7 max-w-xl font-serif text-lg leading-8 text-[#19352c]/65 sm:text-xl">
                  How much can you trust what you see?
                </p>

                <div className="mx-auto mt-12 max-w-md border border-[#19352c]/15 bg-[#eee5d5]/40 p-6 text-left">
                  <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#19352c]/40">
                    Before we begin
                  </p>

                  <p className="mt-4 font-serif text-base leading-7">
                    There is no right or wrong answer.
                    <br />
                    Choose what you naturally see.
                  </p>
                </div>

                <button
                 onClick={() => {
  if (isLocked) return;

  setStage("question");
}}
                  className="mt-10 rounded-full bg-[#19352c] px-8 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#f8f1e6] transition-transform hover:scale-[1.02]"
                >
                  Begin Experiment
                </button>
              </motion.div>
            )}
{/* =========================
    QUESTION
========================== */}
{stage === "question" && (
  <motion.div
    key="question"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.5 }}
  >
    {/* EXPERIMENT HEADER */}
    <div className="mx-auto max-w-3xl">
      <div className="flex items-end justify-between border-b border-[#19352c]/10 pb-4">
        <div>
          <p className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#c7542b]">
            Observation Test
          </p>

          <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.2em] text-[#19352c]/35">
            Visual Perception / 01
          </p>
        </div>

        <p className="font-mono text-[8px] tracking-[0.2em] text-[#19352c]/35">
          01 — 01
        </p>
      </div>
    </div>

    {/* QUESTION */}
    <div className="mt-10 text-center sm:mt-14">
      <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#19352c]/40">
        Trust your first impression
      </p>

      <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-5xl">
        Which centre looks darker?
      </h2>
    </div>

    {/* TIMER */}
    <div className="mx-auto mt-7 flex max-w-[420px] flex-col items-center">
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

      {/* TIMER BAR */}
      <div className="mt-3 h-[2px] w-full overflow-hidden bg-[#19352c]/10">
        <motion.div
          className="h-full bg-[#c7542b]"
          initial={{ width: "100%" }}
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

    {/* VISUAL TEST FRAME */}
    <div className="mx-auto mt-10 max-w-4xl sm:mt-12">
      <div className="relative border border-[#19352c]/15 bg-[#eee5d5]/35 p-3 sm:p-5">

        {/* corner details */}
        <div className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-[#c7542b]/40" />
        <div className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-[#c7542b]/40" />
        <div className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b border-l border-[#c7542b]/40" />
        <div className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-[#c7542b]/40" />

        {/* visual area */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">

          {/* A */}
          <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#e8dfd0]"
          >
            <div className="absolute left-3 top-3 font-mono text-[7px] tracking-[0.25em] text-[#19352c]/25">
              A
            </div>

            <motion.div
              animate={{
                scale: [1, 1.015, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-24 w-24 bg-[#777777] sm:h-32 sm:w-32"
            />
          </motion.div>

          {/* B */}
          <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#19352c]"
          >
            <div className="absolute left-3 top-3 font-mono text-[7px] tracking-[0.25em] text-[#f8f1e6]/30">
              B
            </div>

            <motion.div
              animate={{
                scale: [1, 1.015, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
              className="h-24 w-24 bg-[#777777] sm:h-32 sm:w-32"
            />
          </motion.div>

        </div>

        {/* frame label */}
        <div className="mt-3 flex items-center justify-between px-1">
          <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-[#19352c]/25">
            Visual stimulus
          </span>

          <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-[#19352c]/25">
            Observe
          </span>
        </div>
      </div>
    </div>

    {/* ANSWER PROMPT */}
    <div className="mt-8 text-center">
      <p className="font-serif text-base italic text-[#19352c]/50">
        What did you see first?
      </p>
    </div>

    {/* ANSWERS */}
    <div className="mx-auto mt-5 grid max-w-xl grid-cols-3 gap-3">

      <button
        onClick={() => {
  if (isLocked) return;
  chooseAnswer("A");
}}
        className="group border border-[#19352c]/20 bg-[#eee5d5] py-4 font-mono text-xs font-bold tracking-[0.25em] transition-all hover:-translate-y-0.5 hover:border-[#c7542b]/40 hover:bg-[#f8f1e6]"
      >
        A
      </button>

      <button
        onClick={() => {
  if (isLocked) return;
  chooseAnswer("B");
}}
        className="group border border-[#19352c]/20 bg-[#eee5d5] py-4 font-mono text-xs font-bold tracking-[0.25em] transition-all hover:-translate-y-0.5 hover:border-[#c7542b]/40 hover:bg-[#f8f1e6]"
      >
        B
      </button>

      <button
        onClick={() => {
  if (isLocked) return;
  chooseAnswer("SAME");
}}
        className="group border border-[#19352c]/20 bg-[#eee5d5] py-4 font-mono text-xs font-bold tracking-[0.25em] transition-all hover:-translate-y-0.5 hover:border-[#c7542b]/40 hover:bg-[#f8f1e6]"
      >
        SAME
      </button>

    </div>

    {/* FOOTNOTE */}
    <p className="mt-7 text-center font-mono text-[6px] uppercase tracking-[0.25em] text-[#19352c]/25">
      There is no right or wrong answer
    </p>
  </motion.div>
)}
            {/* =========================
    SAME — BONUS
========================== */}

{stage === "same-bonus" && (
  <motion.div
    key="same-bonus"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="flex min-h-[420px] flex-col items-center justify-center text-center"
  >
    {/* Eye */}
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative flex h-20 w-20 items-center justify-center"
    >
      {/* subtle pulse */}
      <motion.div
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.15, 0.05, 0.15],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full border border-[#c7542b]/40"
      />

      <Eye
        className="relative h-9 w-9 text-[#19352c]"
        strokeWidth={1.4}
      />
    </motion.div>

    {/* Label */}
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      className="mt-7 font-mono text-[8px] uppercase tracking-[0.35em] text-[#c7542b]"
    >
      Perception / Bonus
    </motion.p>

    {/* Heading */}
    <motion.h2
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.6 }}
      className="mt-3 font-serif text-5xl tracking-[-0.02em] text-[#19352c] sm:text-6xl"
    >
      GOOD EYE.
    </motion.h2>

    {/* Explanation */}
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mx-auto mt-6 max-w-md font-serif text-base leading-7 text-[#19352c]/60 sm:text-lg sm:leading-8"
    >
      You questioned what you were seeing
      <br className="hidden sm:block" />
      before we revealed the trick.
    </motion.p>

    {/* Bonus card */}
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.7,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="mt-10 w-full max-w-xl border border-[#19352c]/15 bg-[#eee5d5]/45 p-6 text-left sm:p-8"
    >
      <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#c7542b]">
        Bonus observation
      </p>

      <p className="mt-5 font-serif text-xl leading-8 text-[#19352c] sm:text-2xl sm:leading-9">
        Most people look for an answer.
        <br />
        <span className="text-[#c7542b]">
          You looked for the assumption.
        </span>
      </p>

      <div className="mt-6 border-t border-[#19352c]/10 pt-6">
        <p className="font-serif text-sm leading-6 text-[#19352c]/55 sm:text-base sm:leading-7">
          Knowing how perception works doesn't make you
          immune to it. Our brains still interpret what we
          see through context.
        </p>
      </div>
    </motion.div>

    {/* Facilitator note */}
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="mt-7 font-mono text-[7px] uppercase tracking-[0.25em] text-[#19352c]/35"
    >
      Your facilitator will explain why.
    </motion.p>

    {/* Continue */}
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.5 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
  if (isLocked) return;

  setStage("wait");
}}
      className="mt-8 flex items-center gap-5 border border-[#19352c]/20 bg-[#19352c] px-7 py-4 font-mono text-[9px] font-semibold uppercase tracking-[0.25em] text-[#f8f1e6] transition-colors hover:bg-[#19352c]/90"
    >
      Continue
      <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
    </motion.button>
  </motion.div>
)}
    
            {/* =========================
                WAIT
            ========================== */}
            {stage === "wait" && (
              <motion.div
                key="wait"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="mx-auto max-w-xl border border-[#19352c]/15 bg-[#eee5d5]/40 p-10 sm:p-16">

                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#c7542b]">
                    Answer recorded
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
                    {answer}
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
            {/* =========================
    REVEAL
========================== */}
{stage === "reveal" && (
  <motion.div
    key="reveal"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center"
  >
    {/* LOOK AGAIN */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#c7542b]">
        Look again.
      </p>

      <h2 className="mt-5 font-serif text-4xl sm:text-6xl">
        LOOK AGAIN.
      </h2>
    </motion.div>

    {/* VISUAL */}
    <div className="mx-auto mt-12 max-w-3xl">
      <div className="relative overflow-hidden bg-[#d9d0c1] p-8 sm:p-12">

        <div className="flex items-center justify-center gap-8 sm:gap-16">

          {/* A */}
          <motion.div
            initial={{
              x: -35,
              opacity: 0.8,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-center"
          >
            <div className="h-28 w-28 bg-[#777777] sm:h-40 sm:w-40" />

            <p className="mt-4 font-mono text-[9px] font-bold tracking-[0.25em]">
              A
            </p>
          </motion.div>

          {/* DIVIDER */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="h-20 w-px bg-[#19352c]/15"
          />

          {/* B */}
          <motion.div
            initial={{
              x: 35,
              opacity: 0.8,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-center"
          >
            <div className="h-28 w-28 bg-[#777777] sm:h-40 sm:w-40" />

            <p className="mt-4 font-mono text-[9px] font-bold tracking-[0.25em]">
              B
            </p>
          </motion.div>

        </div>

      </div>
    </div>

    {/* THE SAME */}
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 1.5,
        duration: 0.8,
      }}
      className="mt-10"
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#c7542b]">
        The reveal
      </p>

      <h3 className="mt-3 font-serif text-3xl sm:text-5xl">
        THEY ARE THE SAME.
      </h3>

      <p className="mx-auto mt-6 max-w-2xl font-serif text-lg leading-8 text-[#19352c]/65 sm:text-xl">
        The object didn't change.
        <br />
        <span className="text-[#c7542b]">
          Your perception did.
        </span>
      </p>
    </motion.div>

    {/* CONTINUE */}
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2, duration: 0.5 }}
      onClick={() => {
  if (isLocked) return;
}}
      className="mt-10 rounded-full bg-[#19352c] px-8 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#f8f1e6] transition-transform hover:scale-[1.02]"
    >
      Continue
    </motion.button>
  </motion.div>
)}

            {/* =========================
                COMPLETE
            ========================== */}
            {stage === "complete" && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#c7542b]">
                  Experiment 01
                </p>

                <h2 className="mt-5 font-serif text-5xl sm:text-7xl">
                  COMPLETE.
                </h2>

                <div className="mx-auto mt-10 max-w-xl border border-[#19352c]/15 bg-[#eee5d5]/50 p-8 sm:p-12">

                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#19352c]/40">
                    PERCEPTION
                  </p>

                  <p className="mt-6 font-serif text-2xl leading-9">
                    You didn't just see it.
                    <br />
                    You interpreted it.
                  </p>

                </div>

                <div className="mt-12">
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#c7542b]">
                    Physical Pass
                  </p>

                  <h3 className="mt-3 font-serif text-3xl">
                    Add Sticker 01
                  </h3>

                  <p className="mt-3 font-serif text-base text-[#19352c]/55">
                    PERCEPTION
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