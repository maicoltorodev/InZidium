"use client";

import { MousePointerClick, List } from "lucide-react";

type Props = {
    interactive: { kind: "button_reply" | "list_reply"; id: string; title: string };
};

export function InteractiveContent({ interactive }: Props) {
    const Icon = interactive.kind === "button_reply" ? MousePointerClick : List;
    return (
        <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2">
            <Icon className="h-4 w-4 text-[#FFD700]" />
            <span className="text-sm text-white">{interactive.title}</span>
        </div>
    );
}
