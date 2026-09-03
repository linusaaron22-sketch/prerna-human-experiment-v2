"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Eye,
  Focus,
  Play,
  RotateCcw,
  Target,
} from "lucide-react";

type Stage =
  | "intro"
  | "instruction"
  | "activity"
  | "question"
  | "correct"
  | "event-correct"
  | "reveal"
  | "discussion"
  | "real-life"
  | "takeaway"
  | "complete";

type ShapeType = "circle" | "square" | "diamond" | "triangle" | "pentagon";

type Shape = {
  id: number;
  type: ShapeType;
  x: number;
  y: number;
  size: number;
  color: string;
  target: boolean;
  delay: number;
  duration: number;
  driftX: number;
  driftY: number;
};

const ACTIVITY_DURATION = 9000;

/*
 * IMPORTANT:
 * The participant is asked to count only RED CIRCLES.
 * Everything else is a visual distractor.
 *
 * There are exactly 8 red circles.
 */
const SHAPES: Shape[] = [
  {
    id: 1,
    type: "circle",
    x: 8,
    y: 17,
    size: 21,
    color: "#c7542b",
    target: true,
    delay: 0,
    duration: 2.8,
    driftX: 13,
    driftY: -9,
  },
  {
    id: 2,
    type: "square",
    x: 18,
    y: 31,
    size: 17,
    color: "#356b8a",
    target: false,
    delay: 0.15,
    duration: 2.4,
    driftX: -12,
    driftY: 8,
  },
  {
    id: 3,
    type: "diamond",
    x: 29,
    y: 14,
    size: 18,
    color: "#76549b",
    target: false,
    delay: 0.4,
    duration: 2.7,
    driftX: 10,
    driftY: 11,
  },
  {
    id: 4,
    type: "circle",
    x: 41,
    y: 28,
    size: 20,
    color: "#c7542b",
    target: true,
    delay: 0.2,
    duration: 2.5,
    driftX: -14,
    driftY: -7,
  },
  {
    id: 5,
    type: "triangle",
    x: 54,
    y: 13,
    size: 20,
    color: "#d19a32",
    target: false,
    delay: 0.55,
    duration: 2.3,
    driftX: 12,
    driftY: -10,
  },
  {
    id: 6,
    type: "pentagon",
    x: 68,
    y: 25,
    size: 20,
    color: "#4f8c73",
    target: false,
    delay: 0.1,
    duration: 2.6,
    driftX: -11,
    driftY: 10,
  },
  {
    id: 7,
    type: "circle",
    x: 83,
    y: 16,
    size: 21,
    color: "#c7542b",
    target: true,
    delay: 0.35,
    duration: 2.5,
    driftX: 14,
    driftY: 8,
  },
  {
    id: 8,
    type: "square",
    x: 91,
    y: 35,
    size: 16,
    color: "#6d8796",
    target: false,
    delay: 0.7,
    duration: 2.7,
    driftX: -13,
    driftY: -8,
  },
  {
    id: 9,
    type: "triangle",
    x: 10,
    y: 49,
    size: 19,
    color: "#d19a32",
    target: false,
    delay: 0.3,
    duration: 2.4,
    driftX: 9,
    driftY: 12,
  },
  {
    id: 10,
    type: "circle",
    x: 25,
    y: 61,
    size: 21,
    color: "#c7542b",
    target: true,
    delay: 0.6,
    duration: 2.6,
    driftX: -10,
    driftY: -11,
  },
  {
    id: 11,
    type: "diamond",
    x: 37,
    y: 46,
    size: 18,
    color: "#76549b",
    target: false,
    delay: 0.15,
    duration: 2.3,
    driftX: 13,
    driftY: 7,
  },
  {
    id: 12,
    type: "pentagon",
    x: 50,
    y: 66,
    size: 20,
    color: "#4f8c73",
    target: false,
    delay: 0.45,
    duration: 2.8,
    driftX: -12,
    driftY: -8,
  },
  {
    id: 13,
    type: "circle",
    x: 63,
    y: 51,
    size: 21,
    color: "#c7542b",
    target: true,
    delay: 0.25,
    duration: 2.4,
    driftX: 10,
    driftY: 9,
  },
  {
    id: 14,
    type: "square",
    x: 76,
    y: 66,
    size: 17,
    color: "#356b8a",
    target: false,
    delay: 0.5,
    duration: 2.5,
    driftX: -14,
    driftY: -10,
  },
  {
    id: 15,
    type: "triangle",
    x: 88,
    y: 54,
    size: 19,
    color: "#d19a32",
    target: false,
    delay: 0.2,
    duration: 2.7,
    driftX: 11,
    driftY: 8,
  },
  {
    id: 16,
    type: "circle",
    x: 14,
    y: 78,
    size: 20,
    color: "#c7542b",
    target: true,
    delay: 0.65,
    duration: 2.5,
    driftX: -9,
    driftY: -9,
  },
  {
    id: 17,
    type: "diamond",
    x: 34,
    y: 81,
    size: 18,
    color: "#76549b",
    target: false,
    delay: 0.3,
    duration: 2.6,
    driftX: 12,
    driftY: 10,
  },
  {
    id: 18,
    type: "square",
    x: 54,
    y: 83,
    size: 17,
    color: "#356b8a",
    target: false,
    delay: 0.55,
    duration: 2.4,
    driftX: -11,
    driftY: 7,
  },
  {
    id: 19,
    type: "circle",
    x: 72,
    y: 81,
    size: 21,
    color: "#c7542b",
    target: true,
    delay: 0.15,
    duration: 2.7,
    driftX: 13,
    driftY: -10,
  },
  {
    id: 20,
    type: "pentagon",
    x: 91,
    y: 79,
    size: 20,
    color: "#4f8c73",
    target: false,
    delay: 0.4,
    duration: 2.5,
    driftX: -12,
    driftY: 9,
  },
  {
    id: 21,
    type: "triangle",
    x: 45,
    y: 39,
    size: 17,
    color: "#d19a32",
    target: false,
    delay: 0.75,
    duration: 2.3,
    driftX: 10,
    driftY: -8,
  },
  {
    id: 22,
    type: "diamond",
    x: 59,
    y: 31,
    size: 17,
    color: "#76549b",
    target: false,
    delay: 0.35,
    duration: 2.6,
    driftX: -9,
    driftY: 12,
  },
  {
    id: 23,
    type: "square",
    x: 4,
    y: 68,
    size: 16,
    color: "#6d8796",
    target: false,
    delay: 0.5,
    duration: 2.5,
    driftX: 13,
    driftY: -7,
  },
  {
    id: 24,
    type: "pentagon",
    x: 80,
    y: 43,
    size: 18,
    color: "#4f8c73",
    target: false,
    delay: 0.25,
    duration: 2.4,
    driftX: -10,
    driftY: 9,
  },
];

