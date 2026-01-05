import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Github, ArrowRight, Sparkles, Loader2, Star } from "lucide-react";
import { staggerContainer, fadeUp } from "../lib/motion.js";
import api from "../services/api.js";
import { convertDriveLinkToImageUrl } from "../utils/imageUtils.js";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.getProjects();
        if (response.success) {
          // Sort by featured first, then by date
          const sortedProjects = (response.projects || []).sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          });
          setProjects(sortedProjects);
        }
      } catch (error) {
        console.error("Failed to fetch projects from backend:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent-red animate-spin" />
      </div>
    );
  }

  return (
    <section className="py-10 md:py-20 space-y-12">
      {/* Header */}
      <motion.div
        className="max-w-4xl space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted">
          <Sparkles className="h-3 w-3 text-accent-red" />
          Our Work
        </div>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl">
          Projects & <span className="gradient-text">Initiatives</span>
        </h1>
        <p className="text-base md:text-lg text-text-muted max-w-2xl">
          Long-term initiatives and flagship events that define the Ethical HCK
          Community and give members real-world exposure.
        </p>
      </motion.div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-20 glass-panel">
          <p className="text-text-muted">No projects found</p>
        </div>
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project._id || project.id}
              project={project}
              index={index}
              onClick={() => navigate(`/projects/${project._id || project.id}`)}
            />
          ))}
        </motion.div>
      )}
    </section>
  );
}

function ProjectCard({ project, index, onClick }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      onClick={onClick}
      className="group relative rounded-2xl border border-border/70 bg-surface/80 backdrop-blur overflow-hidden cursor-pointer hover:border-accent-red/60 transition-all duration-300 hover:shadow-soft-glow"
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Image */}
      {project.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={convertDriveLinkToImageUrl(project.image)}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {project.featured && (
            <div className="absolute top-2 right-2 px-2 py-1 rounded bg-accent-red/80 text-white text-xs font-medium flex items-center gap-1">
              <Star className="h-3 w-3" />
              Featured
            </div>
          )}
        </div>
      )}

      <div className="relative p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <h3 className="font-heading text-xl mb-2">{project.title}</h3>
            {project.category && (
              <span className="inline-block rounded-full border border-border bg-background/70 px-3 py-1 text-[10px] text-accent-red font-mono uppercase tracking-[0.15em]">
                {project.category}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-text-muted mb-4 flex-1 leading-relaxed line-clamp-3">
          {project.shortDescription || project.fullDescription}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="rounded-full border border-accent-red/30 bg-accent-red/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-accent-red"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border/50">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-text-muted hover:text-accent-red transition-colors"
            >
              <Github className="h-4 w-4" />
              Code
            </a>
          )}
          {project.demo && project.demo !== "#" && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-text-muted hover:text-accent-red transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Demo
            </a>
          )}
          <motion.div
            className="ml-auto flex items-center gap-1 text-xs font-mono uppercase tracking-[0.15em] text-accent-red/0 group-hover:text-accent-red transition-all duration-300"
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 0 }}
          >
            View
            <ArrowRight className="h-3 w-3" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Projects;
