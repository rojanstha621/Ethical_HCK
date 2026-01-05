import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, X as XIcon, Loader2 } from "lucide-react";
import api from "../../services/api.js";
import ImageUpload from "./ImageUpload.jsx";

function MemberForm({ member = null, positions = [], onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availablePositions, setAvailablePositions] = useState(positions);
  const [formData, setFormData] = useState({
    name: member?.name || "",
    position: member?.position || "",
    email: member?.email || "",
    github: member?.github || "",
    linkedin: member?.linkedin || "",
    instagram: member?.instagram || "",
    photo: member?.photo || "",
  });

  // Fetch positions if not passed as prop
  useEffect(() => {
    if (positions.length === 0) {
      const fetchPositions = async () => {
        try {
          const positionsList = await api.getPositions();
          setAvailablePositions(positionsList);
        } catch (err) {
          console.error("Failed to fetch positions:", err);
        }
      };
      fetchPositions();
    }
  }, [positions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (url) => {
    setFormData((prev) => ({
      ...prev,
      photo: url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (member) {
        // Update existing member
        await api.updateMember(member._id || member.id, formData);
      } else {
        // Create new member
        await api.createMember(formData);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Failed to save member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="glass-panel p-6">
        <h2 className="text-2xl font-heading mb-6">
          {member ? "Edit Member" : "Add New Member"}
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-accent-red/10 border border-accent-red/30 text-accent-red text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
              placeholder="John Doe"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Position
            </label>
            {availablePositions.length === 0 ? (
              <div className="px-4 py-3 rounded-lg border border-border bg-background/50 text-text-muted text-sm">
                No positions available. Add positions from the "Manage Positions" button in the Members list.
              </div>
            ) : (
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
              >
                <option value="">Select a position (optional)</option>
                {availablePositions.map((pos) => (
                  <option key={pos._id} value={pos.name}>
                    {pos.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
              placeholder="john@example.com"
            />
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
              placeholder="https://github.com/username"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Instagram URL
            </label>
            <input
              type="url"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
              placeholder="https://instagram.com/username"
            />
          </div>

          {/* Photo Upload */}
          <ImageUpload
            label="Profile Photo"
            value={formData.photo}
            onChange={handlePhotoChange}
            folder="ethical-hck/members"
          />

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
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
                  {member ? "Update Member" : "Add Member"}
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

export default MemberForm;
