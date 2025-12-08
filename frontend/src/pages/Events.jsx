import React from "react";

const dummyEvents = [
  {
    title: "Cyber यात्रा: Dark Web 101",
    date: "2025-01-15",
    type: "Workshop",
    status: "Upcoming",
    description:
      "Introduction to the dark web, Tor, and legality with a strong focus on ethics and safety.",
  },
  {
    title: "Ethical Padarshan",
    date: "2024-10-10",
    type: "Showcase",
    status: "Past",
    description:
      "Student-led demos of security projects, tools and research with live walkthroughs.",
  },
  {
    title: "Digital Forensics Hands-on",
    date: "2024-11-20",
    type: "Workshop",
    status: "Past",
    description:
      "Practical lab on disk, memory and log analysis using open-source tools.",
  },
];

function Events() {
  return (
    <section className="py-10 md:py-16 space-y-8">
      <div className="max-w-3xl space-y-3">
        <h1 className="font-heading text-3xl md:text-4xl">Events</h1>
        <p className="text-sm md:text-base text-text-muted">
          Workshops, talks, competitions and showcases that help you grow in
          ethical hacking, forensics, and security research.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {dummyEvents.map((ev) => (
          <div key={ev.title} className="glass-panel p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-text-muted">
                  {ev.type}
                </div>
                <h2 className="font-heading text-sm mt-1">{ev.title}</h2>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-mono uppercase tracking-[0.15em] ${
                  ev.status === "Upcoming"
                    ? "bg-accent-green/10 text-accent-green border border-accent-green/40"
                    : "bg-surface text-text-muted border border-border"
                }`}
              >
                {ev.status}
              </span>
            </div>
            <div className="text-xs text-text-muted">
              <span className="font-mono">{ev.date}</span>
            </div>
            <p className="text-xs text-text-muted">{ev.description}</p>
            {ev.status === "Upcoming" && (
              <div className="pt-1">
                <button type="button" className="btn-outline text-xs">
                  Register Interest
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Events;
