"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  children
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative px-4 py-10 sm:px-6 md:px-8 md:py-16 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
          className="mb-6 max-w-3xl md:mb-9"
        >
          {eyebrow ? <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-aureate md:tracking-[0.28em]">{eyebrow}</p> : null}
          <h2 className="font-display text-3xl font-semibold leading-tight text-white md:text-5xl">{title}</h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}
