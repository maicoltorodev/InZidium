"use client";

import { CornerDownRight } from "lucide-react";
import type { MessageRole, WaMessageType } from "@/lib/crm/types";

type Props = {
    preview: { role: MessageRole; content: string | null; wa_type: WaMessageType };
};

const TYPE_LABEL: Record<WaMessageType, string> = {
    text: "",
    image: "📷 Imagen",
    audio: "🎵 Audio",
    video: "🎬 Video",
    document: "📄 Documento",
    sticker: "✨ Sticker",
    location: "📍 Ubicación",
    contacts: "👤 Contacto",
    interactive: "🔘 Botón",
    reaction: "💬 Reacción",
    system: "⚙️ Sistema",
    template: "📋 Plantilla",
    unknown: "❔ Mensaje",
};

const ROLE_LABEL: Record<MessageRole, string> = {
    user: "Cliente",
    ai: "Izzy",
    human: "Tú",
};

export function ReplyContext({ preview }: Props) {
    const isMedia = preview.wa_type !== "text";
    const text = preview.content?.trim() || (isMedia ? TYPE_LABEL[preview.wa_type] : "(sin contenido)");
    return (
        <div className="mb-2 rounded-lg border-l-2 border-[#FFD700]/40 bg-white/[0.04] px-3 py-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#FFD700]/70">
                <CornerDownRight className="h-2.5 w-2.5" />
                {ROLE_LABEL[preview.role]}
            </div>
            <p className="mt-0.5 line-clamp-2 text-xs text-gray-400">{text}</p>
        </div>
    );
}