const COUNT_OPTIONS = [6, 7, 8, 9];

const EVENT_OPTIONS = [
  "A person crossed the background.",
  "A large symbol appeared.",
  "The background changed.",
  "Nothing unusual happened.",
];

function ContinueButton({
  children,
  onClick,
  icon = <ArrowRight className="h-4 w-4" strokeWidth={1.5} />,
}: {
  children: ReactNode;
  onClick: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center justify-center gap-3 bg-[#19352c] px-6 py-3.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#f8f1e6] transition-all duration-300 hover:bg-[#c7542b]"
    >
      {children}

      <span className="transition-transform duration-300 group-hover:translate-x-1">
        {icon}
      </span>
    </button>
  );
}

function Shape({
  shape,
  reveal = false,
}: {
  shape: Shape;
  reveal?: boolean;
}) {
  const common =
    "absolute flex items-center justify-center shadow-[0_5px_12px_rgba(25,53,44,0.08)]";

  const opacity = reveal ? 1 : 0.9;

  const animation = {
    x: [0, shape.driftX, -shape.driftX * 0.7, 0],
    y: [0, shape.driftY, -shape.driftY * 0.6, 0],
    rotate: [0, 35, -25, 0],
  };

  const transition = {
    duration: shape.duration,
    delay: shape.delay,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };

  if (shape.type === "circle") {
    return (
      <motion.div
        className={`${common} rounded-full`}
        style={{
          left: `${shape.x}%`,
          top: `${shape.y}%`,
          width: shape.size,
          height: shape.size,
          backgroundColor: shape.color,
          opacity,
        }}
        animate={animation}
        transition={transition}
      />
    );
  }

  if (shape.type === "square") {
    return (
      <motion.div
        className={common}
        style={{
          left: `${shape.x}%`,
          top: `${shape.y}%`,
          width: shape.size,
          height: shape.size,
          backgroundColor: shape.color,
          opacity,
        }}
        animate={animation}
        transition={transition}
      />
    );
  }

  if (shape.type === "diamond") {
    return (
      <motion.div
        className={common}
        style={{
          left: `${shape.x}%`,
          top: `${shape.y}%`,
          width: shape.size,
          height: shape.size,
          backgroundColor: shape.color,
          opacity,
          transform: "rotate(45deg)",
        }}
        animate={animation}
        transition={transition}
      />
    );
  }

  if (shape.type === "pentagon") {
    return (
      <motion.div
        className={common}
        style={{
          left: `${shape.x}%`,
          top: `${shape.y}%`,
          width: shape.size + 3,
          height: shape.size + 3,
          backgroundColor: shape.color,
          opacity,
          clipPath:
            "polygon(50% 0%, 95% 35%, 78% 100%, 22% 100%, 5% 35%)",
        }}
        animate={animation}
        transition={transition}
      />
    );
  }

  return (
    <motion.div
      className={common}
      style={{
        left: `${shape.x}%`,
        top: `${shape.y}%`,
        width: shape.size + 4,
        height: shape.size + 4,
        backgroundColor: shape.color,
        opacity,
        clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
      }}
      animate={animation}
      transition={transition}
    />
  );
}

function AttentionField({
  running,
  reveal = false,
}: {
  running: boolean;
  reveal?: boolean;
}) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#19352c]/10 bg-[#eee5d5] sm:aspect-[16/9]">
      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(25,53,44,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(25,53,44,.08) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* soft focus area */}
      <div className="absolute inset-[8%] border border-[#19352c]/[0.06]" />

      {/* objects */}
      {SHAPES.map((shape) => (
        <Shape key={shape.id} shape={shape} reveal={reveal} />
      ))}

     {/* hidden event */}
<AnimatePresence>
  {(running || reveal) && (
    <motion.div
      initial={reveal ? { opacity: 0 } : { opacity: 0, x: "-10vw" }}
      animate={
        reveal
          ? { opacity: 1, x: 0 }
          : {
              opacity: [0, 0, 0.38, 0.38, 0],
              x: ["-10vw", "-10vw", "4vw", "11vw", "19vw"],
            }
      }
      transition={
        reveal
          ? { duration: 0.4 }
          : {
              duration: 2.1,
              delay: 4.1,
              ease: "easeInOut",
              times: [0, 0.25, 0.42, 0.67, 1],
            }
      }
      className="absolute left-[14%] top-[13%] z-40"
    >
      {/* tiny person */}
      <div className="relative h-10 w-5">
        {/* head */}
        <div
          className={`absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full ${
            reveal ? "bg-[#19352c]/45" : "bg-[#19352c]/45"
          }`}
        />

        {/* body */}
        <div
          className={`absolute left-1/2 top-3 h-4 w-1.5 -translate-x-1/2 rounded-full ${
            reveal ? "bg-[#19352c]/45" : "bg-[#19352c]/45"
          }`}
        />

        {/* arms */}
        <div
          className={`absolute left-1/2 top-4 h-px w-5 -translate-x-1/2 rotate-[25deg] ${
            reveal ? "bg-[#19352c]/45" : "bg-[#19352c]/45"
          }`}
        />

        {/* legs */}
        <div
          className={`absolute left-1/2 top-6 h-px w-5 -translate-x-1/2 rotate-[-45deg] ${
            reveal ? "bg-[#19352c]/45" : "bg-[#19352c]/45"
          }`}
        />

        <div
          className={`absolute left-1/2 top-6 h-px w-5 -translate-x-1/2 rotate-[45deg] ${
            reveal ? "" : "bg-[#19352c]/45"
          }`}
        />
      </div>
    </motion.div>
  )}
</AnimatePresence>

      {/* reveal highlight */}
      {reveal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute left-[11%] top-[10%] z-30 h-16 w-16 rounded-full border-2 border-[#c7542b]"
          />

          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute left-[calc(11%+70px)] top-[14%] z-30 bg-[#f8f1e6] px-3 py-2 shadow-sm"
          >
            <p className="font-mono text-[7px] font-bold uppercase tracking-[0.18em] text-[#c7542b]">
              There.
            </p>

            <p className="mt-1 font-serif text-sm">
              You may have missed this.
            </p>
          </motion.div>
        </>
      )}

      {/* live status */}
      {running && (
        <div className="absolute bottom-3 left-3 z-40 flex items-center gap-2 bg-[#f8f1e6]/90 px-3 py-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c7542b]" />

          <span className="font-mono text-[7px] font-bold uppercase tracking-[0.18em]">
            Count red circles
          </span>
        </div>
      )}
    </div>
  );
}
  function DrivingPOV() {
  return (
    <div className="relative h-[330px] overflow-hidden border border-[#19352c]/10 bg-[#eee5d5] sm:h-[430px]">
      <img
        src="/attention/driving-pov.png"
        alt="Driver's view of a mountain road"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* subtle cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#19352c]/45 via-transparent to-transparent" />

      {/* website text — NOT part of image */}
      <div className="absolute left-5 top-5 z-20 max-w-[230px] bg-[#f8f1e6]/90 px-4 py-3">
        <p className="font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-[#c7542b]">
          Real life
        </p>

        <p className="mt-1 font-serif text-lg leading-tight sm:text-xl">
          Your eyes are on the road.
        </p>
      </div>

      <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#c7542b]" />

        <span className="font-mono text-[7px] font-bold uppercase tracking-[0.18em] text-[#f8f1e6]">
          Attention elsewhere
        </span>
      </div>
    </div>
  );
}
    

