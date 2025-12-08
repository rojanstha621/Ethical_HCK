// src/pages/AllMembers.jsx
import React from "react";
import { allMembers } from "../data/members.js";
import { Github, Linkedin, Mail } from "lucide-react";

function AllMembers() {
  return (
    <div className="py-10 md:py-14">
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl">
          All Community Members
        </h1>
        <p className="mt-1 text-xs md:text-sm text-text-muted max-w-xl">
          A complete list of the people contributing to Ethical HCK Community as
          leaders, coordinators, and active members.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allMembers.map((member) => (
          <div
            key={member.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-soft-glow"
          >
            <div className="relative h-40 w-full overflow-hidden">
              <img
                src={member.imageUrl}
                alt={member.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </div>

            <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
              <div>
                <h2 className="font-heading text-sm md:text-base">
                  {member.name}
                </h2>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-accent-green">
                  {member.position}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-text-muted">
                  {member.group}
                </p>
                {member.email && (
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-text-muted">
                    <Mail className="h-3 w-3 text-accent-blue/70" />
                    <span className="truncate">{member.email}</span>
                  </div>
                )}
              </div>

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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllMembers;
