import React from "react";

function Footer() {
  return (
    <footer className="border-t border-border/80 bg-background/80">
      <div className="container-cyber flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-heading text-sm text-text-primary">
            Ethical HCK Community
          </div>
          <p className="mt-1 max-w-md text-xs text-text-muted">
            Empowering students to explore ethical hacking, security research,
            and digital forensics in a safe and guided environment.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
          <span>© {new Date().getFullYear()} Ethical HCK Community</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <button type="button" className="hover:text-accent-blue transition">
            Code of Conduct
          </button>
          <span className="h-1 w-1 rounded-full bg-border" />
          <button type="button" className="hover:text-accent-blue transition">
            Contact
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
