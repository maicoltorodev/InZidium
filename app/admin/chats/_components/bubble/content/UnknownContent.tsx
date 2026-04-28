"use client";

import { HelpCircle } from "lucide-react";

type Props = { type: string };

export function UnknownContent({ type }: Props) {
    return (
        <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2">
            <HelpCircle className="h-4 w-4 text-gray-500" />
            <span className="text-xs italic text-gray-500">Mensaje de tipo "{type}"</span>
        </div>
    );
}
