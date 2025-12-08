import React from "react";

function About() {
  return (
    <section className="py-10 md:py-16 space-y-8">
      <div className="max-w-3xl space-y-4">
        <h1 className="font-heading text-3xl md:text-4xl">
          About Ethical HCK Community
        </h1>
        <p className="text-sm md:text-base text-text-muted">
          Ethical HCK Community is a student-led cybersecurity group focused on
          learning, experimentation and responsible hacking. We run events,
          projects and awareness initiatives to help students explore security
          from fundamentals to advanced topics.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass-panel p-5">
          <h2 className="font-heading text-sm mb-2">Our Mission</h2>
          <p className="text-xs text-text-muted">
            To create a safe, inclusive environment where students can develop
            real-world cybersecurity skills and ethical thinking.
          </p>
        </div>
        <div className="glass-panel p-5">
          <h2 className="font-heading text-sm mb-2">Our Vision</h2>
          <p className="text-xs text-text-muted">
            To become a leading student security community that produces the
            next wave of defenders, researchers and builders.
          </p>
        </div>
        <div className="glass-panel p-5">
          <h2 className="font-heading text-sm mb-2">Core Values</h2>
          <ul className="text-xs text-text-muted space-y-1 list-disc list-inside">
            <li>Ethics first</li>
            <li>Learn by doing</li>
            <li>Open collaboration</li>
            <li>Community over ego</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default About;
