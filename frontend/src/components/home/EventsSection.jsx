import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import { fadeUp, gridReveal, staggerContainer, sectionReveal } from "../../lib/motion.js";
import { convertDriveLinkToImageUrl } from "../../utils/imageUtils.js";

function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.getEvents();
        if (response.success) {
          const homepageEvents = (response.events || [])
            .filter((event) => event.showOnHomepage)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 6);
          setEvents(homepageEvents);
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

  if (loading) {
    return (
      <section className="mt-16 space-y-10 border-t border-border/70 pt-12">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-accent-red animate-spin" />
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Duplicate events for infinite scroll effect
  const scrollEvents = events.length >= 3 ? [...events, ...events, ...events] : events;
  const useMarquee = events.length >= 3;

  return (
    <motion.section
      className="mt-16 space-y-10 border-t border-border/70 pt-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionReveal}
    >
      {/* Section header */}
      <motion.div className="space-y-3">
        <motion.p
          variants={fadeUp}
          custom={0}
          className="text-xs font-mono uppercase tracking-[0.28em] text-accent-red"
        >
          Recent Events
        </motion.p>

        <motion.h2
          variants={fadeUp}
          custom={1}
          className="font-heading text-2xl md:text-3xl"
        >
          Community Events & Activities
        </motion.h2>

        <motion.p
          variants={fadeUp}
          custom={2}
          className="max-w-2xl text-sm text-text-muted"
        >
          Explore our recent workshops, CTFs, and community gatherings.
        </motion.p>
      </motion.div>

      {/* View All Link */}
      <motion.div variants={fadeUp} custom={3} className="flex justify-end">
        <button
          onClick={() => navigate("/events")}
          className="text-xs font-mono uppercase tracking-[0.18em] text-text-muted hover:text-accent-red transition"
        >
          View all events
        </button>
      </motion.div>

      {/* Events Horizontal Scroll */}
      {useMarquee ? (
        <motion.div variants={fadeUp} custom={4}>
          <div
            className="events-marquee overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div
              className="events-marquee-track"
              style={{ animationPlayState: isPaused ? "paused" : "running" }}
            >
              {scrollEvents.map((event, index) => (
                <EventCard
                  key={`${event._id || event.id}-${index}`}
                  event={event}
                  navigate={navigate}
                  formatDate={formatDate}
                  index={index}
                />
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
        >
          {events.map((event, idx) => (
            <motion.div key={event._id || event.id} variants={gridReveal} custom={idx}>
              <EventCard
                event={event}
                navigate={navigate}
                formatDate={formatDate}
                index={idx}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
}

function EventCard({ event, navigate, formatDate, index }) {
  return (
    <div
      onClick={() => navigate(`/events/${event._id || event.id}`)}
      className="event-card group relative rounded-2xl border border-white/10 bg-black/70 backdrop-blur-md overflow-hidden cursor-pointer flex-shrink-0 w-[320px]"
    >
      {/* Image */}
      {event.image && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={convertDriveLinkToImageUrl(event.image)}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-accent-red">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(event.date)}</span>
        </div>

        <h3 className="font-heading text-lg text-text-primary group-hover:text-accent-red transition-colors line-clamp-1">
          {event.title}
        </h3>

        <p className="text-sm text-text-muted line-clamp-2">
          {event.shortDescription || event.fullDescription}
        </p>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded border border-accent-red/30 bg-accent-red/10 text-accent-red text-[10px]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Read More */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.12em] text-accent-red/0 group-hover:text-accent-red transition-all duration-300">
          <span>Read more</span>
          <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}

export default EventsSection;
