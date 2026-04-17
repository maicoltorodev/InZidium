"use client";

import { motion } from "framer-motion";
import { MOTION } from "./motion";

export const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

/**
 * Wrapper de un bloque de campo dentro de una section.
 * Soporta stagger (via parent con `variants` parent) y `id` para anchors (usado en DesktopSection).
 */
export function FieldItem({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      data-field-item={id}
      variants={fieldVariants}
      transition={MOTION.reveal}
      className={`scroll-mt-24 ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
