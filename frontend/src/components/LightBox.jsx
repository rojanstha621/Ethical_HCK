import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function Lightbox({ src, onClose }) {
  const handleKey = (e) => {
    if (e.key === "Escape") onClose();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="relative max-w-6xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-accent-red hover:text-white"
        >
          <X />
        </button>

        <img
          src={src}
          alt="Event"
          className="w-full max-h-[80vh] object-contain rounded-lg border border-accent-red/30"
        />
      </motion.div>
    </motion.div>
  );
}
