"use client";

import { highlightMatches } from "../../search/highlightMatches";

type Props = { content: string | null; highlight?: string };

export function TextContent({ content, highlight }: Props) {
    if (!content) return <p className="text-xs italic text-gray-600">[sin contenido]</p>;
    return (
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-100">
            {highlight ? highlightMatches(content, highlight) : content}
        </p>
    );
}
