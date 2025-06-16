"use client";

import { motion } from "framer-motion";

export default function HeroAnimation() {
  return (
    <div className="relative w-full h-full min-h-[400px] md:min-h-[500px] overflow-hidden rounded-xl border border-border shadow-2xl bg-card">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />

      {/* Floating UI elements */}
      <motion.div
        className="absolute top-10 left-10 w-24 h-24 bg-primary/30 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      <motion.div
        className="absolute top-16 right-10 w-32 h-32 bg-secondary/30 rounded-full shadow-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      />
      <motion.div
        className="absolute bottom-10 left-1/3 w-16 h-16 bg-info/30 rounded-md shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      />

      {/* Main dashboard image */}
      <motion.img
        src="https://images.unsplash.com/photo-1589520870714-d2831e435652?auto=format&fit=crop&w=1200&q=80"
        alt="Dashboard screenshot"
        className="h-full w-full object-cover"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      />

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-background/10" />
    </div>
  );
}
