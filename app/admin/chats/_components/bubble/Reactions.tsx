"use client";

import type { MessageReaction } from "@/lib/crm/types";

type Props = { reactions: MessageReaction[]; align: "left" | "right" };

const BUSINESS = "business";

/**
 * Muestra UN chip por reaccionante (cliente / business). WhatsApp permite UNA reacción por lado.
 * Tooltip sobre el chip del business indica qué admin del CRM reaccionó.
 */
export function Reactions({ reactions, align }: Props) {
    if (!reactions || reactions.length === 0) return null;

    return (
        <div
            className={`mt-1 flex flex-wrap gap-1 ${align === "right" ? "justify-end" : "justify-start"}`}
        >
            {reactions.map((r, i) => {
                const isBusiness = r.from === BUSINESS;
                const tooltip = isBusiness
                    ? `${r.emoji} · ${r.by ? `Por ${r.by}` : "Equipo"}`
                    : `${r.emoji} · Cliente`;
                return (
                    <span
                        key={`${r.from}-${i}`}
                        title={tooltip}
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] backdrop-blur-sm ${
                            isBusiness
                                ? "border-[#22d3ee]/25 bg-[#22d3ee]/[0.06]"
                                : "border-white/[0.08] bg-[#0a0a0a]/80"
                        }`}
                        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.35)" }}
                    >
                        <span>{r.emoji}</span>
                    </span>
                );
            })}
        </div>
    );
}
