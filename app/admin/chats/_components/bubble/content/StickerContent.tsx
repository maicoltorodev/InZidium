"use client";

import type { ContactMedia } from "@/lib/crm/types";

type Props = { media: ContactMedia };

export function StickerContent({ media }: Props) {
    const url = media.signed_url;
    if (!url) return <div className="h-32 w-32 animate-pulse rounded-xl bg-white/[0.04]" />;
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={url}
            alt="Sticker"
            className="h-32 w-32 object-contain"
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}
        />
    );
}
