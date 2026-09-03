"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SitePage } from "@/components/SiteShell";

export default function RegistrationSuccessPage() {
  return (
    <Suspense>
      <RegistrationSuccessContent />
    </Suspense>
  );
}

function RegistrationSuccessContent() {
  const searchParams = useSearchParams();
  const participantName = searchParams.get("name") || "Participant";

  return (
    <SitePage>
      <section className="px-4 py-10 sm:px-6 md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-3xl glass rounded-3xl p-6 text-center md:p-10">

          <CheckCircle2 className="mx-auto h-16 w-16 text-aureate" />

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-aureate">
            Registration Received
          </p>

          <h1 className="mt-4 break-words font-display text-4xl font-semibold text-white md:text-5xl">
            Thank you, {participantName}
          </h1>

          <p className="mt-5 text-lg leading-8 text-white/70">
            Your registration has been received successfully.
          </p>

          {/* Status Card */}

          <div className="mt-10 rounded-2xl border border-aureate/20 bg-aureate/10 p-6 text-left">

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-aureate">
              Registration Status
            </p>

            <div className="mt-5 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-400 shadow-[0_0_14px_rgba(74,222,128,0.8)]" />
              <p className="font-display text-3xl font-semibold text-white">
                Confirmed
              </p>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-aureate">
                What Happens Next?
              </p>

              <div className="mt-5 space-y-5">

                <div className="flex items-start gap-3">
                  <div className="mt-2 h-2.5 w-2.5 rounded-full bg-aureate" />
                  <p className="leading-7 text-white/75">
                    You'll receive important event updates as they become available.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-2 h-2.5 w-2.5 rounded-full bg-aureate" />
                  <p className="leading-7 text-white/75">
                    Please keep an eye on our Arise Whatsapp group for announcements from the ARISE team.
                  </p>
                </div>

              </div>
            </div>

          </div>
        <p className="mx-auto mt-7 max-w-2xl leading-8 text-white/70">
  We are excited to welcome you to ARISE #3. Keep your heart ready for a meaningful time of faith, fellowship, and purpose.
</p>

          <Link
            href="/"
            className="mt-10 inline-flex rounded-full bg-aureate px-8 py-4 font-semibold text-midnight transition hover:scale-105"
          >
            Back to ARISE
          </Link>

        </div>
      </section>
    </SitePage>
  );
}