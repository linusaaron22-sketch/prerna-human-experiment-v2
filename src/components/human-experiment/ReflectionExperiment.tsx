"use client";

import { useMemo, useEffect,useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Circle,
  Clock3,
  Compass,
  Eye,
  Book,
  Lightbulb,
  Lock,
  MessageCircle,
  Moon,
  Smartphone,
  Sparkles,
  PartyPopper,
  Target,
  Users,
  X,
} from "lucide-react";

type Stage =
  | "intro"
  | "rule"
  | "scenario-1"
  | "scenario-2"
  | "scenario-3"
  | "scenario-4"
  | "choice-trail"
  | "pattern"
  | "not-destiny"
  | "interruption"
  | "final-choice"
  | "you-know"
  | "real-life"
  | "takeaway"
  | "finale"
  | "complete";

type ChoiceId = "A" | "B" | "C";

type Choice = {
  id: ChoiceId;
  label: string;
  short: string;
  themes: string[];
};

type Scenario = {
  number: string;
  title: string;
  eyebrow: string;
  description: string;
  visual: "study" | "friends" | "mistake" | "pressure";
  question: string;
  choices: Choice[];
};

const SCENARIOS: Scenario[] = [
  {
    number: "01",
    title: "THE NIGHT BEFORE",
    eyebrow: "DISCIPLINE",
    description:
      "You have an important exam tomorrow. You have two hours free tonight, but you haven't prepared enough.",
    visual: "study",
    question: "What do you actually do?",
    choices: [
      {
        id: "A",
        label: "Start now.",
        short: "START",
        themes: ["discipline", "action"],
      },
      {
        id: "B",
        label: "Take a short break first.",
        short: "BREAK",
        themes: ["comfort", "balance"],
      },
      {
        id: "C",
        label: "I'll do it tomorrow.",
        short: "LATER",
        themes: ["avoidance", "comfort"],
      },
    ],
  },
  {
    number: "02",
    title: "THE INVITATION",
    eyebrow: "PRIORITIES",
    description:
      "Your friends ask you to come out. You already planned to work on something important.",
    visual: "friends",
    question: "What do you actually do?",
    choices: [
      {
        id: "A",
        label: "Stick to my plan.",
        short: "PLAN",
        themes: ["discipline", "boundaries"],
      },
      {
        id: "B",
        label: "Go for a while.",
        short: "JOIN",
        themes: ["social", "balance"],
      },
      {
        id: "C",
        label: "Forget the plan.",
        short: "CANCEL",
        themes: ["social", "comfort"],
      },
    ],
  },
  {
    number: "03",
    title: "THE MISTAKE",
    eyebrow: "INTEGRITY",
    description:
      "You notice a mistake in something you submitted. Nobody else has noticed it.",
    visual: "mistake",
    question: "What do you actually do?",
    choices: [
      {
        id: "A",
        label: "Fix it anyway.",
        short: "FIX IT",
        themes: ["integrity", "action"],
      },
      {
        id: "B",
        label: "Leave it.",
        short: "LEAVE",
        themes: ["comfort", "avoidance"],
      },
      {
        id: "C",
        label: "Wait and see.",
        short: "WAIT",
        themes: ["avoidance", "uncertainty"],
      },
    ],
  },
  {
    number: "04",
    title: "THE CROWD",
    eyebrow: "SOCIAL PRESSURE",
    description:
      "Everyone around you is comfortable doing something you don't agree with.",
    visual: "pressure",
    question: "What do you actually do?",
    choices: [
      {
        id: "A",
        label: "Speak up.",
        short: "SPEAK",
        themes: ["courage", "boundaries"],
      },
      {
        id: "B",
        label: "Stay quiet.",
        short: "QUIET",
        themes: ["avoidance", "social"],
      },
      {
        id: "C",
        label: "Go along with them.",
        short: "FOLLOW",
        themes: ["social", "comfort"],
      },
    ],
  },
];

const THEME_LABELS: Record<string, string> = {
  discipline: "DISCIPLINE",
  action: "ACTION",
  comfort: "COMFORT",
  balance: "BALANCE",
  avoidance: "AVOIDANCE",
  boundaries: "BOUNDARIES",
  social: "SOCIAL PRESSURE",
  integrity: "INTEGRITY",
  uncertainty: "UNCERTAINTY",
  courage: "COURAGE",
};

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
      className="group inline-flex min-h-12 items-center justify-center gap-3 border border-[#19352c] bg-[#19352c] px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f8f1e6] transition-all duration-300 hover:bg-[#c7542b] hover:border-[#c7542b] disabled:pointer-events-none disabled:opacity-40 sm:min-h-14 sm:px-8"
    >
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
}

function SectionLabel({
  children,
  orange = true,
}: {
  children: React.ReactNode;
  orange?: boolean;
}) {
  return (
    <p
      className={`font-mono text-[9px] font-bold uppercase tracking-[0.24em] sm:text-[10px] ${
        orange ? "text-[#c7542b]" : "text-[#19352c]/55"
      }`}
    >
      {children}
    </p>
  );
}

