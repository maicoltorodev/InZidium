"use client";

import { useRef, useState } from "react";
import { Send } from "lucide-react";

type Props = {
    onSend: (text: string) => Promise<{ error?: string }>;
};

export function ChatInput({ onSend }: Props) {
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    function autoResize() {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }

    async function handleSend() {
        if (sending) return;
        const trimmed = text.trim();
        if (!trimmed) return;
        setSending(true);
        setError(null);
        const res = await onSend(trimmed);
        setSending(false);
        if (res.error) {
            setError(res.error);
            return;
        }
        setText("");
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="space-y-2">
            <div className="flex items-end gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 focus-within:border-[#FFD700]/35 transition-colors">
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => { setText(e.target.value); autoResize(); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu respuesta…"
                    rows={1}
                    className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none leading-relaxed"
                    style={{ minHeight: "36px", maxHeight: "160px" }}
                />
                <button
                    onClick={handleSend}
                    disabled={sending || !text.trim()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFD700] text-black transition hover:bg-[#FFD700]/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
            {error && (
                <p className="px-1 text-xs font-bold uppercase tracking-widest text-red-400">{error}</p>
            )}
            <p className="px-1 text-xs text-gray-600">
                Enter para enviar · Shift+Enter para nueva línea
            </p>
        </div>
    );
}
