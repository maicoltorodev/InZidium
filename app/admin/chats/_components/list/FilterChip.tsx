"use client";

import type { ReactNode } from "react";

type Props = {
    active: boolean;
    onClick: () => void;
    label: string;
    count: number;
    icon?: ReactNode;
    accent?: string;
};

export function FilterChip({ active, onClick, label, count, icon, accent }: Props) {
    return (
        <button
            onClick={onClick}
            className={`group inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
                active
                    ? "text-white"
                    : "border-white/[0.06] bg-white/[0.02] text-gray-500 hover:bg-white/[0.04] hover:text-gray-300"
            }`}
            style={
                active
                    ? {
                          borderColor: accent ? `${accent}40` : "rgba(255,255,255,0.4)",
                          background: accent ? `${accent}1A` : "rgba(255,255,255,0.1)",
                      }
                    : undefined
            }
        >
            {icon && (
                <span style={{ color: active && accent ? accent : undefined }}>
                    {icon}
                </span>
            )}
            <span style={{ color: active && accent ? accent : undefined }}>{label}</span>
            <span
                className={`font-mono ${active ? "" : "text-gray-600"}`}
                style={{
                    color: active ? (accent ? accent : "#fff") : undefined,
                    opacity: active ? 0.7 : 1,
                }}
            >
                {count}
            </span>
        </button>
    );
}
