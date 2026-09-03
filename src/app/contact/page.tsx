import { Section } from "@/components/Section";
import { SitePage } from "@/components/SiteShell";
import { eventDetails } from "@/lib/site-content";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <SitePage>
      <Section eyebrow="Contact" title="Get in Touch with the ARISE Team.">
     
   <div className="glass rounded-3xl p-6 md:p-8">

  <div className="grid gap-5 md:grid-cols-2">

    {/* Email */}

    <a
      href="mailto:arise.youth.mumbai@gmail.com"
      className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-aureate/40 hover:bg-white/[0.05]"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-aureate/20 bg-aureate/10 text-aureate">
        <Mail className="h-7 w-7" />
      </div>

      <p className="text-xs uppercase tracking-[0.24em] text-aureate">
        Email
      </p>

      <p className="mt-3 text-lg font-semibold text-white break-all">
        arise.youth.mumbai@gmail.com
      </p>
    </a>

    {/* Coordinator */}

    <a
      href="tel:+919892747669"
      className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-aureate/40 hover:bg-white/[0.05]"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-aureate/20 bg-aureate/10 text-aureate">
        <Phone className="h-7 w-7" />
      </div>

      <p className="text-xs uppercase tracking-[0.24em] text-aureate">
        Coordinator
      </p>

      <p className="mt-3 text-xl font-display text-white">
        Richard Michael
      </p>

      <p className="mt-1 text-white/70">
        +91 98927 47669
      </p>
    </a>

    {/* Venue */}

    <a
      href="https://maps.google.com"
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-aureate/40 hover:bg-white/[0.05]"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-aureate/20 bg-aureate/10 text-aureate">
        <MapPin className="h-7 w-7" />
      </div>

      <p className="text-xs uppercase tracking-[0.24em] text-aureate">
        Venue
      </p>

      <p className="mt-3 text-xl font-display text-white">
        Dharavi Church of Christ
      </p>

      <p className="mt-1 text-white/70">
        Mumbai, Maharashtra
      </p>
    </a>

    {/* WhatsApp */}

    <a
      href="https://chat.whatsapp.com/HLVIu9Vf5pk0yORFBiPJNJ"
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-aureate/40 hover:bg-white/[0.05]"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366]/20 text-[#25D366]">
        <MessageCircle className="h-7 w-7" />
      </div>

      <p className="text-xs uppercase tracking-[0.24em] text-[#25D366]">
        Arise Whatsapp Group 
      </p>

      <p className="mt-3 text-xl font-display text-white">
        Join by Clicking
      </p>

      <p className="mt-2 leading-7 text-white/70">
        Receive announcements, reminders and event updates.
      </p>
    </a>

  </div>

</div>
</Section>
</SitePage>
  )
}