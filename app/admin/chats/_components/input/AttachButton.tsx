"use client";

import { useRef } from "react";
import { Paperclip } from "lucide-react";

const ACCEPT =
    "image/*,audio/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain";

type Props = {
    disabled?: boolean;
    onPick: (file: File) => void;
};

export function AttachButton({ disabled, onPick }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) onPick(file);
        e.target.value = ""; // reset para poder re-seleccionar el mismo archivo
    }

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                onChange={handleChange}
                className="hidden"
            />
            <button
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
                aria-label="Adjuntar archivo"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-gray-400 transition hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <Paperclip className="h-4 w-4" />
            </button>
        </>
    );
}
