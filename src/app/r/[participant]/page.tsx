"use client";

export default function LegacyParticipantRedirectPage() {
  return (
    <main className="min-h-screen bg-[#f8f1e6] flex items-center justify-center px-6">
      <div className="max-w-md text-center text-[#19352c]">
        <h1 className="font-serif text-3xl">
          Secure pass required
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-[#19352c]/65">
          Participant ID links are no longer accepted.
          Please use your personal secure Prerna pass or contact
          the event administrator.
        </p>
      </div>
    </main>
  );
}