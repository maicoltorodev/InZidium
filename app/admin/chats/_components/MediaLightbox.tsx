"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Props = {
    kind: "image" | "video";
    src: string;
    caption?: string | null;
    onClose: () => void;
};

export function MediaLightbox({ kind, src, caption, onClose }: Props) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    if (typeof window === "undefined") return null;

    return createPortal(
        <div
            onClick={onClose}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
        >
            <button
                onClick={onClose}
                aria-label="Cerrar"
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            >
                <X className="h-5 w-5" />
            </button>
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full max-w-full flex-col items-center gap-3"
            >
                {kind === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={caption ?? "Imagen"} className="max-h-[85vh] max-w-full object-contain" />
                ) : (
                    <video src={src} controls autoPlay className="max-h-[85vh] max-w-full" />
                )}
                {caption && (
                    <p className="max-w-2xl text-center text-sm text-gray-300">{caption}</p>
                )}
            </div>
        </div>,
        document.body,
    );
}
