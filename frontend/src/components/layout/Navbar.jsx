import React from "react";
import { NavLink } from "react-router-dom";
import { Shield } from "lucide-react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Events", path: "/events" },
  { name: "Projects", path: "/projects" },
];

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-border/80 bg-background/70 backdrop-blur">
      <div className="container-cyber flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface/80 shadow-inner shadow-accent-blue/40">
            <Shield className="h-4 w-4 text-accent-green" />
          </div>
          <div className="leading-tight">
            <div className="font-heading text-sm uppercase tracking-[0.25em] text-text-muted">
              Ethical HCK
            </div>
            <div className="text-[11px] font-mono text-accent-blue">
              Cybersecurity Community
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "nav-link",
                  isActive ? "text-text-primary" : "",
                ].join(" ")
              }
              end={item.path === "/"}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Simple CTA */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden text-xs font-mono uppercase tracking-[0.18em] text-text-muted md:inline-flex"
          >
            v0.1 • Preview
          </button>
          <button type="button" className="btn-primary text-xs">
            Join
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
