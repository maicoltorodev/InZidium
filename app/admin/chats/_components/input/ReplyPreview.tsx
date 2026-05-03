"use client";

import { X, Reply } from "lucide-react";
import type { Message, MessageRole, WaMessageType } from "@/lib/crm/types";

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
    ai: "Zid",
    human: "Tú",
};

type Props = {
    message: Message;
    onCancel: () => void;
};

export function ReplyPreview({ message, onCancel }: Props) {
    const { role, wa_type, content } = message;
    const text = content?.trim() || (wa_type !== "text" ? TYPE_LABEL[wa_type] : "(sin contenido)");
    return (
        <div className="flex items-start gap-2 rounded-xl border-l-2 border-[#22d3ee]/60 bg-white/[0.04] px-3 py-2">
            <Reply className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#22d3ee]" />
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#22d3ee]">
                    Respondiendo a {ROLE_LABEL[role]}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-gray-400">{text}</p>
            </div>
            <button
                onClick={onCancel}
                aria-label="Cancelar reply"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.03] text-gray-400 transition hover:border-red-500/30 hover:text-red-400"
            >
                <X className="h-3 w-3" />
            </button>
        </div>
    );
}
