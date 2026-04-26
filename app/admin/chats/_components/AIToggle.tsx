"use client";

import { useState, useTransition } from "react";
import { Bot, BotOff } from "lucide-react";

type Props = {
    enabled: boolean;
    onToggle: (enabled: boolean) => Promise<void>;
};

export function AIToggle({ enabled, onToggle }: Props) {
    const [isPending, startTransition] = useTransition();
    const [confirmingDisable, setConfirmingDisable] = useState(false);

    function handleClick() {
        if (enabled) {
            setConfirmingDisable(true);
            return;
        }
        startTransition(async () => {
            await onToggle(true);
        });
    }

    function confirmDisable() {
        setConfirmingDisable(false);
        startTransition(async () => {
            await onToggle(false);
        });
    }

    if (confirmingDisable) {
        return (
            <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/5 px-2 py-1.5">
                <span className="px-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                    ¿Tomar control?
                </span>
                <button
                    onClick={() => setConfirmingDisable(false)}
                    className="rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white"
                >
                    No
                </button>
                <button
                    onClick={confirmDisable}
                    className="rounded-lg bg-amber-500 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#0a0a0a] hover:bg-amber-400"
                >
                    Sí
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={`group inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-widest transition disabled:opacity-50 ${
                enabled
                    ? "border-[#FFD700]/30 bg-[#FFD700]/10 text-[#FFD700] hover:border-[#FFD700]/50"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:border-amber-500/50"
            }`}
            title={enabled ? "IA respondiendo — click para tomar control" : "Humano al control — click para reactivar IA"}
        >
            {enabled ? (
                <>
                    <Bot className="h-3.5 w-3.5" />
                    IA activa
                </>
            ) : (
                <>
                    <BotOff className="h-3.5 w-3.5" />
                    Humano
                </>
            )}
        </button>
    );
}
