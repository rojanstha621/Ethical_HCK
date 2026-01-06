import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Loader2 } from "lucide-react";
import api from "../../services/api.js";
import { convertDriveLinkToImageUrl } from "../../utils/imageUtils.js";
import { fadeUp, gridReveal, staggerContainer, sectionReveal } from "../../lib/motion.js";

function MembersSection() {
  const [members, setMembers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, positionsRes] = await Promise.all([
          api.getMembers(),
          api.getPositions(),
        ]);

        if (membersRes.success) {
          setMembers(membersRes.members || []);
        }
        setPositions(positionsRes || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setMembers([]);
        setPositions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="mt-16 space-y-10 border-t border-border/70 pt-12">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-accent-red animate-spin" />
        </div>
      </section>
    );
  }

  if (members.length === 0) {
    return null;
  }

  // Create a map of position names to their order
  const positionOrderMap = positions.reduce((acc, pos) => {
    acc[pos.name] = pos.order || 0;
    return acc;
  }, {});

  // Group members by position
  const groupedByPosition = members.reduce((acc, member) => {
    const position = member.position || "Team Members";
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(member);
    return acc;
  }, {});

  // Sort position groups by order
  const positionGroups = Object.entries(groupedByPosition)
    .map(([title, members]) => ({
      title,
      members,
      order: positionOrderMap[title] !== undefined ? positionOrderMap[title] : 999,
    }))
    .sort((a, b) => a.order - b.order);

  return (
    <motion.section
      className="mt-16 space-y-10 border-t border-border/70 pt-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionReveal}
    >
      {/* Section header */}
      <motion.div className="space-y-3">
        <motion.p
          variants={fadeUp}
          custom={0}
          className="text-xs font-mono uppercase tracking-[0.28em] text-accent-red"
        >
          Core Community
        </motion.p>

        <motion.h2
          variants={fadeUp}
          custom={1}
          className="font-heading text-2xl md:text-3xl"
        >
          People behind Ethical HCK Community
        </motion.h2>

        <motion.p
          variants={fadeUp}
          custom={2}
          className="max-w-2xl text-sm text-text-muted"
        >
          A small, focused group of contributors who drive community operations,
          research, and events.
        </motion.p>
      </motion.div>

      {/* View All Members */}
      <motion.div variants={fadeUp} custom={3} className="flex justify-end">
        <a
          href="/members"
          className="text-xs font-mono uppercase tracking-[0.18em] text-text-muted hover:text-accent-red transition"
        >
          View all members
        </a>
      </motion.div>

      <div className="space-y-14">
        {positionGroups.map((group, groupIndex) => (
          <PositionSection
            key={group.title}
            group={group}
            index={groupIndex}
          />
        ))}
      </div>
    </motion.section>
  );
}

/* Position Section with Infinite Scroll */
function PositionSection({ group, index }) {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate members for seamless infinite scroll (need at least 3 for effect)
  const useMarquee = group.members.length >= 3;
  const trackMembers = useMarquee
    ? [...group.members, ...group.members, ...group.members]
    : group.members;

  const isFastRow = index % 2 === 1;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Position Title */}
      <motion.div
        variants={fadeUp}
        custom={0}
        className="relative flex items-center justify-center"
      >
        <div className="flex-grow border-t border-border/40"></div>
        <div className="w-full text-center space-y-2">
          <h3 className="font-heading text-lg md:text-xl inline-block px-4">
            {group.title}
          </h3>
          <div className="group-title-line"></div>
        </div>
        <div className="flex-grow border-t border-border/40"></div>
      </motion.div>

      {/* Members Marquee/Grid */}
      {useMarquee ? (
        <div
          className="members-marquee overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            className={`members-marquee-track ${isFastRow ? "members-marquee-track--fast" : ""}`}
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          >
            {trackMembers.map((member, idx) => (
              <MemberCard
                key={`${member._id || member.name}-${idx}`}
                member={member}
                index={idx}
              />
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          className="flex flex-wrap justify-center gap-6"
          variants={staggerContainer}
        >
          {group.members.map((member, idx) => (
            <motion.div key={member._id || member.name} variants={gridReveal} custom={idx}>
              <MemberCard member={member} index={idx} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

/* Member Card Component */
function MemberCard({ member, index }) {
  return (
    <div className="member-card section-card group">
      <div className="relative h-[64%] w-full overflow-hidden">
        {member.photo ? (
          <img
            src={convertDriveLinkToImageUrl(member.photo)}
            alt={member.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) {
                e.target.nextSibling.style.display = 'flex';
              }
            }}
          />
        ) : null}
        {/* Fallback placeholder */}
        <div
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-background via-surface to-background absolute inset-0"
          style={{ display: member.photo ? 'none' : 'flex' }}
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted">
            No Photo
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/40 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

      <div className="flex h-[36%] flex-col items-center justify-center px-4 text-center">
        <h4 className="font-heading text-base text-text-primary">
          {member.name}
        </h4>
        {member.position && (
          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-accent-red">
            {member.position}
          </p>
        )}
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
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/50 text-text-muted transition hover:border-accent-red hover:text-accent-red"
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
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/50 text-text-muted transition hover:border-accent-red hover:text-accent-red"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}

          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label={`Instagram profile of ${member.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/50 text-text-muted transition hover:border-accent-red hover:text-accent-red"
            >
              <Instagram className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default MembersSection;
