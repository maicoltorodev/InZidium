"use client";

import { useCallback, useEffect, useState } from "react";
import type { Order, OrderWithContact } from "@/lib/crm/types";
import { listOrders } from "@/lib/crm/actions/pedidos";
import { useRealtime } from "./RealtimeProvider";

/**
 * Lista de pedidos con sync realtime. INSERT → prepend; UPDATE → patch; DELETE → drop.
 * Reset → refetch full.
 */
export function useOrdersRealtime() {
    const { onTable, onReset } = useRealtime();
    const [orders, setOrders] = useState<OrderWithContact[]>([]);
    const [loading, setLoading] = useState(true);

    const refetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await listOrders();
            setOrders(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => onReset(refetch), [onReset, refetch]);

    useEffect(
        () =>
            onTable<Order>("orders", (e) => {
                if (e.eventType === "INSERT") {
                    // INSERT puro no trae el contact join → refetch para tenerlo enriched
                    refetch();
                } else if (e.eventType === "UPDATE") {
                    setOrders((prev) =>
                        prev.map((o) => (o.id === e.new.id ? { ...o, ...e.new } : o)),
                    );
                } else if (e.eventType === "DELETE") {
                    const old = e.old as Partial<Order>;
                    if (!old?.id) return;
                    setOrders((prev) => prev.filter((o) => o.id !== old.id));
                }
            }),
        [onTable, refetch],
    );

    return { orders, loading, refetch };
}
