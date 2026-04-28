"use client";

import type { ReactNode } from "react";

type Props = { label: string; children: ReactNode };

export function Row({ label, children }: Props) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] uppercase tracking-wider text-gray-600 shrink-0 font-bold">
                {label}
            </span>
            {children}
        </div>
    );
}
