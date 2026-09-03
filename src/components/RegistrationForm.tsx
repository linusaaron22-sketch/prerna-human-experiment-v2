"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Languages, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const fields = [
  ["full_name", "text"],
  ["date_of_birth", "date"],
  ["age", "number"],
  ["congregation", "text"],
  ["city", "text"],
  ["state", "text"],
  ["whatsapp_number", "tel"],
  ["email", "email"],
  ["emergency_contact_name", "text"],
  ["emergency_contact_number", "tel"],
  ["medical_conditions", "text"],
  ["guardian_name", "text"],
  ["guardian_contact_number", "tel"],
  ["heard_about_arise", "text"]
] as const;

const optionalFields = new Set(["medical_conditions", "guardian_name", "guardian_contact_number"]);

type Language = "en" | "hi";

const labels: Record<Language, Record<string, string>> = {
  en: {
    eyebrow: "ARISE #3 Registration",
    title: "Participant Details",
    introTitle: "Secure registration",
    introBody: "We're excited to have you at ARISE! Your details help us prepare a meaningful, safe, and well-organized experience for everyone.",
    full_name: "Full Name",
    date_of_birth: "Date of Birth",
    age: "Age",
    congregation: "Congregation",
    city: "City",
    state: "State",
    whatsapp_number: "WhatsApp Number",
    email: "Email Address",
    emergency_contact_name: "Emergency Contact Name",
    emergency_contact_number: "Emergency Contact Number",
    medical_conditions: "Medical Conditions / Allergies",
    guardian_name: "Parent / Guardian Name",
    guardian_contact_number: "Parent / Guardian Contact Number",
    heard_about_arise: "How Did You Hear About ARISE?",
    gender: "Gender",
    female: "Female",
    male: "Male",
    prefer_not: "Prefer not to say",
    food: "Food Preference",
    veg: "Veg",
    non_veg: "Non-Veg",
    first_time: "First-time attendee?",
    yes: "Yes",
    no: "No",
    guardianNote: "Parent / guardian details are required because the participant is under 18.",
    additional_notes: "Additional Notes",
    submit: "Submit Registration"
  },
  hi: {}
};

labels.hi = {
  eyebrow: "अराइज #3 रजिस्ट्रेशन",
  title: "प्रतिभागी की जानकारी",
  introTitle: "सुरक्षित रजिस्ट्रेशन",
  introBody: "हम ARISE में आपका स्वागत करने के लिए उत्साहित हैं! आपकी जानकारी से हमें सभी के लिए एक अर्थपूर्ण, सुरक्षित और सुव्यवस्थित अनुभव तैयार करने में मदद मिलती है.",
  full_name: "पूरा नाम",
  date_of_birth: "जन्म तिथि",
  age: "उम्र",
  congregation: "कलीसिया / मंडली",
  city: "शहर",
  state: "राज्य",
  whatsapp_number: "व्हाट्सऐप नंबर",
  email: "ईमेल पता",
  emergency_contact_name: "आपातकालीन संपर्क नाम",
  emergency_contact_number: "आपातकालीन संपर्क नंबर",
  medical_conditions: "मेडिकल कंडीशन / एलर्जी",
  guardian_name: "माता-पिता / अभिभावक का नाम",
  guardian_contact_number: "माता-पिता / अभिभावक का संपर्क नंबर",
  heard_about_arise: "आपने ARISE के बारे में कैसे सुना?",
  gender: "लिंग",
  female: "महिला",
  male: "पुरुष",
  prefer_not: "नहीं बताना चाहते",
  food: "भोजन पसंद",
  veg: "शाकाहारी",
  non_veg: "मांसाहारी",
  first_time: "क्या आप पहली बार ARISE में आ रहे हैं?",
  yes: "हाँ",
  no: "नहीं",
  guardianNote: "प्रतिभागी 18 वर्ष से कम है, इसलिए माता-पिता / अभिभावक की जानकारी आवश्यक है.",
  additional_notes: "अतिरिक्त नोट्स",
  submit: "रजिस्ट्रेशन सबमिट करें"
};

