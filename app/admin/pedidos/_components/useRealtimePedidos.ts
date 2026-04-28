"use client";

import { useEffect, useRef } from "react";
import type { Order, OrderWithContact } from "@/lib/crm/types";

type Callbacks = {
    onInsert?: (order: OrderWithContact) => void;
    onUpdate?: (order: Order) => void;
    onDelete?: (id: string) => void;
};

export function useRealtimePedidos(callbacks: Callbacks) {
    const callbacksRef = useRef(callbacks);
    useEffect(() => {
        callbacksRef.current = callbacks;
    });

    useEffect(() => {
        const es = new EventSource("/api/pedidos/stream");

        es.addEventListener("order_insert", (e) => {
            try {
                callbacksRef.current.onInsert?.(JSON.parse(e.data) as OrderWithContact);
            } catch {}
        });

        es.addEventListener("order_update", (e) => {
            try {
                callbacksRef.current.onUpdate?.(JSON.parse(e.data) as Order);
            } catch {}
        });

        es.addEventListener("order_delete", (e) => {
            try {
                const { id } = JSON.parse(e.data) as { id: string };
                callbacksRef.current.onDelete?.(id);
            } catch {}
        });

        return () => {
            es.close();
        };
    }, []);
}
