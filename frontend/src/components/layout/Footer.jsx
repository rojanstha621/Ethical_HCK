import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";

function Footer() {
  return (
    <footer className="relative border-t border-border/70 bg-gradient-to-t from-background/95 via-background/85 to-background/90 pt-12 mt-10">
      {/* Subtle glow / decoration behind footer */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 -top-10 h-24 bg-[radial-gradient(circle_at_top,_rgba(0,245,160,0.18),_transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(circle_at_bottom,_rgba(0,198,255,0.16),_transparent_60%)]" />
      </div>

      <div className="container-cyber">
        {/* Inner gradient divider */}
        <div className="mb-8 h-px w-full bg-gradient-to-r from-accent-green/70 via-accent-blue/60 to-accent-green/70" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & About */}
          <div className="space-y-3">
            <div className="font-heading text-lg text-text-primary">
              Ethical HCK Community
            </div>
            <p className="text-sm text-text-muted">
              Empowering students to explore ethical hacking, cybersecurity, and
              digital forensics in a safe, collaborative, and professional
              environment.
            </p>

            <div className="mt-3 flex gap-4">
              <a
                href="https://github.com/ethicalhck"
                target="_blank"
                rel="noreferrer"
                className="text-text-muted transition hover:text-accent-green"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/ethicalhck"
                target="_blank"
                rel="noreferrer"
                className="text-text-muted transition hover:text-accent-blue"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/ethicalhck"
                target="_blank"
                rel="noreferrer"
                className="text-text-muted transition hover:text-accent-blue"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>

            {/* Small identity chips */}
            {/* <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-text-muted">
              <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 font-mono uppercase tracking-[0.18em]">
                Ethical
              </span>
              <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 font-mono uppercase tracking-[0.18em]">
                Research
              </span>
              <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 font-mono uppercase tracking-[0.18em]">
                Applied Security
              </span>
            </div> */}
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-sm font-heading text-text-primary uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-1 text-sm text-text-muted">
              <li>
                <a href="/about" className="transition hover:text-accent-blue">
                  About
                </a>
              </li>
              <li>
                <a href="/members" className="transition hover:text-accent-blue">
                  Members
                </a>
              </li>
              <li>
                <a href="/events" className="transition hover:text-accent-blue">
                  Events
                </a>
              </li>
              <li>
                <a href="/projects" className="transition hover:text-accent-blue">
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="/resources"
                  className="transition hover:text-accent-blue"
                >
                  Resources
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-heading text-text-primary uppercase tracking-wider">
              Contact
            </h4>
            <p className="text-sm text-text-muted">
              Email:{" "}
              <a
                href="mailto:contact@ethicalhck.org"
                className="transition hover:text-accent-green"
              >
                contact@ethicalhck.org
              </a>
            </p>
            <p className="text-sm text-text-muted">
              Phone:{" "}
              <a
                href="tel:+9779812345678"
                className="transition hover:text-accent-green"
              >
                +977 9812345678
              </a>
            </p>
            <p className="text-sm text-text-muted">Kathmandu, Nepal</p>
          </div>

          {/* Newsletter / Signup */}
          <div className="space-y-2">
            <h4 className="text-sm font-heading text-text-primary uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-sm text-text-muted">
              Stay updated with our latest events, research, and projects.
            </p>
            <form className="mt-2 flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-blue"
              />
              <button
                type="submit"
                className="rounded-lg bg-accent-green px-4 py-2 text-sm font-medium text-black shadow-md shadow-accent-green/30 transition hover:scale-[1.02]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="mt-10 border-t border-border/50 pt-5 pb-4">
        <div className="container-cyber flex flex-col items-center justify-between gap-3 text-center text-[11px] text-text-muted md:flex-row md:text-left">
          <div>
            © {new Date().getFullYear()}{" "}
            <span className="text-text-primary">Ethical HCK Community</span>. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono uppercase tracking-[0.2em]">
              Think Deep. Hack Ethical.
            </span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="text-[10px]">
              Built by the Boss.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
