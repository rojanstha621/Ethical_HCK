import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";

const rotatingWords = ["Learn.", "Research.", "Build.", "Secure."];

function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center py-16 overflow-hidden">
      {/* Enhanced background with animated gradients */}
      <div className="pointer-events-none absolute inset-0">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-red/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-red/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.18] bg-hero-grid bg-[length:24px_24px]" />
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.05),_transparent_60%)]" />
      </div>

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 w-full max-w-4xl px-4 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {/* Animated label with sparkle effect */}
        <motion.div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-text-muted backdrop-blur shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-accent-red"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span>Cybersecurity Collective</span>
          <Sparkles className="h-3 w-3 text-accent-red/60" />
        </motion.div>

        {/* Main title with gradient text effect */}
        <motion.h1
          className="font-heading text-4xl leading-tight md:text-5xl lg:text-7xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="text-accent-red">
            Ethical HCK
          </span>
          <br />
          <span className="text-text-primary">Community</span>
        </motion.h1>

        {/* Enhanced subtitle */}
        <motion.p
          className="mt-4 text-base text-text-muted md:text-lg max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          A dedicated space for ethical hacking, cybersecurity learning, and
          collaborative research. Building the next generation of security professionals.
        </motion.p>

        {/* Enhanced rotating word strip */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-3 text-sm font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <span className="uppercase tracking-[0.18em] text-text-muted/80">
            Focus:
          </span>
          <motion.span
            key={wordIndex}
            initial={{ opacity: 0, y: 10, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -10, rotateX: 90 }}
            transition={{ duration: 0.5 }}
            className="min-w-[100px] text-accent-red font-semibold text-base"
          >
            {rotatingWords[wordIndex]}
          </motion.span>
        </motion.div>

        {/* Enhanced CTA buttons */}
        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <motion.button
            type="button"
            className="btn-primary px-8 py-3 text-sm font-medium relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Explore Our Work</span>
            <motion.div
              className="absolute inset-0 bg-accent-red"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          
          <motion.button
            type="button"
            className="btn-outline px-8 py-3 text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join Community
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown className="h-5 w-5 text-accent-red/60" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