function ScenarioVisual({
  type,
  selected,
}: {
  type: Scenario["visual"];
  selected?: ChoiceId;
}) {
  if (type === "study") {
    return (
      <div className="relative h-[290px] overflow-hidden border border-[#19352c]/10 bg-[#e7ddcc] sm:h-[380px]">
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[#19352c]/10" />

        <div className="absolute right-5 top-5 flex items-center gap-2 border border-[#19352c]/10 bg-[#f8f1e6]/90 px-3 py-2">
          <Clock3 className="h-3.5 w-3.5 text-[#c7542b]" />
          <span className="font-mono text-[9px] font-bold tracking-[0.14em]">
            10:47 PM
          </span>
        </div>

        <div className="absolute left-[12%] top-[25%] h-32 w-48 rotate-[-2deg] border border-[#19352c]/15 bg-[#f8f1e6] p-3 shadow-xl sm:h-44 sm:w-64">
          <div className="h-full border border-[#19352c]/10 bg-[#eee5d5] p-3">
            <div className="h-2 w-20 bg-[#19352c]/15" />
            <div className="mt-4 space-y-2">
              <div className="h-1.5 w-full bg-[#19352c]/10" />
              <div className="h-1.5 w-4/5 bg-[#19352c]/10" />
              <div className="h-1.5 w-11/12 bg-[#19352c]/10" />
              <div className="h-1.5 w-3/5 bg-[#19352c]/10" />
            </div>
            <div className="mt-5 inline-block border border-[#c7542b]/40 px-2 py-1 font-mono text-[7px] font-bold uppercase tracking-wider text-[#c7542b]">
              EXAM TOMORROW
            </div>
          </div>
        </div>

        <div className="absolute bottom-[13%] right-[13%] h-16 w-28 rotate-[7deg] rounded-sm bg-[#19352c] shadow-lg sm:h-20 sm:w-36">
          <div className="absolute inset-2 border border-[#f8f1e6]/20" />
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c7542b]" />
        </div>

        <div className="absolute bottom-[7%] left-[7%] font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#19352c]/45">
          TWO HOURS LEFT
        </div>

        {selected && (
          <ChoiceStamp choice={selected} />
        )}
      </div>
    );
  }

  if (type === "friends") {
    return (
      <div className="relative h-[290px] overflow-hidden border border-[#19352c]/10 bg-[#dfe2d8] sm:h-[380px]">
        <div className="absolute inset-x-0 bottom-0 h-20 bg-[#19352c]/10" />

        <div className="absolute right-[12%] top-[18%] h-28 w-36 rounded-lg border border-[#19352c]/15 bg-[#f8f1e6]/80 p-3 shadow-md">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-[#c7542b]" />
            <span className="font-mono text-[8px] font-bold uppercase tracking-wider">
              GROUP CHAT
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="ml-auto h-5 w-24 rounded bg-[#19352c]/10" />
            <div className="h-5 w-28 rounded bg-[#c7542b]/15" />
            <div className="ml-auto h-5 w-20 rounded bg-[#19352c]/10" />
          </div>
        </div>

        <div className="absolute bottom-[16%] left-[12%] flex gap-3">
          {[0, 1, 2].map((person) => (
            <motion.div
              key={person}
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 2.2,
                delay: person * 0.15,
                repeat: Infinity,
              }}
              className="flex flex-col items-center"
            >
              <div className="h-9 w-9 rounded-full bg-[#19352c]" />
              <div className="mt-[-3px] h-16 w-12 rounded-t-[18px] bg-[#19352c]/80" />
            </motion.div>
          ))}
        </div>

        <div className="absolute bottom-[7%] right-[8%] font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#19352c]/45">
          THEY ARE WAITING
        </div>

        {selected && (
          <ChoiceStamp choice={selected} />
        )}
      </div>
    );
  }

  if (type === "mistake") {
    return (
      <div className="relative h-[290px] overflow-hidden border border-[#19352c]/10 bg-[#eee5d5] sm:h-[380px]">
        <div className="absolute left-[10%] top-[12%] font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#19352c]/45">
          SUBMISSION
        </div>

        <div className="absolute left-[12%] right-[12%] top-[25%] h-40 border border-[#19352c]/10 bg-[#f8f1e6] p-6 shadow-xl sm:h-52">
          <div className="flex justify-between">
            <div className="h-3 w-32 bg-[#19352c]/15" />
            <div className="font-mono text-[8px] text-[#19352c]/45">
              PAGE 07
            </div>
          </div>

          <div className="mt-7 space-y-3">
            <div className="h-2 w-full bg-[#19352c]/10" />
            <div className="h-2 w-[85%] bg-[#19352c]/10" />
            <div className="h-2 w-[92%] bg-[#19352c]/10" />
          </div>

          <div className="absolute bottom-5 right-6 flex items-center gap-2 border border-[#c7542b]/30 px-3 py-2">
            <X className="h-3 w-3 text-[#c7542b]" />
            <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-[#c7542b]">
              ERROR
            </span>
          </div>
        </div>

        <div className="absolute bottom-[8%] left-[10%] flex items-center gap-2">
          <Eye className="h-3.5 w-3.5 text-[#c7542b]" />
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#19352c]/50">
            NOBODY NOTICED
          </span>
        </div>

        {selected && (
          <ChoiceStamp choice={selected} />
        )}
      </div>
    );
  }

  return (
    <div className="relative h-[290px] overflow-hidden border border-[#19352c]/10 bg-[#d8ddd5] sm:h-[380px]">
      <div className="absolute left-[8%] right-[8%] top-[17%] h-px bg-[#19352c]/15" />

      <div className="absolute left-[13%] top-[27%] flex gap-5">
        {[0, 1, 2, 3].map((person, index) => (
          <motion.div
            key={person}
            animate={{
              y: [0, index % 2 === 0 ? -5 : 3, 0],
            }}
            transition={{
              duration: 2,
              delay: index * 0.1,
              repeat: Infinity,
            }}
            className="flex flex-col items-center"
          >
            <div className="h-8 w-8 rounded-full bg-[#19352c]" />
            <div className="mt-[-2px] h-14 w-10 rounded-t-[16px] bg-[#19352c]/80" />
          </motion.div>
        ))}
      </div>

      <div className="absolute right-[12%] top-[31%] flex h-20 w-32 items-center justify-center border-2 border-[#c7542b]/50 bg-[#f8f1e6]/60">
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#c7542b]">
          SOMETHING YOU
          <br />
          DON'T AGREE WITH
        </span>
      </div>

      <div className="absolute bottom-[8%] left-[9%] flex items-center gap-2">
        <Users className="h-3.5 w-3.5 text-[#c7542b]" />
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#19352c]/50">
          EVERYONE ELSE IS FINE
        </span>
      </div>

      {selected && (
        <ChoiceStamp choice={selected} />
      )}
    </div>
  );
}

