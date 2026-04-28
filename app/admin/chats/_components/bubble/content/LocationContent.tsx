"use client";

import { MapPin, ExternalLink } from "lucide-react";

type Props = {
    location: { latitude: number; longitude: number; name?: string; address?: string };
};

export function LocationContent({ location }: Props) {
    const { latitude, longitude, name, address } = location;
    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    return (
        <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 transition hover:border-white/[0.15] hover:bg-white/[0.05]"
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <MapPin className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
                {name && <p className="truncate text-sm font-semibold text-white">{name}</p>}
                {address && <p className="truncate text-xs text-gray-400">{address}</p>}
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                    {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </p>
            </div>
            <ExternalLink className="h-4 w-4 shrink-0 text-gray-500" />
        </a>
    );
}
