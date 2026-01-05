import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Loader2 } from "lucide-react";
import api from "../services/api.js";
import { convertDriveLinkToImageUrl } from "../utils/imageUtils.js";

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
  const [members, setMembers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersResponse, positionsResponse] = await Promise.all([
          api.getMembers(),
          api.getPositions(),
        ]);

        if (membersResponse.success) {
          setMembers(membersResponse.members || []);
        }
        setPositions(positionsResponse || []);
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

  // Get unique positions from members
  const uniquePositions = [...new Set(members.map(m => m.position).filter(Boolean))];

  const filteredMembers =
    filter === "All"
      ? members
      : members.filter((m) => m.position === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent-red animate-spin" />
      </div>
    );
  }

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
            className="text-xs font-mono uppercase tracking-[0.3em] text-accent-red"
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
            Leadership, contributors, and community members.
          </motion.p>
        </motion.div>

        {/* Filters */}
        {uniquePositions.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {["All", ...uniquePositions].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`
                  px-4 py-1.5 rounded-full border text-xs font-mono tracking-wider
                  transition-all duration-200
                  ${filter === item
                    ? "border-accent-red text-accent-red bg-surface/50 backdrop-blur"
                    : "border-border text-text-muted hover:text-text-primary"
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-muted">No members found</p>
          </div>
        ) : (
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
              <motion.div key={member._id || i} variants={gridReveal} custom={i}>
                <MemberCardFull member={member} />
              </motion.div>
            ))}
          </motion.div>
        )}
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
        hover:border-accent-red/70
        transition-all duration-300
        relative
      "
    >
      {/* Parallax wrapper */}
      <div className="relative h-[64%] w-full overflow-hidden group perspective-700">
        <div className="transform transition-transform duration-700 group-hover:rotate-[2deg] group-hover:scale-105">
          {member.photo ? (
            <img
              src={convertDriveLinkToImageUrl(member.photo)}
              alt={member.name}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'flex';
                }
              }}
            />
          ) : null}
          {/* Fallback when no photo or photo fails to load */}
          <div
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-background via-surface to-background absolute inset-0"
            style={{ display: member.photo ? 'none' : 'flex' }}
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted">
              No Photo
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

      {/* Member Info */}
      <div className="flex h-[36%] flex-col items-center justify-center px-4 text-center">
        <h3 className="font-heading text-base text-text-primary">
          {member.name}
        </h3>
        {member.position && (
          <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-accent-red">
            {member.position}
          </p>
        )}
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
                transition hover:border-accent-red hover:text-accent-red
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
                transition hover:border-accent-red hover:text-accent-red
              "
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}

          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noreferrer"
              className="
                flex h-8 w-8 items-center justify-center rounded-full
                border border-border bg-background/80 text-text-muted
                transition hover:border-accent-red hover:text-accent-red
              "
            >
              <Instagram className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllMembers;
