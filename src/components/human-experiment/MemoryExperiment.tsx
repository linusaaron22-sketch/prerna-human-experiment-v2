"use client";

import { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  Eye,
  HelpCircle,
  MessageCircle,
  Train,
  Bus,
  Brain,
  Sparkles,
} from "lucide-react";

type Stage =
  | "intro"
  | "observe"
  | "journey"
  | "questions"
  | "confidence"
  | "wait"
  | "reveal"
  | "discussion"
  | "takeaway"
  | "complete";

type Answer = {
  question: number;
  value: string;
};

const OBJECTS = [
  {
    number: "01",
    name: "RED NOTEBOOK",
    detail: "YOUR NOTEBOOK",
    type: "notebook",
  },
  {
    number: "02",
    name: "BLACK BACKPACK",
    detail: "ON THE DESK",
    type: "bag",
  },
  {
    number: "03",
    name: "BLUE WATER BOTTLE",
    detail: "NEAR THE NOTEBOOK",
    type: "bottle",
  },
  {
    number: "04",
    name: "GREEN PENCIL CASE",
    detail: "BESIDE THE BAG",
    type: "case",
  },
];

const QUESTIONS = [
  {
    number: "01",
    question: "What colour was the notebook?",
    options: ["RED", "BLUE", "GREEN", "BLACK"],
    correct: "RED",
    kind: "fact",
  },
  {
    number: "02",
    question: "What colour was the water bottle?",
    options: ["RED", "BLUE", "GREEN", "BLACK"],
    correct: "BLUE",
    kind: "fact",
  },
  {
    number: "03",
    question: "Who did the black backpack belong to?",
    options: [
      "YOU",
      "YOUR FRIEND",
      "ANOTHER STUDENT",
      "IT WAS NEVER ESTABLISHED",
    ],
    correct: "IT WAS NEVER ESTABLISHED",
    kind: "inference",
  },
  {
    number: "04",
    question: "Why was your friend waiting outside?",
    options: [
      "THEY WERE WAITING FOR YOU",
      "THE CLASSROOM WAS LOCKED",
      "THEY WERE ON THEIR PHONE",
      "IT WAS NEVER ESTABLISHED",
    ],
    correct: "IT WAS NEVER ESTABLISHED",
    kind: "inference",
  },
  {
    number: "05",
    question: "What colour was the pencil case?",
    options: ["RED", "BLUE", "GREEN", "BLACK"],
    correct: "GREEN",
    kind: "fact",
  },
];

