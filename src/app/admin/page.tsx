"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  CheckSquare,
  ClipboardCheck,
  Copy,
  Download,
  Edit3,
  FileDown,
  Filter,
  Hourglass,
  ListChecks,
  LogOut,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  Square,
  Trash2,
  UserRoundCheck,
  UsersRound,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { AttendanceStatus, Registration, RegistrationStatus } from "@/types/arise";

type SortMode = "newest" | "oldest" | "name-az" | "name-za";
type ActionView = "all" | "today" | "not-checked-in";
type FilterState = {
  gender: string;
  food: string;
  firstTime: string;
  registrationStatus: string;
  attendanceStatus: string;
  city: string;
  congregation: string;
};

const defaultFilters: FilterState = {
  gender: "all",
  food: "all",
  firstTime: "all",
  registrationStatus: "all",
  attendanceStatus: "all",
  city: "all",
  congregation: "all"
};

export default function AdminDashboard() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [selected, setSelected] = useState<Registration | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [actionView, setActionView] = useState<ActionView>("all");
  const [dashboardError, setDashboardError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function init() {
      if (!supabase || !isSupabaseConfigured) {
        setIsCheckingAuth(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/admin/login");
        return;
      }
      setIsCheckingAuth(false);
      await loadRegistrations();
    }
    init();
  }, [router]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  async function loadRegistrations() {
    if (!supabase) return;
    setIsLoadingRegistrations(true);
    setDashboardError("");
    const { data, error } = await supabase.from("registrations").select("*").order("created_at", { ascending: false });
    setIsLoadingRegistrations(false);
    if (error) {
      setDashboardError(error.message);
      setRegistrations([]);
      return;
    }
    setRegistrations((data || []) as Registration[]);
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  async function patchRegistration(id: string, patch: Partial<Registration>, message = "Registration updated") {
    if (!supabase) return;
    const { error } = await supabase.from("registrations").update(patch).eq("id", id);
    if (error) {
      setDashboardError(error.message);
      return;
    }
    setRegistrations((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    setSelected((current) => (current?.id === id ? { ...current, ...patch } : current));
    showToast(message);
  }

  async function deleteRegistration(id: string) {
    if (!supabase) return;
    if (!window.confirm("Delete this registration?")) return;
    const { error } = await supabase.from("registrations").delete().eq("id", id);
    if (error) {
      setDashboardError(error.message);
      return;
    }
    setRegistrations((current) => current.filter((item) => item.id !== id));
    setSelected(null);
    showToast("Registration deleted");
  }

  async function bulkPatchRegistrations(patch: Partial<Registration>, message: string) {
    if (!supabase || selectedIds.length === 0) return;
    const { error } = await supabase.from("registrations").update(patch).in("id", selectedIds);
    if (error) {
      setDashboardError(error.message);
      return;
    }
    setRegistrations((current) => current.map((item) => (selectedIds.includes(item.id) ? { ...item, ...patch } : item)));
    setSelectedIds([]);
    showToast(message);
  }

  async function bulkDeleteRegistrations() {
    if (!supabase || selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected registration${selectedIds.length === 1 ? "" : "s"}?`)) return;
    const { error } = await supabase.from("registrations").delete().in("id", selectedIds);
    if (error) {
      setDashboardError(error.message);
      return;
    }
    setRegistrations((current) => current.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setSelected(null);
    showToast("Selected registrations deleted");
  }

  async function saveNotes(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    await patchRegistration(selected.id, { notes: String(form.get("notes") || "") }, "Private notes saved");
  }

  const optionSets = useMemo(() => {
    const cities = Array.from(new Set(registrations.map((item) => item.city).filter(Boolean))).sort();
    const congregations = Array.from(new Set(registrations.map((item) => item.congregation).filter(Boolean))).sort();
    return { cities, congregations };
  }, [registrations]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      total: registrations.length,
      today: registrations.filter((item) => safeDate(item.created_at) === today).length,
      firstTime: registrations.filter((item) => item.first_time).length,
      confirmed: registrations.filter((item) => item.registration_status === "confirmed").length,
      waitlist: registrations.filter((item) => item.registration_status === "waitlist").length,
      checkedIn: registrations.filter((item) => item.attendance_status === "checked-in").length,
      notCheckedIn: registrations.filter((item) => item.attendance_status !== "checked-in").length
    };
  }, [registrations]);

  const filteredRegistrations = useMemo(() => {
    const result = registrations.filter((registration) => {
      const matchesSearch = [
        registration.full_name,
        registration.email,
        registration.whatsapp_number,
        registration.congregation,
        registration.city,
        registration.state
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      return (
        matchesSearch &&
        (actionView === "all" ||
          (actionView === "today" && safeDate(registration.created_at) === new Date().toDateString()) ||
          (actionView === "not-checked-in" && registration.attendance_status !== "checked-in")) &&
        (filters.gender === "all" || registration.gender === filters.gender) &&
        (filters.food === "all" || registration.food_preference === filters.food) &&
        (filters.firstTime === "all" || String(registration.first_time) === filters.firstTime) &&
        (filters.registrationStatus === "all" || registration.registration_status === filters.registrationStatus) &&
        (filters.attendanceStatus === "all" || registration.attendance_status === filters.attendanceStatus) &&
        (filters.city === "all" || registration.city === filters.city) &&
        (filters.congregation === "all" || registration.congregation === filters.congregation)
      );
    });

    return result.sort((a, b) => {
      if (sortMode === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortMode === "name-az") return a.full_name.localeCompare(b.full_name);
      if (sortMode === "name-za") return b.full_name.localeCompare(a.full_name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [registrations, search, filters, sortMode, actionView]);

  const selectedFilteredCount = filteredRegistrations.filter((item) => selectedIds.includes(item.id)).length;
  const allVisibleSelected = filteredRegistrations.length > 0 && selectedFilteredCount === filteredRegistrations.length;

  function toggleSelected(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function toggleAllVisible() {
    setSelectedIds((current) => {
      const visibleIds = filteredRegistrations.map((item) => item.id);
      if (allVisibleSelected) return current.filter((id) => !visibleIds.includes(id));
      return Array.from(new Set([...current, ...visibleIds]));
    });
  }

  function exportCsv() {
    const headers = ["Registration ID", "Name", "Email", "WhatsApp", "Gender", "Food", "Congregation", "City", "State", "Status", "Attendance", "Notes"];
    const rows = filteredRegistrations.map((item) => [
      item.id,
      item.full_name,
      item.email,
      item.whatsapp_number,
      item.gender,
      item.food_preference,
      item.congregation,
      item.city,
      item.state,
      item.registration_status,
      item.attendance_status,
      item.notes || ""
    ]);
    downloadText("arise-registrations.csv", [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n"));
    showToast("CSV exported");
  }

  function downloadBadges() {
    const badges = filteredRegistrations.map((item) => `${item.full_name}\n${item.congregation}\nARISE #3`).join("\n\n---\n\n");
    downloadText("arise-name-badges.txt", badges);
    showToast("Name badge list downloaded");
  }

  function exportFilteredResults() {
    exportCsv();
  }

  async function copyWhatsAppNumbers() {
    const numbers = filteredRegistrations.map((item) => item.whatsapp_number).filter(Boolean).join(", ");
    if (!numbers) return;
    await navigator.clipboard.writeText(numbers);
    showToast("WhatsApp numbers copied");
  }

  function printSelectedParticipants() {
    const list = registrations.filter((item) => selectedIds.includes(item.id));
    if (list.length === 0) return;
    printParticipants(list);
    showToast("Selected participant list opened");
  }

  function setQuickFilter(nextFilters: Partial<FilterState>, nextActionView: ActionView = "all") {
    setFilters({ ...defaultFilters, ...nextFilters });
    setActionView(nextActionView);
    setSelectedIds([]);
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-midnight bg-gold-radial px-4 sm:px-6">
        <div className="glass w-full max-w-lg rounded-2xl p-5 text-center md:p-7">
          <h1 className="font-display text-3xl font-semibold md:text-4xl">Connect Supabase</h1>
          <p className="mt-3 leading-7 text-white/64">Admin database access requires Supabase URL and anon key in `.env.local`.</p>
          <Link href="/admin/login" className="mt-6 inline-flex rounded-lg bg-aureate px-5 py-3 font-semibold text-midnight">Go to Login Portal</Link>
        </div>
      </main>
    );
  }

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-midnight bg-gold-radial px-4 sm:px-6">
        <AdminSkeleton />
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-midnight bg-violet-radial px-4 py-5 print:bg-white print:text-black sm:px-6 md:px-8 md:py-6 lg:px-12">
      <AnimatePresence>
        {toast ? (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="fixed inset-x-4 top-4 z-[60] rounded-xl border border-aureate/30 bg-midnight/90 px-4 py-3 text-sm text-aureate shadow-glow backdrop-blur sm:left-auto sm:right-5 sm:w-auto md:px-5 md:text-base">
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 print:hidden md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-sm text-aureate">Back to site</Link>
            <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">ARISE Admin</h1>
            <p className="mt-2 text-base text-white/62">Premium conference registration management.</p>
          </div>
          <button onClick={signOut} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/12 px-3 py-3 text-white/80 transition hover:border-aureate hover:text-aureate">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </header>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 md:mt-8 md:gap-4 lg:grid-cols-5 print:hidden">
          <StatCard icon={<UsersRound />} label="Total Registrations" value={stats.total} subtitle="All submissions" />
          <StatCard icon={<ShieldCheck />} label="Confirmed Registrations" value={stats.confirmed} subtitle="Approved attendees" />
          <StatCard icon={<Hourglass />} label="Waitlist Count" value={stats.waitlist} subtitle="Awaiting confirmation" />
          <StatCard icon={<BadgeCheck />} label="Checked-In Count" value={stats.checkedIn} subtitle="Arrived at venue" />
          <StatCard icon={<UserRoundCheck />} label="First-Time Visitors" value={stats.firstTime} subtitle="New to ARISE" />
        </section>

        <section className="mt-6 print:hidden">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-aureate">Action Center</p>
              <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">Focus the list instantly</h2>
            </div>
            <button onClick={() => setQuickFilter({})} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/60 transition hover:border-aureate hover:text-aureate">
              Clear focus
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
            <ActionCenterCard icon={<ListChecks />} title="Registrations needing confirmation" value={stats.waitlist} subtitle="Review waitlisted participants" onClick={() => setQuickFilter({ registrationStatus: "waitlist" })} />
            <ActionCenterCard icon={<Hourglass />} title="Waitlisted participants" value={stats.waitlist} subtitle="Move approved guests to confirmed" onClick={() => setQuickFilter({ registrationStatus: "waitlist" })} />
            <ActionCenterCard icon={<ClipboardCheck />} title="Participants not checked in" value={stats.notCheckedIn} subtitle="Pending or absent attendance" onClick={() => setQuickFilter({}, "not-checked-in")} />
            <ActionCenterCard icon={<CalendarDays />} title="Today's registrations" value={stats.today} subtitle="Newest submissions today" onClick={() => setQuickFilter({}, "today")} />
          </div>
        </section>

        <section className="sticky top-3 z-30 mt-5 glass rounded-2xl p-4 shadow-violet backdrop-blur-xl md:top-4 md:mt-6 md:p-5 print:hidden">
          {dashboardError ? <div className="mb-4 rounded-xl border border-red-300/30 bg-red-500/10 p-4 text-red-200">{dashboardError}</div> : null}
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto] lg:items-center">
            <div className="flex min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3">
              <Search className="h-4 w-4 text-white/45" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone, city" className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none md:text-base" />
            </div>
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} className="h-11 rounded-lg border border-white/10 bg-midnight px-3 outline-none">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-az">Name A-Z</option>
              <option value="name-za">Name Z-A</option>
            </select>
            <button onClick={loadRegistrations} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 font-semibold text-white/75 transition hover:border-aureate hover:text-aureate">
              <RefreshCw className={`h-4 w-4 ${isLoadingRegistrations ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button onClick={() => setShowAdvancedFilters((value) => !value)} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-aureate/25 bg-aureate/10 px-4 font-semibold text-aureate transition hover:bg-aureate hover:text-midnight">
              <Filter className="h-4 w-4" /> Advanced Filters
            </button>
            <button onClick={() => { setFilters(defaultFilters); setActionView("all"); setSelectedIds([]); }} className="h-11 rounded-lg border border-white/10 px-4 font-semibold text-white/75 transition hover:border-aureate hover:text-aureate">
              Reset
            </button>
          </div>

          <AnimatePresence>
            {showAdvancedFilters ? (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <FilterSelect label="Gender" value={filters.gender} onChange={(value) => setFilters({ ...filters, gender: value })} options={["Female", "Male", "Prefer not to say"]} />
                  <FilterSelect label="Food" value={filters.food} onChange={(value) => setFilters({ ...filters, food: value })} options={["Veg", "Non-Veg"]} />
                  <FilterSelect label="First Time" value={filters.firstTime} onChange={(value) => setFilters({ ...filters, firstTime: value })} options={[["true", "First Time"], ["false", "Returning"]]} />
                  <FilterSelect label="Registration Status" value={filters.registrationStatus} onChange={(value) => setFilters({ ...filters, registrationStatus: value })} options={["confirmed", "waitlist", "cancelled"]} />
                  <FilterSelect label="Attendance Status" value={filters.attendanceStatus} onChange={(value) => setFilters({ ...filters, attendanceStatus: value })} options={["pending", "checked-in", "absent"]} />
                  <FilterSelect label="City" value={filters.city} onChange={(value) => setFilters({ ...filters, city: value })} options={optionSets.cities} />
                  <FilterSelect label="Congregation" value={filters.congregation} onChange={(value) => setFilters({ ...filters, congregation: value })} options={optionSets.congregations} />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
            <button onClick={toggleAllVisible} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 font-semibold text-white/75 transition hover:border-aureate hover:text-aureate sm:w-auto">
              {allVisibleSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />} Select visible
            </button>
            <ActionButton onClick={() => bulkPatchRegistrations({ registration_status: "confirmed" }, "Selected participants confirmed")} icon={<Check className="h-4 w-4" />} label="Bulk Confirm" disabled={selectedIds.length === 0} />
            <ActionButton onClick={() => bulkPatchRegistrations({ attendance_status: "checked-in" }, "Selected participants checked in")} icon={<BadgeCheck className="h-4 w-4" />} label="Bulk Check-In" disabled={selectedIds.length === 0} />
            <ActionButton onClick={bulkDeleteRegistrations} icon={<Trash2 className="h-4 w-4" />} label="Bulk Delete" disabled={selectedIds.length === 0} />
            <ActionButton onClick={printSelectedParticipants} icon={<Printer className="h-4 w-4" />} label="Print Selected" disabled={selectedIds.length === 0} />
            <ActionButton onClick={exportFilteredResults} icon={<Download className="h-4 w-4" />} label="Export Filtered" />
            <ActionButton onClick={copyWhatsAppNumbers} icon={<Copy className="h-4 w-4" />} label="Copy WhatsApp Numbers" />
            <ActionButton onClick={downloadBadges} icon={<FileDown className="h-4 w-4" />} label="Download Name Badges" />
            <span className="text-center text-sm text-white/45 sm:ml-auto sm:text-left">{filteredRegistrations.length} shown · {selectedIds.length} selected</span>
          </div>
        </section>

        <section className="mt-6 grid gap-3 print:mt-0">
          {isLoadingRegistrations ? <AdminSkeleton /> : null}
          {!isLoadingRegistrations && filteredRegistrations.length === 0 ? <EmptyState /> : null}
          {!isLoadingRegistrations && filteredRegistrations.map((participant, index) => (
            <motion.article
              key={participant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.025 }}
              className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition hover:border-aureate/30 hover:bg-white/[0.065] print:border-neutral-300 print:bg-white lg:grid-cols-[auto_1fr_.9fr_auto] lg:items-center"
            >
              <label className="justify-self-start print:hidden">
                <input checked={selectedIds.includes(participant.id)} onChange={() => toggleSelected(participant.id)} type="checkbox" className="sr-only" />
                <span className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/45 transition hover:border-aureate hover:text-aureate">
                  {selectedIds.includes(participant.id) ? <CheckSquare className="h-5 w-5 text-aureate" /> : <Square className="h-5 w-5" />}
                </span>
              </label>
              <button onClick={() => setSelected(participant)} className="min-w-0 text-left">
                <p className="break-words text-lg font-semibold md:text-xl">{participant.full_name}</p>
                <p className="mt-1 break-words text-sm text-white/55 print:text-neutral-600">{participant.email} - {participant.whatsapp_number}</p>
                <p className="mt-1 text-xs text-white/38 print:text-neutral-500">Age {participant.age} - {participant.gender} - {participant.food_preference}</p>
              </button>
              <p className="text-sm text-white/70 print:text-neutral-700">{participant.congregation}<br />{participant.city}, {participant.state}</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <StatusBadge type={participant.registration_status} />
                <StatusBadge type={participant.attendance_status} />
                {participant.first_time ? <StatusBadge type="first-time" /> : null}
                <p className="text-white/55 print:text-neutral-600">{formatDate(participant.created_at)}</p>
              </div>
              <div className="flex flex-wrap justify-start gap-2 print:hidden lg:justify-end">
                <MiniButton label="Confirm" icon={<Check className="h-3.5 w-3.5" />} onClick={() => patchRegistration(participant.id, { registration_status: "confirmed" }, "Participant confirmed")} />
                <MiniButton label="Waitlist" icon={<Hourglass className="h-3.5 w-3.5" />} onClick={() => patchRegistration(participant.id, { registration_status: "waitlist" }, "Participant moved to waitlist")} />
                <MiniButton label="Check In" icon={<BadgeCheck className="h-3.5 w-3.5" />} onClick={() => patchRegistration(participant.id, { attendance_status: "checked-in" }, "Marked checked-in")} />
                <MiniButton label="Edit" icon={<Edit3 className="h-3.5 w-3.5" />} onClick={() => setSelected(participant)} />
                <button onClick={() => deleteRegistration(participant.id)} className="rounded-lg border border-white/10 p-2 text-white/70 hover:border-red-300 hover:text-red-300" aria-label="Delete registration">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </section>
      </div>

      <AnimatePresence>
        {selected ? (
          <motion.aside initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur print:hidden">
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 26, stiffness: 220 }} className="ml-auto h-full w-full overflow-y-auto bg-midnight p-4 shadow-violet md:max-w-xl md:border-l md:border-white/10 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-aureate">Participant Details</p>
                  <h2 className="mt-2 break-words font-display text-3xl font-semibold md:text-4xl">{selected.full_name}</h2>
                </div>
                <button onClick={() => setSelected(null)} className="rounded-lg border border-white/10 p-2 text-white/70 hover:border-aureate hover:text-aureate">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 grid gap-3">
                {detailRows(selected).map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/42">{label}</p>
                    <p className="mt-2 break-words text-white/84">{value || "None"}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={saveNotes} className="mt-6">
                <label className="grid gap-3 text-sm font-semibold text-white/80">
                  Private Notes
                  <textarea name="notes" defaultValue={selected.notes || ""} rows={5} className="rounded-xl border border-white/10 bg-white/[0.06] p-4 outline-none focus:border-aureate" />
                </label>
                <button className="mt-4 rounded-lg bg-aureate px-5 py-3 font-semibold text-midnight">Save Notes</button>
              </form>
            </motion.div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function StatCard({ icon, label, value, subtitle }: { icon?: ReactNode; label: string; value: number; subtitle: string }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-4 shadow-[0_20px_70px_rgba(0,0,0,0.22)] transition md:p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-aureate/10 text-aureate md:mb-4">{icon || <span className="h-2 w-2 rounded-full bg-aureate" />}</div>
      <p className="text-xs uppercase tracking-[0.18em] text-white/45">{label}</p>
      <p className="mt-2 font-display text-4xl font-semibold md:text-5xl">{value}</p>
      <p className="mt-2 text-sm text-white/48">{subtitle}</p>
    </motion.div>
  );
}

function ActionCenterCard({ icon, title, value, subtitle, onClick }: { icon: ReactNode; title: string; value: number; subtitle: string; onClick: () => void }) {
  return (
    <motion.button whileHover={{ y: -3 }} onClick={onClick} className="glass group rounded-2xl p-4 text-left transition hover:border-aureate/35 hover:bg-aureate/[0.08] md:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-aureate transition group-hover:bg-aureate group-hover:text-midnight">{icon}</div>
        <p className="font-display text-3xl font-semibold text-white md:text-4xl">{value}</p>
      </div>
      <p className="mt-4 font-semibold text-white md:mt-5">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/52">{subtitle}</p>
    </motion.button>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<string | [string, string]> }) {
  return (
    <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 rounded-lg border border-white/10 bg-midnight px-3 normal-case tracking-normal text-white outline-none">
        <option value="all">All</option>
        {options.map((option) => {
          const optionValue = Array.isArray(option) ? option[0] : option;
          const optionLabel = Array.isArray(option) ? option[1] : option;
          return <option key={optionValue} value={optionValue}>{optionLabel}</option>;
        })}
      </select>
    </label>
  );
}

function ActionButton({ icon, label, onClick, disabled = false }: { icon: ReactNode; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button disabled={disabled} onClick={onClick} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-aureate px-4 font-semibold text-midnight transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto">
      {icon} {label}
    </button>
  );
}

function MiniButton({ label, icon, onClick }: { label: string; icon?: ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-aureate hover:bg-aureate/10 hover:text-aureate sm:flex-none">
      {icon} {label}
    </button>
  );
}

function StatusBadge({ type }: { type: RegistrationStatus | AttendanceStatus | "first-time" }) {
  const styles: Record<string, string> = {
    confirmed: "border-aureate/35 bg-aureate/15 text-aureate",
    waitlist: "border-orange-300/35 bg-orange-400/12 text-orange-200",
    cancelled: "border-red-300/35 bg-red-500/12 text-red-200",
    "checked-in": "border-sky-300/35 bg-sky-400/12 text-sky-200",
    pending: "border-white/15 bg-white/[0.06] text-white/60",
    absent: "border-red-300/35 bg-red-500/12 text-red-200",
    "first-time": "border-violet-300/35 bg-violet/20 text-violet-100"
  };
  const labels: Record<string, string> = {
    confirmed: "Confirmed",
    waitlist: "Waitlist",
    cancelled: "Cancelled",
    "checked-in": "Checked In",
    pending: "Pending",
    absent: "Absent",
    "first-time": "First Time"
  };
  return <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${styles[type]}`}>{labels[type]}</span>;
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-aureate/20 bg-aureate/10 shadow-glow">
        <Search className="h-8 w-8 text-aureate" />
      </div>
      <p className="font-display text-3xl font-semibold">No registrations found</p>
      <p className="mt-2 text-white/56">New submissions will appear here as soon as they are stored in Supabase.</p>
    </div>
  );
}

function AdminSkeleton() {
  return (
    <div className="grid w-full max-w-5xl gap-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="h-24 animate-pulse rounded-2xl border border-white/10 bg-white/[0.05]" />
      ))}
    </div>
  );
}

