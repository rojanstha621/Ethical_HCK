import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Loader2, ArrowRight } from "lucide-react";
import api from "../services/api.js";
import { fadeUp, staggerContainer } from "../lib/motion.js";
import { convertDriveLinkToImageUrl } from "../utils/imageUtils.js";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
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
      <div className="min-h-screen bg-background pt-20 pb-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="container-cyber max-w-6xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="space-y-4 mb-12 border-b border-border/70 pb-6"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-mono uppercase tracking-[0.3em] text-accent-red"
          >
            All Events
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-heading text-3xl md:text-4xl lg:text-5xl"
          >
            Community Events
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-sm text-text-muted"
          >
            Explore all our workshops, CTFs, and community gatherings.
          </motion.p>
        </motion.div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-20 glass-panel">
            <p className="text-text-muted">No events found</p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {events.map((event, index) => (
              <motion.div
                key={event._id || event.id}
                variants={fadeUp}
                custom={index}
                onClick={() => navigate(`/events/${event._id || event.id}`)}
                className="group relative rounded-2xl border border-border/70 bg-surface/80 backdrop-blur overflow-hidden cursor-pointer hover:border-accent-red/60 transition-all duration-300 hover:shadow-soft-glow"
              >
                {/* Image */}
                {event.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={convertDriveLinkToImageUrl(event.image)}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {event.showOnHomepage && (
                      <div className="absolute top-2 right-2 px-2 py-1 rounded bg-accent-red/80 text-white text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-accent-red">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>

                  <h3 className="font-heading text-xl text-text-primary group-hover:text-accent-red transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-sm text-text-muted line-clamp-3">
                    {event.shortDescription || event.fullDescription}
                  </p>

                  {event.location && (
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {event.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded border border-accent-red/30 bg-accent-red/10 text-accent-red text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {event.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs text-text-muted">
                          +{event.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Read More */}
                  <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-[0.12em] text-accent-red/0 group-hover:text-accent-red transition-all duration-300 pt-2">
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
