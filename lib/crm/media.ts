import type { MediaType } from "./types";

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
    image: "Imagen",
    audio: "Audio",
    voice: "Nota de voz",
    video: "Video",
    document: "Documento",
    sticker: "Sticker",
};

export function formatBytes(n: number | null | undefined): string {
    if (!n || n <= 0) return "—";
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDuration(seconds: number | null | undefined): string {
    if (!seconds || seconds <= 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Extrae extensión de un mime o filename. */
export function fileExtension(mime: string, filename?: string | null): string {
    if (filename) {
        const dot = filename.lastIndexOf(".");
        if (dot > 0) return filename.slice(dot + 1).toUpperCase();
    }
    const last = mime.split("/").pop() ?? "FILE";
    return last.toUpperCase();
}
