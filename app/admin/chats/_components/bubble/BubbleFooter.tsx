"use client";

import type { MessageRole, MessageStatus } from "@/lib/crm/types";
import { StatusTicks } from "./StatusTicks";

type Props = {
    sentAt: string;
    role: MessageRole;
    status: MessageStatus;
    align: "left" | "right";
};

export function BubbleFooter({ sentAt, role, status, align }: Props) {
    const time = formatTime(new Date(sentAt));
    return (
        <div
            className={`mt-1.5 flex items-center gap-1.5 ${
                align === "right" ? "justify-end" : "justify-start"
            }`}
        >
            <span className="font-mono text-[10px] tabular-nums text-gray-500">{time}</span>
            {role !== "user" && <StatusTicks status={status} />}
        </div>
    );
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}
