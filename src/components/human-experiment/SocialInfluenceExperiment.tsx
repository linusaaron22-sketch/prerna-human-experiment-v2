"use client";

import { useEffect, useState } from "react";

import { useHumanExperimentSession } from "@/lib/human-experiment/useHumanExperimentSession";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Check,
  Lightbulb,
  MessageCircle,
  Scale,
  School,
  Users,
} from "lucide-react";

type Stage =
  | "intro"
  | "round-one"
  | "waiting-one"
  | "reveal"
  | "round-two"
  | "waiting-two"
  | "final"
  | "real-life"
  | "connection"
  | "takeaway"
  | "last-question";

type GroupId = "women" | "ot" | "nt" | "disciples";

type Character = {
  name: string;
  traits: string;
  description: string;
  image: string;
};

const groups = [
  { id: "women" as GroupId, name: "Women of the Bible", short: "WOMEN" },
  { id: "ot" as GroupId, name: "Old Testament Leaders", short: "OLD TESTAMENT" },
  { id: "nt" as GroupId, name: "New Testament Important Members", short: "NEW TESTAMENT" },
  { id: "disciples" as GroupId, name: "The 12 Disciples", short: "12 DISCIPLES" },
];

const characters: Character[] = [
  {
    name: "Peter",
    traits: "Bold • Faithful • Resilient",
    description:
      "Known for bold action, strong faith, mistakes, restoration, and leadership.",
    image: "/characters/disciples/peter.png",
  },
  {
    name: "Barnabas",
    traits: "Encouraging • Generous • Supportive",
    description:
      "Known for encouraging others, generosity, and helping fellow believers grow.",
    image: "/characters/new-testament/barnabas.png",
  },
  {
    name: "Esther",
    traits: "Courageous • Strategic • Influential",
    description:
      "Used her position courageously and strategically to protect her people.",
    image: "/characters/women-of-bible/esther.png",
  },
  {
   name: "Hannah",
  traits: "Prayerful • Faithful • Persistent",
  description:
    "Known for bringing her deepest struggles to God through prayer and remaining faithful through a season of waiting.",
  image: "/characters/women-of-bible/hannah.png",
},
  {
    name: "Rachel",
    traits: "LOVED • HOPEFUL • FAITHFUL",
    description: 
    "Known for deep love, hope, and trusting God through seasons of waiting.",  
    image: "/characters/women-of-bible/rachel.png",
  },
  {
    name: "Paul",
    traits: "Persuasive • Missionary • Convicted",
    description:
      "A major missionary and teacher who passionately communicated the Christian message.",
    image: "/characters/new-testament/paul.png",
  },
  {
    name: "Martha",
    traits: "Practical • Hospitable • Faithful",
    description:
      "Known for hospitality, practical service, and her declaration of faith in Jesus.",
    image: "/characters/women-of-bible/martha.png",
  },
  {
    name: "Joseph",
    traits: "Wise • Resilient • Forgiving",
    description:
      "Rose from betrayal and hardship to leadership and ultimately forgave his brothers.",
    image: "/characters/old-testament/joseph.png",
  },
];

const demoGroupChoices: Record<GroupId, string> = {
  women: "Barnabas",
  ot: "Hannah",
  nt: "Paul",
  disciples: "Peter",
};

