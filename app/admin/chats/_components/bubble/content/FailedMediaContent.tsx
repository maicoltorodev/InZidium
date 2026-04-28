"use client";

import { AlertTriangle } from "lucide-react";

type Props = { reason?: string };

export function FailedMediaContent({ reason }: Props) {
    return (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-xs text-red-300">
                No se pudo cargar el archivo {reason ? `(${reason})` : ""}
            </span>
        </div>
    );
}
