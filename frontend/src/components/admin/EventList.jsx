import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Loader2, RefreshCw, Eye, EyeOff } from "lucide-react";
import api from "../../services/api.js";
import EventForm from "./EventForm";

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.getEvents();
      if (response.success) {
        setEvents(response.events || []);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.deleteEvent(id);
      fetchEvents();
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message || "Failed to delete event");
    }
  };

  const handleEditSuccess = () => {
    setEditingEvent(null);
    fetchEvents();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (editingEvent) {
    return (
      <EventForm
        event={editingEvent}
        onSuccess={handleEditSuccess}
        onCancel={() => setEditingEvent(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading mb-2">Events Management</h2>
          <p className="text-text-muted text-sm">
            Manage community events and their information
          </p>
        </div>
        <button
          onClick={fetchEvents}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface/50 hover:bg-background/50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-accent-red/10 border border-accent-red/30 text-accent-red">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-accent-red animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 glass-panel">
          <p className="text-text-muted mb-4">No events found</p>
          <p className="text-sm text-text-muted">
            Add your first event using the "Add Event" tab
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <motion.div
              key={event._id || event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border rounded-lg overflow-hidden hover:border-accent-red/50 transition-colors bg-background/50"
            >
              {/* Image */}
              {event.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  {event.showOnHomepage && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded bg-accent-red/80 text-white text-xs font-medium flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Homepage
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-lg text-text-primary flex-1">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingEvent(event)}
                      className="p-2 rounded-lg hover:bg-surface transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4 text-text-muted hover:text-accent-red" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(event._id || event.id)}
                      className="p-2 rounded-lg hover:bg-surface transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-text-muted hover:text-accent-red" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-text-muted line-clamp-2">
                  {event.shortDescription || event.fullDescription}
                </p>

                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span>{formatDate(event.date)}</span>
                  {event.location && (
                    <>
                      <span>•</span>
                      <span>{event.location}</span>
                    </>
                  )}
                </div>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {event.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
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

                {/* Gallery count */}
                {event.gallery && event.gallery.length > 0 && (
                  <div className="text-xs text-text-muted">
                    {event.gallery.length} gallery image{event.gallery.length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 max-w-md"
          >
            <h3 className="text-lg font-heading mb-4">Confirm Delete</h3>
            <p className="text-text-muted mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 rounded-lg bg-accent-red text-white font-medium hover:bg-accent-redDark transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-transparent text-text-primary font-medium hover:bg-background/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default EventList;



