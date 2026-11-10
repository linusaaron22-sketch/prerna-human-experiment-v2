"use client";

import BibleReadingExperience from "@/components/human-experiment/BibleReadingExperience";
import { DEFAULT_SESSION } from "@/lib/human-experiment/session";

export default function ExperiencePreviewPage() {
  return (
    <BibleReadingExperience
      previewMode
      session={DEFAULT_SESSION}
    />
  );
}