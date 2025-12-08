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
    <header className="fixed inset-x-0 top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur">
      {/* subtle gradient line at bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-accent-green via-accent-blue to-accent-green opacity-70" />

      <div className="container-cyber flex h-16 items-center justify-between gap-4">
        {/* Left: Logo / wordmark */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface/80 shadow-inner">
            <div className="absolute inset-0 rounded-2xl bg-[conic-gradient(from_180deg_at_50%_50%,rgba(0,245,160,0.32),transparent_40%,rgba(0,198,255,0.32),transparent_80%)] opacity-30 blur-md" />
            <Shield className="relative h-5 w-5 text-accent-green" />
          </div>
          <div className="leading-tight">
            <div className="font-heading text-base uppercase tracking-[0.28em] text-text-primary">
              Ethical HCK
            </div>
            <div className="text-[11px] font-mono text-text-muted">
              ethical • focused • secure
            </div>
          </div>
        </div>

        {/* Center: Nav links inside glass pill */}
        <nav className="hidden md:flex items-center justify-center flex-1">
          <div className="inline-flex items-center gap-4 rounded-full border border-border bg-surface/70 px-4 py-2 backdrop-blur">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  [
                    "relative px-2 text-xs font-medium uppercase tracking-[0.18em]",
                    "text-text-muted transition-colors",
                    "hover:text-text-primary",
                    isActive ? "text-text-primary" : "",
                  ].join(" ")
                }
              >
                <span>{item.name}</span>
                {/* active indicator */}
                <span
                  className={({ isActive }) =>
                    isActive ? "" : "hidden"
                  }
                />
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Right: tiny status pill */}
        <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-text-muted">
          <span className="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
          <span className="uppercase tracking-[0.18em]">
            community online
          </span>
        </div>

        {/* Mobile: only logo + simple menu hint (no actual drawer yet) */}
        <div className="flex items-center gap-2 md:hidden">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">
            Menu
          </span>
          <span className="h-1 w-5 rounded-full bg-gradient-to-r from-accent-green to-accent-blue" />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
