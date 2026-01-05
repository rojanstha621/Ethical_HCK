import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, X as XIcon, Loader2, Plus, Trash2 } from "lucide-react";
import api from "../../services/api.js";
import ImageUpload from "./ImageUpload.jsx";
import MultiImageUpload from "./MultiImageUpload.jsx";
import CustomSections from "./CustomSections.jsx";

function ProjectForm({ project = null, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: project?.title || "",
    shortDescription: project?.shortDescription || "",
    fullDescription: project?.fullDescription || "",
    category: project?.category || "",
    image: project?.image || "",
    gallery: project?.gallery || [],
    github: project?.github || "",
    demo: project?.demo || "",
    tags: project?.tags || [],
    highlights: project?.highlights || [],
    learning: project?.learning || [],
    tools: project?.tools || [],
    customSections: project?.customSections || [],
    featured: project?.featured || false,
    showOnHomepage: project?.showOnHomepage || false,
  });

  const [newTag, setNewTag] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [newLearning, setNewLearning] = useState("");
  const [newTool, setNewTool] = useState("");

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

  const handleAddItem = (field, value, setter) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      setter("");
    }
  };

  const handleRemoveItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (project) {
        await api.updateProject(project._id || project.id, formData);
      } else {
        await api.createProject(formData);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Failed to save project");
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
          {project ? "Edit Project" : "Add New Project"}
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
              placeholder="Project Title"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Category / Focus
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
              placeholder="e.g., Hardware Exploitation, Mobile Security"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Short Description
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50 resize-none"
              placeholder="Brief description for cards/homepage"
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
              placeholder="Complete project description"
            />
          </div>

          {/* Main Image Upload */}
          <ImageUpload
            label="Main Image"
            value={formData.image}
            onChange={handleImageChange}
            folder="ethical-hck/projects"
          />

          {/* Gallery Images Upload */}
          <MultiImageUpload
            label="Gallery Images"
            value={formData.gallery}
            onChange={handleGalleryChange}
            folder="ethical-hck/projects/gallery"
            maxImages={20}
          />

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="https://github.com/username/repo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Demo URL
              </label>
              <input
                type="url"
                name="demo"
                value={formData.demo}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
                placeholder="https://demo.example.com"
              />
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
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem("tags", newTag, setNewTag))}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
                placeholder="Add tag"
              />
              <button
                type="button"
                onClick={() => handleAddItem("tags", newTag, setNewTag)}
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
                    onClick={() => handleRemoveItem("tags", index)}
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
              Highlights / Key Features
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem("highlights", newHighlight, setNewHighlight))}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
                placeholder="Add highlight"
              />
              <button
                type="button"
                onClick={() => handleAddItem("highlights", newHighlight, setNewHighlight)}
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
                    onClick={() => handleRemoveItem("highlights", index)}
                    className="p-1 rounded hover:bg-surface transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-accent-red" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning Points */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Key Learnings
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newLearning}
                onChange={(e) => setNewLearning(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem("learning", newLearning, setNewLearning))}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
                placeholder="Add learning point"
              />
              <button
                type="button"
                onClick={() => handleAddItem("learning", newLearning, setNewLearning)}
                className="px-4 py-2 rounded-lg bg-accent-red text-white hover:bg-accent-redDark transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-2">
              {formData.learning.map((learning, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg border border-border bg-background/50"
                >
                  <span className="text-accent-red">•</span>
                  <span className="flex-1 text-sm text-text-primary">{learning}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem("learning", index)}
                    className="p-1 rounded hover:bg-surface transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-accent-red" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tools / Technologies Used
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem("tools", newTool, setNewTool))}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50"
                placeholder="Add tool/technology"
              />
              <button
                type="button"
                onClick={() => handleAddItem("tools", newTool, setNewTool)}
                className="px-4 py-2 rounded-lg bg-accent-red text-white hover:bg-accent-redDark transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tools.map((tool, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-red/30 bg-accent-red/10 text-accent-red text-sm"
                >
                  {tool}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem("tools", index)}
                    className="hover:text-accent-redDark"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Custom Sections */}
          <div className="border-t border-border pt-6">
            <CustomSections
              label="Custom Sections (Optional)"
              value={formData.customSections}
              onChange={handleCustomSectionsChange}
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-border bg-background text-accent-red focus:ring-2 focus:ring-accent-red/50"
              />
              <label htmlFor="featured" className="text-sm font-medium text-text-primary">
                Featured Project
              </label>
            </div>
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
                  {project ? "Update Project" : "Add Project"}
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

export default ProjectForm;
