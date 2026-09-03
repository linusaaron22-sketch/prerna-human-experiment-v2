import { CalendarDays } from "lucide-react";
import { Section } from "@/components/Section";
import { SitePage } from "@/components/SiteShell";

export default function SchedulePage() {
  return (
    <SitePage>
      <Section eyebrow="Schedule" title="Conference flow coming soon.">
        <div className="glass max-w-3xl rounded-2xl p-5 md:p-7">
          <CalendarDays className="mb-4 h-7 w-7 text-aureate md:mb-5 md:h-8 md:w-8" />
          <p className="text-base leading-7 text-white/72 md:text-lg md:leading-8">
            The ARISE #3 schedule is being prayerfully prepared. Session details, worship moments, activities, and gathering times will be shared closer to 5 September 2026.
          </p>
          <p className="mt-5 rounded-xl border border-aureate/20 bg-aureate/10 p-4 font-display text-xl text-aureate md:mt-6 md:p-5 md:text-2xl">
            Schedule announcement coming soon.
          </p>
        </div>
      </Section>
    </SitePage>
  );
}
