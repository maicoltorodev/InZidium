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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#060214]/90 backdrop-blur-3xl pointer-events-none"
    >
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#22d3ee]/20 via-[#a855f7]/20 to-[#e879f9]/20 blur-3xl" />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-[3px] border-transparent"
          style={{ borderTopColor: "#22d3ee", borderRightColor: "#a855f7" }}
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="absolute inset-6 rounded-full border-[3px] border-transparent"
          style={{ borderBottomColor: "#a855f7", borderLeftColor: "#e879f9" }}
        />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
          className="absolute inset-12 rounded-full border-[3px] border-transparent"
          style={{ borderTopColor: "#e879f9", borderRightColor: "#22d3ee" }}
        />
      </div>
    </motion.div>,
    document.body,
  );
}
