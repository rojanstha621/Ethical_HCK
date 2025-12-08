import React, { useState } from "react";
import { motion } from "framer-motion";
import { memberGroups } from "../data/members";
import { Github, Linkedin } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.5,
      ease: [0.22, 0.61, 0.36, 1],
    },
  }),
};

const gridReveal = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.03,
      duration: 0.45,
      ease: [0.25, 0.8, 0.25, 1],
    },
  }),
};

function AllMembers() {
  const [filter, setFilter] = useState("All");

  const flattened = [
    ...memberGroups.flatMap((g) =>
      g.members.map((m) => ({
        ...m,
        group: g.title,
      }))
    ),
  ];

  const filteredMembers =
    filter === "All"
      ? flattened
      : flattened.filter((m) => m.group === filter);

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="container-cyber space-y-14">
        
        {/* Page Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="space-y-3 border-b border-border/70 pb-6"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-mono uppercase tracking-[0.3em] text-accent-green"
          >
            Full Team
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-heading text-3xl md:text-4xl"
          >
            All Members of Ethical HCK Community
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-sm text-text-muted"
          >
            Steering leadership, department heads, contributors, and general members.
          </motion.p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {["All", ...memberGroups.map((g) => g.title)].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`
                px-4 py-1.5 rounded-full border text-xs font-mono tracking-wider
                transition-all duration-200
                ${
                  filter === item
                    ? "border-accent-blue text-accent-blue bg-surface/50 backdrop-blur"
                    : "border-border text-text-muted hover:text-text-primary"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
            gap-10 place-items-center
          "
        >
          {filteredMembers.map((member, i) => (
            <motion.div key={i} variants={gridReveal} custom={i}>
              <MemberCardFull member={member} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function MemberCardFull({ member }) {
  return (
    <div
      className="
        member-card group
        hover:shadow-[0_0_25px_rgba(0,198,255,0.25)]
        hover:border-accent-blue/70
        transition-all duration-300
        relative
      "
    >
      {/* Parallax wrapper */}
      <div className="relative h-[64%] w-full overflow-hidden group perspective-700">
        <div className="transform transition-transform duration-700 group-hover:rotate-[2deg] group-hover:scale-105">
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-background via-surface to-background">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted">
                No Photo
              </span>
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

      {/* Member Info */}
      <div className="flex h-[36%] flex-col items-center justify-center px-4 text-center">
        <h3 className="font-heading text-base text-text-primary">
          {member.name}
        </h3>
        <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-accent-blue">
          {member.position}
        </p>
        {member.email && (
          <p className="mt-1 text-[11px] text-text-muted">{member.email}</p>
        )}

        {/* Socials */}
        <div className="mt-3 flex items-center gap-3">
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noreferrer"
              className="
                flex h-8 w-8 items-center justify-center rounded-full
                border border-border bg-background/80 text-text-muted
                transition hover:border-accent-green hover:text-accent-green
              "
            >
              <Github className="h-4 w-4" />
            </a>
          )}

          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              className="
                flex h-8 w-8 items-center justify-center rounded-full
                border border-border bg-background/80 text-text-muted
                transition hover:border-accent-blue hover:text-accent-blue
              "
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllMembers;
