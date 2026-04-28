"use client";

import { useEffect, useState } from "react";
import { X, Image as ImageIcon, Music, Video, FileText } from "lucide-react";
import { formatBytes } from "@/lib/crm/media";

type Props = {
    file: File;
    onRemove: () => void;
    sending: boolean;
};

export function FilePreview({ file, onRemove, sending }: Props) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!file.type.startsWith("image/")) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const Icon = pickIcon(file.type);

    return (
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
            {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="preview" className="h-12 w-12 rounded-lg object-cover" />
            ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FFD700]/10">
                    <Icon className="h-5 w-5 text-[#FFD700]" />
                </div>
            )}
            <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">{file.name}</p>
                <p className="font-mono text-[10px] text-gray-500">
                    {formatBytes(file.size)} · {file.type || "desconocido"}
                </p>
            </div>
            <button
                onClick={onRemove}
                disabled={sending}
                aria-label="Quitar archivo"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-gray-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}

function pickIcon(mime: string) {
    if (mime.startsWith("image/")) return ImageIcon;
    if (mime.startsWith("audio/")) return Music;
    if (mime.startsWith("video/")) return Video;
    return FileText;
}
