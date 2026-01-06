import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowLeft, Loader2, X } from "lucide-react";
import api from "../services/api.js";
import Lightbox from "../components/LightBox.jsx";
import { convertDriveLinkToImageUrl } from "../utils/imageUtils.js";

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await api.getEvent(id);
        if (response.success) {
          setEvent(response.event);
        } else {
          setError("Event not found");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderDescriptionWithLinks = (text) => {
    if (!text) return "";
    // Regex to detect URLs (http/https)
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-red hover:underline break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent-red animate-spin" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-4">{error || "Event not found"}</p>
          <button
            onClick={() => navigate("/events")}
            className="px-4 py-2 rounded-lg bg-accent-red text-white hover:bg-accent-redDark transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const allImages = event.image
    ? [event.image, ...(event.gallery || [])]
    : event.gallery || [];

  // Convert all images to direct URLs (handles Google Drive links)
  const convertedImages = allImages.map(img => convertDriveLinkToImageUrl(img));

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="container-cyber max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/events")}
          className="flex items-center gap-2 mb-8 text-text-muted hover:text-accent-red transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-mono uppercase tracking-[0.15em]">
            Back to Events
          </span>
        </button>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent-red" />
                <span>{formatDate(event.date)}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent-red" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-text-primary">
              {event.title}
            </h1>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full border border-accent-red/30 bg-accent-red/10 text-accent-red text-sm font-mono uppercase tracking-[0.15em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Main Image */}
          {event.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl border border-border/70 cursor-pointer group"
              onClick={() => setSelectedImage(convertDriveLinkToImageUrl(event.image))}
            >
              <img
                src={convertDriveLinkToImageUrl(event.image)}
                alt={event.title}
                className="w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          )}

          {/* Description Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Short Description */}
              {event.shortDescription && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-panel p-6"
                >
                  <h2 className="font-heading text-xl mb-3 text-accent-red">
                    Overview
                  </h2>
                  <p className="text-text-primary leading-relaxed">
                    {event.shortDescription}
                  </p>
                </motion.div>
              )}

              {/* Full Description */}
              {event.fullDescription && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-panel p-6"
                >
                  <h2 className="font-heading text-xl mb-3 text-accent-red">
                    Full Description
                  </h2>
                  <div className="text-text-primary leading-relaxed whitespace-pre-line">
                    {event.fullDescription}
                  </div>
                </motion.div>
              )}

              {/* Highlights */}
              {event.highlights && event.highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-panel p-6"
                >
                  <h2 className="font-heading text-xl mb-4 text-accent-red">
                    Key Highlights
                  </h2>
                  <ul className="space-y-3">
                    {event.highlights.map((highlight, index) => (
                      <li
                        key={index}
                        className="flex gap-3 text-text-primary"
                      >
                        <span className="text-accent-red mt-1">▸</span>
                        <span className="flex-1">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Custom Sections */}
              {event.customSections && event.customSections.length > 0 && (
                event.customSections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + index * 0.05 }}
                    className="glass-panel p-6"
                  >
                    <h2 className="font-heading text-xl mb-3 text-accent-red">
                      {section.sectionName}
                    </h2>
                    <div className="text-text-primary leading-relaxed whitespace-pre-line">
                      {renderDescriptionWithLinks(section.description)}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-panel p-6 space-y-4"
              >
                <h3 className="font-heading text-lg text-accent-red border-b border-border pb-2">
                  Event Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-text-muted">Date:</span>
                    <p className="text-text-primary mt-1">{formatDate(event.date)}</p>
                  </div>
                  {event.location && (
                    <div>
                      <span className="text-text-muted">Location:</span>
                      <p className="text-text-primary mt-1">{event.location}</p>
                    </div>
                  )}
                  {event.tags && event.tags.length > 0 && (
                    <div>
                      <span className="text-text-muted">Tags:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {event.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded border border-accent-red/30 bg-accent-red/10 text-accent-red text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Gallery Section */}
          {allImages.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-2xl text-accent-red border-b border-border pb-2">
                Event Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {convertedImages.map((imageUrl, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    onClick={() => setSelectedImage(imageUrl)}
                    className="relative aspect-square overflow-hidden rounded-lg border border-border/70 cursor-pointer group hover:border-accent-red/50 transition-all"
                  >
                    <img
                      src={imageUrl}
                      alt={`Event gallery ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-mono uppercase tracking-[0.15em]">
                        View
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Videos Section */}
          {event.videos && event.videos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-2xl text-accent-red border-b border-border pb-2">
                Event Videos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.videos.map((videoUrl, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="relative aspect-video overflow-hidden rounded-lg border border-border/70 bg-surface"
                  >
                    <video
                      src={convertDriveLinkToImageUrl(videoUrl)}
                      controls
                      className="w-full h-full object-contain"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <Lightbox
          src={convertDriveLinkToImageUrl(selectedImage)}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}

export default EventDetail;


