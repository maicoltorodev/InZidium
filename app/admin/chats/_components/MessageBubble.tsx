"use client";

import { Bot, User } from "lucide-react";
import type { Message } from "@/lib/crm/types";

type Props = {
    message: Message;
};

export function MessageBubble({ message }: Props) {
    const { role, content, sent_at } = message;
    const isUser = role === "user";

    return (
        <div className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
            <div className="max-w-[75%] min-w-0">
                {/* Label encima del bubble (solo AI/human) */}
                {role !== "user" && (
                    <div className="mb-1 flex items-center justify-end gap-1.5 px-1">
                        {role === "ai" ? (
                            <Bot className="h-3 w-3 text-[#22d3ee]" />
                        ) : (
                            <User className="h-3 w-3 text-[#e879f9]" />
                        )}
                        <span
                            className="text-[9px] font-black uppercase tracking-[0.25em] font-[family-name:var(--font-orbitron)]"
                            style={{
                                color: role === "ai" ? "#22d3ee" : "#e879f9",
                            }}
                        >
                            {role === "ai" ? "Izzy" : "Tú"}
                        </span>
                    </div>
                )}

                <BubbleContent role={role} content={content} sent_at={sent_at} isUser={isUser} />
            </div>
        </div>
    );
}

function BubbleContent({
    role,
    content,
    sent_at,
    isUser,
}: {
    role: "user" | "ai" | "human";
    content: string | null;
    sent_at: string;
    isUser: boolean;
}) {
    if (role === "ai") {
        // Bubble AI con gradient sutil
        return (
            <div
                className="relative overflow-hidden rounded-2xl rounded-tr-md border px-4 py-3"
                style={{
                    borderColor: "rgba(34,211,238,0.2)",
                    background:
                        "linear-gradient(135deg, rgba(34,211,238,0.10), rgba(168,85,247,0.08))",
                    boxShadow: "0 4px 20px rgba(34,211,238,0.06)",
                }}
            >
                {/* Glow ambient interno */}
                <div
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-40"
                    style={{
                        background: "radial-gradient(circle, #22d3ee, transparent)",
                    }}
                />
                <Body content={content} timeAlign="right" sent_at={sent_at} />
            </div>
        );
    }

    if (role === "human") {
        return (
            <div
                className="relative overflow-hidden rounded-2xl rounded-tr-md border px-4 py-3"
                style={{
                    borderColor: "rgba(232,121,249,0.2)",
                    background:
                        "linear-gradient(135deg, rgba(232,121,249,0.08), rgba(168,85,247,0.05))",
                    boxShadow: "0 4px 20px rgba(232,121,249,0.06)",
                }}
            >
                <Body content={content} timeAlign="right" sent_at={sent_at} />
            </div>
        );
    }

    // user (cliente)
    return (
        <div
            className="rounded-2xl rounded-tl-md border border-white/[0.08] bg-white/[0.04] px-4 py-3"
            style={{ backdropFilter: "blur(8px)" }}
        >
            <Body content={content} timeAlign="left" sent_at={sent_at} />
        </div>
    );
}

function Body({
    content,
    timeAlign,
    sent_at,
}: {
    content: string | null;
    timeAlign: "left" | "right";
    sent_at: string;
}) {
    return (
        <>
            {content ? (
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-100">
                    {content}
                </p>
            ) : (
                <p className="text-xs italic text-gray-600">[sin contenido]</p>
            )}
            <span
                className={`mt-1.5 block font-mono text-[10px] tabular-nums text-gray-500 ${
                    timeAlign === "left" ? "text-left" : "text-right"
                }`}
            >
                {formatTime(new Date(sent_at))}
            </span>
        </>
    );
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}
