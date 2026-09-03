"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

const navItems = [
  ["About", "/about"],
  ["Theme", "/theme"],
  ["Schedule", "/schedule"],
  ["Register", "/register"],
  ["FAQ", "/faq"],
  ["Archive", "/archive"],
  ["Contact", "/contact"],
] as const;

const disabledItems = ["/schedule", "/archive"];

export function SiteNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/10 bg-[#0a0910]/95 backdrop-blur-xl md:h-[4.5rem]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 sm:px-6 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tight text-white transition hover:text-aureate md:text-3xl"
        >
          ARISE
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map(([label, href]) => {
            const disabled = disabledItems.includes(href);

            if (disabled) {
              return (
                <span
                  key={href}
                  className="cursor-not-allowed text-sm font-semibold text-white/20"
                >
                  {label}
                </span>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-semibold transition ${
                  pathname === href
                    ? "text-aureate"
                    : "text-white/55 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Desktop register button */}
        <Link
          href="/register"
          className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-midnight transition hover:-translate-y-0.5 hover:bg-aureate md:inline-flex"
        >
          Register now
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition hover:border-aureate hover:text-aureate md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#080812]/95 backdrop-blur-xl md:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 28,
                stiffness: 240,
              }}
              className="fixed inset-0 flex min-h-screen flex-col overflow-y-auto bg-[#080812] p-5"
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="font-display text-2xl font-bold text-white"
                >
                  ARISE
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-aureate hover:text-aureate"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile links */}
              <div className="mt-10 flex flex-col gap-4 pb-8">
                {navItems.map(([label, href]) => {
                  const disabled = disabledItems.includes(href);

                  if (disabled) {
                    return (
                      <div
                        key={href}
                        className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-5 text-xl font-semibold text-white/20"
                      >
                        <span>{label}</span>
                        <span className="h-2 w-2 rounded-full bg-white/10" />
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`group flex items-center justify-between rounded-2xl border px-5 py-5 text-xl font-semibold transition active:scale-[0.98] ${
                        pathname === href
                          ? "border-aureate/40 bg-aureate/10 text-aureate"
                          : "border-white/10 bg-white/[0.035] text-white hover:border-aureate/40 hover:text-aureate"
                      }`}
                    >
                      <span>{label}</span>

                      <span
                        className={`h-2 w-2 rounded-full transition ${
                          pathname === href
                            ? "bg-aureate shadow-[0_0_12px_rgba(216,166,74,0.8)]"
                            : "bg-white/20 group-hover:bg-aureate"
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>

              {/* Mobile register */}
              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="mt-auto inline-flex min-h-14 items-center justify-center rounded-full bg-aureate px-5 py-3 font-semibold text-midnight shadow-glow transition active:scale-[0.98]"
              >
                Register now
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#080812] px-6 py-14 text-center">
      <p className="font-display text-3xl text-white">ARISE</p>

      <p className="mt-3 text-sm text-white/45">
        Church of Christ Mumbai
      </p>
    </footer>
  );
}
export function SitePage({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteNav />

      <main className="min-h-screen bg-[#080812] pt-16 md:pt-[4.5rem]">
        {children}
      </main>
    </>
  );
}