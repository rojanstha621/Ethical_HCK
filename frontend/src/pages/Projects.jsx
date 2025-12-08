import React from "react";

const projects = [
  {
    name: "Cyber यात्रा: Dark Web Event",
    focus: "Awareness & Exploration",
    description:
      "Guided walkthrough of the dark web, anonymity tools and safety practices with strict ethical framing.",
  },
  {
    name: "Ethical Padarshan",
    focus: "Project Showcase",
    description:
      "Platform where members present security tools, scripts, and research to peers and mentors.",
  },
  {
    name: "Cyber Padarshan",
    focus: "Security Demos",
    description:
      "Live demonstrations of attacks and defenses in controlled environments to teach core concepts.",
  },
  {
    name: "Digital Forensics Workshop",
    focus: "Forensics",
    description:
      "Hands-on case studies with log files, disk images and incident timelines.",
  },
];

function Projects() {
  return (
    <section className="py-10 md:py-16 space-y-8">
      <div className="max-w-3xl space-y-3">
        <h1 className="font-heading text-3xl md:text-4xl">Projects & Initiatives</h1>
        <p className="text-sm md:text-base text-text-muted">
          Long-term initiatives and flagship events that define the Ethical HCK
          Community and give members real-world exposure.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p) => (
          <div key={p.name} className="glass-panel p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-sm">{p.name}</h2>
              <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] text-accent-blue font-mono uppercase tracking-[0.15em]">
                {p.focus}
              </span>
            </div>
            <p className="text-xs text-text-muted">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
