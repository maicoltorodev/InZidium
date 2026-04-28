"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { ContactMedia } from "@/lib/crm/types";
import { MediaLightbox } from "../../MediaLightbox";

type Props = { media: ContactMedia; caption?: string | null };

export function VideoContent({ media, caption }: Props) {
    const [open, setOpen] = useState(false);
    const url = media.signed_url;
    if (!url) return <div className="h-40 w-56 animate-pulse rounded-xl bg-white/[0.04]" />;

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="group relative block overflow-hidden rounded-xl border border-white/[0.05]"
            >
                <video src={url} className="max-h-72 w-auto max-w-full" preload="metadata" />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black">
                        <Play className="h-5 w-5 ml-0.5" />
                    </div>
                </div>
            </button>
            {caption && (
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-100">
                    {caption}
                </p>
            )}
            {open && (
                <MediaLightbox
                    kind="video"
                    src={url}
                    caption={caption}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}
