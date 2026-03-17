import React, { useMemo, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lightbox from "../components/LightBox.jsx";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { events } from "../data/events";

/* ---------------- Animations ---------------- */
const slideIn = (side) => ({
  hidden: { opacity: 0, x: side === "right" ? 100 : -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 0.61, 0.36, 1] },
  },
});

export default function Events() {
  const list = useMemo(() => events, []);
  const [lightbox, setLightbox] = useState(null);

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  return (
    <div className="pt-20 relative">
      {/* Particle background */}
      {/* <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "#0A0A0A" } },
          fpsLimit: 60,
          interactivity: { events: { onHover: { enable: true, mode: "repulse" } } },
          particles: {
            color: { value: "#0ff" },
            links: { color: "#0ff", distance: 150, enable: true, opacity: 0.2, width: 1 },
            collisions: { enable: false },
            move: { enable: true, speed: 0.3, outModes: { default: "bounce" } },
            number: { density: { enable: true, area: 800 }, value: 50 },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
        }}
      /> */}

      <main className="h-[calc(100vh-80px)] overflow-y-auto snap-y snap-mandatory no-scrollbar">
        {list.map((event, index) => (
          <EventSlide
            key={event.id}
            event={event}
            index={index}
            openLightbox={setLightbox}
          />
        ))}
      </main>

      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}

/* ---------------- Event Slide ---------------- */
function EventSlide({ event, index, openLightbox }) {
  const isRight = index % 2 === 0;
  const image = event.images?.[0];
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section
      ref={ref}
      className="snap-start min-h-[calc(100vh-100px)] flex items-center overflow-hidden relative"
    >
      <div className="container-cyber max-w-6xl -translate-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          {/* IMAGE */}
          <motion.div
            style={{ y }}
            onClick={() => openLightbox(image)}
            className={["relative cursor-pointer group", isRight ? "lg:order-1" : "lg:order-2"].join(" ")}
          >
            <div className="overflow-hidden rounded-xl border border-accent-green/30 bg-black shadow-lg shadow-cyan/40">
              <img
                src={image}
                alt={event.title}
                className="h-[300px] lg:h-[420px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
            </div>
          </motion.div>

          {/* CONTENT */}
          <motion.div
            variants={slideIn(isRight ? "right" : "left")}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className={["space-y-6", isRight ? "lg:order-2" : "lg:order-1"].join(" ")}
          >
            <div className="flex gap-4 text-[11px] font-mono uppercase tracking-[0.3em] text-accent-green">
              <span>{event.year}</span>
              <span className="text-text-muted">{event.category}</span>
            </div>

            <h2 className="font-heading text-3xl md:text-4xl text-text-primary">
              {event.title}
            </h2>

            {event.subtitle && (
              <p className="text-[12px] font-mono uppercase tracking-[0.28em] text-accent-blue/90">
                {event.subtitle}
              </p>
            )}

            <p className="max-w-xl text-sm md:text-base text-text-muted leading-relaxed">
              {event.description}
            </p>

            {/* Highlights */}
            {event.highlights && (
              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-2 text-sm text-text-muted"
              >
                {event.highlights.map((h) => (
                  <motion.li key={h} className="flex gap-2" whileHover={{ scale: 1.02 }}>
                    <span className="text-accent-green">▸</span>
                    {h}
                  </motion.li>
                ))}
              </motion.ul>
            )}

            {/* Tools */}
            {event.tools && (
              <div className="flex flex-wrap gap-2 pt-2">
                {event.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-accent-green/30 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-accent-green hover:scale-105 transition-transform"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