function ChoiceStamp({ choice }: { choice: ChoiceId }) {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
      animate={{ scale: 1, opacity: 1, rotate: -4 }}
      className="absolute right-5 bottom-5 z-20 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#c7542b] bg-[#f8f1e6]/95 shadow-lg"
    >
      <span className="font-serif text-2xl text-[#c7542b]">{choice}</span>
    </motion.div>
  );
}

function PatternBar({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: number;
  highlighted?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-end justify-between">
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#19352c]/65 sm:text-[9px]">
          {label}
        </span>
        <span className="font-serif text-lg">{value}</span>
      </div>

      <div className="h-2 bg-[#19352c]/8">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(value * 20, 8)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full ${
            highlighted ? "bg-[#c7542b]" : "bg-[#19352c]"
          }`}
        />
      </div>
    </div>
  );
}

function ChoiceTrail({
  answers,
}: {
  answers: Record<string, ChoiceId>;
}) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-5 bottom-5 w-px bg-[#19352c]/15 sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:h-px sm:w-[calc(100%-80px)] sm:-translate-x-1/2" />

      <div className="grid gap-5 sm:grid-cols-4">
        {SCENARIOS.map((scenario, index) => {
          const answer = answers[scenario.number];

          return (
            <motion.div
              key={scenario.number}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              className="relative flex items-center gap-4 sm:block sm:text-center"
            >
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#19352c]/20 bg-[#f8f1e6] font-serif text-lg sm:mx-auto">
                {answer}
              </div>

              <div className="sm:mt-4">
                <p className="font-mono text-[8px] font-bold tracking-[0.18em] text-[#c7542b]">
                  {scenario.number}
                </p>
                <p className="mt-1 font-serif text-base">{scenario.title}</p>
                <p className="mt-1 font-mono text-[7px] font-bold uppercase tracking-[0.15em] text-[#19352c]/45">
                  {scenario.choices.find((choice) => choice.id === answer)?.short}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function ReflectionExperiment() {
  const [stage, setStage] = useState<Stage>("intro");
useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
}, [stage]);
  const [answers, setAnswers] = useState<Record<string, ChoiceId>>({});
  const [finalChoice, setFinalChoice] = useState<ChoiceId | null>(null);

  const currentScenario = useMemo(() => {
    const match = stage.match(/^scenario-([1-4])$/);
    if (!match) return null;

    return SCENARIOS[Number(match[1]) - 1];
  }, [stage]);

  const pattern = useMemo(() => {
    const counts: Record<string, number> = {};

    Object.entries(answers).forEach(([number, answer]) => {
      const scenario = SCENARIOS.find((item) => item.number === number);
      const choice = scenario?.choices.find((item) => item.id === answer);

      choice?.themes.forEach((theme) => {
        counts[theme] = (counts[theme] || 0) + 1;
      });
    });

    return {
      discipline: counts.discipline || 0,
      action: counts.action || 0,
      comfort: counts.comfort || 0,
      avoidance: counts.avoidance || 0,
      social: counts.social || 0,
      integrity: counts.integrity || 0,
      courage: counts.courage || 0,
      boundaries: counts.boundaries || 0,
    };
  }, [answers]);

  const topPatterns = useMemo(() => {
  return [
    ["discipline", pattern.discipline],
    ["action", pattern.action],
    ["integrity", pattern.integrity],
    ["courage", pattern.courage],
    ["boundaries", pattern.boundaries],
    ["comfort", pattern.comfort],
    ["avoidance", pattern.avoidance],
    ["social", pattern.social],
  ]
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 3);
}, [pattern]);

  function chooseScenario(choice: ChoiceId) {
    if (!currentScenario) return;

    setAnswers((previous) => ({
      ...previous,
      [currentScenario.number]: choice,
    }));

    const number = Number(currentScenario.number);

    if (number < 4) {
      setStage(`scenario-${number + 1}` as Stage);
    } else {
      setStage("choice-trail");
    }
  }

  function chooseFinal(choice: ChoiceId) {
    setFinalChoice(choice);
    setStage("you-know");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f1e6] text-[#19352c]">
      <AnimatePresence mode="wait">
        {/* =====================================================
            INTRO
        ====================================================== */}
        {stage === "intro" && (
          <motion.section
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex min-h-screen items-center px-5 py-16 sm:px-8"
          >
            <div className="absolute right-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full border border-[#19352c]/10" />
            <div className="absolute right-[5%] top-[10%] h-[220px] w-[220px] rounded-full border border-[#c7542b]/20" />

            <div className="mx-auto w-full max-w-6xl">
              <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
                <div>
                 <p className="font-mono text-[10x] font-bold uppercase tracking-[0.24em] text-black sm:text-[11px]">
  Experiment 06 / 06
</p>
                <h1 className="mt-6 whitespace-nowrap font-serif text-[clamp(3.4rem,10vw,9rem)] leading-[0.82] tracking-[-0.06em] text-[#c7542b]">
  REFLECTION<span className="text-[#19352c]">.</span>
</h1>

                  <p className="mt-8 max-w-xl font-serif text-xl leading-relaxed text-[#19352c]/70 sm:text-2xl">
                    You've seen what your brain can do.
                    <br />
                    <span className="text-[#19352c]">
                      Now look at what you do.
                    </span>
                  </p>

                  <div className="mt-10">
                    <ContinueButton onClick={() => setStage("rule")}>
                      Begin the final experiment
                    </ContinueButton>
                  </div>
                </div>

                <div className="relative hidden min-h-[420px] lg:block">
                  <motion.div
                    animate={{ rotate: [0, 3, 0, -3, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute left-[20%] top-[8%] h-64 w-52 border border-[#19352c]/15 bg-[#eee5d5] p-5 shadow-xl"
                  >
                    <div className="font-mono text-[8px] font-bold tracking-[0.2em] text-[#c7542b]">
                      YOUR EXPERIMENT
                    </div>

                    <div className="mt-8 space-y-5">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full border border-[#19352c]/20" />
                          <div className="h-1.5 flex-1 bg-[#19352c]/10" />
                        </div>
                      ))}
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 border-t border-[#19352c]/10 pt-3">
                      <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#19352c]/45">
                        OBSERVE / CHOOSE / REFLECT
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute bottom-[9%] right-[7%] flex h-36 w-36 items-center justify-center rounded-full border border-[#c7542b]/30 bg-[#f8f1e6]"
                  >
                    <div className="text-center">
                      <Sparkles className="mx-auto h-6 w-6 text-[#c7542b]" />
                      <p className="mt-3 font-serif text-lg">
                        Look
                        <br />
                        inward.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            RULE
        ====================================================== */}
        {stage === "rule" && (
          <motion.section
            key="rule"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen items-center px-5 py-16 sm:px-8"
          >
            <div className="mx-auto w-full max-w-5xl">
              <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <SectionLabel>Before we begin</SectionLabel>

                  <h2 className="mt-7 font-serif text-[clamp(3.2rem,8vw,7rem)] leading-[0.86] tracking-[-0.05em]">
                    THERE ARE
                    <br />
                    <span className="text-[#c7542b]">NO RIGHT</span>
                    <br />
                    ANSWERS.
                  </h2>
                </div>

                <div className="border-y border-[#19352c]/15 py-8">
                  <div className="space-y-7">
                    <p className="font-serif text-xl leading-relaxed sm:text-2xl">
                      Don't choose what sounds good.
                    </p>

                    <p className="font-serif text-xl leading-relaxed sm:text-2xl">
                      Don't choose what you think you{" "}
                      <em>should</em> choose.
                    </p>

                    <div className="border-l-2 border-[#c7542b] pl-5">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
                        Choose what you would actually do.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-3">
                      <Lock className="h-4 w-4 text-[#c7542b]" />
                      <span className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#19352c]/50">
                        Your answers are for reflection.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-14 flex justify-center">
                <ContinueButton onClick={() => setStage("scenario-1")}>
                  Show me the first situation
                </ContinueButton>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            SCENARIOS
        ====================================================== */}
        {currentScenario && (
          <motion.section
            key={currentScenario.number}
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -35 }}
            className="min-h-screen px-5 py-10 sm:px-8 sm:py-16"
          >
            <div className="mx-auto max-w-6xl">
              <div className="flex items-center justify-between border-b border-[#19352c]/10 pb-5">
                <SectionLabel>
                  Reflection / Situation {currentScenario.number}
                </SectionLabel>

                <span className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#19352c]/40">
                  0{Number(currentScenario.number)} / 04
                </span>
              </div>

              <div className="grid gap-10 pt-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] font-bold text-[#c7542b]">
                      {currentScenario.number}
                    </span>
                    <span className="h-px w-10 bg-[#c7542b]/40" />
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#19352c]/45">
                      {currentScenario.eyebrow}
                    </span>
                  </div>

                  <h2 className="mt-5 font-serif text-[clamp(3rem,7vw,6.5rem)] leading-[0.84] tracking-[-0.05em]">
                    {currentScenario.title}
                  </h2>

                  <p className="mt-7 max-w-xl font-serif text-lg leading-relaxed text-[#19352c]/65 sm:text-xl">
                    {currentScenario.description}
                  </p>

                  <div className="mt-9 border-l-2 border-[#c7542b] pl-5">
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#19352c]/45">
                      The question
                    </p>
                    <p className="mt-2 font-serif text-2xl sm:text-3xl">
                      {currentScenario.question}
                    </p>
                  </div>
                </div>

                <div>
                  <ScenarioVisual type={currentScenario.visual} />

                  <div className="mt-6 grid gap-3">
                    {currentScenario.choices.map((choice, index) => (
                      <motion.button
                        key={choice.id}
                        type="button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.08 }}
                        onClick={() => chooseScenario(choice.id)}
                        className="group flex min-h-16 items-center border border-[#19352c]/12 bg-[#eee5d5]/55 px-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c7542b]/50 hover:bg-[#f8f1e6] sm:min-h-20 sm:px-5"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#19352c]/15 font-serif text-lg transition-colors group-hover:border-[#c7542b] group-hover:text-[#c7542b]">
                          {choice.id}
                        </span>

                        <span className="ml-4 flex-1">
                          <span className="block font-serif text-lg sm:text-xl">
                            {choice.label}
                          </span>
                        </span>

                        <ChevronRight className="h-4 w-4 text-[#19352c]/25 transition-transform group-hover:translate-x-1 group-hover:text-[#c7542b]" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            CHOICE TRAIL
        ====================================================== */}
        {stage === "choice-trail" && (
          <motion.section
            key="choice-trail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen items-center px-5 py-16 sm:px-8"
          >
            <div className="mx-auto w-full max-w-6xl">
              <SectionLabel>Your choices</SectionLabel>

              <h2 className="mt-6 max-w-4xl font-serif text-[clamp(3.4rem,8vw,7rem)] leading-[0.82] tracking-[-0.055em]">
                LOOK AT WHAT
                <br />
                <span className="text-[#c7542b]">YOU CHOSE.</span>
              </h2>

              <p className="mt-7 max-w-2xl font-serif text-lg leading-relaxed text-[#19352c]/65 sm:text-xl">
                You probably weren't thinking about the previous situation
                while answering the next one.
              </p>

              <div className="mt-14 border-y border-[#19352c]/12 py-10 sm:py-14">
                <ChoiceTrail answers={answers} />
              </div>

              <div className="mt-10 flex justify-center">
                <ContinueButton onClick={() => setStage("pattern")}>
                  Show the pattern
                </ContinueButton>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            PATTERN
        ====================================================== */}
        {stage === "pattern" && (
          <motion.section
            key="pattern"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen px-5 py-12 sm:px-8 sm:py-16"
          >
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                <div>
                  <SectionLabel>The pattern</SectionLabel>

                  <h2 className="mt-6 font-serif text-[clamp(3.3rem,8vw,7rem)] leading-[0.83] tracking-[-0.05em]">
                    YOUR
                    <br />
                    CHOICES
                    <br />
                    <span className="text-[#c7542b]">LEAN.</span>
                  </h2>

                  <p className="mt-7 max-w-md font-serif text-lg leading-relaxed text-[#19352c]/65">
                    These aren't labels. They're simply patterns inside the
                    choices you just made.
                  </p>
                </div>

                <div className="border border-[#19352c]/10 bg-[#eee5d5]/55 p-6 sm:p-10">
                  <div className="mb-8 flex items-center justify-between border-b border-[#19352c]/10 pb-5">
                    <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em]">
                      Your reflection map
                    </span>

                    <Target className="h-4 w-4 text-[#c7542b]" />
                  </div>

                  <div className="space-y-7">
                    <PatternBar
                      label={THEME_LABELS[topPatterns[0][0]]}
                      value={topPatterns[0][1] as number}
                      highlighted
                    />
                    <PatternBar
                      label={THEME_LABELS[topPatterns[1][0]]}
                      value={topPatterns[1][1] as number}
                    />
                    <PatternBar
                      label={THEME_LABELS[topPatterns[2][0]]}
                      value={topPatterns[2][1] as number}
                    />
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-3 border-t border-[#19352c]/10 pt-7">
                    {[
                      ["DISCIPLINE", pattern.discipline],
                      ["ACTION", pattern.action],
                      ["COMFORT", pattern.comfort],
                      ["AVOIDANCE", pattern.avoidance],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="border border-[#19352c]/8 bg-[#f8f1e6]/60 p-4"
                      >
                        <p className="font-mono text-[7px] font-bold uppercase tracking-[0.15em] text-[#19352c]/45">
                          {label}
                        </p>
                        <p className="mt-2 font-serif text-2xl">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-center">
                <ContinueButton onClick={() => setStage("not-destiny")}>
                  One important thing
                </ContinueButton>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            NOT DESTINY
        ====================================================== */}
        {stage === "not-destiny" && (
          <motion.section
            key="not-destiny"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex min-h-screen items-center px-5 py-16 sm:px-8"
          >
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#19352c]/8" />

            <div className="relative mx-auto max-w-6xl">
              <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
                <div>
                  <SectionLabel>Don't mistake a pattern for an identity</SectionLabel>

                  <h2 className="mt-7 font-serif text-[clamp(3.2rem,7vw,6.5rem)] leading-[0.84] tracking-[-0.05em]">
                    A PATTERN
                    <br />
                    IS NOT A
                    <br />
                    <span className="text-[#c7542b]">DESTINY.</span>
                  </h2>
                </div>

                <div className="space-y-8">
                  <p className="font-serif text-2xl leading-relaxed sm:text-3xl">
                    Your choices can show a tendency.
                  </p>

                  <p className="font-serif text-2xl leading-relaxed text-[#19352c]/55 sm:text-3xl">
                    They don't define you.
                  </p>

                  <div className="border-l-2 border-[#c7542b] pl-5">
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em]">
                      The interesting question isn't
                      <br />
                      "What am I?"
                    </p>

                    <p className="mt-4 font-serif text-xl sm:text-2xl">
                      It's "What do I want to become?"
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-14 flex justify-center">
                <ContinueButton onClick={() => setStage("interruption")}>
                  Keep going
                </ContinueButton>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            INTERRUPTION
        ====================================================== */}
        {stage === "interruption" && (
          <motion.section
            key="interruption"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen items-center bg-[#19352c] px-5 py-16 text-[#f8f1e6] sm:px-8"
          >
            <div className="mx-auto w-full max-w-5xl text-center">
              <motion.div
                animate={{ rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#f8f1e6]/20"
              >
                <Circle className="h-3 w-3 fill-[#c7542b] text-[#c7542b]" />
              </motion.div>

              <p className="mt-10 font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#c7542b]">
                Now forget the experiment for a moment
              </p>

              <h2 className="mx-auto mt-8 max-w-4xl font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.85] tracking-[-0.05em]">
                IF YOU KNEW
                <br />
                YOUR PATTERN...
              </h2>

              <p className="mx-auto mt-8 max-w-2xl font-serif text-xl leading-relaxed text-[#f8f1e6]/65 sm:text-2xl">
                Would you make the same choice next time?
              </p>

              <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setStage("final-choice")}
                  className="min-h-14 border border-[#f8f1e6]/25 px-7 font-mono text-[9px] font-bold uppercase tracking-[0.18em] transition hover:border-[#c7542b] hover:bg-[#c7542b]"
                >
                  Yes
                </button>

                <button
                  type="button"
                  onClick={() => setStage("final-choice")}
                  className="min-h-14 border border-[#f8f1e6]/25 px-7 font-mono text-[9px] font-bold uppercase tracking-[0.18em] transition hover:border-[#c7542b] hover:bg-[#c7542b]"
                >
                  No
                </button>

                <button
                  type="button"
                  onClick={() => setStage("final-choice")}
                  className="min-h-14 border border-[#f8f1e6]/25 px-7 font-mono text-[9px] font-bold uppercase tracking-[0.18em] transition hover:border-[#c7542b] hover:bg-[#c7542b]"
                >
                  I'm not sure
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            FINAL CHOICE
        ====================================================== */}
        {stage === "final-choice" && (
          <motion.section
            key="final-choice"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen px-5 py-14 sm:px-8"
          >
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div>
                  <SectionLabel>One last choice</SectionLabel>

                  <h2 className="mt-7 font-serif text-[clamp(3.3rem,7vw,6.5rem)] leading-[0.84] tracking-[-0.05em]">
                    THIS ONE
                    <br />
                    IS
                    <br />
                    <span className="text-[#c7542b]">REAL.</span>
                  </h2>
                </div>

                <div>
                  <div className="border border-[#19352c]/10 bg-[#eee5d5]/60 p-7 sm:p-10">
                    <div className="flex items-center gap-3">
                      <Lightbulb className="h-5 w-5 text-[#c7542b]" />
                      <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#19352c]/50">
                        Don't tell us
                      </span>
                    </div>

                    <p className="mt-8 font-serif text-3xl leading-tight sm:text-4xl">
                      There is something in your life you've been putting off.
                    </p>

                    <p className="mt-6 font-serif text-lg leading-relaxed text-[#19352c]/55">
                      You already know what it is.
                      <br />
                      You don't need to type it.
                    </p>

                    <div className="my-8 h-px bg-[#19352c]/10" />

                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#19352c]/45">
                      What will you do?
                    </p>

                    <div className="mt-5 grid gap-3">
                      {[
                        ["A", "Start today."],
                        ["B", "Wait for the right time."],
                        ["C", "I don't know yet."],
                      ].map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => chooseFinal(id as ChoiceId)}
                          className="group flex min-h-16 items-center border border-[#19352c]/12 bg-[#f8f1e6] px-4 text-left transition hover:border-[#c7542b]/50 sm:min-h-20 sm:px-5"
                        >
                          <span className="flex h-9 w-9 items-center justify-center border border-[#19352c]/15 font-serif text-lg group-hover:border-[#c7542b] group-hover:text-[#c7542b]">
                            {id}
                          </span>
                          <span className="ml-4 font-serif text-lg sm:text-xl">
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-[#c7542b]" />
                    <span className="font-mono text-[7px] font-bold uppercase tracking-[0.17em] text-[#19352c]/40">
                      This choice stays with you.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            YOU ALREADY KNOW
        ====================================================== */}
        {stage === "you-know" && (
          <motion.section
            key="you-know"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex min-h-screen items-center overflow-hidden bg-[#f8f1e6] px-5 py-16 sm:px-8"
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7542b]/10"
            />

            <div className="relative mx-auto w-full max-w-6xl text-center">
              <SectionLabel>You already knew</SectionLabel>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.8 }}
                className="mt-8 font-serif text-[clamp(4rem,12vw,11rem)] leading-[0.75] tracking-[-0.07em]"
              >
                YOU
                <br />
                <span className="text-[#c7542b]">ALREADY</span>
                <br />
                KNOW.
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mx-auto mt-12 max-w-2xl border-y border-[#19352c]/12 py-7"
              >
                <p className="font-serif text-xl leading-relaxed text-[#19352c]/65 sm:text-2xl">
                  You knew what you should do before this experiment started.
                </p>

                <p className="mt-5 font-serif text-xl leading-relaxed text-[#19352c]/65 sm:text-2xl">
                  You probably knew while answering these questions.
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-10 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#c7542b]"
              >
                Knowing was never the difficult part.
              </motion.p>

              <div className="mt-10">
                <ContinueButton onClick={() => setStage("real-life")}>
                  Take this into real life
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
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen px-5 py-14 sm:px-8"
          >
            <div className="mx-auto max-w-6xl">
              <SectionLabel>Real life</SectionLabel>

              <div className="mt-8 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div>
                  <h2 className="font-serif text-[clamp(3.3rem,7vw,6.5rem)] leading-[0.84] tracking-[-0.05em]">
                    THIS ISN'T
                    <br />
                    ABOUT A
                    <br />
                    <span className="text-[#c7542b]">TEST.</span>
                  </h2>

                  <p className="mt-8 max-w-md font-serif text-lg leading-relaxed text-[#19352c]/60 sm:text-xl">
                    It's about the tiny decisions that quietly shape a life.
                  </p>
                </div>

                <div className="grid gap-3">
                  {[
                    {
                      icon: Clock3,
                      text: "You know you should study.",
                    },
                    {
                      icon: Moon,
                      text: "You know you should sleep earlier.",
                    },
                    {
                      icon: Smartphone,
                      text: "You know you should stop scrolling.",
                    },
                    {
                      icon: Book,
                      text: "You know you should read bible.",
                    },
                    {
                      icon: Target,
                      text: "You know you should start.",
                    },
                  ].map(({ icon: Icon, text }, index) => (
                    <motion.div
                      key={text}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.12 }}
                      className="flex min-h-16 items-center gap-4 border-b border-[#19352c]/10 py-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#19352c]/12">
                        <Icon className="h-4 w-4 text-[#c7542b]" />
                      </div>

                      <p className="font-serif text-lg sm:text-xl">{text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-16 border-y border-[#19352c]/15 py-12 text-center sm:py-16">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#c7542b]">
                  So...
                </p>

                <h3 className="mt-6 font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.82] tracking-[-0.055em]">
                  WHY DO
                  <br />
                  WE WAIT?
                </h3>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex min-h-screen items-center overflow-hidden bg-[#19352c] px-5 py-16 text-[#f8f1e6] sm:px-8"
          >
            <div className="absolute left-[-100px] top-[-100px] h-[400px] w-[400px] rounded-full border border-[#f8f1e6]/10" />
            <div className="absolute bottom-[-150px] right-[-100px] h-[500px] w-[500px] rounded-full border border-[#c7542b]/20" />

            <div className="relative mx-auto w-full max-w-6xl">
              <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-end">
                <div>
                  <SectionLabel>Experiment 06 / Takeaway</SectionLabel>

                  <h2 className="mt-8 font-serif text-[clamp(3.8rem,9vw,8rem)] leading-[0.78] tracking-[-0.06em]">
                    KNOWING
                    <br />
                    <span className="text-[#c7542b]">≠</span>
                    <br />
                    DOING.
                  </h2>
                </div>

                <div>
                  <div className="border-l border-[#f8f1e6]/20 pl-6">
                    <p className="font-serif text-2xl leading-relaxed text-[#f8f1e6]/75 sm:text-3xl">
                      You don't become disciplined in one big moment.
                    </p>

                    <p className="mt-7 font-serif text-2xl leading-relaxed text-[#f8f1e6]/75 sm:text-3xl">
                      You become disciplined through the small choices you
                      repeat.
                    </p>
                  </div>

                  <div className="mt-10">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#c7542b]">
                      Choose on purpose.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex justify-center lg:justify-end">
                <ContinueButton onClick={() => setStage("finale")}>
                  Finish the experiment
                </ContinueButton>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================================================
            FINALE
        ====================================================== */}
        {stage === "finale" && (
  <motion.section
    key="finale"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative min-h-screen overflow-hidden bg-[#f8f1e6] px-5 py-10 sm:px-8"
  >
    {/* Background geometry */}
    <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full border border-[#19352c]/8" />
    <div className="pointer-events-none absolute -right-40 top-[20%] h-[620px] w-[620px] rounded-full border border-[#c7542b]/10" />

    <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col">

      {/* =====================================================
          TOP IDENTITY BAR
      ====================================================== */}
      <div className="flex items-center justify-between border-b border-[#19352c]/10 pb-5">
        <div className="flex items-center gap-4">
          {/* HUMAN EXPERIMENT MARK */}
          <div className="flex h-11 w-11 items-center justify-center border border-[#19352c]">
            <div className="text-center leading-none">
              <div className="font-serif text-lg">H</div>
              <div className="mt-[-2px] font-mono text-[5px] font-bold tracking-[0.15em]">
                06
              </div>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#c7542b]">
              ARISE
            </p>
            <p className="mt-1 font-serif text-lg leading-none">
              Human Experiment
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#19352c]/40">
            Final experiment
          </p>
          <p className="mt-1 font-mono text-[9px] font-bold tracking-[0.16em]">
            06 / 06
          </p>
        </div>
      </div>

      {/* =====================================================
          MAIN FINALE
      ====================================================== */}
      <div className="flex flex-1 items-center py-14 sm:py-20">
        <div className="grid w-full gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">

          {/* LEFT — EXPERIMENT JOURNEY */}
          <div>
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#19352c]/40">
              You made it through
            </p>

            <div className="mt-7 space-y-3">
              {[
                "PERCEPTION",
                "COMMITMENT",
                "SOCIAL INFLUENCE",
                "MEMORY",
                "ATTENTION",
                "REFLECTION",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.2 + index * 0.1,
                    duration: 0.5,
                  }}
                  className="group flex items-center gap-4"
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                      index === 5
                        ? "border-[#c7542b] bg-[#c7542b] text-[#f8f1e6]"
                        : "border-[#19352c]/15"
                    }`}
                  >
                    {index === 5 ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <span className="font-mono text-[7px] font-bold">
                        0{index + 1}
                      </span>
                    )}
                  </div>

                  <div
                    className={`h-px w-5 ${
                      index === 5
                        ? "bg-[#c7542b]"
                        : "bg-[#19352c]/15"
                    }`}
                  />

                  <span
                    className={`font-serif text-lg sm:text-xl ${
                      index === 5 ? "text-[#c7542b]" : ""
                    }`}
                  >
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 border-l-2 border-[#c7542b] pl-4">
              <p className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#19352c]/45">
                Six experiments.
              </p>
              <p className="mt-2 font-serif text-lg">
                One experience.
              </p>
            </div>
          </div>

          {/* RIGHT — HERO */}
          <div className="relative">

            {/* Orbit */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 28,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#19352c]/8 sm:h-[580px] sm:w-[580px]"
            />

            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#c7542b]/15 sm:h-[420px] sm:w-[420px]"
            />

            <div className="relative text-center">

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.5,
                  duration: 0.8,
                }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#c7542b]/40 bg-[#f8f1e6] sm:h-24 sm:w-24"
              >
                <div className="text-center">
                  <div className="font-serif text-3xl leading-none">
                    H
                  </div>
                  <div className="mt-1 font-mono text-[6px] font-bold uppercase tracking-[0.18em] text-[#c7542b]">
                    HUMAN
                  </div>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-10 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[#c7542b]"
              >
                Human Experiment
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mt-5 font-serif text-[clamp(4rem,10vw,9rem)] leading-[0.76] tracking-[-0.07em]"
              >
                YOU
                <br />
                DON'T NEED
                <br />
                <span className="text-[#c7542b]">ANOTHER</span>
                <br />
                EXPERIMENT.
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 1.7, duration: 0.6 }}
                className="mx-auto mt-9 h-px w-20 bg-[#c7542b]"
              />

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                className="mt-7 font-serif text-2xl sm:text-3xl"
              >
                You need a choice.
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM
      ====================================================== */}
      <div className="border-t border-[#19352c]/10 pt-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#19352c]/40">
              Final message
            </p>

            <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]">
              Choose on purpose.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setStage("complete")}
            className="group inline-flex min-h-12 items-center justify-center gap-3 bg-[#19352c] px-7 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#f8f1e6] transition-all duration-300 hover:bg-[#c7542b] sm:min-h-14"
          >
            <PartyPopper className="h-4 w-4" />
            <span>Finish the journey</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
    </motion.section>

        )}

        {/* =====================================================
            COMPLETE — FINAL CELEBRATION
        ====================================================== */}

        {stage === "complete" && (
          <motion.section
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative min-h-screen overflow-hidden bg-[#c7542b] text-[#f8f1e6]"
          >
            {/* Celebration particles */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 24 }).map((_, index) => {
                const positions = [
                  ["7%", "12%"],
                  ["15%", "72%"],
                  ["24%", "20%"],
                  ["32%", "87%"],
                  ["42%", "9%"],
                  ["51%", "91%"],
                  ["61%", "17%"],
                  ["70%", "79%"],
                  ["80%", "27%"],
                  ["89%", "67%"],
                  ["95%", "13%"],
                  ["10%", "48%"],
                  ["28%", "59%"],
                  ["46%", "39%"],
                  ["65%", "55%"],
                  ["84%", "44%"],
                  ["5%", "88%"],
                  ["94%", "85%"],
                  ["37%", "5%"],
                  ["74%", "7%"],
                  ["19%", "37%"],
                  ["56%", "70%"],
                  ["91%", "38%"],
                  ["30%", "13%"],
                ];

                const [left, top] = positions[index];

                return (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 30,
                      rotate: 0,
                      scale: 0.5,
                    }}
                    animate={{
                      opacity: [0, 1, 0.65],
                      y: [30, -15, 10],
                      rotate: [0, 90, 180],
                      scale: [0.5, 1, 0.8],
                    }}
                    transition={{
                      duration: 3 + (index % 4) * 0.5,
                      delay: (index % 8) * 0.12,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                    }}
                    className={
                      index % 3 === 0
                        ? "absolute h-2 w-2 rounded-full bg-[#f8f1e6]"
                        : index % 3 === 1
                          ? "absolute h-2 w-2 rotate-45 bg-[#19352c]"
                          : "absolute h-2 w-2 bg-[#f8f1e6]/70"
                    }
                    style={{ left, top }}
                  />
                );
              })}
            </div>

            {/* Large celebration rings */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f8f1e6]/15 sm:h-[720px] sm:w-[720px]"
            />

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, duration: 1 }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#19352c]/20 sm:h-[500px] sm:w-[500px]"
            />

            <div className="relative flex min-h-screen items-center justify-center px-5 py-14 sm:px-8">
              <div className="w-full max-w-5xl text-center">

                {/* Human Experiment logo */}
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                    rotate: -10,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 14,
                  }}
                  className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#f8f1e6]/60"
                >
                  <div className="text-center">
                    <div className="font-serif text-4xl leading-none">
                      H
                    </div>

                    <div className="mt-1 font-mono text-[6px] font-bold uppercase tracking-[0.2em]">
                      HUMAN
                    </div>
                  </div>
                </motion.div>

                {/* Brand */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 font-mono text-[9px] font-bold uppercase tracking-[0.28em]"
                >
                  ARISE × HUMAN EXPERIMENT
                </motion.p>

                {/* ARISE */}
                <motion.h1
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.65,
                    duration: 0.8,
                  }}
                  className="mt-8 font-serif text-[clamp(5rem,15vw,13rem)] leading-[0.7] tracking-[-0.08em]"
                >
                  ARISE
                  <span className="text-[#19352c]">.</span>
                </motion.h1>

                {/* Divider */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 90 }}
                  transition={{
                    delay: 1.25,
                    duration: 0.6,
                  }}
                  className="mx-auto mt-10 h-1 bg-[#f8f1e6]"
                />

                {/* Six experiments */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.55 }}
                  className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2 sm:gap-3"
                >
                  {[
                    "PERCEPTION",
                    "COMMITMENT",
                    "SOCIAL",
                    "MEMORY",
                    "ATTENTION",
                    "REFLECTION",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 border border-[#f8f1e6]/25 px-3 py-2"
                    >
                      <Check className="h-3 w-3" />

                      <span className="font-mono text-[7px] font-bold uppercase tracking-[0.14em]">
                        {item}
                      </span>
                    </div>
                  ))}
                </motion.div>

                {/* Main message */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="mx-auto mt-14 max-w-3xl border-y border-[#f8f1e6]/30 py-8"
                >
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em]">
                    The experiment ends here.
                  </p>

                  <p className="mt-4 font-serif text-3xl leading-tight sm:text-5xl">
                    Your choices don't.
                  </p>
                </motion.div>

                {/* Final statement */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 2.45,
                    duration: 0.7,
                  }}
                  className="mt-10"
                >
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em]">
                    CHOOSE ON PURPOSE.
                  </p>
                </motion.div>

                {/* Sticker moment */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.9 }}
                  className="mt-10 flex items-center justify-center gap-3"
                >
                  <div className="h-px w-10 bg-[#f8f1e6]/35" />

                  <span className="font-mono text-[8px] font-bold uppercase tracking-[0.18em]">
                    Add sticker 06 to your pass
                  </span>

                  <div className="h-px w-10 bg-[#f8f1e6]/35" />
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}
    </AnimatePresence>
    </main>
  );
}
