import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const rotatingWords = ["Learn.", "Research.", "Build.", "Secure."];

function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center py-16">
      {/* Minimal inner background (extra subtle, hero-only) */}
      <div className="pointer-events-none absolute inset-0">
        {/* very soft center glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,245,160,0.10),_transparent_55%)]" />
        {/* top–bottom gradient just to add depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-3xl px-4 text-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {/* Tiny label – neutral, not repeating the name */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-text-muted backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
          Cybersecurity Collective
        </div>

        {/* Main title – single clear identity line */}
        <h1 className="font-heading text-3xl leading-snug md:text-4xl lg:text-5xl">
          Ethical HCK Community
        </h1>

        {/* Short, precise subtitle */}
        <p className="mt-4 text-sm text-text-muted md:text-base">
          A dedicated space for ethical hacking, cybersecurity learning, and
          collaborative research.
        </p>

        {/* Rotating word strip – minimal but unique */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-text-muted">
          <span className="uppercase tracking-[0.18em] text-text-muted/80">
            Focus:
          </span>
          <motion.span
            key={wordIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="min-w-[80px] text-accent-green"
          >
            {rotatingWords[wordIndex]}
          </motion.span>
        </div>

        {/* Single subtle CTA */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            className="btn-primary px-7 py-2.5 text-sm"
          >
            Explore Our Work
          </button>
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
