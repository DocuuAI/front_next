"use client";

import {
  Clock,
  FileText,
  Bell,
  MessageSquare,
  LayoutDashboard,
  Shield,
  Zap,
} from "lucide-react";
import { StatCard } from "@/app/providers/StatCard";

const features = [
  {
    icon: FileText,
    title: "AI That Understands Your Documents",
    description:
      "Upload any document. The AI reads, classifies, and extracts key information automatically — IDs, invoices, agreements, licenses, and more.",
    glow: "rgba(59,130,246,0.6)", // blue
    iconColor: "text-blue-400",
  },
  {
    icon: Clock,
    title: "Never Miss a Deadline Again",
    description:
      "Expiry dates, renewals, and compliance deadlines are detected directly from your documents — with proactive alerts before it’s too late.",
    glow: "rgba(245,158,11,0.55)", // amber
    iconColor: "text-amber-400",
  },
  {
    icon: Bell,
    title: "Smart Compliance Reminders",
    description:
      "The AI automatically creates reminders for renewals, filings, and obligations. No manual tracking. No guesswork.",
    glow: "rgba(34,197,94,0.55)", // green
    iconColor: "text-green-400",
  },
  {
    icon: MessageSquare,
    title: "Talk to Your Documents",
    description:
      "Ask questions in plain language. “What are my deadlines?” “Is this compliant?” “What does this agreement mean?”",
    glow: "rgba(168,85,247,0.55)", // violet
    iconColor: "text-violet-400",
  },
  {
    icon: LayoutDashboard,
    title: "One Dashboard for Life & Business",
    description:
      "Personal documents, business compliance, taxes, licenses, contracts — all organized automatically in one place.",
    glow: "rgba(14,165,233,0.55)", // cyan
    iconColor: "text-cyan-400",
  },
  {
    icon: Shield,
    title: "Built for Security, Trust & Scale",
    description:
      "End-to-end encryption, private document vaults, and audit-ready organization — designed to scale globally.",
    glow: "rgba(236,72,153,0.5)", // pink
    iconColor: "text-pink-400",
  },
];

export function FeatureCards() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Soft background orbs */}
      <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-blue-600/20 blur-[140px]" />
      <div className="absolute bottom-1/3 left-0 h-80 w-80 rounded-full bg-sky-500/20 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center space-y-6 mb-20">
          {/* Bluish DocuAI pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 shadow-[0_0_30px_rgba(59,130,246,0.25)]">
            <Zap className="h-4 w-4 text-blue-400" />
            Why DocuAI
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            From document chaos to
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
              intelligent compliance clarity
            </span>
            .
          </h2>

          <p className="text-lg text-zinc-400">
            AI-powered understanding, reminders, and answers — built on your
            actual documents.
          </p>
        </div>
        <StatCard />
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 ">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative isolate overflow-visible rounded-xl
              border border-white/15 bg-gradient-to-br from-blue-500/10 via-white/5 to-sky-500/10
              p-6 backdrop-blur-md
              transition-all duration-300"
              style={{ boxShadow: `0 0 0px ${feature.glow}` }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 90px ${feature.glow}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0px ${feature.glow}`;
              }}
            >
              {/* Glow */}
              <div
                className="pointer-events-none absolute inset-[-60%] -z-10
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(600px circle at var(--glow-x,20%) var(--glow-y,20%), ${feature.glow}, transparent 65%)`,
                }}
              />

              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/15 shadow-[0_0_20px_rgba(59,130,246,0.35)]">
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}