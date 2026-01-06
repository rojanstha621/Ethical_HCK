// src/components/home/WhatWeDoSection.jsx

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, gridReveal, staggerContainer, sectionReveal } from "../../lib/motion.js";
import {
  Shield,
  Bug,
  Lock,
  Radio,
  Globe2,
  ArrowRight,
} from "lucide-react";

const items = [
  {
    id: "workshops",
    label: "Hands-on Workshops",
    title: "Workshops & Labs",
    description:
      "Deep-dive sessions on topics like web security, dark web exploration, digital forensics, and more — focused on ethical use only.",
    highlight: "Practice over theory, every time.",
    icon: Shield,
    href: "/events#workshops",
    tag: "Skill-building",
  },
  {
    id: "ctf",
    label: "Capture The Flag",
    title: "CTFs & Challenges",
    description:
      "Small, focused CTFs and challenge sets that help members think like defenders and attackers, without crossing ethical lines.",
    highlight: "Think, break, understand, secure.",
    icon: Bug,
    href: "/events#ctf",
    tag: "Problem-solving",
  },
  {
    id: "projects",
    label: "Community Projects",
    title: "Projects & Initiatives",
    description:
      "Collaborative builds like demo web apps, monitoring tools, and security awareness campaigns under senior guidance.",
    highlight: "From idea to working prototype.",
    icon: Globe2,
    href: "/projects",
    tag: "Build & ship",
  },
  {
    id: "research",
    label: "Guided Research",
    title: "Research & Reading Circles",
    description:
      "Small groups exploring topics like threat intelligence, malware analysis basics, and privacy — slowly and carefully.",
    highlight: "Not rushing. Deep, patient learning.",
    icon: Radio,
    href: "/projects#research",
    tag: "Deep work",
  },
  {
    id: "awareness",
    label: "Campus Awareness",
    title: "Security Awareness & Outreach",
    description:
      "Talks, demos, and campaigns aimed at helping students and staff stay safer online, in a language they actually understand.",
    highlight: "Awareness before incident.",
    icon: Lock,
    href: "/events#awareness",
    tag: "Community-facing",
  },
];

function WhatWeDoSection() {
  return (
    <motion.section
      className="py-10 md:py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionReveal}
    >
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          custom={0}
          className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-red" />
              What we do
            </div>
            <div className="space-y-1">
              <motion.h2
                variants={fadeUp}
                custom={1}
                className="font-heading text-2xl md:text-3xl"
              >
                Focused on learning, not noise.
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="max-w-xl text-sm text-text-muted"
              >
                The community runs a small but consistent set of activities:
                workshops, CTF-style problem solving, guided projects, and
                security awareness work across campus.
              </motion.p>
            </div>
          </div>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="hidden text-xs text-text-muted md:flex md:flex-col md:items-end"
          >
            <span className="font-mono uppercase tracking-[0.18em]">
              Learn • Research • Build • Secure
            </span>
            <span className="mt-1 text-[11px] text-text-muted/80">
              Cards below are clickable and lead to events or projects.
            </span>
          </motion.div>
        </motion.div>

        {/* Cards: horizontal scroll on mobile, grid on desktop */}
        <motion.div
          className="-mx-4 flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible"
          variants={staggerContainer}
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.id}
                href={item.href}
                variants={gridReveal}
                custom={index}
                className="section-card group relative min-w-[80%] snap-start rounded-2xl border border-white/10 bg-black/70 backdrop-blur-md shadow-lg shadow-black/20 md:min-w-0 md:rounded-2xl"
              >
                {/* gradient ring */}
                <div className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(0,245,160,0.3),transparent_60%),radial-gradient(circle_at_bottom,_rgba(0,198,255,0.2),transparent_55%)] opacity-0 blur-[2px] transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative flex h-full flex-col p-4 md:p-5">
                  {/* top row: icon + tag */}
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/50 border border-white/10">
                        <Icon className="h-4 w-4 text-accent-red transition-colors duration-300 group-hover:text-accent-redLight" />
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-text-muted">
                        {item.label}
                      </span>
                    </div>
                    <span className="rounded-full border border-white/10 bg-black/50 px-2 py-0.5 text-[10px] text-text-muted">
                      {item.tag}
                    </span>
                  </div>

                  {/* title + description */}
                  <h3 className="font-heading text-base md:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs md:text-sm text-text-muted">
                    {item.description}
                  </p>

                  {/* highlight + read more */}
                  <div className="mt-4 flex flex-1 flex-col justify-end gap-2 text-xs">
                    <p className="text-[11px] text-accent-red/80">
                      {item.highlight}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-text-muted/80">
                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono tracking-[0.12em] text-accent-red/0 translate-x-2 opacity-0 transition-all duration-300 group-hover:text-accent-red group-hover:translate-x-0 group-hover:opacity-100">
                        Read more
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </motion.div>

        {/* Mobile hint */}
        <motion.div
          variants={fadeUp}
          custom={5}
          className="mt-1 flex items-center justify-between text-[11px] text-text-muted md:hidden"
        >
          <span>Swipe horizontally to see more.</span>
          <span className="font-mono uppercase tracking-[0.16em]">
            Learn • Build • Secure
          </span>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default WhatWeDoSection;
