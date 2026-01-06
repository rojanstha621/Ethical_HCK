import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader2, Github, ExternalLink, ArrowRight, ChevronDown, Star, Folder } from "lucide-react";
import api from "../services/api.js";
import Lightbox from "../components/LightBox.jsx";
import { convertDriveLinkToImageUrl } from "../utils/imageUtils.js";

/* ---------------- Constants ---------------- */


/* ---------------- Animations ---------------- */
const slideIn = (side) => ({
  hidden: { opacity: 0, x: side === "right" ? 100 : -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 0.61, 0.36, 1] },
  },
});

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
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
      <div className="min-h-screen pt-20 pb-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent-red animate-spin" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-20 flex items-center justify-center">
        <div className="text-center py-20 glass-panel px-12">
          <p className="text-text-muted">No projects found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 relative min-h-screen">
      <main className="space-y-24 pb-20">
        {/* Hero Section */}
        <section className="py-10 md:py-20 relative">
          <motion.div
            className="max-w-4xl space-y-4 mx-auto text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted mx-auto">
              <Folder className="h-3 w-3 text-accent-red" />
              Community Projects
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-text-primary">
              Our <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-base md:text-lg text-text-muted max-w-2xl leading-relaxed mx-auto">
              Explore open-source tools, scripts, and applications developed by our
              talented community members. Contribute and learn.
            </p>


          </motion.div>
        </section>
        {projects.map((project, index) => (
          <ProjectSlide
            key={project._id || project.id}
            project={project}
            index={index}
            openLightbox={setLightbox}
            navigate={navigate}
          />
        ))}
      </main>

      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}

/* ---------------- Project Slide ---------------- */
function ProjectSlide({ project, index, openLightbox, navigate }) {
  const isRight = index % 2 === 0;
  const image = project.image ? convertDriveLinkToImageUrl(project.image) : null;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  const handleViewDetails = () => {
    navigate(`/projects/${project._id || project.id}`);
  };

  return (
    <section
      ref={ref}
      className="flex items-center relative py-10"
    >
      <div className="container-cyber max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          {/* IMAGE */}
          <motion.div
            style={{ y }}
            onClick={() => image && openLightbox(image)}
            className={["relative", isRight ? "lg:order-1" : "lg:order-2", image ? "cursor-pointer group" : ""].join(" ")}
          >
            <div className="overflow-hidden rounded-xl border border-accent-red/30 shadow-lg shadow-accent-red/20 h-[300px] lg:h-[420px]">
              {image ? (
                <img
                  src={image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                  <Folder className="h-16 w-16 text-accent-red/20 mb-4" />
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-text-muted/50">No Image</span>
                </div>
              )}
              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-accent-red/90 text-white text-xs font-medium backdrop-blur flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Featured
                </div>
              )}
            </div>
          </motion.div>

          {/* CONTENT */}
          <motion.div
            variants={slideIn(isRight ? "right" : "left")}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className={["flex flex-col p-6 md:p-8 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 h-[300px] lg:h-[420px] overflow-y-auto", isRight ? "lg:order-2" : "lg:order-1"].join(" ")}
          >
            {/* Content wrapper */}
            <div className="space-y-4 flex-1">
              {/* Title */}
              <h2
                className="font-heading text-3xl md:text-4xl text-text-primary neon-text"
                data-text={project.title}
              >
                {project.title}
              </h2>

              {/* Category */}
              {project.category && (
                <div className="flex items-center gap-2 text-sm text-accent-red">
                  <Folder className="h-4 w-4" />
                  <span className="font-mono uppercase tracking-[0.15em]">{project.category}</span>
                </div>
              )}

              {/* Short Description */}
              {project.shortDescription && (
                <p className="max-w-xl text-sm md:text-base text-text-muted leading-relaxed">
                  {project.shortDescription}
                </p>
              )}

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-accent-red/30 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-accent-red hover:scale-105 transition-transform hover:bg-accent-red/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Links - GitHub & Demo (only if they exist) */}
              {(project.github || (project.demo && project.demo !== "#")) && (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface/50 text-text-muted text-xs font-mono uppercase tracking-[0.12em] hover:border-accent-red hover:text-accent-red transition-all duration-200"
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
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface/50 text-text-muted text-xs font-mono uppercase tracking-[0.12em] hover:border-accent-red hover:text-accent-red transition-all duration-200"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Demo
                    </a>
                  )}
                </div>
              )}

            </div>

            {/* View Details Button - Always at bottom */}
            <motion.button
              onClick={handleViewDetails}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 mt-auto pt-4 px-6 py-3 rounded-full border border-accent-red/50 bg-accent-red/10 text-accent-red text-sm font-mono uppercase tracking-[0.15em] hover:bg-accent-red/20 hover:border-accent-red transition-all duration-300 group self-start"
            >
              <span>View Details</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
