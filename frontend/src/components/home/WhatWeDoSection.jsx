import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Terminal, RadioTower, Search } from "lucide-react";
import { fadeUp, staggerContainer } from "../../lib/motion.js";

const items = [
  {
    label: "Workshops & Labs",
    title: "Hands-on Technical Sessions",
    icon: Terminal,
    description:
      "Focused labs on web security, Linux, networking, OSINT, and practical ethical hacking workflows.",
    points: [
      "Small, focused groups",
      "Tool-driven practice",
      "Beginner-friendly on-ramps",
    ],
  },
  {
    label: "Events & CTFs",
    title: "Challenges, Talks, and CTFs",
    icon: ShieldCheck,
    description:
      "Curated events that combine talks, guided demos, and competitive problem-solving in a safe environment.",
    points: [
      "CTF-style challenges",
      "Invited speakers",
      "Dark web & forensics themes",
    ],
  },
  {
    label: "Projects & Research",
    title: "Community-driven Initiatives",
    icon: Search,
    description:
      "Longer-term initiatives around security tooling, analysis, and documentation of real-world attack surfaces.",
    points: [
      "Collaborative repositories",
      "Student-led experiments",
      "Practical write-ups",
    ],
  },
  {
    label: "Awareness & Outreach",
    title: "Security Awareness Programs",
    icon: RadioTower,
    description:
      "Sessions and campaigns focused on digital hygiene, privacy, and responsible technology use.",
    points: [
      "Campus awareness drives",
      "Non-technical audiences",
      "Legal & ethical framing",
    ],
  },
];

function WhatWeDoSection() {
  return (
    <section id="what-we-do" className="py-14 md:py-18">
      <motion.div
        className="space-y-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* Header */}
        <motion.div
          variants={fadeUp}
          className="max-w-2xl space-y-3"
        >
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-accent-green/80">
            What We Do
          </p>
          <h2 className="font-heading text-2xl md:text-3xl">
            Quiet, focused, security work.
          </h2>
          <p className="text-sm md:text-[15px] text-text-muted">
            The community is structured around a few core activities: technical
            sessions, events, long-term projects, and awareness work. No noise,
            just deliberate practice.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid gap-5 md:grid-cols-2"
          variants={staggerContainer}
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.label}
                variants={fadeUp}
                className="group glass-panel relative overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                {/* subtle gradient strip */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent-green/40 via-accent-blue/40 to-accent-green/30" />

                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background/80">
                    <Icon className="h-4 w-4 text-accent-green" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted">
                      {item.label}
                    </div>
                    <h3 className="font-heading text-base md:text-lg">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-[13px] text-text-muted">
                      {item.description}
                    </p>
                    <ul className="mt-3 space-y-1.5 text-[11px] text-text-muted/90">
                      {item.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-center gap-2"
                        >
                          <span className="h-1 w-1 rounded-full bg-accent-blue/80" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* corner index */}
                <div className="pointer-events-none absolute bottom-3 right-4 text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted/60">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* faint hover glow */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute -bottom-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-accent-blue/10 blur-3xl" />
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}

export default WhatWeDoSection;
