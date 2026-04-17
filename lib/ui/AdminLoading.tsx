"use client";

import React from "react";
import { motion } from "framer-motion";

export function AdminLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-3xl pointer-events-none"
    >
      <div className="relative">
        <div className="relative w-48 h-48">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 rounded-full border-t-2 border-l-2 border-[#FFD700]/30 blur-[1px]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-t-2 border-r-2 border-[#a855f7]/50 blur-[1px]"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-10 rounded-full border-b-2 border-l-2 border-[#22d3ee]/70 blur-[1px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-16 rounded-full bg-gradient-to-tr from-[#FFD700] via-[#a855f7] to-[#22d3ee] blur-2xl"
          />
        </div>
      </div>
    </motion.div>
  );
}
