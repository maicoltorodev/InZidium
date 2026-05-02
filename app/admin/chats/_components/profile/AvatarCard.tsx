"use client";

import { Bot, BotOff } from "lucide-react";
import type { Contact } from "@/lib/crm/types";

type Props = { contact: Contact };

export function AvatarCard({ contact }: Props) {
    const displayName = contact.name?.trim() || contact.phone;
    const initial = displayName.charAt(0).toUpperCase();
    const aiActive = contact.ai_enabled;

    return (
        <div
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-6 text-center"
            style={{ backdropFilter: "blur(8px)" }}
        >
            <div
                className="pointer-events-none absolute -top-12 left-1/2 h-24 w-32 -translate-x-1/2 rounded-full blur-2xl opacity-40"
                style={{
                    background: aiActive
                        ? "radial-gradient(circle, #22d3ee, transparent)"
                        : "radial-gradient(circle, #f59e0b, transparent)",
                }}
            />
            <div className="relative">
                <div className="relative mx-auto mb-4 h-16 w-16">
                    <div
                        className="absolute inset-0 rounded-full blur-md opacity-60"
                        style={{
                            background: aiActive
                                ? "linear-gradient(135deg, #22d3ee, #a855f7)"
                                : "linear-gradient(135deg, #22d3ee, #f59e0b)",
                        }}
                    />
                    <div
                        className={`relative flex h-full w-full items-center justify-center rounded-full text-xl font-black ${
                            aiActive
                                ? "border border-white/[0.12] bg-white/[0.06] text-white"
                                : "border border-amber-500/30 bg-amber-500/[0.1] text-amber-300"
                        }`}
                        style={{ backdropFilter: "blur(8px)" }}
                    >
                        {initial}
                    </div>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug truncate px-2">
                    {displayName}
                </h3>
                {contact.name && (
                    <p className="mt-1 font-mono text-[10px] text-gray-500">{contact.phone}</p>
                )}

                <div
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em]"
                    style={
                        aiActive
                            ? {
                                  borderColor: "rgba(34,211,238,0.3)",
                                  background:
                                      "linear-gradient(135deg, rgba(34,211,238,0.08), rgba(255,255,255,0.08))",
                                  color: "#22d3ee",
                              }
                            : {
                                  borderColor: "rgba(245,158,11,0.3)",
                                  background: "rgba(245,158,11,0.08)",
                                  color: "#fbbf24",
                              }
                    }
                >
                    {aiActive ? <Bot className="h-3 w-3" /> : <BotOff className="h-3 w-3" />}
                    {aiActive ? "IA activa" : "Manual"}
                </div>
            </div>
        </div>
    );
}
