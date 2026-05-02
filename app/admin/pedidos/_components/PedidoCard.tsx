"use client";

import type { OrderWithContact } from "@/lib/crm/types";
import { Bot, User } from "lucide-react";
import { StatusPill } from "./StatusPill";

const COP = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
});

type Props = {
    order: OrderWithContact;
    onClick: () => void;
};

export function PedidoCard({ order, onClick }: Props) {
    const contactName = order.contact?.name?.trim() || order.contact?.phone || "Sin cliente";
    const itemsSummary = summarizeItems(order.items);
    const createdByAI = order.created_by === "ai";

    return (
        <button
            onClick={onClick}
            className="group relative w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-left transition hover:border-[#22d3ee]/20 hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(34,211,238,0.08)]"
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-white">{contactName}</h3>
                    {order.contact?.name && (
                        <p className="truncate text-xs font-medium text-gray-600">
                            {order.contact.phone}
                        </p>
                    )}
                </div>
                <StatusPill status={order.status} />
            </div>

            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-500">
                {itemsSummary}
            </p>

            <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                    {createdByAI ? (
                        <>
                            <Bot className="h-3 w-3" style={{ color: "#22d3ee" }} />
                            <span>Creado por IA</span>
                        </>
                    ) : (
                        <>
                            <User className="h-3 w-3 text-white" />
                            <span>Manual · {order.created_by}</span>
                        </>
                    )}
                    <span className="text-gray-700">·</span>
                    <span>{formatRelative(new Date(order.created_at))}</span>
                </div>
                {order.total !== null && order.total !== undefined && (
                    <span className="shrink-0 rounded-full border border-[#22d3ee]/20 bg-[#22d3ee]/5 px-3 py-1 text-xs font-black tracking-wide text-[#22d3ee]">
                        {COP.format(order.total)}
                    </span>
                )}
            </div>
        </button>
    );
}

function summarizeItems(items: OrderWithContact["items"]): string {
    if (!Array.isArray(items) || items.length === 0) return "Sin ítems cargados";
    const parts = items.slice(0, 3).map((it) => {
        const qty = it.quantity ? `${it.quantity}×` : "";
        return `${qty}${it.name || "ítem"}`.trim();
    });
    const rest = items.length - 3;
    return rest > 0 ? `${parts.join(", ")} · +${rest} más` : parts.join(", ");
}

function formatRelative(date: Date): string {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "ahora";
    if (mins < 60) return `hace ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `hace ${days} d`;
    return date.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
    });
}
