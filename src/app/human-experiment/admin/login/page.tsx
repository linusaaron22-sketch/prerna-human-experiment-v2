
"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      if (!supabase || !isSupabaseConfigured) return;

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (active && user && !error) {
        router.replace("/admin/experiment");
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");
    setIsLoading(true);

    if (!supabase || !isSupabaseConfigured) {
      setIsLoading(false);
      setAuthError(
        "Supabase is not connected. Check your .env.local configuration."
      );
      return;
    }

    const form = new FormData(event.currentTarget);

    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    setIsLoading(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    router.replace("/admin/experiment");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-midnight bg-gold-radial px-4 sm:px-6">
      <form
        onSubmit={login}
        className="glass w-full max-w-md rounded-2xl p-5 md:p-7"
      >
        <Link href="/human-experiment" className="text-sm text-aureate">
          Back to Prerna Human Experiment
        </Link>

        <ShieldCheck className="mb-6 mt-8 h-10 w-10 text-aureate" />

        <h1 className="font-display text-4xl font-semibold">
          Experiment Admin
        </h1>

        <p className="mt-3 text-white/64">
          Secure access to the Prerna Human Experiment control panel.
        </p>

        <div className="mt-8 grid gap-4">
          <input
            required
            name="email"
            type="email"
            placeholder="Admin email"
            autoComplete="username"
            className="h-12 rounded-lg border border-white/10 bg-white/[0.06] px-4 outline-none focus:border-aureate"
          />

          <input
            required
            name="password"
            type="password"
            placeholder="Admin password"
            autoComplete="current-password"
            className="h-12 rounded-lg border border-white/10 bg-white/[0.06] px-4 outline-none focus:border-aureate"
          />

          <button
            disabled={isLoading}
            className="rounded-lg bg-aureate px-5 py-4 font-semibold text-midnight transition hover:bg-white disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          {authError ? (
            <p role="alert" className="text-red-300">
              {authError}
            </p>
          ) : null}
        </div>
      </form>
    </main>
  );
}
