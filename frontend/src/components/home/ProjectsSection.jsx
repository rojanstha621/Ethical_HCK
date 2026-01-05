import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, ArrowRight, Loader2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import { fadeUp, staggerContainer } from "../../lib/motion.js";
import { convertDriveLinkToImageUrl } from "../../utils/imageUtils.js";

function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.getProjects();
        if (response.success) {
          // Filter projects that should show on homepage and sort by featured first
          const homepageProjects = (response.projects || [])
            .filter((project) => project.showOnHomepage)
            .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
            .slice(0, 3); // Show only 3
          setProjects(homepageProjects);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
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

  if (projects.length === 0) {
    return null; // Don't show section if no projects
  }

  return (
    <section className="mt-16 space-y-10 border-t border-border/70 pt-12">
      {/* Section header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="space-y-3"
      >
        <motion.p
          variants={fadeUp}
          className="text-xs font-mono uppercase tracking-[0.28em] text-accent-red"
        >
          Featured Projects
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="font-heading text-2xl md:text-3xl"
        >
          Projects & Initiatives
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="max-w-2xl text-sm text-text-muted"
        >
          Explore our community projects, tools, and research initiatives.
        </motion.p>
      </motion.div>

      {/* View All Link */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/projects")}
          className="text-xs font-mono uppercase tracking-[0.18em] text-text-muted hover:text-accent-red transition"
        >
          View all projects
        </button>
      </div>

      {/* Projects Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projects.map((project, index) => (
          <motion.div
            key={project._id || project.id}
            variants={fadeUp}
            custom={index}
            onClick={() => navigate(`/projects/${project._id || project.id}`)}
            className="group relative rounded-2xl border border-border/70 bg-surface/80 backdrop-blur overflow-hidden cursor-pointer hover:border-accent-red/60 transition-all duration-300 hover:shadow-soft-glow"
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

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-heading text-xl text-text-primary group-hover:text-accent-red transition-colors mb-1">
                  {project.title}
                </h3>
                {project.category && (
                  <p className="text-xs text-accent-red font-mono uppercase tracking-[0.15em]">
                    {project.category}
                  </p>
                )}
              </div>

              <p className="text-sm text-text-muted line-clamp-2">
                {project.shortDescription || project.fullDescription}
              </p>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded border border-accent-red/30 bg-accent-red/10 text-accent-red text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Links */}
              <div className="flex items-center gap-4 text-xs text-text-muted pt-2 border-t border-border/50">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 hover:text-accent-red transition-colors"
                  >
                    <Github className="h-3 w-3" />
                    Code
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 hover:text-accent-red transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Demo
                  </a>
                )}
              </div>

              {/* Read More */}
              <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-[0.12em] text-accent-red/0 group-hover:text-accent-red transition-all duration-300">
                <span>Read more</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default ProjectsSection;


