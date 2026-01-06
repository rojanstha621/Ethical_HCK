import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, ArrowRight, Loader2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import { fadeUp, gridReveal, staggerContainer, sectionReveal } from "../../lib/motion.js";
import { convertDriveLinkToImageUrl } from "../../utils/imageUtils.js";

function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.getProjects();
        if (response.success) {
          const homepageProjects = (response.projects || [])
            .filter((project) => project.showOnHomepage)
            .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
            .slice(0, 6);
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
    return null;
  }

  // Duplicate projects for infinite scroll effect
  const scrollProjects = projects.length >= 3 ? [...projects, ...projects, ...projects] : projects;
  const useMarquee = projects.length >= 3;

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
          Featured Projects
        </motion.p>

        <motion.h2
          variants={fadeUp}
          custom={1}
          className="font-heading text-2xl md:text-3xl"
        >
          Projects & Initiatives
        </motion.h2>

        <motion.p
          variants={fadeUp}
          custom={2}
          className="max-w-2xl text-sm text-text-muted"
        >
          Explore our community projects, tools, and research initiatives.
        </motion.p>
      </motion.div>

      {/* View All Link */}
      <motion.div variants={fadeUp} custom={3} className="flex justify-end">
        <button
          onClick={() => navigate("/projects")}
          className="text-xs font-mono uppercase tracking-[0.18em] text-text-muted hover:text-accent-red transition"
        >
          View all projects
        </button>
      </motion.div>

      {/* Projects Horizontal Scroll */}
      {useMarquee ? (
        <motion.div variants={fadeUp} custom={4}>
          <div
            className="projects-marquee overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div
              className="projects-marquee-track"
              style={{ animationPlayState: isPaused ? "paused" : "running" }}
            >
              {scrollProjects.map((project, index) => (
                <ProjectCard
                  key={`${project._id || project.id}-${index}`}
                  project={project}
                  navigate={navigate}
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
          {projects.map((project, idx) => (
            <motion.div key={project._id || project.id} variants={gridReveal} custom={idx}>
              <ProjectCard
                project={project}
                navigate={navigate}
                index={idx}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
}

function ProjectCard({ project, navigate, index }) {
  return (
    <div
      onClick={() => navigate(`/projects/${project._id || project.id}`)}
      className="project-card group relative rounded-2xl border border-white/10 bg-black/70 backdrop-blur-md overflow-hidden cursor-pointer flex-shrink-0 w-[320px]"
    >
      {/* Image */}
      {project.image && (
        <div className="relative h-40 overflow-hidden">
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
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-heading text-lg text-text-primary group-hover:text-accent-red transition-colors line-clamp-1 mb-1">
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
            {project.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded border border-accent-red/30 bg-accent-red/10 text-accent-red text-[10px]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        {(project.github || (project.demo && project.demo !== "#")) && (
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
            {project.demo && project.demo !== "#" && (
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

export default ProjectsSection;
