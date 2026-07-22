"use client";

import { motion } from "framer-motion";
import {
  ShieldHalf,
  UserCheck,
  Siren,
  Lock,
  Clock,
  Wallet,
  Mic,
  FileAudio,
  Brain,
  Megaphone,
  Smartphone,
  Landmark,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Nav from "@/components/Nav";

const STATS = [
  { value: "₹4,057 Cr", label: "stolen to digital arrest & cyber fraud scams" },
  { value: "2,97,727", label: "reported victims" },
  { value: "0", label: "tools that act during the call — until now" },
];

const STAGES = [
  {
    n: "01",
    title: "IMPERSONATION",
    desc: "Caller claims to be CBI, ED, Customs, TRAI, Police, RBI, or a courier company.",
    Icon: UserCheck,
    color: "#FFB020",
  },
  {
    n: "02",
    title: "ACCUSATION",
    desc: "Your Aadhaar, SIM, bank account, or a parcel is linked to money laundering or drugs.",
    Icon: Siren,
    color: "#FFB020",
  },
  {
    n: "03",
    title: "ISOLATION",
    desc: "Stay on video, don't disconnect, don't tell family — confidential national security matter.",
    Icon: Lock,
    color: "#FF7A1A",
  },
  {
    n: "04",
    title: "FEAR",
    desc: "Threatens immediate arrest, cites non-bailable sections, shows a fake warrant, applies pressure.",
    Icon: Clock,
    color: "#FF7A1A",
  },
  {
    n: "05",
    title: "EXTRACTION",
    desc: "Demands transfer to a 'verification account', or asks for OTP, card, or banking credentials.",
    Icon: Wallet,
    color: "#FF3B4E",
  },
];

const PIPELINE = [
  {
    n: "01",
    title: "LISTEN",
    desc: "The browser captures the live call in 4-second audio chunks via MediaRecorder — mic input or an on-device recording.",
    Icon: Mic,
  },
  {
    n: "02",
    title: "TRANSCRIBE",
    desc: "Each chunk is sent to ElevenLabs Speech-to-Text, which handles code-mixed Hindi-English and other Indian languages.",
    Icon: FileAudio,
  },
  {
    n: "03",
    title: "CLASSIFY",
    desc: "Gemini scores the rolling transcript against the five-stage digital-arrest script in real time and extracts red-flag quotes.",
    Icon: Brain,
  },
  {
    n: "04",
    title: "INTERRUPT",
    desc: "At risk ≥ 75, Kavach fires a full-screen alert and speaks a warning back in the victim's own language via ElevenLabs TTS.",
    Icon: Megaphone,
  },
];

const ROADMAP = [
  {
    phase: "Phase 1 — Today",
    status: "shipped",
    items: [
      "Browser-based live Guardian console (this app)",
      "Text / screenshot / recording triage tool",
      "Real-time Gemini classifier + ElevenLabs voice pipeline",
    ],
    Icon: CheckCircle2,
  },
  {
    phase: "Phase 2 — Next",
    status: "planned",
    items: [
      "Android CallScreeningService for native call-time protection",
      "WhatsApp & IVR channel coverage",
      "Live cyber-cell map for nearest reporting station",
    ],
    Icon: Smartphone,
  },
  {
    phase: "Phase 3 — Scale",
    status: "vision",
    items: [
      "Telecom-layer call screening at the carrier level",
      "Integration with Sanchar Saathi and the 1930 helpline",
      "Bank-side transaction circuit breaker triggered by live risk score",
    ],
    Icon: Landmark,
  },
];

const TEAM = [
  { name: "Shivani Santosh Kapase", role: "Lead" },
  { name: "Yash Pradip Pakale", role: "Team Member" },
  { name: "Yashawant Dayanand Mane", role: "Team Member" },
  { name: "Prasad Babasaheb Thete", role: "Team Member" },
];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10 text-center">
      <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.3em] text-accent">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-extrabold sm:text-4xl">{title}</h2>
    </div>
  );
}

