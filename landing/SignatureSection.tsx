import { Quote } from "lucide-react";

export function FoundersMessage() {
  return (
    <section className="relative overflow-hidden py-32 bg-[#05070d]">
      {/* Soft blue light behind text */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {/* guaranteed visible blue light */}
        <div className="absolute h-[700px] w-[700px] rounded-full bg-blue-600/40 blur-[200px] mix-blend-screen" />
        <div className="absolute h-[520px] w-[520px] rounded-full bg-cyan-400/35 blur-[160px] mix-blend-screen" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        {/* Quote icon */}
        <div className="mb-10 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(59,130,246,0.35)]">
            <Quote className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        {/* Quote */}
        <blockquote className="relative text-2xl md:text-3xl font-light leading-relaxed text-zinc-100">
          {/* inner text glow */}
          <span className="absolute -inset-6 -z-10 rounded-xl bg-blue-500/20 blur-[90px]" />
          Documents shouldn’t be buried in folders.
          <br />
          They should{" "}
          <span className="font-medium text-blue-300 drop-shadow-[0_0_30px_rgba(96,165,250,0.9)]">
            explain themselves
          </span>
          , track their own deadlines,
          <br />
          and help you stay compliant — automatically.
        </blockquote>

        {/* Signature (no separator line, gradual merge) */}
        <div className="mt-16 space-y-3 text-center">
          <p className="text-xl font-medium text-zinc-100">
            — The Founders
          </p>

          <p className="text-sm tracking-widest text-zinc-500">
            Ayishik · Hiranmoy · Koustav
          </p>

          <p className="text-sm text-zinc-600">
            DocuAI
          </p>
        </div>
      </div>
    </section>
  );
}