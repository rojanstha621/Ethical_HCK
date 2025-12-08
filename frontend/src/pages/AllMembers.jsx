import React from "react";
import { motion } from "framer-motion";
import { memberGroups } from "../data/members";
import { Github, Linkedin } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.5,
      ease: [0.22, 0.61, 0.36, 1],
    },
  }),
};

function AllMembers() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container-cyber space-y-12">
        {/* Header */}
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
            All members of Ethical HCK Community
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-sm text-text-muted"
          >
            Steering leadership, department leads, contributors, and general
            members who keep the community running and the projects alive.
          </motion.p>
        </motion.div>

        {/* Groups */}
        <div className="space-y-10">
          {memberGroups.map((group, index) => {
            const trackMembers = [...group.members, ...group.members];
            const isFastRow = index % 2 === 1;

            return (
              <motion.section
                key={group.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                custom={index}
                variants={fadeUp}
                className="space-y-4"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-xl md:text-2xl">
                      {group.title}
                    </h2>
                    {group.description && (
                      <p className="mt-1 text-xs text-text-muted">
                        {group.description}
                      </p>
                    )}
                  </div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-text-muted">
                    {group.members.length} members
                  </p>
                </div>

                <div className="members-marquee">
                  <div
                    className={`members-marquee-track ${
                      isFastRow ? "members-marquee-track--fast" : ""
                    }`}
                  >
                    {trackMembers.map((member, idx) => (
                      <MemberCardFull
                        key={`${member.email || member.name}-${idx}`}
                        member={member}
                      />
                    ))}
                  </div>
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MemberCardFull({ member }) {
  return (
    <div className="member-card">
      <div className="relative h-[64%] w-full overflow-hidden">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-background via-surface to-background">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted">
              No Photo
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      </div>

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

export default AllMembers;
