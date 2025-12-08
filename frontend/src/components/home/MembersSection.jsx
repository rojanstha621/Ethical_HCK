import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { memberGroups } from "../../data/members";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.22, 0.61, 0.36, 1],
    },
  }),
};

function MembersSection() {
  return (
    <section className="mt-16 space-y-10 border-t border-border/70 pt-12">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="space-y-3"
      >
        <motion.p
          variants={fadeUp}
          className="text-xs font-mono uppercase tracking-[0.28em] text-accent-green"
        >
          Core Community
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-heading text-2xl md:text-3xl"
        >
          People behind Ethical HCK Community
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="max-w-2xl text-sm text-text-muted"
        >
          A small, focused group of students and contributors who help design
          events, projects, and research directions for the community.
        </motion.p>
      </motion.div>

      <div className="space-y-10">
        {memberGroups.map((group, index) => {
          // Duplicate members list for seamless infinite scroll
          const trackMembers = [...group.members, ...group.members];

          // If there are very few members, we’ll still duplicate but it’s okay.
          const isFastRow = index % 2 === 1;

          return (
            <motion.div
              key={group.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              custom={index}
              variants={fadeUp}
              className="space-y-4"
            >
              {/* Group header */}
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-heading text-lg md:text-xl">
                    {group.title}
                  </h3>
                  {group.description && (
                    <p className="mt-1 text-xs text-text-muted">
                      {group.description}
                    </p>
                  )}
                </div>

                {/* View all link (goes to full members page) */}
                <a
                  href="/members"
                  className="text-xs font-mono uppercase tracking-[0.18em] text-text-muted hover:text-accent-blue transition"
                >
                  View all members
                </a>
              </div>

              {/* Auto-scrolling row */}
              <div className="members-marquee">
                <div
                  className={`members-marquee-track ${
                    isFastRow ? "members-marquee-track--fast" : ""
                  }`}
                >
                  {trackMembers.map((member, idx) => (
                    <MemberCard
                      key={`${member.email || member.name}-${idx}`}
                      member={member}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function MemberCard({ member }) {
  return (
    <div className="member-card group hover:-translate-y-1 hover:scale-[1.02]">

      {/* Photo zone */}
      <div className="relative h-[64%] w-full overflow-hidden">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-background via-surface to-background">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted">
              No Photo
            </span>
          </div>
        )}

        {/* Subtle top gradient */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/40 via-black/10 to-transparent" />
        {/* Subtle bottom gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

      {/* Text zone */}
      <div className="flex h-[36%] flex-col items-center justify-center px-4 text-center">
        <h4 className="font-heading text-base text-text-primary">
          {member.name}
        </h4>
        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-accent-blue">
          {member.position}
        </p>
        {member.email && (
          <p className="mt-1 text-[11px] text-text-muted">{member.email}</p>
        )}

        <div className="mt-3 flex items-center gap-3">
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/80 text-text-muted transition hover:border-accent-green hover:text-accent-green"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/80 text-text-muted transition hover:border-accent-blue hover:text-accent-blue"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default MembersSection;
