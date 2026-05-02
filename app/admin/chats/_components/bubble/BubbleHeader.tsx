"use client";

import { Bot, User, FileCode2 } from "lucide-react";
import type { MessageRole, WaMessageType } from "@/lib/crm/types";

type Props = {
    role: MessageRole;
    waType?: WaMessageType;
    /** Username del admin que envió (para role='human'). */
    createdBy?: string | null;
    /** Username del agente actual; si coincide con createdBy mostramos "Tú". */
    currentUser?: string | null;
};

export function BubbleHeader({ role, waType, createdBy, currentUser }: Props) {
    if (role === "user") return null;
    const isAi = role === "ai";
    const isTemplate = waType === "template";

    // Para humanos: si el admin actual es quien envió, "Tú"; sino mostramos el username
    let label: string;
    if (isAi) label = "Izzy";
    else if (!createdBy || createdBy === currentUser) label = "Tú";
    else label = createdBy;

    return (
        <div className="mb-1 flex items-center justify-end gap-1.5 px-1">
            {isAi ? (
                <Bot className="h-3 w-3 text-[#22d3ee]" />
            ) : (
                <User className="h-3 w-3 text-white" />
            )}
            <span
                className="text-[9px] font-black uppercase tracking-[0.25em] font-[family-name:var(--font-orbitron)]"
                style={{ color: isAi ? "#22d3ee" : "#ffffff" }}
                title={!isAi && createdBy ? `Enviado por ${createdBy}` : undefined}
            >
                {label}
            </span>
            {isTemplate && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/[0.08] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#22d3ee]">
                    <FileCode2 className="h-2.5 w-2.5" />
                    Plantilla
                </span>
            )}
        </div>
    );
}
