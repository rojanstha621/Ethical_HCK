import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, X as XIcon, Loader2, Plus, Trash2 } from "lucide-react";
import api from "../../services/api.js";
import ImageUpload from "./ImageUpload.jsx";
import MultiImageUpload from "./MultiImageUpload.jsx";
import CustomSections from "./CustomSections.jsx";

function EventForm({ event = null, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: event?.title || "",
    shortDescription: event?.shortDescription || "",
    fullDescription: event?.fullDescription || "",
    date: event?.date ? new Date(event.date).toISOString().split('T')[0] : "",
    location: event?.location || "",
    image: event?.image || "",
    gallery: event?.gallery || [],
    videos: event?.videos || [],
    tags: event?.tags || [],
    highlights: event?.highlights || [],
    customSections: event?.customSections || [],
    showOnHomepage: event?.showOnHomepage || false,
  });

  const [newTag, setNewTag] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [newVideo, setNewVideo] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (url) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
    }));
  };

  const handleGalleryChange = (urls) => {
    setFormData((prev) => ({
      ...prev,
      gallery: urls,
    }));
  };

  const handleCustomSectionsChange = (sections) => {
    setFormData((prev) => ({
      ...prev,
      customSections: sections,
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }));
      setNewHighlight("");
    }
  };

  const handleRemoveHighlight = (index) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const handleAddVideo = () => {
    if (newVideo.trim()) {
      setFormData((prev) => ({
        ...prev,
        videos: [...prev.videos, newVideo.trim()],
      }));
      setNewVideo("");
    }
  };

  const handleRemoveVideo = (index) => {
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = {
        ...formData,
        date: new Date(formData.date),
      };

      if (event) {
        await api.updateEvent(event._id || event.id, submitData);
      } else {
        await api.createEvent(submitData);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="glass-panel p-6">
        <h2 className="text-2xl font-heading mb-6">
          {event ? "Edit Event" : "Add New Event"}
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-accent-red/10 border border-accent-red/30 text-accent-red text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
              placeholder="Event Title"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Short Description *
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50 resize-none"
              placeholder="Brief description for homepage/cards"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Full Description *
            </label>
            <textarea
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50 resize-none"
              placeholder="Complete event description"
            />
          </div>

          {/* Date and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
                placeholder="Event Location"
              />
            </div>
          </div>

          {/* Main Image Upload */}
          <ImageUpload
            label="Main Image"
            value={formData.image}
            onChange={handleImageChange}
            folder="ethical-hck/events"
          />

          {/* Gallery Images Upload */}
          <MultiImageUpload
            label="Gallery Images"
            value={formData.gallery}
            onChange={handleGalleryChange}
            folder="ethical-hck/events/gallery"
            maxImages={20}
          />

          {/* Videos */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Videos (YouTube/Vimeo URLs)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={newVideo}
                onChange={(e) => setNewVideo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddVideo())}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
                placeholder="https://youtube.com/watch?v=..."
              />
              <button
                type="button"
                onClick={handleAddVideo}
                className="px-4 py-2 rounded-lg bg-accent-red text-white hover:bg-accent-redDark transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.videos.map((url, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-background/50">
                  <span className="flex-1 text-sm text-text-muted truncate">{url}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(index)}
                    className="p-1 rounded hover:bg-surface transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-accent-red" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
                placeholder="Add tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 rounded-lg bg-accent-red text-white hover:bg-accent-redDark transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-red/30 bg-accent-red/10 text-accent-red text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="hover:text-accent-redDark"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Highlights / Key Points
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddHighlight())}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
                placeholder="Add highlight point"
              />
              <button
                type="button"
                onClick={handleAddHighlight}
                className="px-4 py-2 rounded-lg bg-accent-red text-white hover:bg-accent-redDark transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-2">
              {formData.highlights.map((highlight, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg border border-border bg-background/50"
                >
                  <span className="text-accent-red">▸</span>
                  <span className="flex-1 text-sm text-text-primary">{highlight}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(index)}
                    className="p-1 rounded hover:bg-surface transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-accent-red" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Custom Sections */}
          <div className="border-t border-border pt-6">
            <CustomSections
              label="Custom Sections (Optional)"
              value={formData.customSections}
              onChange={handleCustomSectionsChange}
            />
          </div>

          {/* Show on Homepage */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="showOnHomepage"
              id="showOnHomepage"
              checked={formData.showOnHomepage}
              onChange={handleChange}
              className="w-5 h-5 rounded border-border bg-background text-accent-red focus:ring-2 focus:ring-accent-red/50"
            />
            <label htmlFor="showOnHomepage" className="text-sm font-medium text-text-primary">
              Show on Homepage
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-accent-red text-white font-medium hover:bg-accent-redDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {event ? "Update Event" : "Add Event"}
                </>
              )}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-2 px-6 py-2 rounded-lg border border-border bg-transparent text-text-primary font-medium hover:bg-background/50 transition-colors"
              >
                <XIcon className="h-4 w-4" />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default EventForm;