export default function AttentionExperiment() {
  const [stage, setStage] = useState<Stage>("intro");
  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
}, [stage]);
  const [activityRunning, setActivityRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ACTIVITY_DURATION);
  const [countAnswer, setCountAnswer] = useState<number | null>(null);
  const [eventAnswer, setEventAnswer] = useState<string | null>(null);

  const targetCount = useMemo(
    () => SHAPES.filter((shape) => shape.target).length,
    []
  );

  useEffect(() => {
    if (!activityRunning) return;

    const interval = window.setInterval(() => {
      setTimeLeft((current) => {
        const next = current - 100;

        if (next <= 0) {
          window.clearInterval(interval);
          setActivityRunning(false);
          setStage("question");
          return 0;
        }

        return next;
      });
    }, 100);

    return () => window.clearInterval(interval);
  }, [activityRunning]);

  const resetExperiment = () => {
    setStage("intro");
    setActivityRunning(false);
    setTimeLeft(ACTIVITY_DURATION);
    setCountAnswer(null);
    setEventAnswer(null);
  };

  return (
    <main className="min-h-screen bg-[#f8f1e6] text-[#19352c]">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="border-b border-[#19352c]/10 bg-[#f8f1e6]">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <div>
            <p className="font-serif text-2xl leading-none">ARISE</p>

            <p className="mt-2 font-mono text-[7px] uppercase tracking-[0.22em] text-[#19352c]/40">
              × Human Experiment
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-mono text-[7px] uppercase tracking-[0.22em] text-[#19352c]/40">
                Experiment
              </p>

              <p className="mt-1 font-mono text-sm font-bold text-[#c7542b]">
                05 / 06
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center border border-[#19352c]/10">
              <Focus className="h-4 w-4" strokeWidth={1.3} />
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {/* =====================================================
            INTRO
        ====================================================== */}
        {stage === "intro" && (
          <motion.section
            key="intro"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className="flex min-h-[calc(100vh-74px)] items-center px-5 py-12 sm:px-8"
          >
            <div className="mx-auto w-full max-w-6xl">
              <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <div className="flex h-16 w-16 items-center justify-center border border-[#19352c]/10 bg-[#eee5d5]">
                    <Eye
                      className="h-7 w-7 text-[#c7542b]"
                      strokeWidth={1.3}
                    />
                  </div>

                  <p className="mt-9 font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-[#c7542b]">
                    Experiment 05
                  </p>

                  <h1 className="mt-4 max-w-5xl font-serif text-6xl leading-[0.86] tracking-[-0.035em] sm:text-8xl lg:text-[9rem]">
                    ATTENTION
                  </h1>

                  <p className="mt-7 max-w-lg font-serif text-xl leading-8 text-black">
                    You notice more than you think.
                  </p>
                </div>

                <div>
                  <ContinueButton onClick={() => setStage("instruction")}>
                    Begin
                  </ContinueButton>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            INSTRUCTION
        ====================================================== */}
        {stage === "instruction" && (
          <motion.section
            key="instruction"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className="px-5 py-12 sm:px-8 sm:py-16"
          >
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#c7542b]">
                    Your only task
                  </p>

                  <h2 className="mt-5 font-serif text-5xl leading-[0.9] sm:text-7xl">
                    COUNT
                    <br />
                    THE RED
                    <br />
                    CIRCLES.
                  </h2>

                  <p className="mt-7 max-w-sm font-serif text-base leading-7 text-[#19352c]/55">
                    Focus on one thing. Ignore everything else.
                  </p>
                </div>
                <div>

                  <div className="border border-[#19352c]/10 bg-[#eee5d5]/40 p-8 sm:p-10">
  <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#c7542b]/30">
      <Target
        className="h-6 w-6 text-[#c7542b]"
        strokeWidth={1.3}
      />
    </div>

    <p className="mt-6 font-mono text-[8px] font-bold uppercase tracking-[0.24em] text-[#c7542b]">
      Your target
    </p>
    <p className="mt-3 max-w-xs font-serif text-xl leading-8">
      Remember only one thing:
    </p>

    <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
      Red circles
    </p>
  </div>

  <div className="mt-6 flex justify-end">
    <ContinueButton
      onClick={() => {
        setTimeLeft(ACTIVITY_DURATION);
        setActivityRunning(true);
        setStage("activity");
      }}
      icon={
        <Play
          className="h-4 w-4"
          fill="currentColor"
          strokeWidth={1.2}
        />
      }
    >
      Begin
    </ContinueButton>
  </div>
</div>
    </div>                
              </div>
            </div>
          </motion.section>
        )}
        {/* =====================================================
            ACTIVITY
        ====================================================== */}
        {stage === "activity" && (
          <motion.section
            key="activity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-8 sm:px-8 sm:py-12"
          >
            <div className="mx-auto max-w-6xl">
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-[#c7542b]">
                    Focus here
                  </p>

                  <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
                    Count the red circles.
                  </h2>
                </div>

                <div className="text-right">
                  <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#19352c]/40">
                    Time
                  </p>

                  <p className="mt-1 font-mono text-xl font-bold text-[#c7542b]">
                    {(timeLeft / 1000).toFixed(1)}
                  </p>
                </div>
              </div>

              <AttentionField running={activityRunning} />

              <div className="mt-4 h-1 overflow-hidden bg-[#19352c]/10">
                <motion.div
                  className="h-full bg-[#c7542b]"
                  animate={{
                    width: `${(timeLeft / ACTIVITY_DURATION) * 100}%`,
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              {activityRunning && (
                <p className="mt-5 text-center font-mono text-[8px] uppercase tracking-[0.22em] text-[#19352c]/40">
                  Stay focused.
                </p>
              )}
            </div>
          </motion.section>
        )}

        {/* =====================================================
            QUESTION
        ====================================================== */}
        {stage === "question" && (
          <motion.section
            key="question"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[calc(100vh-74px)] items-center px-5 py-12 sm:px-8"
          >
            <div className="mx-auto w-full max-w-5xl">
              {!countAnswer ? (
                <>
                  <div className="flex items-end justify-between border-b border-[#19352c]/10 pb-5">
                    <div>
                      <p className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-[#c7542b]">
                        Question 01
                      </p>

                      <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
                        How many red circles did you see?
                      </h2>
                    </div>

                    <span className="hidden font-mono text-[9px] font-bold text-[#c7542b] sm:block">
                      01 / 02
                    </span>
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {COUNT_OPTIONS.map((answer) => (
                      <button
                        key={answer}
                        type="button"
                       onClick={() => {
                        setCountAnswer(answer);
                        setStage("question");
                        }}
                        className="group border border-[#19352c]/12 bg-[#eee5d5]/35 p-6 text-left transition-all duration-300 hover:border-[#c7542b]/45 hover:bg-[#eee5d5] sm:p-7"
                      >
                        <span className="font-mono text-[8px] font-bold text-[#c7542b]">
                          {String(answer).padStart(2, "0")}
                        </span>

                        <div className="mt-7 flex items-center justify-between">
                          <span className="font-serif text-4xl sm:text-5xl">
                            {answer}
                          </span>

                          <ArrowRight
                            className="h-4 w-4 text-[#c7542b] opacity-40 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                            strokeWidth={1.4}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b border-[#19352c]/10 pb-5">
                    <p className="font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-[#c7542b]">
                      Question 02
                    </p>

                    <h2 className="mt-5 max-w-4xl font-serif text-4xl leading-tight sm:text-6xl">
                      While you were counting, what happened?
                    </h2>
                  </div>

                  <div className="mt-8 grid gap-3">
                    {EVENT_OPTIONS.map((option, index) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
  setEventAnswer(option);

  if (option === "A person crossed the background.") {
    setStage("event-correct");
  } else {
    setStage("reveal");
  }
}}
                        className="group flex min-h-[70px] items-center gap-5 border border-[#19352c]/12 bg-[#eee5d5]/35 px-5 text-left transition-all duration-300 hover:border-[#c7542b]/45 hover:bg-[#eee5d5] sm:px-7"
                      >
                        <span className="font-mono text-[9px] font-bold text-[#c7542b]">
                          {String.fromCharCode(65 + index)}
                        </span>

                        <span className="flex-1 font-mono text-[9px] font-bold uppercase tracking-[0.08em] sm:text-[10px]">
                          {option}
                        </span>

                        <ArrowRight
                          className="h-4 w-4 text-[#c7542b] opacity-40 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                          strokeWidth={1.4}
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.section>
        )}

            {stage === "correct" && (
  <motion.section
    key="correct"
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex min-h-[calc(100vh-74px)] items-center px-5 py-12 sm:px-8"
  >
    <div className="mx-auto w-full max-w-4xl text-center">
      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-[#c7542b]">
        You got it
      </p>

      <h2 className="mt-6 font-serif text-6xl leading-[0.9] sm:text-8xl">
        CORRECT.
      </h2>

      <p className="mx-auto mt-7 max-w-xl font-serif text-xl leading-8 text-[#19352c]/55">
        You successfully kept your attention on the target.
      </p>

      <div className="mx-auto mt-10 border-y border-[#19352c]/10 py-8">
        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#19352c]/40">
          Your answer
        </p>

        <p className="mt-3 font-serif text-5xl">
          {countAnswer}
        </p>
      </div>

      <div className="mt-10 flex justify-center">
        <ContinueButton onClick={() => setStage("question")}>
          Continue
        </ContinueButton>
      </div>
    </div>
  </motion.section>
)}
        {stage === "event-correct" && (
  <motion.section
    key="event-correct"
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex min-h-[calc(100vh-74px)] items-center px-5 py-12 sm:px-8"
  >
    <div className="mx-auto w-full max-w-4xl text-center">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#c7542b]/25 bg-[#eee5d5]">
        <Eye
          className="h-7 w-7 text-[#c7542b]"
          strokeWidth={1.3}
        />
      </div>

      <p className="mt-8 font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-[#c7542b]">
        You noticed it
      </p>

      <h2 className="mt-5 font-serif text-6xl leading-[0.9] sm:text-8xl">
        YOU
        <br />
        SAW IT.
      </h2>

      <p className="mx-auto mt-7 max-w-xl font-serif text-xl leading-8 text-[#19352c]/55">
        While you were counting, you still noticed the person crossing
        the background.
      </p>

      <div className="mx-auto mt-10 max-w-xl border-y border-[#19352c]/10 py-8">
        <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#19352c]/40">
          Your answer
        </p>

        <p className="mt-4 font-serif text-2xl leading-9">
          A person crossed the background.
        </p>
      </div>

      <div className="mt-10 flex justify-center">
        <ContinueButton onClick={() => setStage("real-life")}>
  See it in real life
</ContinueButton>
      </div>

    </div>
  </motion.section>
)}
        {/* =====================================================
            REVEAL
        ====================================================== */}
        {stage === "reveal" && (
          <motion.section
            key="reveal"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-5 py-12 sm:px-8 sm:py-16"
          >
            <div className="mx-auto max-w-6xl">
              <div className="text-center">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-[#c7542b]">
                  The reveal
                </p>

                <h2 className="mx-auto mt-5 max-w-5xl font-serif text-5xl leading-[0.9] tracking-[-0.025em] sm:text-7xl lg:text-8xl">
                  YOU WERE LOOKING.
                  <br />
                  <span className="text-[#c7542b]">BUT YOU MISSED THIS.</span>
                </h2>

                <p className="mx-auto mt-7 max-w-2xl font-serif text-lg leading-8 text-[#19352c]/55">
                  Your attention had a target. Everything outside that target
                  became easier to miss.
                </p>
              </div>

              <div className="mt-12">
                <AttentionField running={false} reveal />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="border border-[#19352c]/10 bg-[#eee5d5]/45 p-7">
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#c7542b]">
                    Your target
                  </p>

                  <p className="mt-5 font-serif text-4xl">
                    {targetCount} red circles
                  </p>

                  <p className="mt-3 font-serif text-base leading-7 text-[#19352c]/50">
                    You were actively tracking one category.
                  </p>
                </div>

                <div className="border border-[#c7542b]/25 bg-[#eee5d5] p-7">
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#c7542b]">
                    Your hidden event
                  </p>

                  <p className="mt-5 font-serif text-4xl">
                    A person crossed the background.
                  </p>

                  <p className="mt-3 font-serif text-base leading-7 text-[#19352c]/50">
                    You weren't asked to look for them.
                  </p>
                </div>
              </div>

              {eventAnswer && (
                <div className="mx-auto mt-8 max-w-xl border-y border-[#19352c]/10 py-6 text-center">
                  <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#19352c]/40">
                    Your answer
                  </p>

                  <p className="mt-3 font-serif text-lg">
                    {eventAnswer}
                  </p>
                </div>
              )}

              <div className="mt-10 flex justify-center">
                <ContinueButton onClick={() => setStage("discussion")}>
                  Continue
                </ContinueButton>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            DISCUSSION
        ====================================================== */}
        {stage === "discussion" && (
          <motion.section
            key="discussion"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[calc(100vh-74px)] items-center px-5 py-12 sm:px-8"
          >
            <div className="mx-auto w-full max-w-4xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#19352c]/10 bg-[#eee5d5]">
                <Focus
                  className="h-7 w-7 text-[#c7542b]"
                  strokeWidth={1.3}
                />
              </div>

              <p className="mt-8 font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-[#c7542b]">
                Think about it
              </p>

              <h2 className="mx-auto mt-5 max-w-4xl font-serif text-5xl leading-[0.94] sm:text-7xl">
                DID YOU MISS IT
                <br />
                BECAUSE YOUR
                <br />
                ATTENTION WAS BUSY?
              </h2>

              <div className="mx-auto mt-10 max-w-2xl border-y border-[#19352c]/10 py-8">
                <p className="font-serif text-xl leading-9 sm:text-2xl">
                  You didn't choose to ignore the person.
                  <br />
                  You simply weren't attending to them.
                </p>
              </div>

              <div className="mt-10 flex justify-center">
                <ContinueButton onClick={() => setStage("real-life")}>
                  See it in real life
                </ContinueButton>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            REAL LIFE
        ====================================================== */}
        {stage === "real-life" && (
          <motion.section
            key="real-life"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-5 py-12 sm:px-8 sm:py-16"
          >
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-[#c7542b]">
                    Real life
                  </p>

                  <h2 className="mt-5 font-serif text-5xl leading-[0.92] sm:text-7xl">
                    THIS HAPPENS
                    <br />
                    EVERY DAY.
                  </h2>

                  <p className="mt-7 max-w-md font-serif text-lg leading-8 text-[#19352c]/55">
                    You can be looking directly at something and still not
                    consciously notice it.
                  </p>
                </div>

                <DrivingPOV />
              </div>

              <div className="mx-auto mt-12 max-w-4xl border-y border-[#19352c]/10 py-10 text-center">
                <p className="font-serif text-2xl leading-9 sm:text-3xl">
                  You&apos;re driving home while thinking about something else.
                </p>

                <p className="mt-5 font-mono text-[9px] font-bold uppercase tracking-[0.24em] leading-5 text-[#c7542b]">
                  Your eyes are on the road. Your attention may be somewhere
                  else.
                </p>
              </div>

              <div className="mt-10 flex justify-center">
                <ContinueButton onClick={() => setStage("takeaway")}>
                  The takeaway
                </ContinueButton>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            TAKEAWAY
        ====================================================== */}
        {stage === "takeaway" && (
          <motion.section
            key="takeaway"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-5 py-12 sm:px-8 sm:py-16"
          >
            <div className="mx-auto max-w-6xl">
              <div className="text-center">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-[#c7542b]">
                  One thing to remember
                </p>

                <h2 className="mx-auto mt-6 font-serif text-6xl leading-[0.86] tracking-[-0.03em] sm:text-8xl lg:text-9xl">
                  SEEING
                  <br />
                  <span className="text-[#c7542b]">≠</span> NOTICING
                </h2>

                <p className="mx-auto mt-8 max-w-2xl font-serif text-lg leading-8 text-[#19352c]/55 sm:text-xl">
                  You can&apos;t consciously process everything around you.
                  What you focus on shapes what you notice.
                </p>
              </div>

              <div className="mx-auto mt-14 max-w-5xl border-y border-[#19352c]/10 py-10 sm:py-14">
                <div className="grid gap-8 sm:grid-cols-3">
                  <div>
                    <p className="font-mono text-[8px] font-bold text-[#c7542b]">
                      01
                    </p>

                    <h3 className="mt-4 font-serif text-3xl">FOCUS</h3>

                    <p className="mt-3 font-serif text-base leading-7 text-[#19352c]/50">
                      Your attention needs a target.
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[8px] font-bold text-[#c7542b]">
                      02
                    </p>

                    <h3 className="mt-4 font-serif text-3xl">FILTER</h3>

                    <p className="mt-3 font-serif text-base leading-7 text-[#19352c]/50">
                      Your brain filters what seems less important.
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[8px] font-bold text-[#c7542b]">
                      03
                    </p>

                    <h3 className="mt-4 font-serif text-3xl">NOTICE</h3>

                    <p className="mt-3 font-serif text-base leading-7 text-[#19352c]/50">
                      What gets your attention gets processed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-center">
                <ContinueButton onClick={() => setStage("complete")}>
                  Complete
                </ContinueButton>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            COMPLETE
        ====================================================== */}
        {stage === "complete" && (
          <motion.section
            key="complete"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[calc(100vh-74px)] items-center justify-center px-5 py-12"
          >
            <div className="w-full max-w-4xl">
              <div className="grid gap-10 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#19352c]/10 bg-[#eee5d5]">
                    <Check
                      className="h-7 w-7 text-[#c7542b]"
                      strokeWidth={1.4}
                    />
                  </div>

                  <p className="mt-8 font-mono text-[9px] font-bold uppercase tracking-[0.34em] text-[#c7542b]">
                    Experiment 05
                  </p>

                  <h2 className="mt-5 font-serif text-6xl leading-[0.9] sm:text-8xl">
                    COMPLETE.
                  </h2>

                  <p className="mt-7 max-w-xl font-serif text-xl leading-8">
                    Seeing something doesn&apos;t mean you noticed it.
                  </p>

                  <p className="mt-3 max-w-xl font-serif text-base leading-7 text-[#19352c]/50">
                    Your attention shapes what reaches your conscious awareness.
                  </p>
                </div>

                <div className="flex justify-start sm:justify-end">
                  <ContinueButton
                    onClick={resetExperiment}
                    icon={
                      <RotateCcw
                        className="h-4 w-4"
                        strokeWidth={1.4}
                      />
                    }
                  >
                    Replay
                  </ContinueButton>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}