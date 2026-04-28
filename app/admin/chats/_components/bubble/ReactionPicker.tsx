"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Smile } from "lucide-react";

const QUICK_EMOJIS = ["❤️", "👍", "👎", "😂", "😮", "😢", "🙏", "🔥"] as const;

const PICKER_WIDTH = 260; // ancho aprox del picker
const PICKER_HEIGHT = 36;
const VIEWPORT_PADDING = 12;

type Props = {
    onPick: (emoji: string) => void;
    /** Hint de qué lado preferir cuando hay espacio en ambos. "left"=hacia la izquierda del botón. */
    align: "left" | "right";
};

type Position = { top: number; left: number };

/**
 * Picker renderizado en `document.body` (portal) para escapar el `overflow:hidden`
 * del scroll container del chat. Calcula la posición con `getBoundingClientRect()`
 * y se voltea automáticamente si no entra del lado preferido.
 */
export function ReactionPicker({ onPick, align }: Props) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState<Position | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    function recompute() {
        const btn = buttonRef.current;
        if (!btn) return;
        const r = btn.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Vertical: preferimos abajo del botón; si no entra, arriba.
        let top = r.bottom + 6;
        if (top + PICKER_HEIGHT + VIEWPORT_PADDING > vh) {
            top = r.top - PICKER_HEIGHT - 6;
        }

        // Horizontal: empezamos según `align` y revisamos clamp.
        // align="left" → picker se ancla por la derecha del botón (expande izquierda)
        // align="right" → picker se ancla por la izquierda del botón (expande derecha)
        let left = align === "left" ? r.right - PICKER_WIDTH : r.left;
        // Si se sale por la izquierda, voltear
        if (left < VIEWPORT_PADDING) left = r.left;
        // Si se sale por la derecha, alinear al borde derecho del botón
        if (left + PICKER_WIDTH + VIEWPORT_PADDING > vw) {
            left = Math.max(VIEWPORT_PADDING, r.right - PICKER_WIDTH);
        }
        // Clamp final por si el viewport es muy chico
        left = Math.max(VIEWPORT_PADDING, Math.min(left, vw - PICKER_WIDTH - VIEWPORT_PADDING));

        setPos({ top, left });
    }

    useLayoutEffect(() => {
        if (!open) return;
        recompute();
        const onScroll = () => recompute();
        const onResize = () => recompute();
        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onClick = (e: MouseEvent) => {
            const target = e.target as Node;
            if (buttonRef.current?.contains(target)) return;
            if (pickerRef.current?.contains(target)) return;
            setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <>
            <button
                ref={buttonRef}
                onClick={() => setOpen((v) => !v)}
                aria-label="Reaccionar"
                title="Reaccionar"
                className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.08] bg-[#0a0a0a]/85 text-gray-300 backdrop-blur-sm transition hover:border-[#FFD700]/40 hover:bg-[#FFD700]/10 hover:text-[#FFD700]"
            >
                <Smile className="h-3 w-3" />
            </button>

            {mounted && open && pos && createPortal(
                <div
                    ref={pickerRef}
                    style={{
                        position: "fixed",
                        top: pos.top,
                        left: pos.left,
                        zIndex: 9999,
                        boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
                    }}
                    className="flex items-center gap-0.5 rounded-xl border border-white/[0.08] bg-[#0a0a0a]/95 px-1.5 py-1 backdrop-blur-md"
                >
                    {QUICK_EMOJIS.map((e) => (
                        <button
                            key={e}
                            onClick={() => {
                                onPick(e);
                                setOpen(false);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-base transition hover:scale-125 hover:bg-white/[0.06]"
                        >
                            {e}
                        </button>
                    ))}
                </div>,
                document.body,
            )}
        </>
    );
}
