"use client";

import { Reply } from "lucide-react";
import { ReactionPicker } from "./ReactionPicker";

type Props = {
    /** Lado del bubble al que pertenece. "left"=acciones a la derecha del bubble; "right"=a la izquierda. */
    side: "left" | "right";
    onReply?: () => void;
    onReact?: (emoji: string) => void;
};

/**
 * Acciones laterales que aparecen al hover, AFUERA del bubble.
 * Position absolute para no reservar espacio en el layout cuando están ocultas.
 */
export function BubbleActions({ side, onReply, onReact }: Props) {
    if (!onReply && !onReact) return null;
    // side="left" significa que el bubble está a la izquierda → acciones afuera a la DERECHA
    // side="right" significa que el bubble está a la derecha → acciones afuera a la IZQUIERDA
    const positionClass = side === "left" ? "left-full ml-2" : "right-full mr-2";
    // El picker de emoji expande HACIA el bubble (lado interior). Si expandiera hacia
    // afuera se sale del scroll container del chat (overflow: hidden) y los emojis del
    // borde quedan cortados.
    const pickerAlign: "left" | "right" = side === "left" ? "left" : "right";
    return (
        <div
            className={`pointer-events-none absolute bottom-1 ${positionClass} flex items-center gap-1 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100`}
        >
            {onReact && <ReactionPicker onPick={onReact} align={pickerAlign} />}
            {onReply && (
                <button
                    onClick={onReply}
                    aria-label="Responder a este mensaje"
                    title="Responder"
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.08] bg-[#0a0a0a]/85 text-gray-300 backdrop-blur-sm transition hover:border-[#22d3ee]/40 hover:bg-[#22d3ee]/10 hover:text-[#22d3ee]"
                >
                    <Reply className="h-3 w-3" />
                </button>
            )}
        </div>
    );
}
