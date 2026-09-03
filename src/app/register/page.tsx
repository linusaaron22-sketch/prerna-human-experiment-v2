import { CalendarDays, MapPin, Sparkles } from "lucide-react";
import { InterestForm } from "@/components/InterestForm";
import { RegistrationForm } from "@/components/RegistrationForm";
import { SitePage } from "@/components/SiteShell";
import { REGISTRATION_OPEN } from "@/lib/feature-flags";
import { eventDetails } from "@/lib/site-content";

export default function RegisterPage() {
  return (
    <SitePage>
      <section className="relative px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:px-12">
        <div className="absolute left-0 top-12 h-80 w-80 rounded-full bg-aureate/10 blur-3xl" />
        <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-violet/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-6">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:pb-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-aureate/30 bg-aureate/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-aureate shadow-glow md:mb-4 md:gap-3 md:px-4 md:tracking-[0.22em]">
                <Sparkles className="h-4 w-4" /> Registrations
                </div>
                <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                  ARISE #3 Registration
                </h1>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[460px]">
                <div className="flex items-center gap-4 rounded-2xl border border-aureate/30 bg-aureate/10 px-4 py-3 shadow-glow md:px-5 md:py-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-aureate/15 text-aureate">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-aureate">Event Date</p>
                    <p className="mt-2 font-display text-3xl font-semibold leading-none text-white">5 September</p>
                    <p className="mt-1 text-sm text-white/55">2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 md:px-5 md:py-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-aureate">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-white/45">Location</p>
                    <p className="mt-2 font-semibold text-white">{eventDetails.city}</p>
                    <p className="mt-1 text-sm text-aureate">{REGISTRATION_OPEN ? "Registration Open" : "Opening Soon"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            {REGISTRATION_OPEN ? <RegistrationForm /> : <InterestForm />}
          </div>
        </div>
      </section>
    </SitePage>
  );
}
