"use client";

import { QRCodeSVG } from "qrcode.react";

type ParticipantCardProps = {
  name?: string;
  subjectId?: string;
};

export default function ParticipantCard({
  name = "ALEX",
  subjectId = "HE-001",
}: ParticipantCardProps) {
  const profileUrl = `https://arise.example/human/${subjectId}`;

  return (
    <div className="relative mx-auto w-full max-w-[430px]">
      {/* Card shadow */}
      <div className="absolute inset-0 translate-y-4 rounded-[22px] bg-[#19352c]/20 blur-2xl" />

      {/* ID CARD */}
      <div className="relative overflow-hidden rounded-[20px] border border-[#19352c]/15 bg-[#f4eee3] shadow-[0_25px_70px_rgba(25,53,44,0.16)]">
        
        {/* Top */}
        <div className="px-7 pb-6 pt-7 sm:px-8 sm:pt-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[22px] font-semibold tracking-[0.18em] text-[#19352c]">
                ARISE
              </p>

              <p className="mt-1 text-[8px] uppercase tracking-[0.28em] text-[#19352c]/50">
                × Human Experiment
              </p>

              <p className="mt-1 text-[7px] uppercase tracking-[0.25em] text-[#19352c]/35">
                A study in human behaviour
              </p>
            </div>

            <div className="text-right">
              <p className="text-[7px] uppercase tracking-[0.22em] text-[#19352c]/40">
                Participant
              </p>

              <p className="mt-1 font-mono text-sm font-bold text-[#c7542b]">
                {subjectId}
              </p>
            </div>
          </div>

          <div className="mt-7 border-t border-[#19352c]/15 pt-6">
            <p className="font-serif text-[2.8rem] leading-[0.9] tracking-[-0.055em] text-[#19352c] sm:text-[3.2rem]">
              HUMAN
            </p>

            <p className="font-serif text-[2.8rem] leading-[0.9] tracking-[-0.055em] text-[#19352c] sm:text-[3.2rem]">
              EXPERIMENT
            </p>
          </div>

          {/* Participant information */}
          <div className="mt-7 grid grid-cols-2 gap-6">
            <div>
              <p className="text-[7px] uppercase tracking-[0.25em] text-[#19352c]/40">
                Participant
              </p>

              <p className="mt-2 text-xl font-semibold tracking-wide text-[#19352c]">
                {name}
              </p>
            </div>

            <div>
              <p className="text-[7px] uppercase tracking-[0.25em] text-[#19352c]/40">
                Subject ID
              </p>

              <p className="mt-2 font-mono text-xl font-bold tracking-wide text-[#c7542b]">
                {subjectId}
              </p>
            </div>
          </div>
        </div>

        {/* QR SECTION */}
        <div className="mx-5 mb-5 rounded-[16px] bg-[#19352c] px-5 py-6 sm:mx-6 sm:mb-6">
          <div className="flex justify-center">
            <div className="rounded-[12px] bg-[#f4eee3] p-4">
              <QRCodeSVG
                value={profileUrl}
                size={210}
                bgColor="#f4eee3"
                fgColor="#19352c"
                level="H"
                includeMargin={false}
              />
            </div>
          </div>

          <p className="mt-4 text-center text-[9px] font-bold uppercase tracking-[0.3em] text-[#f4eee3]">
            Scan to connect
          </p>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between px-7 pb-7 text-[7px] uppercase tracking-[0.24em] text-[#19352c]/35">
          <span>ARISE</span>
          <span>Human Behaviour Lab</span>
          <span>2026</span>
        </div>
      </div>
    </div>
  );
}