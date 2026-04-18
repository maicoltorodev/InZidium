"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import AdminSidebar from "@/app/admin/_components/AdminSidebar";
import AdminMobileNav from "@/app/admin/_components/AdminMobileNav";
import { useSessionEviction } from "@/hooks/use-session-eviction";
import { validateAdminSession } from "@/lib/actions";

export function AdminDesktopShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const adminId = (session?.user as any)?.id ?? null;

  useSessionEviction({
    userId: adminId,
    table: "administradores",
    validate: validateAdminSession,
    onEvicted: () => {
      signOut({ callbackUrl: "/admin/login?reason=concurrent" });
    },
  });

  return (
    <div className="min-h-screen lg:fixed lg:inset-0 lg:h-screen lg:w-screen lg:overflow-hidden lg:flex">
      <AdminMobileNav />
      <AdminSidebar />
      <main
        className="relative z-10 lg:min-h-0 lg:h-full lg:flex-1 lg:overflow-y-auto"
        style={{ scrollbarGutter: "stable" }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="lg:min-h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
