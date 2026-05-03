"use client";

import { MessageSquare, Sparkles, Bot, Zap, Radio } from "lucide-react";
import { motion } from "framer-motion";

export function ChatsEmptyState() {
    return (
        <div className="max-w-md w-full text-center">
            <div className="relative mx-auto mb-10 h-28 w-28">
                <div
                    className="absolute inset-0 rounded-[2rem] blur-2xl opacity-50"
                    style={{
                        background: "linear-gradient(135deg, #22d3ee, #ffffff, #22d3ee)",
                    }}
                />
                <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex h-full w-full items-center justify-center rounded-[2rem] border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl"
                >
                    <MessageSquare className="h-12 w-12 text-white" strokeWidth={1.5} />
                </motion.div>
            </div>

            <div className="flex items-center justify-center gap-3 mb-4 text-[#22d3ee]">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] font-[family-name:var(--font-orbitron)]">
                    Centro de chats
                </span>
            </div>

            <h2 className="mb-4 text-2xl sm:text-3xl font-black tracking-tighter text-white">
                Selecciona una{" "}
                <span
                    className="bg-clip-text text-transparent bg-[length:200%_auto]"
                    style={{
                        backgroundImage:
                            "linear-gradient(90deg, #22d3ee, #ffffff, #22d3ee, #ffffff, #22d3ee)",
                        animation: "gradient 4s linear infinite",
                    }}
                >
                    conversación
                </span>
            </h2>

            <p className="mb-10 text-sm leading-relaxed text-gray-500">
                Elige un chat de la lista para ver el historial completo, controlar a
                Zid y responder manualmente al cliente.
            </p>

            <div className="space-y-2.5">
                <Tip
                    icon={<Zap className="h-4 w-4" />}
                    accent="#22d3ee"
                    title="IA en tiempo real"
                    body="Zid responde automáticamente cuando está activa. Toma control desde el toggle del chat cuando quieras."
                />
                <Tip
                    icon={<Bot className="h-4 w-4" />}
                    accent="#22d3ee"
                    title="Filtros inteligentes"
                    body="Filtra por estado de IA, busca por nombre o teléfono."
                />
                <Tip
                    icon={<Radio className="h-4 w-4" />}
                    accent="#ffffff"
                    title="Sincronización viva"
                    body="Mensajes nuevos llegan instantáneamente sin recargar."
                />
            </div>
        </div>
    );
}

function Tip({
    icon,
    accent,
    title,
    body,
}: {
    icon: React.ReactNode;
    accent: string;
    title: string;
    body: string;
}) {
    return (
        <div className="group flex items-start gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-sm px-4 py-3.5 transition-all hover:border-white/[0.1] hover:bg-white/[0.03]">
            <div
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] transition-all group-hover:scale-110"
                style={{ color: accent }}
            >
                {icon}
            </div>
            <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold text-gray-300 mb-0.5">{title}</p>
                <p className="text-xs leading-relaxed text-gray-500">{body}</p>
            </div>
        </div>
    );
}
