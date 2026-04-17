"use client";

import React from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/app/admin/_components/AdminSidebar";
import { SectionBackground } from "@/lib/ui/SectionBackground";

export function AdminDesktopShell({ children }: { children: React.ReactNode }) {
  return (
    <SectionBackground
      className="fixed inset-0 h-screen w-screen overflow-hidden"
      innerClassName="relative flex h-full w-full"
    >
      <AdminSidebar />

      <main
        className="relative z-10 h-full flex-1 overflow-y-auto"
        style={{ scrollbarGutter: "stable" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>
    </SectionBackground>
  );
}
