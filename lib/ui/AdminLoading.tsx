"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export function AdminLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-[#060214]/90 backdrop-blur-3xl pointer-events-none"
    >
      <div className="flex flex-col items-center gap-10">

        {/* Rings + logo */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#22d3ee]/15 to-[#e879f9]/15 blur-2xl" />

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{ borderTopColor: "#22d3ee", borderRightColor: "#a855f7" }}
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-5 rounded-full border-2 border-transparent"
            style={{ borderBottomColor: "#a855f7", borderLeftColor: "#e879f9" }}
          />

          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src="/logo.webp" alt="InZidium" width={36} height={36} className="object-contain" />
          </motion.div>
        </div>

        {/* Sweeping gradient bar */}
        <div className="w-40 h-[2px] rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full w-full rounded-full"
            style={{ background: "linear-gradient(to right, #22d3ee, #a855f7, #e879f9)" }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.1 }}
          />
        </div>

      </div>
    </motion.div>
  );
}
