import { SitePage } from "@/components/SiteShell";
import { Section } from "@/components/Section";
import { archiveItems } from "@/lib/site-content";

export default function ArchivePage() {
  return (
    <SitePage>
      <Section eyebrow="Archive currently being updated" title="Previous Arise Journeys">
        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {archiveItems.map((event, index) => (
            <div key={event.title} className="glass overflow-hidden rounded-2xl">
              <div className="relative aspect-[16/10] border-b border-white/10 bg-gradient-to-br from-aureate/20 via-white/[0.04] to-violet/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(247,216,145,.32),transparent_30%),radial-gradient(circle_at_75%_70%,rgba(142,107,255,.24),transparent_35%)]" />
                <p className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-midnight/55 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70 backdrop-blur">
                  Photo placeholder
                </p>
              </div>
              <div className="p-5 md:p-6">
                <p className="font-display text-2xl font-semibold text-aureate md:text-3xl">{event.title}</p>
                <div className="mt-4 grid gap-3 text-sm md:mt-5">
                  <p className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-white/70">Theme: {event.theme}</p>
                  <p className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-white/70">Key verse: {event.verse}</p>
                </div>
                <p className="mt-4 leading-7 text-white/64 md:mt-5">{event.description}</p>
                <p className="mt-5 text-xs uppercase tracking-[0.22em] text-white/40 md:mt-6 md:text-sm md:tracking-[0.24em]">Archive {index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </SitePage>
  );
}
