import React, { useEffect } from "react";
import { X } from "lucide-react";

function WelcomePopup({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="Community of the Year announcement"
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-accent-green/40 bg-surface/95 shadow-[0_0_40px_rgba(0,255,85,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-text-muted transition hover:border-accent-green hover:text-accent-green"
          aria-label="Close popup"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid min-h-[560px] grid-cols-1 md:grid-cols-2 lg:min-h-[620px]">
          <div className="relative h-64 md:h-full">
            <img
              src="/events/image.png"
              alt="Ethical HCK members celebrating Community of the Year"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center space-y-5 p-6 md:p-10 md:pr-14 lg:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-green/40 bg-background/70 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-accent-green">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
              Special Announcement
            </div>

            <h2 className="font-heading text-3xl text-text-primary md:text-4xl">
              Community of the Year
            </h2>

            <p className="text-sm leading-relaxed text-text-muted md:text-base">
              Ethical HCK Community is honored to be recognized as Community of
              the Year for impactful cybersecurity awareness, ethical hacking
              workshops, and student-led innovation.
            </p>

            <p className="text-xs font-mono uppercase tracking-[0.16em] text-accent-blue/90">
              Thank you to every member, mentor, and supporter who made this
              possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomePopup;
