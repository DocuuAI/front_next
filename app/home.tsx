"use client";

import { useAuth } from "@clerk/clerk-react";
import Link from "next/link";

export default function Homepage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-gray-900 to-black text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold tracking-wide">
          <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Docu AI
          </span>
        </h1>

        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <>
              <Link
                href="/sign-in"
                className="px-5 py-2 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-5 py-2 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </>
          ) : (
            <Link
              href="/app/dashboard"
              className="px-5 py-2 rounded-xl bg-linear-to-r from-green-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-20 mt-20 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Automate Your Documents,  
          <br />
          <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Compliance & Bookkeeping with AI
          </span>
        </h2>

        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-10">
          Upload any document — the AI extracts fields, categorizes it, stores it,
          creates reminders, tracks compliance deadlines, and automates all business paperwork.
          No more manual effort. No more chaos.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/sign-up"
            className="px-8 py-4 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold hover:opacity-90 transition"
          >
            Start Free
          </Link>

          <Link
            href="/sign-in"
            className="px-8 py-4 rounded-xl border border-white/30 text-lg font-semibold hover:bg-white/10 transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Advertisement / Value Section */}
      <section className="mt-28 px-6 md:px-20">
        <div className="grid md:grid-cols-3 gap-10">
          
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
            <h3 className="text-xl font-semibold mb-3">📄 Auto Document Reading</h3>
            <p className="text-gray-300">
              AI instantly extracts names, dates, amounts, and important fields from any document — invoices, letters, agreements, bills, anything.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
            <h3 className="text-xl font-semibold mb-3">📅 Auto Compliance Alerts</h3>
            <p className="text-gray-300">
              Never miss a tax filing, renewal, or business deadline again. Automated reminders tailored to your documents.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
            <h3 className="text-xl font-semibold mb-3">📦 Centralized Document Hub</h3>
            <p className="text-gray-300">
              All your paperwork in one place — searchable, categorized, secure, and always available.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 mt-20 pb-10">
        © {new Date().getFullYear()} Docu AI. All rights reserved.
      </footer>
    </div>
  );
}