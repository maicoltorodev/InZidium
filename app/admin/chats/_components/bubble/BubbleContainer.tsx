"use client";

import { type ReactNode } from "react";
import type { MessageRole } from "@/lib/crm/types";

type Props = {
    role: MessageRole;
    /** Cuando el contenido es un sticker o imagen suelta, sin chrome ni padding. */
    bare?: boolean;
    children: ReactNode;
};

export function BubbleContainer({ role, bare = false, children }: Props) {
    if (bare) return <div className="inline-block">{children}</div>;

    if (role === "ai") {
        return (
            <div
                className="relative overflow-hidden rounded-2xl rounded-tr-md border px-4 py-3"
                style={{
                    borderColor: "rgba(255,215,0,0.2)",
                    background:
                        "linear-gradient(135deg, rgba(255,215,0,0.10), rgba(255,255,255,0.08))",
                    boxShadow: "0 4px 20px rgba(255,215,0,0.06)",
                }}
            >
                <div
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-40"
                    style={{ background: "radial-gradient(circle, #FFD700, transparent)" }}
                />
                <div className="relative">{children}</div>
            </div>
        );
    }

    if (role === "human") {
        return (
            <div
                className="relative overflow-hidden rounded-2xl rounded-tr-md border px-4 py-3"
                style={{
                    borderColor: "rgba(255,255,255,0.18)",
                    background:
                        "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
                    boxShadow: "0 4px 20px rgba(255,255,255,0.04)",
                }}
            >
                {children}
            </div>
        );
    }

    // user (cliente)
    return (
        <div
            className="rounded-2xl rounded-tl-md border border-white/[0.08] bg-white/[0.04] px-4 py-3"
            style={{ backdropFilter: "blur(8px)" }}
        >
            {children}
        </div>
    );
}
