"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldHalf, Radio, MessageSquareWarning, ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";

const STATS = [
  { value: "₹4,057 Cr", label: "stolen to digital arrest & cyber fraud scams" },
  { value: "2,97,727", label: "reported victims" },
  { value: "0", label: "tools that act during the call — until now" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Nav />

      <main className="relative">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px]"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,59,78,0.14), transparent 70%)",
          }}
        />

        <section className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-danger/40 bg-danger/10 shadow-[0_0_40px_rgba(255,59,78,0.25)] sm:h-20 sm:w-20"
          >
            <ShieldHalf className="h-9 w-9 text-danger sm:h-11 sm:w-11" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 text-6xl font-extrabold tracking-tight sm:text-8xl"
          >
            KAVACH
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-xl font-semibold text-text-primary sm:text-2xl"
          >
            Real-time defence against digital arrest scams.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg"
          >
            An AI guardian that listens to the call as it happens, recognises the scam script
            mid-sentence, and interrupts in the victim&rsquo;s own language — before the money
            moves.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
          >
            <Link
              href="/guardian"
              className="group flex items-center justify-center gap-2 rounded-xl bg-accent px-7 py-4 text-base font-bold text-[#04141C] shadow-[0_0_40px_rgba(53,201,232,0.3)] transition-transform hover:scale-[1.03]"
            >
              <Radio className="h-5 w-5" /> Open Live Guardian
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/triage"
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-panel px-7 py-4 text-base font-bold text-text-primary transition-colors hover:border-accent"
            >
              <MessageSquareWarning className="h-5 w-5" /> Check a message
            </Link>
          </motion.div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-border bg-panel p-6 text-center sm:p-8"
              >
                <p className="font-mono text-3xl font-bold text-danger sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-sm text-text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center">
        <p className="text-xs text-text-muted">
          Team DeepSeek · ET AI Hackathon 2.0 · Problem Statement 06
        </p>
      </footer>
    </div>
  );
}
