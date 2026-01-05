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
      {/* subtle red line at bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-accent-red opacity-30" />

      <div className="container-cyber flex h-16 items-center justify-between gap-4">
        {/* Left: Logo / wordmark */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface/80 shadow-inner">
            <div className="absolute inset-0 rounded-2xl bg-accent-red opacity-20 blur-md" />
            <Shield className="relative h-5 w-5 text-accent-red" />
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
                    "hover:text-accent-red",
                    isActive ? "text-accent-red" : "",
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
          <span className="h-2 w-2 rounded-full bg-accent-red animate-pulse" />
          <span className="uppercase tracking-[0.18em]">
            community online
          </span>
        </div>

        {/* Mobile: Hamburger menu */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            className="flex flex-col gap-1.5 p-2"
            aria-label="Menu"
          >
            <span className="h-0.5 w-6 rounded-full bg-accent-red transition-all" />
            <span className="h-0.5 w-6 rounded-full bg-accent-red transition-all" />
            <span className="h-0.5 w-6 rounded-full bg-accent-red transition-all" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
