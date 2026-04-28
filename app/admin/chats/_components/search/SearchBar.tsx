"use client";

import { useEffect, useRef } from "react";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";

type Props = {
    query: string;
    onQueryChange: (q: string) => void;
    matchesCount: number;
    currentIndex: number;
    onPrev: () => void;
    onNext: () => void;
    onClose: () => void;
};

export function SearchBar({
    query,
    onQueryChange,
    matchesCount,
    currentIndex,
    onPrev,
    onNext,
    onClose,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Escape") {
            e.preventDefault();
            onClose();
            return;
        }
        if (e.key === "Enter") {
            e.preventDefault();
            if (e.shiftKey) onPrev();
            else onNext();
        }
    }

    const hasQuery = query.trim().length > 0;
    const counterText = !hasQuery
        ? "Escribe para buscar"
        : matchesCount === 0
            ? "Sin resultados"
            : `${currentIndex + 1} / ${matchesCount}`;

    return (
        <div className="flex items-center gap-2 border-b border-white/[0.05] px-4 py-2 bg-white/[0.02]">
            <Search className="h-3.5 w-3.5 text-gray-500" />
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Buscar en esta conversación…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none"
            />
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 tabular-nums">
                {counterText}
            </span>
            <div className="flex items-center gap-0.5">
                <button
                    onClick={onPrev}
                    disabled={matchesCount === 0}
                    aria-label="Match anterior"
                    className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={onNext}
                    disabled={matchesCount === 0}
                    aria-label="Match siguiente"
                    className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronDown className="h-3.5 w-3.5" />
                </button>
            </div>
            <button
                onClick={onClose}
                aria-label="Cerrar búsqueda"
                className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}
