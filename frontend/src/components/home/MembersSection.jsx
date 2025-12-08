// src/components/home/MembersSection.jsx
import React from "react";
import { memberPositions } from "../../data/members.js";
import { Github, Linkedin, Mail } from "lucide-react";

function MembersSection({ onViewAll }) {
  return (
    <section className="py-12 md:py-16">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl md:text-3xl">
            Core Members & Community
          </h2>
          <p className="mt-1 text-xs md:text-sm text-text-muted max-w-xl">
            A curated group of learners, builders, and researchers driving the
            Ethical HCK Community.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="btn-outline text-xs md:text-sm"
        >
          View All Members
        </button>
      </div>

      <div className="space-y-10">
        {memberPositions.map((group) =>
          group.members.length ? (
            <div key={group.key} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-heading text-sm md:text-base uppercase tracking-[0.16em] text-text-muted">
                  {group.label}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-border via-border/40 to-transparent" />
              </div>

              {/* Horizontal scroll row */}
              <div className="relative">
                {/* gradient fade left */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background via-background/70 to-transparent" />
                {/* gradient fade right */}
                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background via-background/70 to-transparent" />

                <div className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth py-1">
                  {group.members.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>
    </section>
  );
}

function MemberCard({ member }) {
  return (
    <div className="group relative flex w-56 md:w-60 shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-soft-glow">
      {/* Photo */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={member.imageUrl}
          alt={member.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <div>
          <h4 className="font-heading text-sm md:text-base">
            {member.name}
          </h4>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-accent-green">
            {member.position}
          </p>
          {member.email && (
            <div className="mt-1 flex items-center gap-1 text-[11px] text-text-muted">
              <Mail className="h-3 w-3 text-accent-blue/70" />
              <span className="truncate">{member.email}</span>
            </div>
          )}
        </div>

        {/* Socials */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border/70 bg-background/80 text-text-muted transition hover:border-accent-green hover:text-accent-green"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border/70 bg-background/80 text-text-muted transition hover:border-accent-blue hover:text-accent-blue"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          <span className="rounded-full bg-background/80 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-text-muted">
            member
          </span>
        </div>
      </div>
    </div>
  );
}

export default MembersSection;
