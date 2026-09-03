"use client";

import { Bell, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export function InterestForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(!compact);

  async function submitInterest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("full_name")),
      whatsapp_number: String(form.get("whatsapp_number")),
      congregation: String(form.get("congregation"))
    };

    if (!isSupabaseConfigured || !supabase) {
      setStatus("error");
      setMessage("Supabase is not connected yet. Add your project keys in .env.local to collect interest list submissions.");
      return;
    }

    const { error } = await supabase
  .from("interest_list")
  .insert(payload);
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("success");
    setMessage("Thank you. You'll be among the first to receive ARISE #3 updates and registration announcements.");
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={submitInterest} className={`glass relative grid overflow-hidden rounded-3xl border-white/10 ${compact ? "gap-3 p-4 md:gap-4 md:p-5" : "gap-5 p-5 sm:p-7 md:gap-6 md:p-10"}`}>
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-aureate/10 blur-3xl" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-aureate md:text-sm md:tracking-[0.28em]">Registrations Opening Soon</p>
        <h2 className={`${compact ? "mt-2 text-2xl md:text-3xl" : "mt-4 text-3xl md:text-5xl"} font-display font-semibold leading-tight text-white`}>Join the interest list</h2>
        <p className={`${compact ? "mt-2 text-sm leading-6 md:hidden" : "mt-4 text-lg leading-8"} text-white/62`}>Be notified first when ARISE #3 registrations open.</p>
      </div>

      {compact && !isExpanded ? (
        <button type="button" onClick={() => setIsExpanded(true)} className="relative mt-1 inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl bg-aureate px-5 py-3 text-base font-bold text-midnight shadow-glow transition active:scale-[0.98]">
          Join Interest List
        </button>
      ) : null}

      <AnimatePresence initial={false}>
        {(isExpanded || !compact) ? (
          <motion.div
            initial={compact ? { opacity: 0, height: 0, y: -8 } : false}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="relative grid gap-3 overflow-hidden md:gap-4"
          >
            <label className="relative grid gap-3 text-base font-semibold text-white/82">
              Full Name
              <input required name="full_name" minLength={2} className="h-[52px] min-w-0 rounded-2xl border border-white/10 bg-white/[0.07] px-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-aureate focus:bg-white/[0.1] focus:shadow-glow md:h-16 md:px-5 md:text-lg" />
            </label>
            <label className="relative grid gap-3 text-base font-semibold text-white/82">
              WhatsApp Number
              <input required name="whatsapp_number" type="tel" pattern="[0-9]{8,20}" className="h-[52px] min-w-0 rounded-2xl border border-white/10 bg-white/[0.07] px-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-aureate focus:bg-white/[0.1] focus:shadow-glow md:h-16 md:px-5 md:text-lg" />
            </label>
            <label className="relative grid gap-3 text-base font-semibold text-white/82">
              Congregation
              <input required name="congregation" className="h-[52px] min-w-0 rounded-2xl border border-white/10 bg-white/[0.07] px-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-aureate focus:bg-white/[0.1] focus:shadow-glow md:h-16 md:px-5 md:text-lg" />
            </label>
            <button disabled={status === "loading"} className="relative mt-1 inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl bg-aureate px-5 py-3 text-base font-bold text-midnight shadow-glow transition hover:-translate-y-0.5 hover:bg-white active:scale-[0.98] disabled:opacity-70 md:mt-2 md:min-h-[64px] md:px-6 md:py-4 md:text-lg">
              {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Bell className="h-5 w-5" />}
              Notify Me
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {message ? <p className={`relative rounded-xl border border-white/10 bg-white/[0.04] p-4 text-base ${status === "error" ? "text-red-300" : "text-aureate"}`}>{message}</p> : null}
    </form>
  );
}
