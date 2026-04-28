"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type Props = {
    icon: LucideIcon;
    label: string;
    accent: string;
    children: ReactNode;
};

export function Section({ icon: Icon, label, accent, children }: Props) {
    return (
        <div
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5"
            style={{ backdropFilter: "blur(8px)" }}
        >
            <div className="mb-3 flex items-center gap-2">
                <div
                    className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/[0.06]"
                    style={{ background: `linear-gradient(135deg, ${accent}1A, transparent)` }}
                >
                    <Icon className="h-3 w-3" style={{ color: accent }} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500 font-[family-name:var(--font-orbitron)]">
                    {label}
                </span>
            </div>
            {children}
        </div>
    );
}