export default function SocialInfluenceExperiment() {
 const session = useHumanExperimentSession();
const [stage, setStage] = useState<Stage>("intro");
const [activeGroup, setActiveGroup] = useState<GroupId | null>(null);
const [groupLoaded, setGroupLoaded] = useState(false);
const [isRepresentative, setIsRepresentative] = useState(false);

const [firstChoice, setFirstChoice] = useState<string | null>(null);
const [secondChoice, setSecondChoice] = useState<string | null>(null);
  const participantKey =
  typeof window !== "undefined"
    ? window.localStorage.getItem(
        "arise-human-experiment-participant"
      ) || ""
    : "";
useEffect(() => {
  let cancelled = false;
  let interval: ReturnType<typeof setInterval> | null = null;

  async function loadParticipantAssignment() {
    if (!session.sessionId || !supabase) return;

    const participantKey = window.localStorage.getItem(
      "arise-human-experiment-participant"
    );

    if (!participantKey) return;

    const { data, error } = await supabase
      .from("experiment_participants")
      .select("group_name, is_representative")
      .eq("session_id", session.sessionId)
      .eq("participant_key", participantKey)
      .maybeSingle();

    if (cancelled) return;

    if (error) {
      console.error(
        "FAILED TO LOAD SOCIAL INFLUENCE ASSIGNMENT:",
        error
      );
      return;
    }

    const groupMap: Record<string, GroupId> = {
      women: "women",
      ot: "ot",
      nt: "nt",
      disciples: "disciples",
    };

    const group = data?.group_name
      ? groupMap[data.group_name.toLowerCase()]
      : undefined;

    if (group) {
      setActiveGroup(group);
      setGroupLoaded(true);
    } else {
      setGroupLoaded(false);
    }

    // IMPORTANT:
    // Keep this updated because Admin may make/remove
    // a participant as representative after assigning groups.
    setIsRepresentative(Boolean(data?.is_representative));
  }

  // Load immediately.
  void loadParticipantAssignment();

  // Keep assignment + representative status synced.
  interval = setInterval(() => {
    void loadParticipantAssignment();
  }, 1000);

  return () => {
    cancelled = true;

    if (interval) {
      clearInterval(interval);
    }
  };
}, [session.sessionId]);

/*
 * FACILITATOR STAGE SYNC 
 *
 * The facilitator controls:
 * INTRO → START → WAIT → REVEAL → DISCUSSION → COMPLETE
 *
 * Participants handle the actual decision screens locally.
 */
useEffect(() => {
  if (session.experiment !== 3) return;

  switch (session.stage) {
    case "INTRO":
      setStage("intro");
      break;

    case "START":
    case "QUESTION":
      if (firstChoice === null) {
        // First question
        setStage("round-one");
      } else if (secondChoice === null) {
        // Second question
        setStage("round-two");
      }
      break;

    case "WAIT":
      if (firstChoice !== null && secondChoice === null) {
        // Waiting after Question 1
        setStage("waiting-one");
      } else if (secondChoice !== null) {
        // Waiting after Question 2
        setStage("waiting-two");
      }
      break;

    case "REVEAL":
      if (secondChoice === null) {
        // First reveal:
        // show what the other groups chose
        setStage("reveal");
      } else {
        // Final reveal:
        // show whether the group moved
        setStage("final");
      }
      break;

    case "DISCUSSION":
      setStage("real-life");
      break;

    case "COMPLETE":
      setStage("takeaway");
      break;

    default:
      break;
  }
}, [
  session.experiment,
  session.stage,
  firstChoice,
  secondChoice,
]);
  const activeGroupName =
    groups.find((group) => group.id === activeGroup)?.name ?? "";

  const otherGroups = groups.filter((group) => group.id !== activeGroup);
const submitAnswer = async (value: {
  round: 1 | 2;
  choice: string;
}) => {
  if (!supabase) return;
  if (!session.sessionId) return;
  if (!participantKey) return;

  // Get the participant's existing answer so Round 02
  // does not overwrite Round 01.
  const { data: existing, error: fetchError } = await supabase
    .from("experiment_participants")
    .select("answer")
    .eq("session_id", session.sessionId)
    .eq("participant_key", participantKey)
    .maybeSingle();

  if (fetchError) {
    console.error(
      "FAILED TO READ SOCIAL INFLUENCE ANSWER:",
      fetchError
    );
    return;
  }

  const previousAnswer =
    existing?.answer &&
    typeof existing.answer === "object" &&
    !Array.isArray(existing.answer)
      ? existing.answer as Record<string, unknown>
      : {};

  const updatedAnswer = {
    ...previousAnswer,
    experiment: 3,
    ...(value.round === 1
      ? { round1: value.choice }
      : { round2: value.choice }),
  };

  const { error } = await supabase
    .from("experiment_participants")
    .update({
      answer: updatedAnswer,
      status: "ANSWERED",
      submitted_at: new Date().toISOString(),
      connected: true,
      current_experiment: 3,
    })
    .eq("session_id", session.sessionId)
    .eq("participant_key", participantKey);

  if (error) {
    console.error(
      "FAILED TO SUBMIT SOCIAL INFLUENCE ANSWER:",
      error
    );
    return;
  }

  console.log(
    "SOCIAL INFLUENCE ANSWER SUBMITTED:",
    participantKey,
    updatedAnswer
  );
};
      
const chooseRoundOne = (name: string) => {
  if (!isRepresentative) return;

  setFirstChoice(name);

  void submitAnswer({
    round: 1,
    choice: name,
  });

  setStage("waiting-one");
};

const chooseRoundTwo = (name: string) => {
  if (!isRepresentative) return;

  setSecondChoice(name);

  void submitAnswer({
    round: 2,
    choice: name,
  });

  setStage("waiting-two");
};

return (
  
    <main className="min-h-screen bg-[#f8f1e6] text-[#19352c]">
      <div className="mx-auto min-h-screen max-w-[1280px] px-5 py-6 sm:px-8 sm:py-10">

        {/* HEADER */}
        <header className="flex items-start justify-between border-b border-[#19352c]/10 pb-5">
          <div>
            <div className="font-sans text-lg font-semibold tracking-[0.25em] sm:text-xl">
              ARISE
            </div>

            <div className="mt-1 font-mono text-[7px] uppercase tracking-[0.28em] text-[#19352c]/55 sm:text-[8px]">
              × Human Experiment
            </div>

            <div className="mt-1 font-mono text-[6px] uppercase tracking-[0.22em] text-[#19352c]/40 sm:text-[7px]">
              Human Behaviour Lab
            </div>
          </div>

          <div className="text-right">
            <div className="font-mono text-[6px] uppercase tracking-[0.22em] text-[#19352c]/45">
              Experiment
            </div>

            <div className="mt-1 font-mono text-sm font-bold text-[#c7542b]">
              03 / 06
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[1160px] py-10 sm:py-14">
          <AnimatePresence mode="wait">

            {/* INTRO / TEST GROUP SELECTOR */}
            {stage === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <div className="text-center">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.35em] text-[#c7542b]">
                    Experiment 03
                  </p>

                  <h1 className="mt-5 font-serif text-5xl leading-none sm:text-7xl">
                    SOCIAL INFLUENCE
                  </h1>

                  <p className="mx-auto mt-6 max-w-2xl font-serif text-lg leading-8 text-[#19352c]/60 sm:text-xl">
                    Make a decision as a group. Then discover what everyone
                    else chose.
                  </p>
                </div>

                {/* FIXED GROUP IDENTITY */}
                <div className="mx-auto mt-5 max-w-4xl border border-[#c7542b]/25 bg-[#f3eadb] px-6 py-5 sm:px-8">
                  <p className="font-mono text-[7px] uppercase tracking-[0.25em] text-[#c7542b]">
                    Your group
                  </p>

                  <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                    <h2 className="font-serif text-3xl sm:text-4xl">
                      {activeGroupName}
                    </h2>

                    <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#19352c]/40">
                      Assigned during the icebreaker
                    </p>
                  </div>
                </div>

                <div className="mx-auto mt-8 max-w-3xl border-l-2 border-[#c7542b] pl-6">
                  <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#c7542b]">
                    Before you begin
                  </p>

                  <p className="mt-4 font-serif text-base leading-8 text-[#19352c]/70 sm:text-lg">
                    Your group will discuss a realistic church situation and
                    choose one biblical character. Your decision will be kept
                    private until the facilitator reveals the other groups'
                    choices.
                    <button
  onClick={() => {
    if (!groupLoaded) return;

    if (!activeGroup) {
      alert("Please wait for the facilitator to assign your group.");
      return;
    }

    setStage("round-one");
  }}
  disabled={!groupLoaded || !activeGroup}
  className="mt-8 rounded-xl bg-white px-8 py-4 font-semibold text-black shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
>
  {groupLoaded
    ? activeGroup
      ? "Continue"
      : "Waiting for Group Assignment..."
    : "Loading..."}
</button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* ROUND ONE */}
            {stage === "round-one" && (
              <motion.div
                key="round-one"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <div className="border-b border-[#19352c]/10 pb-7">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c7542b] sm:text-[13px]">
                  Round 01 · Group Decision
                </p>

                  <div className="mt-5 border border-[#c7542b]/25 bg-[#f3eadb] p-5 sm:p-6">
                    <p className="font-mono text-[7px] uppercase tracking-[0.25em] text-[#c7542b]">
                      Your group
                    </p>

                    <p className="mt-2 font-serif text-2xl sm:text-3xl">
                      {activeGroupName}
                    </p>
                  </div>

                  <h2 className="mt-10 font-serif text-4xl leading-tight sm:text-6xl">
                    A NEW PERSON
                  </h2>

                  <p className="mt-5 max-w-4xl font-serif text-base leading-8 text-[#19352c]/65 sm:text-lg">
                    Someone has started attending your church. They don't know
                    anyone yet, feel unsure whether they belong, and are
                    carrying some personal struggles.
                  </p>

                  <p className="mt-4 max-w-4xl font-serif text-base leading-8 text-[#19352c]/65 sm:text-lg">
                    Your group must choose one person to take the lead in
                    welcoming and supporting them.
                  </p>
                </div>

                <div className="mt-10 flex items-center justify-between">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c7542b] sm:text-[13px]">
                    Discuss together · Choose one
                  </p>

                  <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#19352c]/35">
                    8 choices
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {characters.map((character, index) => (
                   <motion.button
  key={character.name}
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.04 }}
  onClick={() => chooseRoundOne(character.name)}
disabled={!isRepresentative}
  className="group overflow-hidden border border-[#19352c]/12 bg-[#eee5d5]/35 text-left transition-all hover:-translate-y-1 hover:border-[#c7542b]/45 hover:bg-[#f8f1e6]"
>
  <div className="overflow-hidden bg-[#e7ddcc]">
    <img
      src={character.image}
      alt={character.name}
      className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
    />
  </div>
                      <div className="p-5">
                        <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#19352c]/35">
                          Character {String(index + 1).padStart(2, "0")}
                        </p>

                        <h3 className="mt-2 font-serif text-2xl">
                          {character.name}
                        </h3>

                        <p className="mt-3 font-mono text-[10px] font-semibold uppercase leading-5 tracking-[0.1em] text-[#c7542b] sm:text-[11px]">
                       {character.traits}
                        </p>

                        <p className="mt-3 font-serif text-sm leading-6 text-[#19352c]/55">
                          {character.description}
                        </p>

                        <p className="mt-5 border-t border-[#19352c]/10 pt-4 font-mono text-[7px] uppercase tracking-[0.18em] text-[#19352c]/40">
                          Choose {character.name} →
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* WAITING AFTER ROUND ONE */}
            {stage === "waiting-one" && (
              <motion.div
                key="waiting-one"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mx-auto max-w-2xl text-center"
              >
                <div className="border border-[#19352c]/15 bg-[#eee5d5]/45 p-10 sm:p-16">
                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#c7542b]">
                    Round 01 · Decision recorded
                  </p>

                  <h2 className="mt-6 font-serif text-5xl sm:text-7xl">
                    WAIT.
                  </h2>

                  <p className="mt-6 font-serif text-lg leading-8 text-[#19352c]/60">
                    Your group chose:
                  </p>

                  <p className="mt-3 font-serif text-4xl">
                    {firstChoice}
                  </p>

                  <p className="mt-8 font-serif text-base leading-7 text-[#19352c]/50">
                    The facilitator is waiting for the other groups.
                  </p>
                </div>

                {/* LOCAL TEST CONTROL — will become facilitator-controlled */}
              </motion.div>
            )}

            {/* SOCIAL REVEAL */}
{stage === "reveal" && (
  <motion.div
    key="reveal"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {/* TITLE */}
    <div className="text-center">
      <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#c7542b]">
        Social Information
      </p>

      <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-6xl">
        WHAT DID THE OTHERS CHOOSE?
      </h2>

      <p className="mx-auto mt-5 max-w-2xl font-serif text-base leading-7 text-[#19352c]/60 sm:text-lg">
        Your decision came first.
        <br />
        Now you can see what the other groups chose.
      </p>
    </div>

    {/* OTHER GROUPS */}
    <div className="mx-auto mt-10 max-w-5xl">
      <p className="mb-4 font-mono text-[8px] uppercase tracking-[0.25em] text-[#c7542b]">
        Other Groups
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {otherGroups.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12 }}
           className="flex min-h-[150px] items-center justify-between border border-[#19352c]/12 bg-[#eee5d5]/45 px-7 py-6 sm:min-h-[170px] sm:flex-col sm:items-start sm:justify-center sm:px-8"
          >
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c7542b] sm:text-[12px]">
               {group.short}
                </p>
              <p className="mt-2 font-serif text-3xl sm:mt-4 sm:text-4xl">
                {demoGroupChoices[group.id]}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* YOUR ORIGINAL CHOICE */}
    <div className="mx-auto mt-8 max-w-5xl">
      <div className="border border-[#c7542b]/35 bg-[#f3eadb] px-6 py-5 sm:px-8 sm:py-6">
        <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#c7542b]">
          Your Group's Original Choice
        </p>

        <div className="mt-2 flex items-center justify-between gap-4">
          <p className="font-serif text-3xl sm:text-4xl">
            {firstChoice}
          </p>

          <p className="font-mono text-[7px] uppercase tracking-[0.15em] text-[#19352c]/35">
            Round 01
          </p>
        </div>
      </div>
    </div>

    {/* TRANSITION */}
    <div className="mx-auto mt-10 max-w-2xl text-center">
      <div className="mx-auto h-px w-16 bg-[#c7542b]/50" />

      <p className="mt-7 font-serif text-xl italic text-[#19352c]/55">
        Now you know what everyone else chose.
      </p>
    </div>
  </motion.div>
)}

                
            {/* ROUND TWO */}
            {stage === "round-two" && (
              <motion.div
                key="round-two"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="border-b border-[#19352c]/10 pb-7">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c7542b] sm:text-[13px]">
                    Round 02 · Group Decision
                  </p>

                  <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">
                    NOW THEY HAVE QUESTIONS.
                  </h2>

                  <p className="mt-5 max-w-4xl font-serif text-base leading-8 text-[#19352c]/65 sm:text-lg">
                    The person has now been attending church for a few weeks.
                    They have started asking difficult questions about faith
                    and are unsure what they believe.
                  </p>

                  <p className="mt-4 max-w-4xl font-serif text-base leading-8 text-[#19352c]/65 sm:text-lg">
                    Your group must choose someone to have a deeper,
                    meaningful conversation with them.
                  </p>
                </div>

                <div className="mt-8 border-l-2 border-[#c7542b] bg-[#eee5d5]/35 p-5">
                  <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#c7542b]">
                    Remember
                  </p>

                  <p className="mt-2 font-serif text-base leading-7 text-[#19352c]/65">
                    You have already seen what the other groups chose in Round
                    01. Discuss again before making your final choice.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {characters.map((character, index) => (
                    <motion.button
                      key={character.name}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      onClick={() => chooseRoundTwo(character.name)}
                      disabled={!isRepresentative}
                      className={`group overflow-hidden border text-left transition-all hover:-translate-y-1 ${
                        character.name === firstChoice
                          ? "border-[#c7542b]/35 bg-[#f3eadb]"
                          : "border-[#19352c]/12 bg-[#eee5d5]/35 hover:border-[#c7542b]/45 hover:bg-[#f8f1e6]"
                      }`}
                    >
                      <div className="overflow-hidden bg-[#e7ddcc]">
                     <img
                     src={character.image}
                    alt={character.name}
                    className="block w-full h-auto"
                    />
                    </div>

                      <div className="p-5">
                        {character.name === firstChoice && (
                          <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#c7542b]">
                            Your Round 01 choice
                          </p>
                        )}

                        <h3 className="mt-2 font-serif text-2xl">
                          {character.name}
                        </h3>

                          <p className="mt-3 font-mono text-[10px] font-semibold uppercase leading-5 tracking-[0.1em] text-[#c7542b] sm:text-[11px]">
                       {character.traits}
                       </p>

                        <p className="mt-3 font-serif text-sm leading-6 text-[#19352c]/55">
                          {character.description}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* WAITING AFTER ROUND TWO */}
            {stage === "waiting-two" && (
              <motion.div
                key="waiting-two"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mx-auto max-w-2xl text-center"
              >
                <div className="border border-[#19352c]/15 bg-[#eee5d5]/45 p-10 sm:p-16">
                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#c7542b]">
                    Round 02 · Final decision recorded
                  </p>

                  <h2 className="mt-6 font-serif text-5xl sm:text-7xl">
                    WAIT.
                  </h2>

                  <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#19352c]/10 pt-8">
                    <div>
                      <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#19352c]/40">
                        Round 01
                      </p>

                      <p className="mt-2 font-serif text-xl">
                        {firstChoice}
                      </p>
                    </div>

                    <div>
                      <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#19352c]/40">
                        Round 02
                      </p>

                      <p className="mt-2 font-serif text-xl">
                        {secondChoice}
                      </p>
                    </div>
                  </div>
                </div>   
              </motion.div>
            )}

            {/* FINAL REVEAL */}
            {stage === "final" && (
              <motion.div
                key="final"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center">
                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#c7542b]">
                    The psychology
                  </p>

                  <h2 className="mt-5 font-serif text-4xl sm:text-6xl">
                    DID THE GROUP MOVE?
                  </h2>

                  <p className="mx-auto mt-6 max-w-2xl font-serif text-lg leading-8 text-[#19352c]/60">
                    Your group made a decision.
                    <br />
                    Then you discovered what the other groups chose.
                    <br />
                    Then you decided again.
                  </p>
                </div>

                <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="border border-[#19352c]/12 bg-[#eee5d5]/45 p-7">
                    <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#19352c]/40">
                      Round 01
                    </p>

                    <p className="mt-4 font-serif text-3xl">
                      {firstChoice}
                    </p>
                  </div>

                  <div className="border border-[#c7542b]/30 bg-[#f3eadb] p-7">
                    <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#c7542b]">
                      Social information
                    </p>

                    <p className="mt-4 font-serif text-lg leading-7">
                      You saw what the other groups chose.
                    </p>
                  </div>

                  <div className="border border-[#19352c]/12 bg-[#eee5d5]/45 p-7">
                    <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#19352c]/40">
                      Round 02
                    </p>

                    <p className="mt-4 font-serif text-3xl">
                      {secondChoice}
                    </p>
                  </div>
                </div>

                <div className="mx-auto mt-10 max-w-3xl border-l-2 border-[#c7542b] pl-6">
                  <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#c7542b]">
                    SOCIAL INFLUENCE
                  </p>

                  <p className="mt-4 font-serif text-lg leading-8 text-[#19352c]/70 sm:text-xl">
                    Other people's choices can influence how we think,
                    discuss, and decide — even when nobody tells us that their
                    choice is the right one.
                  </p>
                </div>

                <div className="mx-auto mt-10 max-w-3xl bg-[#19352c] p-8 text-[#f8f1e6] sm:p-10">
                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#c7542b]">
                    Ask yourself
                  </p>
                  <p className="mt-5 font-serif text-2xl leading-9 sm:text-3xl">
                    Did we change because we learned something new — or because
                    we saw what everyone else chose?
                  </p>
                </div>
              </motion.div>
            )}
            {/* =========================================================
    REAL LIFE — CLASSROOM EXAMPLE
========================================================= */}
{stage === "real-life" && (
  <motion.div
    key="real-life"
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -18 }}
  >
    {/* HEADER */}
    <div className="border-b border-[#19352c]/10 pb-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center bg-[#19352c] text-[#f8f1e6]">
          <School className="h-4 w-4" strokeWidth={1.5} />
        </div>

        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.3em] text-[#c7542b]">
          Real Life
        </p>
      </div>

      <h2 className="mt-7 max-w-3xl font-serif text-5xl leading-[0.95] sm:text-7xl">
        YOU DON'T ALWAYS
        <br />
        CHOOSE ALONE.
      </h2>

      <p className="mt-6 max-w-2xl font-serif text-lg leading-8 text-[#19352c]/60 sm:text-xl">
        Sometimes, seeing what others think can change what we decide.
      </p>
    </div>

    {/* CLASSROOM SCENE */}
    <div className="mt-10 overflow-hidden border border-[#19352c]/12 bg-[#eee5d5]/50">
      <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
</div>
        {/* CLASSROOM */}
        <div className="relative min-h-[300px] overflow-hidden border-b border-[#19352c]/10 bg-[#e9dfce] p-6 sm:min-h-[380px] sm:p-10 lg:border-b-0 lg:border-r">

          {/* Window */}

          {/* Whiteboard */}
          <div className="mx-auto max-w-xl border-4 border-[#19352c]/15 bg-[#f8f1e6] p-5 shadow-sm sm:p-7">
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#19352c]/40">
              Classroom · Mathematics
            </p>

            <p className="mt-4 font-serif text-lg sm:text-2xl">
              Which of the following
              <br />
              is the correct answer?
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3">
              {["A. 15", "B. 20", "C. 25", "D. 30"].map((answer) => (
                <div
                  key={answer}
                  className="border border-[#19352c]/10 bg-[#eee5d5]/60 px-3 py-2 font-mono text-[10px] text-[#19352c]/70 sm:text-xs"
                >
                  {answer}
                </div>
              ))}
            </div>
          </div>

          {/* Students */}
          <div className="mt-8 flex items-end justify-center gap-3 sm:gap-6">

            {/* Student 1 */}
            <div className="relative hidden sm:block">
              <div className="mx-auto h-10 w-10 rounded-full bg-[#b88962]" />
              <div className="mt-1 h-16 w-20 bg-[#19352c]" />
            </div>

            {/* Main student */}
            <div className="relative">
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap border border-[#19352c]/10 bg-[#f8f1e6] px-3 py-2 shadow-sm">
                <p className="font-mono text-[8px] uppercase tracking-[0.12em]">
                  I know the answer
                </p>
              </div>

              <div className="mx-auto h-12 w-12 rounded-full bg-[#a97855]" />

              {/* raised arm */}
              <div className="absolute -left-4 -top-16 h-20 w-3 -rotate-[12deg] rounded-full bg-[#a97855] sm:-left-5 sm:-top-20 sm:h-24 sm:w-4" />
              <div className="mt-1 h-20 w-28 bg-[#c7542b] sm:h-24 sm:w-36" />
            </div>

            {/* Student 2 */}
            <div className="relative">
              <div className="mx-auto h-10 w-10 rounded-full bg-[#9c7053]" />
              <div className="mt-1 h-16 w-20 bg-[#334c58] sm:h-20 sm:w-24" />
            </div>

            {/* Student 3 */}
            <div className="relative hidden sm:block">
              <div className="mx-auto h-10 w-10 rounded-full bg-[#b98c6d]" />
              <div className="mt-1 h-16 w-20 bg-[#c9a68a]" />
            </div>
          </div>
        </div>

        {/* SIDE EXPLANATION */}
        <div className="flex flex-col justify-center p-7 sm:p-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3eadb] text-[#c7542b]">
            <Lightbulb className="h-5 w-5" strokeWidth={1.5} />
          </div>

          <p className="mt-6 font-mono text-[8px] font-semibold uppercase tracking-[0.25em] text-[#c7542b]">
            Imagine this
          </p>

          <h3 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
            You know the answer.
          </h3>

          <p className="mt-5 font-serif text-base leading-7 text-[#19352c]/60">
            You are confident and about to answer.
            Then another student gives a different answer —
            and sounds completely sure.
          </p>

          <div className="mt-6 flex items-center gap-3 border-l-2 border-[#c7542b] pl-4">
            <MessageCircle className="h-5 w-5 shrink-0 text-[#c7542b]" />
            <p className="font-serif text-base italic text-[#19352c]/70">
              “I think the answer is 20.”
            </p>
          </div>
        </div>
      </div>                
    {/* STEP-BY-STEP */}
    <div className="mt-10 grid grid-cols-1 gap-px border border-[#19352c]/10 bg-[#19352c]/10 sm:grid-cols-3">

      {/* Step 1 */}
      <div className="bg-[#f8f1e6] p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c7542b] font-mono text-xs font-bold text-white">
            01
          </span>

          <Lightbulb className="h-5 w-5 text-[#c7542b]/60" />
        </div>

        <h3 className="mt-6 font-serif text-2xl">
          You feel confident.
        </h3>

        <p className="mt-3 font-serif text-sm leading-6 text-[#19352c]/55">
          You have your own answer and believe it is correct.
        </p>
      </div>

      {/* Step 2 */}
      <div className="bg-[#f8f1e6] p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c7542b] font-mono text-xs font-bold text-white">
            02
          </span>

          <Users className="h-5 w-5 text-[#c7542b]/60" />
        </div>

        <h3 className="mt-6 font-serif text-2xl">
          Others disagree.
        </h3>

        <p className="mt-3 font-serif text-sm leading-6 text-[#19352c]/55">
          A few classmates confidently agree with the other answer.
        </p>
      </div>

      {/* Step 3 */}
      <div className="bg-[#f3eadb] p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#19352c] font-mono text-xs font-bold text-[#f8f1e6]">
            03
          </span>

          <Brain className="h-5 w-5 text-[#c7542b]/70" />
        </div>

        <h3 className="mt-6 font-serif text-2xl">
          You start doubting.
        </h3>

        <p className="mt-3 font-serif text-sm leading-6 text-[#19352c]/55">
          Suddenly you wonder whether your own answer was wrong.
        </p>
      </div>
    </div>

    {/* CHOICE MOMENT */}
    <div className="mt-10 border border-[#c7542b]/25 bg-[#f3eadb] p-7 sm:p-9">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#19352c] text-[#f8f1e6]">
          <Scale className="h-5 w-5" strokeWidth={1.5} />
        </div>

        <div>
          <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.25em] text-[#c7542b]">
            The choice
          </p>

          <h3 className="mt-2 font-serif text-3xl sm:text-4xl">
            What do you do next?
          </h3>
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">

        <div className="flex items-start gap-4 border border-[#19352c]/10 bg-[#f8f1e6] p-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#19352c] font-serif text-lg text-[#f8f1e6]">
            A
          </div>

          <div>
            <p className="font-serif text-lg">
              Stick with your answer.
            </p>

            <p className="mt-1 font-serif text-sm leading-6 text-[#19352c]/50">
              You believe your reasoning is correct.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 border border-[#c7542b]/20 bg-[#f8f1e6] p-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c7542b] font-serif text-lg text-white">
            B
          </div>

          <div>
            <p className="font-serif text-lg">
              Change your answer.
            </p>

            <p className="mt-1 font-serif text-sm leading-6 text-[#19352c]/50">
              Everyone else seems to agree.
            </p>
          </div>
        </div>
      </div>
    </div>
    </motion.div>
)}
    {/* CONNECTION */}
    {stage === "connection" && (
  <motion.div
    key="connection"
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -18 }}
    className="min-h-[70vh]"
  >
    <div className="grid overflow-hidden border border-[#19352c]/10 lg:min-h-[620px] lg:grid-cols-2">

      {/* LEFT */}
      <div className="flex flex-col justify-center bg-[#19352c] p-8 text-[#f8f1e6] sm:p-12 lg:p-16">
        <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.3em] text-[#c7542b]">
          The connection
        </p>

        <h2 className="mt-6 max-w-xl font-serif text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
          This is
          <br />
          Social Influence.
        </h2>

        <p className="mt-8 max-w-lg font-serif text-lg leading-8 text-[#f8f1e6]/65">
          Sometimes we don't change our minds because
          we found a better answer.
        </p>

        <p className="mt-5 max-w-lg font-serif text-lg font-semibold leading-8 text-[#f8f1e6]">
          We change because other people make us
          question our own.
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-center justify-center bg-[#eee5d5] p-8 text-center sm:p-12 lg:p-16">

        <div className="border border-[#19352c]/10 bg-[#f8f1e6] px-5 py-3 shadow-sm">
          <p className="font-serif text-base italic sm:text-lg">
            “Maybe I'm wrong...”
          </p>
        </div>

        <div className="mt-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#c7542b]/15 sm:h-28 sm:w-28">
          <Brain
            className="h-12 w-12 text-[#c7542b] sm:h-14 sm:w-14"
            strokeWidth={1}
          />
        </div>

        <h3 className="mt-8 max-w-md font-serif text-3xl leading-tight sm:text-4xl">
          Your thinking
          <br />
          meets the crowd.
        </h3>

        <div className="mt-8 flex justify-center gap-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#19352c] text-[#f8f1e6]"
            >
              <Users className="h-4 w-4" strokeWidth={1.5} />
            </div>
          ))}
        </div>

      </div>
    </div>
  </motion.div>
)}       
    {stage === "takeaway" && (
  <motion.div
    key="takeaway"
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -18 }}
    className="min-h-[70vh]"
  >
    <div className="text-center">
      <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.3em] text-[#c7542b]">
        The takeaway
      </p>

      <h2 className="mt-5 font-serif text-5xl leading-none sm:text-7xl">
        LISTEN.
        <br />
        THINK.
        <br />
        THEN DECIDE.
      </h2>
    </div>

    <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">

      <div className="border border-[#19352c]/12 bg-[#eee5d5]/40 p-7 sm:p-8">
        <MessageCircle className="h-7 w-7 text-[#c7542b]" />

        <p className="mt-6 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#c7542b]">
          01 · Listen
        </p>

        <h3 className="mt-3 font-serif text-2xl">
          Hear others out.
        </h3>

        <p className="mt-3 font-serif text-sm leading-6 text-[#19352c]/55">
          Other people can have better reasons.
          That's why listening matters.
        </p>
      </div>

      <div className="border border-[#19352c]/12 bg-[#eee5d5]/40 p-7 sm:p-8">
        <Brain className="h-7 w-7 text-[#c7542b]" />

        <p className="mt-6 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#c7542b]">
          02 · Think
        </p>

        <h3 className="mt-3 font-serif text-2xl">
          Question your reason.
        </h3>

        <p className="mt-3 font-serif text-sm leading-6 text-[#19352c]/55">
          Did I find a better reason, or did I simply
          follow the crowd?
        </p>
      </div>

      <div className="border border-[#19352c]/12 bg-[#eee5d5]/40 p-7 sm:p-8">
        <Check className="h-7 w-7 text-[#c7542b]" />

        <p className="mt-6 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#c7542b]">
          03 · Decide
        </p>

        <h3 className="mt-3 font-serif text-2xl">
          Make it your decision.
        </h3>

        <p className="mt-3 font-serif text-sm leading-6 text-[#19352c]/55">
          Don't follow people blindly.
          Don't reject them blindly either.
        </p>
      </div>

    </div>

    <div className="mx-auto mt-10 max-w-4xl border-l-2 border-[#c7542b] pl-6">
      <p className="font-serif text-lg leading-8 text-[#19352c]/70 sm:text-xl">
        Listen to others.
        <br />
        Think for yourself.
        <br />
        Then decide.
      </p>
    </div>
     <div className="flex justify-center">
    </div>
    <div className="flex justify-center">
</div>
  </motion.div>
)}
{stage === "last-question" && (
  <motion.div
    key="last-question"
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -18 }}
    className="flex min-h-[70vh] flex-col items-center justify-center text-center"
  >
    <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.3em] text-[#c7542b]">
      One last question
    </p>

    <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#eee5d5]">
      <Lightbulb
        className="h-9 w-9 text-[#c7542b]"
        strokeWidth={1.3}
      />
    </div>

    <h2 className="mx-auto mt-10 max-w-4xl font-serif text-4xl leading-tight sm:text-6xl lg:text-7xl">
      Would you still choose
      <br className="hidden sm:block" />
      the same answer...
    </h2>

    <p className="mx-auto mt-6 max-w-2xl font-serif text-xl leading-8 text-[#19352c]/60 sm:text-2xl">
      if you couldn't see what everyone else chose?
    </p>

  </motion.div>
)}        
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}
