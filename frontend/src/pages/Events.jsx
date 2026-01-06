import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader2, Calendar, MapPin, ArrowRight, ChevronDown } from "lucide-react";
import api from "../services/api.js";
import Lightbox from "../components/LightBox.jsx";
import { convertDriveLinkToImageUrl } from "../utils/imageUtils.js";

/* ---------------- Constants ---------------- */
const EVENTS_PER_PAGE = 6;

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
  const [visibleCount, setVisibleCount] = useState(EVENTS_PER_PAGE);
  const navigate = useNavigate();
  const showMoreRef = useRef(null);

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

  // Get visible events based on current count
  const visibleEvents = useMemo(() => {
    return events.slice(0, visibleCount);
  }, [events, visibleCount]);

  const hasMoreEvents = visibleCount < events.length;
  const remainingEvents = events.length - visibleCount;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + EVENTS_PER_PAGE, events.length));
    // Scroll to show new events after a short delay
    setTimeout(() => {
      if (showMoreRef.current) {
        showMoreRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

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
      <main className="h-[calc(100vh-80px)] overflow-y-auto snap-y snap-mandatory no-scrollbar">
        {visibleEvents.map((event, index) => (
          <EventSlide
            key={event._id || event.id}
            event={event}
            index={index}
            openLightbox={setLightbox}
            navigate={navigate}
            formatDate={formatDate}
          />
        ))}

        {/* Show More Section */}
        {hasMoreEvents && (
          <section
            ref={showMoreRef}
            className="snap-start min-h-[calc(100vh-100px)] flex items-center justify-center overflow-hidden relative"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-8 p-10 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10"
            >
              <div className="space-y-2">
                <p className="text-text-muted text-sm font-mono uppercase tracking-[0.2em]">
                  {remainingEvents} more event{remainingEvents > 1 ? "s" : ""} to explore
                </p>
                <h2 className="font-heading text-3xl md:text-4xl text-text-primary">
                  Want to see more?
                </h2>
              </div>

              <motion.button
                onClick={handleShowMore}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-accent-red bg-accent-red/10 text-accent-red text-lg font-mono uppercase tracking-[0.15em] hover:bg-accent-red hover:text-white transition-all duration-300 group"
              >
                <span>Show More Events</span>
                <ChevronDown className="h-5 w-5 group-hover:animate-bounce" />
              </motion.button>

              <p className="text-text-muted/60 text-xs">
                Showing {visibleCount} of {events.length} events
              </p>
            </motion.div>
          </section>
        )}

        {/* End Message when all events are shown */}
        {!hasMoreEvents && events.length > EVENTS_PER_PAGE && (
          <section className="snap-start min-h-[50vh] flex items-center justify-center overflow-hidden relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <p className="text-text-muted text-sm font-mono uppercase tracking-[0.2em]">
                You've seen all {events.length} events
              </p>
              <div className="w-16 h-1 bg-accent-red/50 mx-auto rounded-full" />
            </motion.div>
          </section>
        )}
      </main>

      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}

/* ---------------- Event Slide ---------------- */
function EventSlide({ event, index, openLightbox, navigate, formatDate }) {
  const isRight = index % 2 === 0;
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
      className="snap-start min-h-[calc(100vh-100px)] flex items-center overflow-hidden relative"
    >
      <div className="container-cyber max-w-6xl -translate-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          {/* IMAGE */}
          <motion.div
            style={{ y }}
            onClick={() => image && openLightbox(image)}
            className={["relative", isRight ? "lg:order-1" : "lg:order-2", image ? "cursor-pointer group" : ""].join(" ")}
          >
            <div className="overflow-hidden rounded-xl border border-accent-red/30 shadow-lg shadow-accent-red/20 h-[300px] lg:h-[420px]">
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
              {/* Featured Badge */}
              {event.showOnHomepage && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent-red/90 text-white text-xs font-medium backdrop-blur">
                  Featured
                </div>
              )}
            </div>
          </motion.div>

          {/* CONTENT */}
          <motion.div
            variants={slideIn(isRight ? "right" : "left")}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className={["flex flex-col p-6 md:p-8 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 h-[300px] lg:h-[420px] overflow-y-auto", isRight ? "lg:order-2" : "lg:order-1"].join(" ")}
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
