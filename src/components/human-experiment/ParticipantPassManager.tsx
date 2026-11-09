
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  KeyRound,
  Loader2,
  MessageCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

type Participant = {
  participant_key: string;
  full_name: string | null;
  display_name: string | null;
  congregation: string | null;
  age: number | null;
};

type PassStatus = {
  participant_key: string;
  has_active_pass: boolean;
};

type GeneratedPass = {
  participantKey: string;
  passId: string;
  token: string;
  url: string;
};

export default function ParticipantPassManager() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [passStatuses, setPassStatuses] = useState<PassStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Participant | null>(null);
  const [generatedPass, setGeneratedPass] = useState<GeneratedPass | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  async function loadParticipants() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/participants", {
        credentials: "same-origin",
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not load participants.");
      }

      setParticipants(result.participants || []);
      setPassStatuses(result.passStatuses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadParticipants();
  }, []);

  const activeCount = passStatuses.filter(
    (pass) => pass.has_active_pass
  ).length;

  const filteredParticipants = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return participants;

    return participants.filter((participant) =>
      [
        participant.participant_key,
        participant.full_name || "",
        participant.display_name || "",
        participant.congregation || "",
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [participants, search]);

  function hasActivePass(participantKey: string) {
    return passStatuses.some(
      (pass) =>
        pass.participant_key === participantKey && pass.has_active_pass
    );
  }

  async function generatePass(participant: Participant) {
    const alreadyActive = hasActivePass(participant.participant_key);

    const confirmed = window.confirm(
      alreadyActive
        ? `Generate a replacement pass for ${participant.participant_key}? The current pass will be revoked.`
        : `Generate a secure participant pass for ${participant.participant_key}?`
    );

    if (!confirmed) return;

    setBusy(true);
    setError("");
    setNotice("");
    setGeneratedPass(null);

    try {
      const response = await fetch("/api/admin/participants/passes", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantKey: participant.participant_key,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.token) {
        throw new Error(result.error || "Could not generate participant pass.");
      }

      const url =
        `${window.location.origin}/p/${encodeURIComponent(result.token)}`;

      setGeneratedPass({
        participantKey: result.participantKey,
        passId: result.passId,
        token: result.token,
        url,
      });

      setSelected(participant);
      setNotice(`Secure pass generated for ${result.participantKey}.`);

      await loadParticipants();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pass generation failed.");
    } finally {
      setBusy(false);
    }
  }
    
async function revokePass(participant: Participant) {
  const confirmed = window.confirm(
    `Are you sure you want to revoke the active pass for ${participant.participant_key}? The participant's old QR code and link will stop working.`
  );

  if (!confirmed) return;

  setBusy(true);
  setError("");
  setNotice("");

  try {
    const response = await fetch(
      "/api/admin/participants/passes/revoke",
      {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantKey: participant.participant_key,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Could not revoke the pass.");
    }

    if (
      generatedPass?.participantKey === participant.participant_key
    ) {
      setGeneratedPass(null);
    }

    await loadParticipants();

    setNotice(
      `The active pass for ${participant.participant_key} has been revoked successfully.`
    );
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Pass revocation failed."
    );
  } finally {
    setBusy(false);
  }
}

  async function copyLink() {
    if (!generatedPass) return;

    try {
      await navigator.clipboard.writeText(generatedPass.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy the link. Please copy it manually.");
    }
  }

  function shareWhatsApp() {
    if (!generatedPass) return;

    const message = [
      "Your Prerna Human Experiment participant pass is ready.",
      `Participant ID: ${generatedPass.participantKey}`,
      "",
      "Open your personal secure pass using this link:",
      generatedPass.url,
      "",
      "Please keep this link private and use it to access the experiment.",
    ].join("\n");

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function downloadQr() {
    const canvas = qrRef.current?.querySelector("canvas");

    if (!canvas || !generatedPass) {
      setError("QR code is not ready to download.");
      return;
    }

    const output = document.createElement("canvas");
    const padding = 36;
    const headingHeight = 100;
    const footerHeight = 70;
    const size = canvas.width + padding * 2;

    output.width = size;
    output.height = canvas.height + headingHeight + footerHeight;

    const context = output.getContext("2d");

    if (!context) {
      setError("Could not prepare the QR download.");
      return;
    }

    context.fillStyle = "#f8f1e6";
    context.fillRect(0, 0, output.width, output.height);

    context.fillStyle = "#19352c";
    context.textAlign = "center";
    context.font = "bold 22px Georgia";
    context.fillText("PRERNA", size / 2, 42);

    context.font = "bold 14px Arial";
    context.fillText(
      `PARTICIPANT ${generatedPass.participantKey}`,
      size / 2,
      72
    );

    context.drawImage(canvas, padding, headingHeight);

    context.font = "12px Arial";
    context.fillStyle = "#19352c";
    context.fillText(
      "Personal secure entry pass",
      size / 2,
      output.height - 27
    );

    const link = document.createElement("a");
    link.download = `${generatedPass.participantKey}-Prerna-Pass.png`;
    link.href = output.toDataURL("image/png");
    link.click();
  }

  return (
    <main className="min-h-screen bg-[#f8f1e6] px-5 py-8 text-[#19352c] sm:px-8">
      <div className="mx-auto max-w-6xl">

        <header className="flex flex-col justify-between gap-5 border-b border-[#19352c]/15 pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#c7542b]">
              PRERNA · ADMINISTRATION
            </p>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
              Participant Passes
            </h1>
            <p className="mt-3 max-w-xl text-sm text-[#19352c]/60">
              Manage individual participant identities and secure digital
              entry passes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/admin/experiment"
              className="border border-[#19352c]/20 px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-wider transition hover:bg-[#19352c] hover:text-[#f8f1e6]"
            >
              <ArrowLeft className="mr-2 inline h-3 w-3" />
              Control Room
            </a>

            <div className="flex items-center gap-2 border border-[#19352c]/15 px-4 py-3">
              <ShieldCheck className="h-4 w-4 text-[#c7542b]" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider">
                Admin only
              </span>
            </div>
          </div>
        </header>

        <section className="mt-7 grid gap-px border border-[#19352c]/10 bg-[#19352c]/10 sm:grid-cols-3">
          <div className="bg-[#eee5d5] p-5">
            <Users className="h-4 w-4 text-[#c7542b]" />
            <p className="mt-4 font-mono text-[9px] uppercase tracking-widest text-[#19352c]/45">
              Registered IDs
            </p>
            <p className="mt-1 font-serif text-3xl">
              {loading ? "—" : participants.length}
            </p>
          </div>

          <div className="bg-[#eee5d5] p-5">
            <ShieldCheck className="h-4 w-4 text-[#c7542b]" />
            <p className="mt-4 font-mono text-[9px] uppercase tracking-widest text-[#19352c]/45">
              Active passes
            </p>
            <p className="mt-1 font-serif text-3xl">
              {loading ? "—" : activeCount}
            </p>
          </div>

          <div className="bg-[#eee5d5] p-5">
            <KeyRound className="h-4 w-4 text-[#c7542b]" />
            <p className="mt-4 font-mono text-[9px] uppercase tracking-widest text-[#19352c]/45">
              Awaiting passes
            </p>
            <p className="mt-1 font-serif text-3xl">
              {loading ? "—" : participants.length - activeCount}
            </p>
          </div>
        </section>

        {error && (
          <div className="mt-5 border border-red-700/20 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {notice && (
          <div className="mt-5 border border-[#19352c]/15 bg-[#e8eddf] p-4 text-sm">
            {notice}
          </div>
        )}

        <section className="mt-8 grid gap-7 lg:grid-cols-[1fr_360px]">

          <div className="min-w-0">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#c7542b]">
                  Participant registry
                </p>
                <h2 className="mt-2 font-serif text-2xl">
                  All participants
                </h2>
              </div>

              <button
                onClick={() => void loadParticipants()}
                disabled={loading}
                className="flex items-center justify-center gap-2 border border-[#19352c]/20 px-4 py-3 text-xs transition hover:bg-[#19352c] hover:text-white disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                Refresh registry
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3 border border-[#19352c]/15 bg-white/40 px-4">
              <Search className="h-4 w-4 text-[#19352c]/40" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search participant ID, name or congregation..."
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-[#19352c]/35"
              />
            </div>

            <div className="mt-5 divide-y divide-[#19352c]/10 border-y border-[#19352c]/10">
              {loading ? (
                <div className="flex items-center justify-center gap-3 py-12 text-sm">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading participants...
                </div>
              ) : filteredParticipants.length === 0 ? (
                <p className="py-12 text-center text-sm text-[#19352c]/50">
                  No participants found.
                </p>
              ) : (
                filteredParticipants.map((participant) => {
                  const active = hasActivePass(participant.participant_key);
                  const isSelected =
                    selected?.participant_key === participant.participant_key;

                  return (
                    <div
                      key={participant.participant_key}
                      className={`flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center ${
                        isSelected ? "bg-[#eee5d5] px-3" : ""
                      }`}
                    >
                      <button
                        onClick={() => {
                          setSelected(participant);
                          setGeneratedPass(null);
                          setError("");
                          setNotice("");
                        }}
                        className="min-w-0 text-left"
                      >
                        <p className="font-mono text-xs font-bold tracking-wider">
                          {participant.participant_key}
                        </p>
                        <p className="mt-1 truncate text-sm font-medium">
                          {participant.full_name ||
                            participant.display_name ||
                            "Name not added"}
                        </p>
                        <p className="mt-1 text-xs text-[#19352c]/45">
                          {participant.congregation || "Congregation not added"}
                        </p>
                      </button>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`border px-3 py-2 font-mono text-[8px] font-bold uppercase tracking-wider ${
                          active
                            ? "border-green-800/20 text-green-800"
                            : "border-[#c7542b]/25 text-[#c7542b]"
                        }`}>
                          {active ? "Pass active" : "Awaiting pass"}
                        </span>

                        <button
                          onClick={() => void generatePass(participant)}
                          disabled={busy}
                          className="flex items-center gap-2 bg-[#19352c] px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-wider text-[#f8f1e6] transition hover:bg-[#c7542b] disabled:opacity-50"
                        >
                          {busy ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <KeyRound className="h-3.5 w-3.5" />
                          )}
                          {active ? "Regenerate" : "Generate pass"}
                        </button>
                        
{active && (
  <button
    onClick={() => void revokePass(participant)}
    disabled={busy}
    className="flex items-center gap-2 border border-red-700/25 px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-wider text-red-800 transition hover:bg-red-700 hover:text-white disabled:opacity-50"
  >
    <X className="h-3.5 w-3.5" />
    Revoke
  </button>
)}

                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <aside className="h-fit border border-[#19352c]/15 bg-[#eee5d5] p-5">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#c7542b]">
              Pass preview
            </p>

            {!generatedPass ? (
              <div className="py-12 text-center">
                <KeyRound className="mx-auto h-8 w-8 text-[#19352c]/30" />
                <h3 className="mt-4 font-serif text-xl">
                  No new pass generated
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#19352c]/55">
                  Select a participant and generate a pass to see its QR code
                  and sharing options here.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-5 border border-[#19352c]/10 bg-[#f8f1e6] p-4 text-center">
                  <p className="font-serif text-2xl">PRERNA</p>
                  <p className="mt-2 font-mono text-[10px] tracking-widest">
                    {generatedPass.participantKey}
                  </p>

                  <div
                    ref={qrRef}
                    className="mx-auto mt-4 flex justify-center"
                  >
                    <QRCodeCanvas
                      value={generatedPass.url}
                      size={220}
                      level="H"
                      includeMargin
                      bgColor="#f8f1e6"
                      fgColor="#19352c"
                    />
                  </div>

                  <p className="mt-3 text-[9px] uppercase tracking-widest text-[#19352c]/45">
                    Personal secure entry pass
                  </p>
                </div>

                <div className="mt-4 break-all border border-[#19352c]/10 bg-white/40 p-3 text-[10px] text-[#19352c]/65">
                  {generatedPass.url}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => void copyLink()}
                    className="flex items-center justify-center gap-2 border border-[#19352c]/20 px-3 py-3 text-[10px] font-bold uppercase"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy link"}
                  </button>

                  <button
                    onClick={shareWhatsApp}
                    className="flex items-center justify-center gap-2 bg-[#19352c] px-3 py-3 text-[10px] font-bold uppercase text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </button>

                  <button
                    onClick={downloadQr}
                    className="col-span-2 flex items-center justify-center gap-2 border border-[#19352c]/20 px-3 py-3 text-[10px] font-bold uppercase"
                  >
                    <Download className="h-4 w-4" />
                    Download QR pass · PNG
                  </button>
                </div>

                <p className="mt-4 text-[10px] leading-relaxed text-[#19352c]/50">
                  This secure link is shown only once after generation. Share
                  it privately with the participant. Regenerating the pass
                  invalidates the previous link.
                </p>
              </>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
