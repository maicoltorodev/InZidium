"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Mic } from "lucide-react";
import type { ContactMedia } from "@/lib/crm/types";
import { formatDuration } from "@/lib/crm/media";

type Props = { media: ContactMedia; isVoice?: boolean };

export function AudioContent({ media, isVoice }: Props) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState<number | null>(media.duration_seconds);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;
        const onTime = () => setProgress(a.currentTime);
        const onLoad = () => setDuration(a.duration);
        const onEnd = () => setPlaying(false);
        a.addEventListener("timeupdate", onTime);
        a.addEventListener("loadedmetadata", onLoad);
        a.addEventListener("ended", onEnd);
        return () => {
            a.removeEventListener("timeupdate", onTime);
            a.removeEventListener("loadedmetadata", onLoad);
            a.removeEventListener("ended", onEnd);
        };
    }, []);

    const url = media.signed_url;
    if (!url) return <div className="h-12 w-56 animate-pulse rounded-xl bg-white/[0.04]" />;

    function toggle() {
        const a = audioRef.current;
        if (!a) return;
        if (a.paused) {
            a.play().then(() => setPlaying(true)).catch(() => {});
        } else {
            a.pause();
            setPlaying(false);
        }
    }

    const pct = duration ? (progress / duration) * 100 : 0;

    return (
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2.5 min-w-[240px]">
            <button
                onClick={toggle}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#22d3ee]/15 text-[#22d3ee] transition hover:bg-[#22d3ee]/25"
                aria-label={playing ? "Pausar" : "Reproducir"}
            >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    {isVoice && <Mic className="h-3 w-3 text-gray-500" />}
                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#22d3ee] to-white transition-all"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>
                <div className="mt-1 flex justify-between font-mono text-[10px] tabular-nums text-gray-500">
                    <span>{formatDuration(progress)}</span>
                    <span>{formatDuration(duration ?? 0)}</span>
                </div>
            </div>
            <audio ref={audioRef} src={url} preload="metadata" className="hidden" />
        </div>
    );
}
