"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { motion, useMotionValue, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Homepage() {
  const { isSignedIn } = useUser();

  /* ---------------- Cursor Glow ---------------- */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  /* ---------------- Scroll Parallax ---------------- */
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.7]);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black text-white"
    >
      {/* CURSOR GLOW */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(99,102,241,0.18),
              transparent 40%
            )
          `,
        }}
      />

      {/* BACKGROUND AMBIENT BLOBS */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-64 -left-64 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[140px]" />
        <div className="absolute -bottom-64 -right-64 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[140px]" />
      </div>

      {/* NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between px-8 py-6"
      >
        <h1 className="text-2xl font-bold tracking-wide">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Docu AI
          </span>
        </h1>

        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <>
              <Link
                href="/sign-in"
                className="px-5 py-2 rounded-xl bg-white text-black font-semibold hover:scale-105 transition"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 font-semibold hover:scale-105 transition"
              >
                Get Started
              </Link>
            </>
          ) : (
            <Link
              href="/app/dashboard"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 font-semibold hover:scale-105 transition"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </motion.nav>

      {/* HERO */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="px-6 md:px-20 mt-20 text-center"
      >
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
        >
          Automate Your Documents
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Compliance & Bookkeeping with AI
          </span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-10"
        >
          Upload any document. AI extracts data, tracks compliance,
          manages deadlines, and automates your paperwork.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex justify-center gap-4"
        >
          <Link
            href="/sign-up"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-lg font-semibold hover:scale-105 transition"
          >
            Start Free
          </Link>
          <Link
            href="/sign-in"
            className="px-8 py-4 rounded-xl border border-white/30 text-lg font-semibold hover:bg-white/10 transition"
          >
            Sign In
          </Link>
        </motion.div>
      </motion.section>

      {/* FEATURES */}
      <section className="mt-28 px-6 md:px-20">
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "📄 Auto Document Reading",
              desc: "Extract names, dates, amounts, and key fields instantly.",
            },
            {
              title: "📅 Compliance Alerts",
              desc: "Never miss filings or renewals with smart reminders.",
            },
            {
              title: "📦 Unified Document Hub",
              desc: "Searchable, categorized, and secure document storage.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              whileHover={{ y: -8, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10"
            >
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-32 text-center px-6"
      >
        <h3 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to simplify compliance?
        </h3>
        <p className="text-gray-400 mb-8">
          Join businesses automating documents with AI.
        </p>
        <Link
          href="/sign-up"
          className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 font-semibold hover:scale-105 transition"
        >
          Get Started Free
        </Link>
      </motion.section>

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-32 border-t border-white/10 px-6 py-10 text-center text-gray-400"
      >
        <p className="mb-2 text-white font-medium">
          Docu AI — Smart Compliance & Documents
        </p>
        <p className="text-sm">
          © {new Date().getFullYear()} Docu AI. All rights reserved.
        </p>
      </motion.footer>
    </motion.div>
  );
}