export default function PitchPage() {
  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <Reveal>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-danger/40 bg-danger/10 shadow-[0_0_40px_rgba(255,59,78,0.25)]">
            <ShieldHalf className="h-9 w-9 text-danger" />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold sm:text-6xl">
            Fighting India&rsquo;s fastest-growing scam, in real time.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-text-muted">
            Digital arrest scams have drained thousands of crores from Indian citizens. Every
            existing defence acts <em>after</em> the call ends. Kavach acts <em>during</em> it.
          </p>
        </Reveal>
      </section>

      {/* Problem stats */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="The Problem" title="A national-scale, in-progress crisis" />
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div className="rounded-2xl border border-border bg-panel p-6 text-center sm:p-8">
                <p className="font-mono text-3xl font-bold text-danger sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-sm text-text-muted">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Five stage script */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="The Script" title="Every digital arrest call follows the same five stages" />
        </Reveal>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-2">
          {STAGES.map((stage, i) => (
            <Reveal key={stage.n} delay={i * 0.08}>
              <div className="flex items-center gap-2 lg:h-full lg:flex-col">
                <div
                  className="flex flex-1 flex-col gap-3 rounded-2xl border p-5 lg:h-full"
                  style={{ borderColor: `${stage.color}55`, backgroundColor: `${stage.color}0D` }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold"
                      style={{ backgroundColor: `${stage.color}33`, color: stage.color }}
                    >
                      {stage.n}
                    </span>
                    <stage.Icon className="h-5 w-5" style={{ color: stage.color }} />
                  </div>
                  <h3 className="text-sm font-bold tracking-wide" style={{ color: stage.color }}>
                    {stage.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-text-muted">{stage.desc}</p>
                </div>
                {i < STAGES.length - 1 && (
                  <ArrowRight className="hidden h-5 w-5 flex-shrink-0 text-text-muted lg:block" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-6 text-center text-sm text-text-muted">
            <strong className="text-text-primary">Ground truth:</strong> no Indian agency — CBI, ED,
            Customs, RBI, or Police — ever arrests or verifies funds over a phone or video call.
            There is no such thing as a &ldquo;digital arrest&rdquo; in Indian law.
          </p>
        </Reveal>
      </section>

      {/* How Kavach works */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="How Kavach Works" title="A four-step real-time pipeline" />
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PIPELINE.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-panel p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-panel-raised font-mono text-sm font-bold text-accent">
                    {step.n}
                  </span>
                  <step.Icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-sm font-bold tracking-wide text-text-primary">{step.title}</h3>
                <p className="text-xs leading-relaxed text-text-muted">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Roadmap" title="From browser guardian to national infrastructure" />
        </Reveal>
        <div className="space-y-4">
          {ROADMAP.map((phase, i) => (
            <Reveal key={phase.phase} delay={i * 0.1}>
              <div className="flex flex-col gap-4 rounded-2xl border border-border bg-panel p-6 sm:flex-row sm:items-start">
                <div className="flex flex-shrink-0 items-center gap-3 sm:w-52">
                  <phase.Icon
                    className={`h-6 w-6 ${
                      phase.status === "shipped"
                        ? "text-safe"
                        : phase.status === "planned"
                          ? "text-accent"
                          : "text-text-muted"
                    }`}
                  />
                  <h3 className="font-bold text-text-primary">{phase.phase}</h3>
                </div>
                <ul className="flex-1 space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-text-muted">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-text-muted" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Team DeepSeek" title="Built for ET AI Hackathon 2.0" />
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.08}>
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-panel p-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-panel-raised font-mono text-lg font-bold text-accent">
                  {member.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{member.name}</p>
                  <p className="mt-0.5 text-xs text-text-muted">{member.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center">
        <p className="text-xs text-text-muted">
          Team DeepSeek · ET AI Hackathon 2.0 · Problem Statement 06
        </p>
      </footer>
    </div>
  );
}
