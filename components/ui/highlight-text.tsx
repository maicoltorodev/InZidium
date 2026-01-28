import React from "react"

interface HighlightTextProps {
    text: string
    highlight: string
    highlightClass?: string
}

export function HighlightText({ text, highlight, highlightClass = "text-white font-medium" }: HighlightTextProps) {
    if (!highlight) return <>{text}</>

    const parts = text.split(new RegExp(`(${highlight})`, "gi"))

    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <span key={i} className={highlightClass}>
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </>
    )
}
