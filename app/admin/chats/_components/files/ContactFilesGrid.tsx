"use client";

import { useMemo, useState } from "react";
import { Image as ImageIcon, Music, Video, FileText, Mic, Loader2, FolderOpen } from "lucide-react";
import type { ContactMedia, MediaType } from "@/lib/crm/types";
import { formatDuration, fileExtension } from "@/lib/crm/media";
import { MediaLightbox } from "../MediaLightbox";
import { useContactMediaRealtime } from "@/app/admin/_components/realtime/useContactMediaRealtime";

type Props = { contactId: string };
type Filter = MediaType | "all";

const TYPE_ORDER: MediaType[] = ["image", "video", "audio", "voice", "document", "sticker"];

const TYPE_ICONS: Record<MediaType, typeof ImageIcon> = {
    image: ImageIcon,
    sticker: ImageIcon,
    video: Video,
    audio: Music,
    voice: Mic,
    document: FileText,
};

/**
 * Grilla de archivos del contacto + filtros por tipo.
 * Sincronizada en realtime via useContactMediaRealtime.
 */
export function ContactFilesGrid({ contactId }: Props) {
    const { items: all } = useContactMediaRealtime(contactId);
    const [filter, setFilter] = useState<Filter>("all");
    const [lightbox, setLightbox] = useState<
        { kind: "image" | "video"; src: string; caption: string | null } | null
    >(null);

    const counts = useMemo(() => {
        const c: Record<MediaType, number> = {
            image: 0, video: 0, audio: 0, voice: 0, document: 0, sticker: 0,
        };
        for (const m of all ?? []) c[m.media_type] = (c[m.media_type] ?? 0) + 1;
        return c;
    }, [all]);

    const filtered = useMemo(() => {
        if (!all) return [];
        if (filter === "all") return all;
        return all.filter((m) => m.media_type === filter);
    }, [all, filter]);

    if (all === null) {
        return (
            <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
            </div>
        );
    }

    if (all.length === 0) return <EmptyState />;

    const visibleTypes = TYPE_ORDER.filter((t) => counts[t] > 0);
    const showFilterRow = visibleTypes.length > 1;

    return (
        <div className="space-y-3">
            {showFilterRow && (
                <FilterRow
                    visibleTypes={visibleTypes}
                    counts={counts}
                    activeFilter={filter}
                    onChange={setFilter}
                    totalCount={all.length}
                />
            )}

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {filtered.map((m) => (
                    <FileTile
                        key={m.id}
                        media={m}
                        onOpen={(kind, src, cap) =>
                            setLightbox({ kind, src, caption: cap })
                        }
                    />
                ))}
            </div>

            {lightbox && (
                <MediaLightbox
                    kind={lightbox.kind}
                    src={lightbox.src}
                    caption={lightbox.caption}
                    onClose={() => setLightbox(null)}
                />
            )}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <FolderOpen className="h-5 w-5 text-gray-600" />
            </div>
            <p className="text-xs text-gray-600">Sin archivos en esta conversación.</p>
        </div>
    );
}

function FilterRow({
    visibleTypes,
    counts,
    activeFilter,
    onChange,
    totalCount,
}: {
    visibleTypes: MediaType[];
    counts: Record<MediaType, number>;
    activeFilter: Filter;
    onChange: (f: Filter) => void;
    totalCount: number;
}) {
    return (
        <div className="flex flex-wrap items-center gap-1">
            <FilterPill
                active={activeFilter === "all"}
                onClick={() => onChange("all")}
                count={totalCount}
            />
            {visibleTypes.map((t) => (
                <FilterPill
                    key={t}
                    active={activeFilter === t}
                    onClick={() => onChange(t)}
                    icon={TYPE_ICONS[t]}
                    count={counts[t]}
                />
            ))}
        </div>
    );
}

function FilterPill({
    active,
    onClick,
    icon: Icon,
    count,
}: {
    active: boolean;
    onClick: () => void;
    icon?: typeof ImageIcon;
    count: number;
}) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold tabular-nums transition ${
                active
                    ? "bg-[#FFD700]/12 text-[#FFD700]"
                    : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-300"
            }`}
        >
            {Icon ? (
                <Icon className="h-3 w-3" />
            ) : (
                <span className="text-[10px] font-black uppercase tracking-widest">Todo</span>
            )}
            <span>{count}</span>
        </button>
    );
}

function FileTile({
    media,
    onOpen,
}: {
    media: ContactMedia;
    onOpen: (kind: "image" | "video", src: string, caption: string | null) => void;
}) {
    const url = media.signed_url;

    if (media.media_type === "image" || media.media_type === "sticker") {
        return (
            <button
                onClick={() => url && onOpen("image", url, media.caption)}
                disabled={!url}
                className="group relative aspect-square overflow-hidden rounded-lg bg-white/[0.02]"
            >
                {url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={url}
                        alt={media.caption ?? ""}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                ) : (
                    <Loader2 className="absolute inset-0 m-auto h-4 w-4 animate-spin text-gray-600" />
                )}
            </button>
        );
    }

    if (media.media_type === "video") {
        return (
            <button
                onClick={() => url && onOpen("video", url, media.caption)}
                disabled={!url}
                className="group relative aspect-square overflow-hidden rounded-lg bg-black/40"
            >
                {url ? (
                    <>
                        <video src={url} className="h-full w-full object-cover" muted preload="metadata" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition group-hover:bg-black/30">
                            <Video className="h-5 w-5 text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]" />
                        </div>
                    </>
                ) : (
                    <Loader2 className="absolute inset-0 m-auto h-4 w-4 animate-spin text-gray-600" />
                )}
                {media.duration_seconds && (
                    <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 font-mono text-[9px] text-white">
                        {formatDuration(media.duration_seconds)}
                    </span>
                )}
            </button>
        );
    }

    const Icon =
        media.media_type === "voice" ? Mic : media.media_type === "audio" ? Music : FileText;
    return (
        <a
            href={url ?? "#"}
            target="_blank"
            rel="noreferrer noopener"
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg bg-white/[0.03] p-2 text-center transition hover:bg-white/[0.06]"
        >
            <Icon className="h-5 w-5 text-[#FFD700]" />
            <p className="line-clamp-2 break-all text-[9px] text-gray-400">
                {media.original_filename ?? fileExtension(media.mime)}
            </p>
        </a>
    );
}
