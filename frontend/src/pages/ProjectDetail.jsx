import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, X, Github, ExternalLink, Star } from "lucide-react";
import api from "../services/api.js";
import Lightbox from "../components/LightBox.jsx";
import { convertDriveLinkToImageUrl } from "../utils/imageUtils.js";

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await api.getProject(id);
        if (response.success) {
          setProject(response.project);
        } else {
          setError("Project not found");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch project");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent-red animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-4">{error || "Project not found"}</p>
          <button
            onClick={() => navigate("/projects")}
            className="px-4 py-2 rounded-lg bg-accent-red text-white hover:bg-accent-redDark transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const allImages = project.image
    ? [project.image, ...(project.gallery || [])]
    : project.gallery || [];

  // Convert all images to direct URLs (handles Google Drive links)
  const convertedImages = allImages.map(img => convertDriveLinkToImageUrl(img));

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="container-cyber max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 mb-8 text-text-muted hover:text-accent-red transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-mono uppercase tracking-[0.15em]">
            Back to Projects
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
            <div className="flex items-center gap-3">
              {project.category && (
                <span className="px-3 py-1 rounded-full border border-accent-red/30 bg-accent-red/10 text-accent-red text-sm font-mono uppercase tracking-[0.15em]">
                  {project.category}
                </span>
              )}
              {project.featured && (
                <span className="px-3 py-1 rounded-full border border-accent-red/30 bg-accent-red/10 text-accent-red text-sm font-medium flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-text-primary">
              {project.title}
            </h1>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
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
          {project.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl border border-border/70 cursor-pointer group"
              onClick={() => setSelectedImage(convertDriveLinkToImageUrl(project.image))}
            >
              <img
                src={convertDriveLinkToImageUrl(project.image)}
                alt={project.title}
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
              {project.shortDescription && (
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
                    {project.shortDescription}
                  </p>
                </motion.div>
              )}

              {/* Full Description */}
              {project.fullDescription && (
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
                    {project.fullDescription}
                  </div>
                </motion.div>
              )}

              {/* Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-panel p-6"
                >
                  <h2 className="font-heading text-xl mb-4 text-accent-red">
                    Key Features & Highlights
                  </h2>
                  <ul className="space-y-3">
                    {project.highlights.map((highlight, index) => (
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

              {/* Learning Points */}
              {project.learning && project.learning.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="glass-panel p-6"
                >
                  <h2 className="font-heading text-xl mb-4 text-accent-red">
                    Key Learnings
                  </h2>
                  <ul className="space-y-3">
                    {project.learning.map((learning, index) => (
                      <li
                        key={index}
                        className="flex gap-3 text-text-primary"
                      >
                        <span className="text-accent-red mt-1">•</span>
                        <span className="flex-1">{learning}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Custom Sections */}
              {project.customSections && project.customSections.length > 0 && (
                project.customSections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 + index * 0.05 }}
                    className="glass-panel p-6"
                  >
                    <h2 className="font-heading text-xl mb-3 text-accent-red">
                      {section.sectionName}
                    </h2>
                    <div className="text-text-primary leading-relaxed whitespace-pre-line">
                      {section.description}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-panel p-6 space-y-4"
              >
                <h3 className="font-heading text-lg text-accent-red border-b border-border pb-2">
                  Project Details
                </h3>
                <div className="space-y-3 text-sm">
                  {project.category && (
                    <div>
                      <span className="text-text-muted">Category:</span>
                      <p className="text-text-primary mt-1">{project.category}</p>
                    </div>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div>
                      <span className="text-text-muted">Tags:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.tags.map((tag, index) => (
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
                  {project.tools && project.tools.length > 0 && (
                    <div>
                      <span className="text-text-muted">Tools:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.tools.map((tool, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded border border-accent-red/30 bg-accent-red/10 text-accent-red text-xs"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Links Card */}
              {(project.github || project.demo) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-panel p-6 space-y-4"
                >
                  <h3 className="font-heading text-lg text-accent-red border-b border-border pb-2">
                    Links
                  </h3>
                  <div className="space-y-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent-red/50 hover:bg-background/50 transition-colors"
                      >
                        <Github className="h-5 w-5 text-accent-red" />
                        <span className="text-text-primary">View on GitHub</span>
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent-red/50 hover:bg-background/50 transition-colors"
                      >
                        <ExternalLink className="h-5 w-5 text-accent-red" />
                        <span className="text-text-primary">View Demo</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Gallery Section */}
          {allImages.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-2xl text-accent-red border-b border-border pb-2">
                Project Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {convertedImages.map((imageUrl, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.05 }}
                    onClick={() => setSelectedImage(imageUrl)}
                    className="relative aspect-square overflow-hidden rounded-lg border border-border/70 cursor-pointer group hover:border-accent-red/50 transition-all"
                  >
                    <img
                      src={imageUrl}
                      alt={`Project gallery ${index + 1}`}
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

export default ProjectDetail;


