"use client";

import type { OrderStatus } from "@/lib/crm/types";
import {
    Sparkles,
    Factory,
    Truck,
    CheckCircle2,
    XCircle,
} from "lucide-react";

export const STATUS_META: Record<
    OrderStatus,
    { label: string; color: string; bg: string; border: string; Icon: typeof Sparkles }
> = {
    new: {
        label: "Nuevo",
        color: "#22d3ee",
        bg: "rgba(34,211,238,0.08)",
        border: "rgba(34,211,238,0.3)",
        Icon: Sparkles,
    },
    in_production: {
        label: "En producción",
        color: "rgba(255,255,255,0.7)",
        bg: "rgba(255,255,255,0.05)",
        border: "rgba(255,255,255,0.15)",
        Icon: Factory,
    },
    delivered: {
        label: "Entregado",
        color: "rgba(255,255,255,0.5)",
        bg: "rgba(255,255,255,0.04)",
        border: "rgba(255,255,255,0.12)",
        Icon: Truck,
    },
    paid: {
        label: "Pagado",
        color: "#22d3ee",
        bg: "rgba(34,211,238,0.1)",
        border: "rgba(34,211,238,0.4)",
        Icon: CheckCircle2,
    },
    cancelled: {
        label: "Cancelado",
        color: "rgba(239,68,68,0.6)",
        bg: "rgba(239,68,68,0.05)",
        border: "rgba(239,68,68,0.15)",
        Icon: XCircle,
    },
};

export const STATUS_ORDER: OrderStatus[] = [
    "new",
    "in_production",
    "delivered",
    "paid",
    "cancelled",
];

type Props = {
    status: OrderStatus;
    size?: "sm" | "md";
};

export function StatusPill({ status, size = "sm" }: Props) {
    const meta = STATUS_META[status];
    const padding = size === "md" ? "px-3 py-1.5" : "px-2.5 py-1";
    const iconSize = size === "md" ? "h-3.5 w-3.5" : "h-3 w-3";
    const textSize = size === "md" ? "text-xs" : "text-[10px]";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border font-black uppercase tracking-widest ${padding} ${textSize}`}
            style={{
                color: meta.color,
                backgroundColor: meta.bg,
                borderColor: meta.border,
            }}
        >
            <meta.Icon className={iconSize} />
            {meta.label}
        </span>
    );
}
