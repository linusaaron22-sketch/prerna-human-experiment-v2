"use client";

import { ArrowLeft, ClipboardList, Mail, MapPin, Phone, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { Registration } from "@/types/arise";

export default function ParticipantProfile() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [participant, setParticipant] = useState<Registration | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadParticipant() {
      if (!supabase || !isSupabaseConfigured) {
        router.replace("/admin/login");
        return;
      }
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        router.replace("/admin/login");
        return;
      }
      const { data } = await supabase.from("registrations").select("*").eq("id", params.id).single();
      if (data) setParticipant(data as Registration);
    }
    loadParticipant();
  }, [params.id, router]);

  async function save() {
    if (!participant) return;
    setSaved(false);
    if (supabase && isSupabaseConfigured) {
      await supabase.from("registrations").update({
        coordinator: participant.coordinator,
        notes: participant.notes,
        attendance_status: participant.attendance_status,
        registration_status: participant.registration_status
      }).eq("id", participant.id);
    }
    setSaved(true);
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-midnight bg-gold-radial px-4 text-center sm:px-6">
        <div className="glass max-w-lg rounded-2xl p-5 md:p-7">
          <h1 className="font-display text-3xl md:text-4xl">Protected Admin Area</h1>
          <p className="mt-3 text-white/64">Connect Supabase and sign in through the admin login portal to view participant database records.</p>
          <Link href="/admin/login" className="mt-5 inline-block text-aureate">Go to login portal</Link>
        </div>
      </main>
    );
  }

  if (!participant) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-midnight px-4 text-center sm:px-6">
        <div>
          <h1 className="font-display text-4xl">Participant not found</h1>
          <Link href="/admin" className="mt-5 inline-block text-aureate">Return to dashboard</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-midnight bg-gold-radial px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin" className="inline-flex items-center gap-2 text-aureate">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <section className="mt-6 glass rounded-2xl p-4 sm:p-6 md:mt-8 md:p-8">
          <div className="flex flex-col gap-5 border-b border-white/10 pb-7 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-aureate">Participant Profile</p>
              <h1 className="mt-3 break-words font-display text-4xl font-semibold md:text-5xl">{participant.full_name}</h1>
              <p className="mt-3 text-white/60">{participant.congregation}</p>
            </div>
            <button onClick={save} className="inline-flex items-center justify-center gap-2 rounded-lg bg-aureate px-5 py-3 font-semibold text-midnight transition hover:bg-white">
              <Save className="h-4 w-4" /> Save
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:mt-7 md:grid-cols-3">
            <Info icon={<Mail />} label="Email" value={participant.email} />
            <Info icon={<Phone />} label="WhatsApp" value={participant.whatsapp_number} />
            <Info icon={<MapPin />} label="Location" value={`${participant.city}, ${participant.state}`} />
          </div>

          <div className="mt-6 grid gap-4 md:mt-7 md:grid-cols-2 md:gap-5">
            <label className="grid gap-2 text-sm text-white/70">
              Attendance Status
              <select value={participant.attendance_status} onChange={(event) => setParticipant({ ...participant, attendance_status: event.target.value as Registration["attendance_status"] })} className="h-12 rounded-lg border border-white/10 bg-midnight px-4 outline-none">
                <option value="pending">Pending</option>
                <option value="checked-in">Checked in</option>
                <option value="absent">Absent</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm text-white/70">
              Registration Status
              <select value={participant.registration_status || "waitlist"} onChange={(event) => setParticipant({ ...participant, registration_status: event.target.value as Registration["registration_status"] })} className="h-12 rounded-lg border border-white/10 bg-midnight px-4 outline-none">
                <option value="waitlist">Waitlist</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm text-white/70">
              Congregation Coordinator
              <input value={participant.coordinator || ""} onChange={(event) => setParticipant({ ...participant, coordinator: event.target.value })} className="h-12 rounded-lg border border-white/10 bg-white/[0.05] px-4 outline-none focus:border-aureate" />
            </label>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70">
              <ClipboardList className="mb-3 h-5 w-5 text-aureate" />
              Age {participant.age} - {participant.gender}<br />
              First-time attendee: {participant.first_time ? "Yes" : "No"}<br />
              Emergency: {participant.emergency_contact_name} - {participant.emergency_contact_number}<br />
              Food: {participant.food_preference}<br />
              Medical: {participant.medical_conditions || "None"}
            </div>
            <label className="grid gap-2 text-sm text-white/70 md:col-span-2">
              Notes
              <textarea value={participant.notes || ""} onChange={(event) => setParticipant({ ...participant, notes: event.target.value })} rows={6} className="rounded-lg border border-white/10 bg-white/[0.05] p-4 outline-none focus:border-aureate" />
            </label>
          </div>
          {saved ? <p className="mt-5 text-aureate">Profile updated.</p> : null}
        </section>
      </div>
    </main>
  );
}

function Info({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 text-aureate">{icon}</div>
      <p className="text-xs uppercase tracking-[0.24em] text-white/42">{label}</p>
      <p className="mt-2 break-words text-white/80">{value}</p>
    </div>
  );
}
