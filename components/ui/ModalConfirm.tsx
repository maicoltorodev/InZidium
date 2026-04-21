"use client";

import React from "react";
import { motion } from "framer-motion";

interface ModalConfirmProps {
  title: string;
  message: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ModalConfirm({
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDestructive = false,
}: ModalConfirmProps) {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#060214]/95 border border-white/10 p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl"
      >
        <h3 className="text-xl font-black uppercase text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wide leading-relaxed mb-8">
          {message}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onCancel}
            className="py-4 rounded-xl border border-white/10 text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isDestructive ? "bg-red-600 hover:bg-red-700 text-white" : "bg-white text-black hover:bg-gray-200"}`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
