"use client";

import { Bot, User } from "lucide-react";
import type { Message } from "@/lib/crm/types";

type Props = {
    message: Message;
};

export function MessageBubble({ message }: Props) {
    const { role, content, sent_at } = message;
    const isUser = role === "user";

    const config = {
        user: {
            align: "justify-start",
            bubble: "bg-white/[0.04] border-white/[0.08] text-gray-100 rounded-tl-sm",
            label: null,
            labelColor: "",
            icon: null,
        },
        ai: {
            align: "justify-end",
            bubble: "bg-[#FFD700]/[0.07] border-[#FFD700]/20 text-white rounded-tr-sm",
            label: "IA",
            labelColor: "text-[#FFD700]",
            icon: <Bot className="h-3 w-3" />,
        },
        human: {
            align: "justify-end",
            bubble: "bg-white/[0.06] border-white/[0.12] text-white rounded-tr-sm",
            label: "Tú",
            labelColor: "text-gray-400",
            icon: <User className="h-3 w-3" />,
        },
    }[role];

    return (
        <div className={`flex ${config.align}`}>
            <div className="max-w-[70%] min-w-0">
                {config.label && (
                    <div className={`mb-1 flex items-center gap-1.5 ${isUser ? "" : "justify-end"} px-1`}>
                        {config.icon}
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${config.labelColor}`}>
                            {config.label}
                        </span>
                    </div>
                )}
                <div className={`relative rounded-2xl border px-4 py-3 ${config.bubble}`}>
                    {content ? (
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                            {content}
                        </p>
                    ) : (
                        <p className="text-xs italic text-gray-500">[sin contenido]</p>
                    )}
                    <span className={`mt-2 block font-mono text-[10px] text-gray-600 ${isUser ? "text-left" : "text-right"}`}>
                        {formatTime(new Date(sent_at))}
                    </span>
                </div>
            </div>
        </div>
    );
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: false });
}
