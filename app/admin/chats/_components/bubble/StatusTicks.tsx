"use client";

import { Check, CheckCheck, Clock, AlertCircle } from "lucide-react";
import type { MessageStatus } from "@/lib/crm/types";

type Props = { status: MessageStatus };

export function StatusTicks({ status }: Props) {
    if (status === "pending") {
        return <Clock className="h-3 w-3 text-gray-500" aria-label="Enviando" />;
    }
    if (status === "failed") {
        return <AlertCircle className="h-3 w-3 text-red-400" aria-label="Falló el envío" />;
    }
    if (status === "sent") {
        return <Check className="h-3 w-3 text-gray-400" aria-label="Enviado" />;
    }
    if (status === "delivered") {
        return <CheckCheck className="h-3 w-3 text-gray-400" aria-label="Entregado" />;
    }
    if (status === "read") {
        return <CheckCheck className="h-3 w-3 text-sky-400" aria-label="Leído" />;
    }
    return null;
}
