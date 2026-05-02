"use client";

import { FileText, Download } from "lucide-react";
import type { ContactMedia } from "@/lib/crm/types";
import { fileExtension, formatBytes } from "@/lib/crm/media";

type Props = { media: ContactMedia; caption?: string | null };

export function DocumentContent({ media, caption }: Props) {
    const url = media.signed_url;
    const filename = media.original_filename ?? "documento";
    const ext = fileExtension(media.mime, filename);

    return (
        <div className="space-y-2">
            <a
                href={url ?? "#"}
                target="_blank"
                rel="noreferrer noopener"
                download={filename}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 transition hover:border-white/[0.15] hover:bg-white/[0.05]"
            >
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#22d3ee]/10">
                    <FileText className="h-5 w-5 text-[#22d3ee]" />
                    <span className="absolute -bottom-1 right-0 rounded bg-[#22d3ee] px-1 text-[8px] font-black tabular-nums text-black">
                        {ext.slice(0, 4)}
                    </span>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{filename}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                        {formatBytes(media.size_bytes)}
                    </p>
                </div>
                <Download className="h-4 w-4 shrink-0 text-gray-500" />
            </a>
            {caption && (
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-100">
                    {caption}
                </p>
            )}
        </div>
    );
}