function detailRows(item: Registration): Array<[string, string]> {
  return [
    ["Email", item.email],
    ["WhatsApp", item.whatsapp_number],
    ["Age", String(item.age)],
    ["Date of Birth", item.date_of_birth],
    ["Gender", item.gender],
    ["Food Preference", item.food_preference],
    ["Congregation", item.congregation],
    ["City", item.city],
    ["State", item.state],
    ["Emergency Contact", `${item.emergency_contact_name} - ${item.emergency_contact_number}`],
    ["Medical / Allergies", item.medical_conditions || ""],
    ["Parent / Guardian", item.guardian_name ? `${item.guardian_name} - ${item.guardian_contact_number || ""}` : ""],
    ["Heard About ARISE", item.heard_about_arise],
    ["Additional Notes", item.additional_notes || ""],
    ["Registration Status", item.registration_status],
    ["Attendance Status", item.attendance_status]
  ];
}

function safeDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toDateString();
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString();
}

function printParticipants(items: Registration[]) {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;
  const rows = items.map((item) => `
    <tr>
      <td>${escapeHtml(item.full_name)}</td>
      <td>${escapeHtml(item.whatsapp_number)}</td>
      <td>${escapeHtml(item.congregation)}</td>
      <td>${escapeHtml(item.city)}</td>
      <td>${escapeHtml(item.registration_status)}</td>
      <td>${escapeHtml(item.attendance_status)}</td>
    </tr>
  `).join("");
  printWindow.document.write(`
    <html>
      <head>
        <title>ARISE Selected Participants</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
          h1 { margin: 0 0 18px; font-size: 28px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border-bottom: 1px solid #ddd; padding: 10px; text-align: left; font-size: 13px; }
          th { background: #f4f4f4; text-transform: uppercase; letter-spacing: .08em; font-size: 11px; }
        </style>
      </head>
      <body>
        <h1>ARISE Selected Participants</h1>
        <table>
          <thead><tr><th>Name</th><th>WhatsApp</th><th>Congregation</th><th>City</th><th>Status</th><th>Attendance</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function escapeHtml(value: string) {
  const replacements: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" };
  return value.replace(/[&<>"']/g, (char) => replacements[char] || char);
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