export function RegistrationForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [ageValue, setAgeValue] = useState("");
  const copy = labels[language];
  const isUnder18 = Number(ageValue) > 0 && Number(ageValue) < 18;
  const visibleFields = fields.filter(([name]) => {
    if (name.startsWith("guardian_")) return isUnder18;
    if (isUnder18 && name.startsWith("emergency_contact_")) return false;
    return true;
  });
  const devanagariClass = language === "hi" ? "font-devanagari [word-break:break-word]" : "";
  const titleClass = language === "hi" ? "text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl" : "text-4xl leading-[0.95] sm:text-5xl md:text-7xl lg:text-8xl";
  const fieldLabelClass = language === "hi" ? "text-sm leading-6 sm:text-base md:text-lg" : "text-base md:text-xl";

  async function submitRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      full_name: String(form.get("full_name")),
      date_of_birth: String(form.get("date_of_birth")),
      age: Number(form.get("age")),
      gender: String(form.get("gender")),
      congregation: String(form.get("congregation")),
      city: String(form.get("city")),
      state: String(form.get("state")),
      whatsapp_number: String(form.get("whatsapp_number")),
      email: String(form.get("email")),
      emergency_contact_name: String(form.get("emergency_contact_name") || ""),
      emergency_contact_number: String(form.get("emergency_contact_number") || ""),
      food_preference: String(form.get("food_preference")),
      first_time: form.get("first_time") === "yes",
      registration_status: "waitlist",
      medical_conditions: String(form.get("medical_conditions") || ""),
      guardian_name: String(form.get("guardian_name") || ""),
      guardian_contact_number: String(form.get("guardian_contact_number") || ""),
      heard_about_arise: String(form.get("heard_about_arise")),
      additional_notes: String(form.get("additional_notes") || "")
    };

    if (!isSupabaseConfigured || !supabase) {
      setStatus("error");
      setMessage("Supabase is not connected yet. Add your project keys in .env.local to activate registrations.");
      return;
    }

    const { data, error } = await supabase.from("registrations").insert(payload).select("id, full_name").single();
    if (error) {
      setStatus("error");
      setMessage(error.code === "23505" ? "This email address has already been registered." : error.message);
      return;
    }

    setStatus("success");
    router.push(`/register/success?id=${data.id}&name=${encodeURIComponent(data.full_name)}`);
  }

  return (
    <motion.form
      onSubmit={submitRegistration}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass relative grid gap-6 overflow-hidden rounded-2xl border-aureate/20 p-4 shadow-glow sm:p-6 md:gap-9 md:p-8 lg:p-10 ${devanagariClass}`}
    >
      <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-aureate/10 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-violet/10 blur-3xl" />
      <div className="absolute left-10 top-36 h-px w-40 bg-gradient-to-r from-aureate/70 to-transparent" />

      <div className="relative flex flex-col gap-4 border-b border-aureate/20 pb-5 md:pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-aureate md:text-base md:tracking-[0.3em]">{copy.eyebrow}</p>
          <h2 className={`mt-3 break-words font-display font-semibold text-white ${titleClass}`}>{copy.title}</h2>
        </div>
        <div className="w-full max-w-md rounded-2xl border border-aureate/25 bg-aureate/10 p-4 shadow-glow md:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-aureate">
              <ShieldCheck className="h-5 w-5 shrink-0" />
              <p className="font-semibold">{copy.introTitle}</p>
            </div>
            <Languages className="h-5 w-5 shrink-0 text-white/45" />
          </div>
          <p className="text-sm leading-6 text-white/68 md:leading-7">{copy.introBody}</p>
          <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-midnight/40">
            <button type="button" onClick={() => setLanguage("en")} className={`px-4 py-3 text-sm font-semibold transition ${language === "en" ? "bg-aureate text-midnight" : "text-white/70 hover:text-aureate"}`}>
              English
            </button>
            <button type="button" onClick={() => setLanguage("hi")} className={`px-4 py-3 text-sm font-semibold transition ${language === "hi" ? "bg-aureate text-midnight" : "text-white/70 hover:text-aureate"}`}>
              हिंदी
            </button>
          </div>
        </div>
      </div>

      <div className="relative grid gap-x-7 gap-y-5 md:gap-y-8 lg:grid-cols-2">
        {visibleFields.map(([name, type]) => (
          <label key={name} className={`grid min-w-0 gap-3 font-semibold text-white/90 ${fieldLabelClass}`}>
            <span className="break-words">{copy[name]}</span>
            <input
              required={isUnder18 && name.startsWith("guardian_") ? true : !optionalFields.has(name)}
              {...(name === "age" ? { min: 10, max: 120 } : {})}
              name={name}
              type={type}
              onChange={name === "age" ? (event) => setAgeValue(event.target.value) : undefined}
              className="h-[56px] min-w-0 rounded-2xl border border-white/15 bg-white/[0.085] px-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-aureate focus:bg-white/[0.12] focus:shadow-glow md:h-[72px] md:px-6 md:text-xl"
            />
          </label>
        ))}

        {isUnder18 ? (
          <div className="rounded-2xl border border-aureate/25 bg-aureate/10 p-5 text-aureate lg:col-span-2">
            {copy.guardianNote}
          </div>
        ) : null}

        <label className={`grid gap-3 font-semibold text-white/90 ${fieldLabelClass}`}>
          <span className="break-words">{copy.gender}</span>
          <select name="gender" required className="h-[56px] min-w-0 rounded-2xl border border-white/15 bg-midnight px-4 text-base text-white outline-none transition focus:border-aureate focus:shadow-glow md:h-[72px] md:px-6 md:text-xl">
            <option value="Female">{copy.female}</option>
            <option value="Male">{copy.male}</option>
            <option value="Prefer not to say">{copy.prefer_not}</option>
          </select>
        </label>

        <label className={`grid gap-3 font-semibold text-white/90 ${fieldLabelClass}`}>
          <span className="break-words">{copy.food}</span>
          <select name="food_preference" required className="h-[56px] min-w-0 rounded-2xl border border-white/15 bg-midnight px-4 text-base text-white outline-none transition focus:border-aureate focus:shadow-glow md:h-[72px] md:px-6 md:text-xl">
            <option value="Veg">{copy.veg}</option>
            <option value="Non-Veg">{copy.non_veg}</option>
          </select>
        </label>

        <fieldset className={`grid gap-3 font-semibold text-white/90 lg:col-span-2 ${fieldLabelClass}`}>
          <legend className="break-words">{copy.first_time}</legend>
          <div className="grid overflow-hidden rounded-2xl border border-white/15 sm:grid-cols-2">
            <label className="flex min-h-[56px] cursor-pointer items-center justify-center gap-2 bg-white/[0.085] px-4 text-center text-base transition hover:bg-aureate/10 md:min-h-[72px] md:text-xl">
              <input required type="radio" name="first_time" value="yes" /> {copy.yes}
            </label>
            <label className="flex min-h-[56px] cursor-pointer items-center justify-center gap-2 bg-white/[0.045] px-4 text-center text-base transition hover:bg-aureate/10 md:min-h-[72px] md:text-xl">
              <input type="radio" name="first_time" value="no" /> {copy.no}
            </label>
          </div>
        </fieldset>
      </div>

      <label className={`relative grid gap-3 font-semibold text-white/90 ${fieldLabelClass}`}>
        <span className="break-words">{copy.additional_notes}</span>
        <textarea name="additional_notes" rows={4} className="min-w-0 rounded-2xl border border-white/15 bg-white/[0.085] p-4 text-base text-white outline-none transition focus:border-aureate focus:bg-white/[0.12] focus:shadow-glow md:p-6 md:text-xl" />
      </label>

      <button
        disabled={status === "loading"}
        className="relative inline-flex min-h-[56px] items-center justify-center gap-3 rounded-2xl bg-aureate px-5 py-4 text-base font-bold text-midnight shadow-glow transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-70 md:min-h-[66px] md:px-7 md:py-5 md:text-lg"
      >
        {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
        {copy.submit}
      </button>

      {message ? (
        <p className={`relative rounded-xl border border-white/10 bg-white/[0.04] p-4 text-base ${status === "error" ? "text-red-300" : "text-aureate"}`}>{message}</p>
      ) : null}
    </motion.form>
  );
}
