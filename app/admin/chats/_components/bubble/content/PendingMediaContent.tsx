"use client";

import { Loader2, Image as ImageIcon, Music, Video, FileText, Sparkles } from "lucide-react";
import type { WaMessageType } from "@/lib/crm/types";

const ICONS: Partial<Record<WaMessageType, typeof ImageIcon>> = {
    image: ImageIcon,
    audio: Music,
    video: Video,
    document: FileText,
    sticker: Sparkles,
};

type Props = { type: WaMessageType };

export function PendingMediaContent({ type }: Props) {
    const Icon = ICONS[type] ?? ImageIcon;
    return (
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/30 px-3 py-2.5">
            <div className="relative">
                <Icon className="h-5 w-5 text-gray-500" />
                <Loader2 className="absolute -right-1 -bottom-1 h-3 w-3 animate-spin text-[#FFD700]" />
            </div>
            <span className="text-xs text-gray-500">Cargando…</span>
        </div>
    );
}
