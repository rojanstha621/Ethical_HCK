// src/lib/motion.js
// Professional scroll-based animation system for Framer Motion

// Smooth cubic-bezier easing curve
const smoothEase = [0.22, 0.61, 0.36, 1];

/**
 * Fade Up animation for headings and text
 * Initial: opacity 0, translateY 20px
 * Final: opacity 1, translateY 0
 */
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: smoothEase,
    },
  }),
};

/**
 * Grid reveal animation for cards
 * Initial: opacity 0, scale 0.9
 * Final: opacity 1, scale 1
 */
export const gridReveal = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.03,
      duration: 0.45,
      ease: "easeInOut",
    },
  }),
};

/**
 * Stagger container for child animations
 */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/**
 * Section reveal animation
 * For entire sections fading in
 */
export const sectionReveal = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: smoothEase,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

/**
 * Simple fade in animation
 */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * Scale up animation for cards/items
 */
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: smoothEase,
    },
  }),
};

/**
 * Slide in from left or right
 */
export const slideIn = (direction = "left") => ({
  hidden: {
    opacity: 0,
    x: direction === "left" ? -30 : 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: smoothEase,
    },
  },
});