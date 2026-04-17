"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { MOTION } from "./motion";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={MOTION.micro}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={MOTION.page}
            className="
              fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] w-full flex-col
              rounded-t-[2rem] border-t border-white/[0.08] bg-[#0d0820]
              md:inset-x-auto md:left-1/2 md:bottom-6 md:max-w-[560px]
              md:-translate-x-1/2 md:rounded-[2rem] md:border md:border-white/[0.08]
              md:max-h-[min(80dvh,720px)] md:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]
            "
            style={{
              touchAction: "pan-y",
              overscrollBehavior: "contain",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
            role="dialog"
            aria-modal
            aria-label={title}
          >
            <div className="flex items-center justify-center pt-3 pb-1 md:hidden">
              <span className="h-1 w-10 rounded-full bg-white/15" aria-hidden />
            </div>
            <div className="flex items-center justify-between px-5 pb-3 pt-1">
              <h3 className="text-base font-black text-white">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.04] text-white/50 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-4">{children}</div>
            {footer && (
              <div className="border-t border-white/[0.05] px-5 py-4">{footer}</div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
