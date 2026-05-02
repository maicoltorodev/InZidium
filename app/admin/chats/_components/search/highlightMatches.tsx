import type { ReactNode } from "react";

/**
 * Devuelve los matches del query envueltos en <mark> dentro del texto.
 * Case-insensitive. Si no hay query o no matchea, devuelve el texto crudo.
 */
export function highlightMatches(text: string, query: string): ReactNode {
    const q = query.trim();
    if (!q) return text;
    const lower = text.toLowerCase();
    const target = q.toLowerCase();
    const parts: ReactNode[] = [];
    let i = 0;
    let key = 0;
    while (i < text.length) {
        const idx = lower.indexOf(target, i);
        if (idx < 0) {
            parts.push(text.slice(i));
            break;
        }
        if (idx > i) parts.push(text.slice(i, idx));
        parts.push(
            <mark
                key={`m-${key++}`}
                className="rounded bg-[#22d3ee]/30 px-0.5 text-white"
            >
                {text.slice(idx, idx + q.length)}
            </mark>,
        );
        i = idx + q.length;
    }
    return <>{parts}</>;
}