function SceneObject({
  type,
}: {
  type: "notebook" | "bag" | "bottle" | "case";
}) {
  if (type === "notebook") {
    return (
      <div className="relative h-24 w-20 rotate-[-3deg] border border-[#c7542b]/35 bg-[#e9d2c0] shadow-[5px_5px_0_rgba(25,53,44,0.06)] sm:h-28 sm:w-24">
        <div className="absolute left-3 top-0 h-full w-px bg-[#c7542b]/20" />
        <div className="absolute bottom-3 left-3 right-3 border-t border-[#19352c]/15" />
        <div className="absolute bottom-1 left-3 font-mono text-[6px] tracking-[0.18em] text-[#c7542b]">
          NOTEBOOK
        </div>
      </div>
    );
  }

  if (type === "bag") {
    return (
      <div className="relative h-20 w-24 rounded-[3px] bg-[#19352c] shadow-[5px_5px_0_rgba(25,53,44,0.08)] sm:h-24 sm:w-28">
        <div className="absolute left-1/2 top-[-10px] h-5 w-10 -translate-x-1/2 rounded-t-full border-2 border-b-0 border-[#19352c]/70" />
        <div className="absolute bottom-3 left-4 right-4 h-px bg-[#f8f1e6]/15" />
        <div className="absolute bottom-1 left-4 font-mono text-[6px] tracking-[0.18em] text-[#f8f1e6]/50">
          BACKPACK
        </div>
      </div>
    );
  }

  if (type === "bottle") {
    return (
      <div className="relative flex h-28 w-16 items-center justify-center rounded-[14px] border border-[#19352c]/15 bg-[#dce2df] shadow-[5px_5px_0_rgba(25,53,44,0.05)] sm:h-32 sm:w-20">
        <div className="absolute top-[-7px] h-5 w-7 rounded-t-[3px] bg-[#19352c]/15" />
        <div className="h-16 w-8 rounded-full bg-[#9aaeb0]/60 sm:h-20 sm:w-9" />
        <div className="absolute bottom-3 font-mono text-[6px] tracking-[0.12em] text-[#19352c]/45">
          BOTTLE
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-16 w-28 items-center justify-center rounded-[3px] border border-[#19352c]/15 bg-[#d8dfd4] shadow-[5px_5px_0_rgba(25,53,44,0.05)] sm:h-20 sm:w-32">
      <div className="h-1.5 w-20 rounded-full bg-[#19352c]/15" />
      <div className="absolute bottom-2 font-mono text-[6px] tracking-[0.18em] text-[#19352c]/45">
        PENCIL CASE
      </div>
    </div>
  );
}
function ContinueButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group inline-flex min-h-14 items-center justify-center gap-5 bg-[#19352c] px-7 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#f8f1e6] transition-all duration-300 hover:bg-[#24483c] disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-16 sm:px-9"
    >
      <span>{children}</span>
      <ArrowRight
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
        strokeWidth={1.5}
      />
    </button>
  );
}

export default function MemoryExperiment() {
  const [stage, setStage] = useState<Stage>("intro");
  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
}, [stage]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [confidence, setConfidence] = useState(80);
  const [journeyAnswer, setJourneyAnswer] = useState<"bus" | "train" | null>(
    null
  );
  const [questionIndex, setQuestionIndex] = useState(0);

  const currentQuestion = QUESTIONS[questionIndex];

  const score = useMemo(() => {
    return answers.reduce((total, answer) => {
      const question = QUESTIONS[answer.question];
      return total + (question.correct === answer.value ? 1 : 0);
    }, 0);
  }, [answers]);

  const answerQuestion = (value: string) => {
    setAnswers((current) => {
      const filtered = current.filter(
        (item) => item.question !== questionIndex
      );

      return [
        ...filtered,
        {
          question: questionIndex,
          value,
        },
      ];
    });

    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex((current) => current + 1);
    } else {
      setStage("confidence");
    }
  };

  const resetExperiment = () => {
    setStage("intro");
    setAnswers([]);
    setConfidence(80);
    setJourneyAnswer(null);
    setQuestionIndex(0);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8f1e6] text-[#19352c]">
      {/* =====================================================
          TOP BAR
      ====================================================== */}
      <header className="border-b border-[#19352c]/10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <div>
            <div className="font-sans text-lg font-semibold tracking-[0.24em] sm:text-xl">
              ARISE
            </div>

            <div className="mt-1 font-mono text-[7px] uppercase tracking-[0.28em] text-[#19352c]/45 sm:text-[8px]">
              × Human Experiment
            </div>
          </div>
            <div className="flex items-center gap-8">

        <div className="text-right">
  <p className="font-mono text-[7px] uppercase tracking-[0.22em] text-[#19352c]/40">
    Experiment
  </p>

  <p className="mt-1 font-mono text-sm font-bold text-[#c7542b]">
    04 / 06
  </p>
</div>
</div>
        </div>
      </header>

      <section className="mx-auto min-h-[calc(100vh-82px)] max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <AnimatePresence mode="wait">

          {/* =====================================================
              INTRO
          ====================================================== */}
          {stage === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex min-h-[calc(100vh-82px)] items-center justify-center py-14"
            >
              <div className="w-full max-w-5xl text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eee5d5] sm:h-20 sm:w-20">
                  <Brain
                    className="h-7 w-7 text-[#c7542b] sm:h-9 sm:w-9"
                    strokeWidth={1.2}
                  />
                </div>

                <p className="mt-8 font-mono text-[9px] font-bold uppercase tracking-[0.35em] text-[#c7542b]">
                  Experiment 04
                </p>

                <h2 className="mt-5 font-serif text-6xl leading-[0.9] tracking-[-0.03em] sm:text-8xl lg:text-[9rem]">
                  MEMORY
                </h2>

                <p className="mx-auto mt-7 max-w-2xl font-serif text-lg leading-8 text-black/60 sm:text-2xl sm:leading-10">
                  Let’s see what your memory holds onto.
                  <br />
                </p>

                <div className="mt-10">
                  <ContinueButton onClick={() => setStage("observe")}>
                    Begin
                  </ContinueButton>
                </div>

                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[#000000]/35">
                  JUST FOLLOW THE STORY.
                </p>
              </div>
            </motion.div>
          )}

          {/* =====================================================
              OBSERVE
          ====================================================== */}
          {stage === "observe" && (
            <motion.div
              key="observe"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="py-10 sm:py-16 lg:py-20"
            >
              <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                {/* STORY */}
                <div>
                  <div className="flex items-center gap-3">
                    <Eye
                      className="h-4 w-4 text-[#c7542b]"
                      strokeWidth={1.5}
                    />

                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#c7542b]">
                      Observe the situation
                    </p>
                  </div>

                  <p className="mt-10 font-mono text-[8px] uppercase tracking-[0.28em] text-[#19352c]/40">
                    A NORMAL EVENING
                  </p>

                  <h2 className="mt-5 font-serif text-5xl leading-[0.94] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
                    You&apos;re leaving
                    <br />
                    college.
                  </h2>

                  <div className="mt-9 space-y-5">
                    {[
                      "A friend stops you near the gate.",
                      "You realize you left your notebook behind.",
                      "You go back into the classroom.",
                      "Inside, you notice a few things on the desk.",
                      "You pick up your notebook and leave.",
                      "Your friend is waiting outside.",
                    ].map((line, index) => (
                      <div
                        key={line}
                        className="flex gap-4 border-l border-[#c7542b]/35 pl-4"
                      >
                        <span className="pt-1 font-mono text-[7px] font-bold text-[#c7542b]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <p className="font-serif text-base leading-7 text-[#19352c]/75 sm:text-lg">
                          {line}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CLASSROOM */}
                <div className="border border-[#19352c]/10 bg-[#eee5d5] p-3 sm:p-5">
                  <div className="border border-[#19352c]/10 bg-[#f8f1e6]">
                    <div className="flex items-center justify-between border-b border-[#19352c]/10 px-4 py-4 sm:px-6">
                      <p className="font-mono text-[7px] uppercase tracking-[0.28em] text-[#19352c]/45">
                        Classroom / 18:24
                      </p>

                      <span className="flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.2em] text-[#c7542b]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#c7542b]" />
                        Live
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:gap-4 sm:p-6">
                      {OBJECTS.map((object) => (
                        <div
                          key={object.name}
                          className="flex min-h-[180px] flex-col items-center justify-between border border-[#19352c]/10 bg-[#eee5d5]/45 p-4 sm:min-h-[210px]"
                        >
                          <span className="self-start font-mono text-[7px] font-bold text-[#c7542b]">
                            {object.number}
                          </span>

                          <SceneObject type={object.type as any} />

                          <div className="w-full text-center">
                            <p className="font-mono text-[8px] font-bold tracking-[0.12em]">
                              {object.name}
                            </p>

                            <p className="mt-1 font-mono text-[6px] uppercase tracking-[0.16em] text-[#19352c]/40">
                              {object.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#19352c]/10 px-4 py-5 sm:px-6">
                      <p className="font-serif text-base italic leading-7 text-[#19352c]/65 sm:text-lg">
                        You pick up your notebook and leave.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end px-2 pt-4">
                    <p className="font-mono text-[7px] uppercase tracking-[0.22em] text-[#19352c]/35">
                      Just follow along
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-center lg:justify-end">
                <ContinueButton onClick={() => setStage("journey")}>
                  Continue
                </ContinueButton>
              </div>
            </motion.div>
          )}

          {/* =====================================================
              JOURNEY / NATURAL DISTRACTOR
          ====================================================== */}
          {stage === "journey" && (
            <motion.div
              key="journey"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="flex min-h-[calc(100vh-82px)] items-center justify-center py-12"
            >
              <div className="w-full max-w-4xl text-center">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-[#c7542b]">
                  Outside the classroom
                </p>

                <h2 className="mt-6 font-serif text-5xl leading-none sm:text-7xl lg:text-8xl">
                  You meet your friend.
                </h2>

                <div className="mx-auto mt-10 max-w-2xl border-y border-[#19352c]/10 py-8">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eee5d5]">
                    <MessageCircle
                      className="h-7 w-7 text-[#c7542b]"
                      strokeWidth={1.3}
                    />
                  </div>

                  <p className="mt-7 font-serif text-xl italic leading-9 text-[#19352c]/70 sm:text-2xl">
                    &ldquo;Got it?&rdquo;
                  </p>

                  <p className="mt-3 font-serif text-xl leading-9 sm:text-2xl">
                    You nod.
                  </p>

                  <p className="mt-7 font-serif text-xl italic leading-9 text-[#19352c]/70 sm:text-2xl">
                    &ldquo;How are you getting home?&rdquo;
                  </p>
                </div>

                <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setJourneyAnswer("bus");
                      setStage("questions");
                    }}
                    className={`group flex min-h-28 items-center justify-center gap-4 border bg-[#eee5d5]/45 px-5 transition-all duration-300 hover:border-[#c7542b]/40 hover:bg-[#eee5d5] sm:min-h-32 ${
                      journeyAnswer === "bus"
                        ? "border-[#c7542b]/50 bg-[#eee5d5]"
                        : "border-[#19352c]/12"
                    }`}
                  >
                    <Bus
                      className="h-5 w-5 text-[#c7542b]"
                      strokeWidth={1.3}
                    />

                    <span className="font-mono text-[10px] font-bold tracking-[0.24em]">
                      BUS
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setJourneyAnswer("train");
                      setStage("questions");
                    }}
                    className={`group flex min-h-28 items-center justify-center gap-4 border bg-[#eee5d5]/45 px-5 transition-all duration-300 hover:border-[#c7542b]/40 hover:bg-[#eee5d5] sm:min-h-32 ${
                      journeyAnswer === "train"
                        ? "border-[#c7542b]/50 bg-[#eee5d5]"
                        : "border-[#19352c]/12"
                    }`}
                  >
                    <Train
                      className="h-5 w-5 text-[#c7542b]"
                      strokeWidth={1.3}
                    />

                    <span className="font-mono text-[10px] font-bold tracking-[0.24em]">
                      TRAIN
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* =====================================================
              QUESTIONS
          ====================================================== */}
          {stage === "questions" && currentQuestion && (
            <motion.div
              key={`question-${questionIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex min-h-[calc(100vh-82px)] items-center justify-center py-12"
            >
              <div className="w-full max-w-4xl">
               <div className="py-12 sm:py-16">
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#c7542b]/30 font-mono text-[9px] font-bold text-[#c7542b]">
                      {currentQuestion.number}
                    </div>

                    <h2 className="max-w-3xl font-serif text-4xl leading-[1.05] sm:text-6xl">
                      {currentQuestion.question}
                    </h2>
                  </div>

                  <div className="mt-12 grid gap-3 sm:grid-cols-2">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => answerQuestion(option)}
                        className="group min-h-16 border border-[#19352c]/12 bg-[#eee5d5]/35 px-5 py-4 text-left transition-all duration-300 hover:border-[#c7542b]/40 hover:bg-[#eee5d5] sm:min-h-20 sm:px-7"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-mono text-[10px] font-bold tracking-[0.12em] sm:text-[11px]">
                            {option}
                          </span>

                          <ArrowRight
                            className="h-4 w-4 text-[#c7542b] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                            strokeWidth={1.4}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#19352c]/10 pt-5">
                  <p className="max-w-xs font-serif text-sm italic text-[#19352c]/45">
                    Go with what you remember.
                  </p>

                  <div className="flex gap-1">
                    {QUESTIONS.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 w-5 ${
                          index <= questionIndex
                            ? "bg-[#c7542b]"
                            : "bg-[#19352c]/10"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* =====================================================
              CONFIDENCE
          ====================================================== */}
          {stage === "confidence" && (
            <motion.div
              key="confidence"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="flex min-h-[calc(100vh-82px)] items-center justify-center py-12"
            >
              <div className="w-full max-w-3xl text-center">
                <HelpCircle
                  className="mx-auto h-10 w-10 text-[#c7542b]"
                  strokeWidth={1.2}
                />

                <p className="mt-7 font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-[#c7542b]">
                  One last thing
                </p>

                <h2 className="mt-5 font-serif text-5xl leading-none sm:text-7xl">
                  How sure are you?
                </h2>

                <p className="mx-auto mt-6 max-w-xl font-serif text-lg leading-8 text-[#19352c]/60 sm:text-xl">
                  How confident are you that your answers were correct?
                </p>

                <div className="mx-auto mt-14 max-w-2xl">
                  <div className="flex items-end justify-between">
                    <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#19352c]/40">
                      Just a guess
                    </span>

                    <span className="font-serif text-5xl sm:text-6xl">
                      {confidence}
                      <span className="text-2xl text-[#c7542b]">%</span>
                    </span>

                    <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#19352c]/40">
                      Absolutely sure
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={confidence}
                    onChange={(event) =>
                      setConfidence(Number(event.target.value))
                    }
                    className="mt-8 w-full accent-[#c7542b]"
                  />

                  <div className="mt-2 flex justify-between font-mono text-[7px] text-[#19352c]/30">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>

                <div className="mt-12">
                  <ContinueButton onClick={() => setStage("wait")}>
                    Lock it in
                  </ContinueButton>
                </div>
              </div>
            </motion.div>
          )}

          {/* =====================================================
              WAIT
          ====================================================== */}
          {stage === "wait" && (
            <motion.div
              key="wait"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[calc(100vh-82px)] items-center justify-center py-12"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#19352c]/10 bg-[#eee5d5]"
                >
                  <Sparkles
                    className="h-7 w-7 text-[#c7542b]"
                    strokeWidth={1.2}
                  />
                </motion.div>

                <p className="mt-9 font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-[#c7542b]">
                  Hold that thought
                </p>

                <h2 className="mt-5 font-serif text-5xl leading-none sm:text-7xl">
                  Let&apos;s see what stayed.
                </h2>

                <p className="mx-auto mt-6 max-w-xl font-serif text-lg leading-8 text-[#19352c]/55 sm:text-xl">
                  Your answers are locked.
                  <br />
                  The reveal is coming.
                </p>

                <div className="mt-10">
                  <ContinueButton onClick={() => setStage("reveal")}>
                    Reveal
                  </ContinueButton>
                </div>
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
              exit={{ opacity: 0 }}
              className="py-12 sm:py-16"
            >
              <div className="mx-auto max-w-6xl">
                <div className="text-center">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-[#c7542b]">
                    The reveal
                  </p>

                  <h2 className="mt-5 font-serif text-5xl leading-[0.95] sm:text-7xl">
                    What actually happened?
                  </h2>

                  <p className="mx-auto mt-6 max-w-2xl font-serif text-lg leading-8 text-[#19352c]/55">
                    Some details were shown.
                    <br />
                    Some were never established.
                  </p>
                </div>

                <div className="mt-12 grid gap-4 md:grid-cols-3">
                  <div className="border border-[#19352c]/10 bg-[#eee5d5]/45 p-6 sm:p-8">
                    <div className="flex h-10 w-10 items-center justify-center border border-[#19352c]/15">
                      <Check
                        className="h-5 w-5 text-[#19352c]"
                        strokeWidth={1.4}
                      />
                    </div>

                    <p className="mt-7 font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-[#c7542b]">
                      What was shown
                    </p>

                    <h3 className="mt-3 font-serif text-3xl">
                      Red notebook.
                    </h3>

                    <p className="mt-3 font-serif text-base leading-7 text-[#19352c]/55">
                      Blue water bottle.
                      <br />
                      Green pencil case.
                    </p>
                  </div>

                  <div className="border border-[#c7542b]/25 bg-[#eee5d5] p-6 sm:p-8">
                    <div className="flex h-10 w-10 items-center justify-center border border-[#c7542b]/30">
                      <Brain
                        className="h-5 w-5 text-[#c7542b]"
                        strokeWidth={1.3}
                      />
                    </div>

                    <p className="mt-7 font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-[#c7542b]">
                      What your brain filled in
                    </p>

                    <h3 className="mt-3 font-serif text-3xl">
                      The backpack was someone&apos;s.
                    </h3>

                    <p className="mt-3 font-serif text-base leading-7 text-[#19352c]/55">
                      Maybe yours.
                      <br />
                      Maybe your friend&apos;s.
                      <br />
                      But we never told you.
                    </p>
                  </div>

                  <div className="border border-[#19352c]/10 bg-[#eee5d5]/45 p-6 sm:p-8">
                    <div className="flex h-10 w-10 items-center justify-center border border-[#19352c]/15">
                      <HelpCircle
                        className="h-5 w-5 text-[#c7542b]"
                        strokeWidth={1.3}
                      />
                    </div>

                    <p className="mt-7 font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-[#c7542b]">
                      What was never established
                    </p>

                    <h3 className="mt-3 font-serif text-3xl">
                      Why your friend waited.
                    </h3>

                    <p className="mt-3 font-serif text-base leading-7 text-[#19352c]/55">
                      We said they were outside.
                      <br />
                      We never said why.
                    </p>
                  </div>
                </div>

                <div className="mt-12 grid gap-4 border-y border-[#19352c]/10 py-8 sm:grid-cols-3 sm:py-10">
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#19352c]/40">
                      Your answers
                    </p>

                    <p className="mt-2 font-serif text-4xl">
                      {score}
                      <span className="text-xl text-[#19352c]/35">
                        /{QUESTIONS.length}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#19352c]/40">
                      Your confidence
                    </p>

                    <p className="mt-2 font-serif text-4xl">
                      {confidence}
                      <span className="text-xl text-[#c7542b]">%</span>
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#19352c]/40">
                      The interesting part
                    </p>

                    <p className="mt-2 max-w-sm font-serif text-lg leading-7">
                      Being confident and being correct are not the same thing.
                    </p>
                  </div>
                </div>

                <div className="mt-10 flex justify-center">
                  <ContinueButton onClick={() => setStage("discussion")}>
                    Continue
                  </ContinueButton>
                </div>
              </div>
            </motion.div>
          )}

          {/* =====================================================
              DISCUSSION
          ====================================================== */}
          {stage === "discussion" && (
            <motion.div
              key="discussion"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="flex min-h-[calc(100vh-82px)] items-center justify-center py-12"
            >
              <div className="w-full max-w-4xl">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-[#c7542b]">
                  Talk about it
                </p>

                <h2 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.95] sm:text-7xl">
                  Did your brain add anything?
                </h2>

                <div className="mt-12 grid gap-4 sm:grid-cols-2">
                  <div className="border border-[#19352c]/10 bg-[#eee5d5]/45 p-6 sm:p-8">
                    <p className="font-mono text-[8px] font-bold tracking-[0.2em] text-[#c7542b]">
                      THINK ABOUT IT
                    </p>

                    <p className="mt-5 font-serif text-xl leading-9">
                      Were you answering from something you actually saw?
                    </p>
                  </div>

                  <div className="border border-[#19352c]/10 bg-[#eee5d5]/45 p-6 sm:p-8">
                    <p className="font-mono text-[8px] font-bold tracking-[0.2em] text-[#c7542b]">
                      OR...
                    </p>

                    <p className="mt-5 font-serif text-xl leading-9">
                      Did your brain make the story feel more complete?
                    </p>
                  </div>
                </div>

                <div className="mt-12 border-l-2 border-[#c7542b] pl-5 sm:pl-7">
                  <p className="font-serif text-xl leading-9 sm:text-2xl">
                    Memory doesn&apos;t simply store an event.
                    <br />
                    <span className="text-[#c7542b]">
                      It rebuilds the event.
                    </span>
                  </p>
                </div>

                <div className="mt-10">
                  <ContinueButton onClick={() => setStage("takeaway")}>
                    Continue
                  </ContinueButton>
                </div>
              </div>
            </motion.div>
          )}

          {/* =====================================================
              TAKEAWAY
          ====================================================== */}
          {stage === "takeaway" && (
            <motion.div
              key="takeaway"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="py-12 sm:py-16 lg:py-20"
            >
              <div className="mx-auto max-w-6xl">
                <div className="text-center">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-[#c7542b]">
                    The takeaway
                  </p>

                  <h2 className="mx-auto mt-5 max-w-5xl font-serif text-5xl leading-[0.94] tracking-[-0.02em] sm:text-7xl lg:text-8xl">
                    MEMORY ISN&apos;T
                    <br />
                    REPLAYING.
                  </h2>

                  <p className="mx-auto mt-7 max-w-2xl font-serif text-lg leading-8 text-[#19352c]/60 sm:text-xl">
                    What feels like a recording can actually be a reconstruction.
                  </p>
                </div>

                <div className="mt-12 grid gap-4 md:grid-cols-3">
                  <div className="border border-[#19352c]/10 bg-[#eee5d5]/45 p-6 sm:p-8">
                    <div className="font-mono text-[9px] font-bold text-[#c7542b]">
                      01
                    </div>

                    <h3 className="mt-7 font-serif text-3xl">NOTICE</h3>

                    <p className="mt-3 font-serif text-base leading-7 text-[#19352c]/55">
                      Pay attention to what actually happened.
                    </p>
                  </div>

                  <div className="border border-[#19352c]/10 bg-[#eee5d5]/45 p-6 sm:p-8">
                    <div className="font-mono text-[9px] font-bold text-[#c7542b]">
                      02
                    </div>

                    <h3 className="mt-7 font-serif text-3xl">FILL IN</h3>

                    <p className="mt-3 font-serif text-base leading-7 text-[#19352c]/55">
                      Your brain naturally connects missing pieces.
                    </p>
                  </div>

                  <div className="border border-[#c7542b]/25 bg-[#eee5d5] p-6 sm:p-8">
                    <div className="font-mono text-[9px] font-bold text-[#c7542b]">
                      03
                    </div>

                    <h3 className="mt-7 font-serif text-3xl">BELIEVE</h3>

                    <p className="mt-3 font-serif text-base leading-7 text-[#19352c]/55">
                      Once reconstructed, the detail can feel completely real.
                    </p>
                  </div>
                </div>
                    <div className="mx-auto mt-14 max-w-5xl border-y border-[#19352c]/10 py-10 sm:mt-16 sm:py-14">
  <div className="grid gap-10 sm:grid-cols-[0.7fr_1.3fr] sm:items-center sm:gap-16">

    {/* LABEL */}
    <div>
      <p className="font-mono text-[8px] font-bold uppercase tracking-[0.32em] text-[#c7542b]">
        One thing to remember
      </p>

      <div className="mt-5 h-px w-12 bg-[#c7542b]/40" />
    </div>

    {/* MAIN INSIGHT */}
    <div>
      <div className="font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
        <span>&ldquo;I remember it&rdquo;</span>

        <span className="mx-3 font-mono text-xl text-[#c7542b] sm:mx-4 sm:text-2xl">
          ≠
        </span>

        <span>&ldquo;I&apos;m sure about it.&rdquo;</span>
      </div>

      <p className="mt-7 max-w-xl font-mono text-[9px] font-bold uppercase tracking-[0.24em] leading-5 text-[#c7542b]">
        Confidence makes a memory feel true.
        <br />
        It doesn&apos;t make it true.
      </p>
    </div>

  </div>
</div>

<div className="mt-10 flex justify-center sm:mt-12">
  <ContinueButton onClick={() => setStage("complete")}>
    Complete
  </ContinueButton>
</div>
                
              </div>
            </motion.div>
          )}

          {/* =====================================================
              COMPLETE
          ====================================================== */}
          {stage === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex min-h-[calc(100vh-82px)] items-center justify-center py-12"
            >
              <div className="w-full max-w-3xl text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#19352c]/10 bg-[#eee5d5]">
                  <Check
                    className="h-7 w-7 text-[#c7542b]"
                    strokeWidth={1.4}
                  />
                </div>

                <p className="mt-8 font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-[#c7542b]">
                  Experiment 04
                </p>

                <h2 className="mt-5 font-serif text-6xl leading-none sm:text-8xl">
                  COMPLETE.
                </h2>

                <div className="mx-auto mt-10 border border-[#19352c]/10 bg-[#eee5d5]/45 p-7 sm:p-10">
                  <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#19352c]/40">
                    MEMORY
                  </p>

                  <p className="mt-6 font-serif text-2xl leading-9 sm:text-3xl">
                    Remembering is not replaying.
                  </p>

                  <p className="mx-auto mt-4 max-w-xl font-serif text-base leading-7 text-[#19352c]/55">
                    Sometimes the most convincing details are the ones your
                    brain added along the way.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetExperiment}
                  className="mt-8 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[#c7542b] underline decoration-[#c7542b]/30 underline-offset-4"
                >
                  Replay experiment
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </section>
    </main>
  );
}