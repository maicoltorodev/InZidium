"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

export function AdminLoading() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-3xl pointer-events-none"
    >
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Halo */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-cyan/25 to-neon-purple/25 blur-3xl" />

        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-[3px] border-transparent"
          style={{ borderTopColor: "#22d3ee", borderRightColor: "#a855f7" }}
        />

        {/* Middle ring — counter-rotation */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="absolute inset-6 rounded-full border-[3px] border-transparent"
          style={{ borderBottomColor: "#a855f7", borderLeftColor: "#22d3ee" }}
        />

        {/* Inner ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
          className="absolute inset-12 rounded-full border-[3px] border-transparent"
          style={{ borderTopColor: "#22d3ee", borderRightColor: "#a855f7" }}
        />

        {/* Center pulse dot */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-2 h-2 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 shadow-[0_0_14px_rgba(168,85,247,0.7)]"
        />
      </div>
    </motion.div>,
    document.body,
  );
}
