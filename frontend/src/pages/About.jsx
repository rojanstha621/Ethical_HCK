import React from "react";
import { motion } from "framer-motion";
import { Shield, Target, Heart, Users, BookOpen, Zap } from "lucide-react";
import { staggerContainer, fadeUp } from "../lib/motion.js";

const values = [
  {
    icon: Shield,
    title: "Ethics First",
    description: "Every action we take is guided by ethical principles and responsible disclosure.",
    color: "text-accent-red",
  },
  {
    icon: BookOpen,
    title: "Learn by Doing",
    description: "Hands-on practice and real-world projects over theoretical knowledge alone.",
    color: "text-accent-red",
  },
  {
    icon: Users,
    title: "Open Collaboration",
    description: "We believe in sharing knowledge and working together to solve complex problems.",
    color: "text-accent-red",
  },
  {
    icon: Heart,
    title: "Community Over Ego",
    description: "The success of our community members is more important than individual recognition.",
    color: "text-accent-red",
  },
];

const stats = [
  { label: "Active Members", value: "50+", icon: Users },
  { label: "Events Hosted", value: "20+", icon: Zap },
  { label: "Projects Completed", value: "15+", icon: Target },
];

function About() {
  return (
    <section className="py-10 md:py-20 space-y-16">
      {/* Header */}
      <motion.div
        className="max-w-4xl space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted">
          <Shield className="h-3 w-3 text-accent-red" />
          About Us
        </div>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl">
          About <span className="gradient-text">Ethical HCK</span> Community
        </h1>
        <p className="text-base md:text-lg text-text-muted max-w-2xl leading-relaxed">
          Ethical HCK Community is a student-led cybersecurity group focused on
          learning, experimentation and responsible hacking. We run events,
          projects and awareness initiatives to help students explore security
          from fundamentals to advanced topics.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="glass-panel p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Icon className="h-8 w-8 text-accent-red mx-auto mb-3" />
              <div className="text-3xl font-heading text-text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-text-muted font-mono uppercase tracking-[0.15em]">
                {stat.label}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Mission, Vision, Values */}
      <motion.div
        className="grid gap-6 md:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          variants={fadeUp}
          className="glass-panel p-6 hover:border-accent-red/60 transition-all duration-300"
        >
          <Target className="h-6 w-6 text-accent-red mb-4" />
          <h2 className="font-heading text-lg mb-3">Our Mission</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            To create a safe, inclusive environment where students can develop
            real-world cybersecurity skills and ethical thinking.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="glass-panel p-6 hover:border-accent-red/60 transition-all duration-300"
        >
          <Zap className="h-6 w-6 text-accent-red mb-4" />
          <h2 className="font-heading text-lg mb-3">Our Vision</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            To become a leading student security community that produces the
            next wave of defenders, researchers and builders.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="glass-panel p-6 hover:border-accent-red/60 transition-all duration-300"
        >
          <Heart className="h-6 w-6 text-accent-red mb-4" />
          <h2 className="font-heading text-lg mb-3">Our Promise</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            We commit to maintaining the highest standards of ethics, security,
            and community support in everything we do.
          </p>
        </motion.div>
      </motion.div>

      {/* Core Values */}
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="text-center space-y-2">
          <h2 className="font-heading text-3xl md:text-4xl">Core Values</h2>
          <p className="text-text-muted max-w-xl mx-auto">
            The principles that guide our community and shape our culture.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                className="glass-panel p-6 group hover:border-accent-red/60 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <Icon className={`h-8 w-8 ${value.color} mb-4 transition-transform group-hover:scale-110`} />
                <h3 className="font-heading text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

export default About;
