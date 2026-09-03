"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ParticipantPage() {
  const params = useParams();
  const router = useRouter();

  const participant =
    typeof params.participant === "string"
      ? params.participant.toUpperCase()
      : "";

  useEffect(() => {
    if (!participant) return;

    window.localStorage.setItem(
      "arise-human-experiment-participant",
      participant
    );
  }, [participant]);

  const enterExperience = () => {
    if (!participant) return;

    router.push(
      `/human-experiment?participant=${encodeURIComponent(participant)}`
    );
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f1e6] text-[#19352c]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-[#c7542b]/20" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[#c7542b]/10" />
        <div className="absolute bottom-[-180px] left-[-120px] h-96 w-96 rounded-full border border-[#19352c]/10" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-16">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#c7542b]">
              ARISE / 2026
            </p>

            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.25em] text-[#19352c]/45">
              Human Behaviour Lab
            </p>
          </div>

          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#19352c]/45">
              Subject ID
            </p>

            <p className="mt-1 font-mono text-sm tracking-[0.12em]">
              {participant || "—"}
            </p>
          </div>
        </header>

        {/* Main hero */}
        <section className="flex flex-1 items-center py-16 lg:py-20">
          <div className="grid w-full items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            {/* Left */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c7542b]">
                A study in human behaviour
              </p>

              <h1 className="mt-6 font-serif text-[clamp(4rem,10vw,8.5rem)] leading-[0.82] tracking-[-0.055em]">
                Human
                <br />
                <span className="text-[#c7542b]">Experiment.</span>
              </h1>

              <div className="mt-10 max-w-xl border-l border-[#19352c]/20 pl-5">
                <p className="font-serif text-xl leading-relaxed text-[#19352c]/75 sm:text-2xl">
                  Observe.
                  <br />
                  Question.
                  <br />
                  Discover.
                </p>
              </div>

              <p className="mt-8 max-w-lg text-sm leading-7 text-[#19352c]/55">
                Six short experiments designed to reveal something
                interesting about the way we see, choose, remember,
                focus and respond.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  onClick={enterExperience}
                  className="group inline-flex items-center justify-center gap-5 bg-[#19352c] px-8 py-5 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#f8f1e6] transition-all duration-300 hover:bg-[#24483d]"
                >
                  Enter Experience

                  <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>

                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#19352c]/40">
                  Participant {participant || "—"}
                </p>
              </div>
            </div>

            {/* Right visual */}
            <div className="relative mx-auto w-full max-w-xl">
              <div className="relative aspect-[4/5] overflow-hidden border border-[#19352c]/15 bg-[#eee5d5]">
                {/* Large number */}
                <div className="absolute right-7 top-6 font-mono text-[9px] uppercase tracking-[0.25em] text-[#19352c]/40">
                  06 / Experiments
                </div>

                <div className="absolute left-8 top-8 font-serif text-[clamp(7rem,18vw,12rem)] leading-none text-[#19352c]/[0.055]">
                  01
                </div>

                {/* Abstract human / portal */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-[68%] w-[68%] rounded-t-full border border-[#19352c]/15">
                    <div className="absolute inset-[12%] rounded-t-full border border-[#c7542b]/25" />

                    <div className="absolute bottom-0 left-1/2 h-[72%] w-[34%] -translate-x-1/2 rounded-t-full bg-[#19352c]">
                      <div className="absolute left-1/2 top-[10%] h-[28%] w-[48%] -translate-x-1/2 rounded-full bg-[#19352c]" />
                    </div>

                    <div className="absolute bottom-[14%] left-1/2 h-px w-[70%] -translate-x-1/2 bg-[#c7542b]/40" />

                    <div className="absolute left-[18%] top-[28%] h-2 w-2 rounded-full bg-[#c7542b]" />
                    <div className="absolute right-[16%] top-[42%] h-1.5 w-1.5 rounded-full bg-[#19352c]/40" />
                    <div className="absolute left-[28%] top-[52%] h-1.5 w-1.5 rounded-full bg-[#19352c]/30" />
                  </div>
                </div>

                {/* Bottom information */}
                <div className="absolute bottom-0 left-0 right-0 border-t border-[#19352c]/10 bg-[#f8f1e6]/80 p-6 backdrop-blur-sm">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#19352c]/40">
                        Your subject
                      </p>

                      <p className="mt-2 font-serif text-2xl">
                        {participant || "Participant"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#19352c]/40">
                        Status
                      </p>

                      <div className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em]">
                        <span className="h-2 w-2 rounded-full bg-[#5f7f65]" />
                        Ready
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.25em] text-[#19352c]/35">
                The most important experiment is you.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col gap-3 border-t border-[#19352c]/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#19352c]/35">
            ARISE Human Behaviour Lab
          </p>

          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#19352c]/35">
            2026 / Mumbai
          </p>
        </footer>
      </div>
    </main>
  );
}