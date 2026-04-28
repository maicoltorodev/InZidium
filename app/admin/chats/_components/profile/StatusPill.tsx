"use client";

const CFG = {
    open: { color: "#34d399", label: "Abierta" },
    closed: { color: "#94a3b8", label: "Cerrada" },
    archived: { color: "#fbbf24", label: "Archivada" },
} as const;

type Props = { status: keyof typeof CFG };

export function StatusPill({ status }: Props) {
    const cfg = CFG[status];
    return (
        <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest"
            style={{
                borderColor: `${cfg.color}40`,
                background: `${cfg.color}15`,
                color: cfg.color,
            }}
        >
            <span className="h-1 w-1 rounded-full" style={{ background: cfg.color }} />
            {cfg.label}
        </span>
    );
}
