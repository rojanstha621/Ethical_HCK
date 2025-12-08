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
      {/* Section header */}
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
          A small, focused group of contributors who drive community operations,
          research, and events.
        </motion.p>
      </motion.div>

      {/* One single “View All Members” */}
      <div className="flex justify-end">
        <a
          href="/members"
          className="text-xs font-mono uppercase tracking-[0.18em] text-text-muted hover:text-accent-blue transition"
        >
          View all members
        </a>
      </div>

      <div className="space-y-14">
        {memberGroups.map((group, index) => {
          const trackMembers = [...group.members, ...group.members];
          const isFastRow = index % 2 === 1;

          return (
            <motion.div
              key={group.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              custom={index}
              variants={fadeUp}
              className="space-y-6"
            >
              {/* CENTERED TITLE WITH ANIMATION */}
              <motion.div
                variants={fadeUp}
                className="relative flex items-center justify-center"
              >
                <div className="flex-grow border-t border-border/40"></div>
                <div className="w-full text-center space-y-2">
                    <h3 className="font-heading text-lg md:text-xl inline-block px-4">
                        {group.title}
                    </h3>

                    {/* neon sweep line */}
                    <div className="group-title-line"></div>
                    </div>


                <div className="flex-grow border-t border-border/40"></div>
              </motion.div>

              {/* Group description */}
              {group.description && (
                <p className="text-center text-xs text-text-muted">
                  {group.description}
                </p>
              )}

              {/* AUTO-SCROLL ROW WITH HOVER / TOUCH PAUSE */}
              <div className="members-marquee" tabIndex={0} aria-label={group.title}>
                <div
                  className={`members-marquee-track ${
                    isFastRow ? "members-marquee-track--fast" : ""
                  }`}
                >
                  {trackMembers.map((member, idx) => (
                    <MemberCard
                      key={`${member.name}-${idx}`}
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

        <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/40 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

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
              aria-label={`GitHub profile of ${member.name}`}
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
              aria-label={`LinkedIn profile of ${member.name}`}
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
