"use client";

type Props = { count: number };

export function UnreadBadge({ count }: Props) {
    if (count <= 0) return null;
    const display = count > 99 ? "99+" : String(count);
    return (
        <span
            className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black text-black tabular-nums"
            style={{
                background: "linear-gradient(135deg, #FFD700, #ffffff)",
                boxShadow: "0 0 12px rgba(255,215,0,0.45)",
            }}
        >
            {display}
        </span>
    );
}
