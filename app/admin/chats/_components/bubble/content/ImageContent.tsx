"use client";

import { useState } from "react";
import type { ContactMedia } from "@/lib/crm/types";
import { MediaLightbox } from "../../MediaLightbox";

type Props = { media: ContactMedia; caption?: string | null };

export function ImageContent({ media, caption }: Props) {
    const [open, setOpen] = useState(false);
    const url = media.signed_url;
    if (!url) return <div className="h-32 w-48 animate-pulse rounded-xl bg-white/[0.04]" />;

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="group block overflow-hidden rounded-xl border border-white/[0.05] transition hover:border-white/[0.15]"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={url}
                    alt={caption ?? "Imagen"}
                    className="max-h-72 w-auto max-w-full object-contain transition group-hover:opacity-90"
                />
            </button>
            {caption && (
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-100">
                    {caption}
                </p>
            )}
            {open && (
                <MediaLightbox
                    kind="image"
                    src={url}
                    caption={caption}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}
