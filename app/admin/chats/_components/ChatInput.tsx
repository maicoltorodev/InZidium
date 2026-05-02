"use client";

import { useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import type { Message } from "@/lib/crm/types";
import { AttachButton } from "./input/AttachButton";
import { FilePreview } from "./input/FilePreview";
import { ReplyPreview } from "./input/ReplyPreview";

type Props = {
    onSend: (text: string) => Promise<{ error?: string }>;
    onSendMedia?: (file: File, caption: string) => Promise<{ error?: string }>;
    replyingTo?: Message | null;
    onCancelReply?: () => void;
};

export function ChatInput({ onSend, onSendMedia, replyingTo, onCancelReply }: Props) {
    const [text, setText] = useState("");
    const [file, setFile] = useState<File | null>(null);
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
        if (!file && !trimmed) return;
        setSending(true);
        setError(null);

        let res: { error?: string };
        if (file) {
            if (!onSendMedia) {
                setError("Envío de archivos no disponible.");
                setSending(false);
                return;
            }
            res = await onSendMedia(file, trimmed);
        } else {
            res = await onSend(trimmed);
        }

        setSending(false);
        if (res.error) {
            setError(res.error);
            return;
        }
        setText("");
        setFile(null);
        if (textareaRef.current) textareaRef.current.style.height = "auto";
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    const canSend = !sending && (!!file || !!text.trim());
    const placeholder = file ? "Caption opcional…" : "Escribe tu respuesta…";

    return (
        <div className="space-y-2">
            {replyingTo && onCancelReply && (
                <ReplyPreview message={replyingTo} onCancel={onCancelReply} />
            )}
            {file && (
                <FilePreview file={file} onRemove={() => setFile(null)} sending={sending} />
            )}

            <div
                className="group flex items-end gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 transition-all focus-within:border-[#22d3ee]/40 focus-within:bg-white/[0.04] focus-within:shadow-[0_0_30px_rgba(34,211,238,0.08)]"
                style={{ backdropFilter: "blur(8px)" }}
            >
                <AttachButton disabled={sending || !!file} onPick={setFile} />

                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        autoResize();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={1}
                    className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none leading-relaxed"
                    style={{ minHeight: "32px", maxHeight: "160px" }}
                />

                <button
                    onClick={handleSend}
                    disabled={!canSend}
                    className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Enviar"
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(135deg, #22d3ee, #ffffff, #22d3ee)",
                        }}
                    />
                    {canSend && (
                        <div className="absolute inset-0 bg-white/0 transition-colors group-focus-within:bg-white/10" />
                    )}
                    <div className="relative flex h-full w-full items-center justify-center text-white">
                        {sending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" strokeWidth={2.5} />
                        )}
                    </div>
                </button>
            </div>

            {error && (
                <p className="px-1 text-[10px] font-black uppercase tracking-widest text-red-400">
                    {error}
                </p>
            )}
            <p className="px-1 text-[10px] text-gray-600 font-mono">
                Enter para enviar · Shift+Enter para nueva línea · 📎 para adjuntar
            </p>
        </div>
    );
}
