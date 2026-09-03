"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/Section";
import { SitePage } from "@/components/SiteShell";

export default function AboutPage() {
  return (
    <SitePage>
      <Section eyebrow="About Arise" title="Gathering Youth. Growing Faith. Inspiring Purpose">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Mission", "To bring young people together around God's Word, encouraging them to know Christ more deeply, build meaningful friendships, and live out their faith with conviction."],
            ["Vision", "To see a generation of youth rooted in Scripture, strengthened through fellowship, and equipped to shine for Christ in their homes, churches, campuses, and communities."],
            ["Why ARISE exists", "ARISE exists to encourage young people to grow closer to Christ, build meaningful friendships, and live out their faith with confidence and purpose."]
          ].map(([title, copy]) => (
            <motion.article key={title} whileHover={{ y: -6 }} className="glass rounded-2xl p-6">
              <h2 className="font-display text-2xl font-semibold text-aureate">{title}</h2>
              <p className="mt-4 leading-7 text-white/70">{copy}</p>
            </motion.article>
          ))}
        </div>
        <div className="mt-6 glass rounded-2xl p-7">
          <h2 className="font-display text-3xl font-semibold text-white">The ARISE Journey So Far</h2>
          <p className="mt-4 max-w-4x1 leading-8 text-white/70">
            Previous ARISE gatherings have brought together young people for a day of learning, fellowship, meaningful discussions, worship, and activities that encourage spiritual growth and lasting connections.
          </p>
        </div>
      </Section>
    </SitePage>
  );
}
