import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader2, Calendar, MapPin, ArrowRight, ChevronDown } from "lucide-react";
import api from "../services/api.js";
import Lightbox from "../components/LightBox.jsx";
import { convertDriveLinkToImageUrl } from "../utils/imageUtils.js";

/* ---------------- Constants ---------------- */


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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.getEvents();
        if (response.success) {
          // Sort by date (newest first)
          const sortedEvents = (response.events || []).sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setEvents(sortedEvents);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [events]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent-red animate-spin" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-20 flex items-center justify-center">
        <div className="text-center py-20 glass-panel px-12">
          <p className="text-text-muted">No events found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 relative min-h-screen">
      <main className="space-y-24 pb-20">
        {/* Hero Section */}
        <section className="py-10 md:py-20 relative">
          <motion.div
            className="max-w-4xl space-y-4 mx-auto text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted mx-auto">
              <Calendar className="h-3 w-3 text-accent-red" />
              Events & Workshops
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-text-primary">
              Our <span className="gradient-text">Events</span>
            </h1>
            <p className="text-base md:text-lg text-text-muted max-w-2xl leading-relaxed mx-auto">
              Join our interactive workshops, capture the flag competitions, and expert talks.
              Stay ahead in the cybersecurity game.
            </p>


          </motion.div>
        </section>

        <div className="space-y-24">
          {sortedEvents.map((event, index) => (
            <EventSlide
              key={event._id || event.id}
              event={event}
              index={index}
              openLightbox={setLightbox}
              navigate={navigate}
              formatDate={formatDate}
            />
          ))}
        </div>
      </main>

      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}

/* ---------------- Event Slide ---------------- */
function EventSlide({ event, index, openLightbox, navigate, formatDate }) {
  const isRight = index % 2 !== 0; // Alternating layout: 0=Left(Image First), 1=Right(Text First)
  const isUpcoming = new Date(event.date) >= new Date(); // Check if event is upcoming
  const image = event.image ? convertDriveLinkToImageUrl(event.image) : null;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  const handleViewDetails = () => {
    navigate(`/events/${event._id || event.id}`);
  };

  return (
    <section
      ref={ref}
      className="flex items-center relative py-10"
    >
      <div className="container-cyber max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          {/* IMAGE */}
          <motion.div
            style={{ y }}
            onClick={() => image && openLightbox(image)}
            className={["relative", isRight ? "lg:order-2" : "lg:order-1", image ? "cursor-pointer group" : ""].join(" ")}
          >
            <div className="overflow-hidden rounded-xl border border-accent-red/30 shadow-lg shadow-accent-red/20 h-[300px] lg:h-[420px] relative">
              {image ? (
                <img
                  src={image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                  <Calendar className="h-16 w-16 text-accent-red/20 mb-4" />
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-text-muted/50">No Image</span>
                </div>
              )}

              {/* Badges Container */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                {/* Featured Badge */}
                {event.showOnHomepage && (
                  <div className="px-3 py-1 rounded-full bg-accent-red/90 text-white text-xs font-medium backdrop-blur shadow-lg">
                    Featured
                  </div>
                )}

                {/* Upcoming Badge */}
                {isUpcoming && (
                  <div className="px-3 py-1 rounded-full bg-green-500/90 text-white text-xs font-medium backdrop-blur shadow-lg">
                    Upcoming
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* CONTENT */}
          <motion.div
            variants={slideIn(isRight ? "right" : "left")}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className={["flex flex-col p-6 md:p-8 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 h-[300px] lg:h-[420px] overflow-y-auto", isRight ? "lg:order-1" : "lg:order-2"].join(" ")}
          >
            {/* Content wrapper */}
            <div className="space-y-4 flex-1">
              {/* Title */}
              <h2
                className="font-heading text-3xl md:text-4xl text-text-primary neon-text"
                data-text={event.title}
              >
                {event.title}
              </h2>

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-accent-red">
                <Calendar className="h-4 w-4" />
                <span className="font-mono uppercase tracking-[0.15em]">{formatDate(event.date)}</span>
              </div>

              {/* Location */}
              {event.location && (
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <MapPin className="h-4 w-4 text-accent-red" />
                  <span>{event.location}</span>
                </div>
              )}

              {/* Short Description */}
              {event.shortDescription && (
                <p className="max-w-xl text-sm md:text-base text-text-muted leading-relaxed">
                  {event.shortDescription}
                </p>
              )}

              {/* Highlights */}
              {event.highlights && event.highlights.length > 0 && (
                <ul className="space-y-2 text-sm text-text-muted">
                  {event.highlights.slice(0, 4).map((highlight, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <span className="text-accent-red mt-0.5">▸</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                  {event.highlights.length > 4 && (
                    <li className="text-accent-red/60 text-xs font-mono">
                      +{event.highlights.length - 4} more highlights
                    </li>
                  )}
                </ul>
              )}

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {event.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-accent-red/30 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-accent-red hover:scale-105 transition-transform hover:bg-accent-red/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

            </div>

            {/* View Details Button - Always at bottom */}
            <motion.button
              onClick={handleViewDetails}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 mt-auto pt-4 px-6 py-3 rounded-full border border-accent-red/50 bg-accent-red/10 text-accent-red text-sm font-mono uppercase tracking-[0.15em] hover:bg-accent-red/20 hover:border-accent-red transition-all duration-300 group self-start"
            >
              <span>View Details</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
