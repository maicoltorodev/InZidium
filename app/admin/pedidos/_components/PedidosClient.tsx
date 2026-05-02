"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Search, Plus } from "lucide-react";
import type {
    ActionResult,
    Order,
    OrderStatus,
} from "@/lib/crm/types";
import {
    deleteOrder,
    updateOrderDetails,
    updateOrderStatus,
} from "@/lib/crm/actions/pedidos";
import { PedidoCard } from "./PedidoCard";
import { PedidoDetailModal } from "./PedidoDetailModal";
import { CreateOrderModal } from "./create/CreateOrderModal";
import { STATUS_META, STATUS_ORDER } from "./StatusPill";
import { useOrdersRealtime } from "@/app/admin/_components/realtime/useOrdersRealtime";
import { AdminLoading } from "@/lib/ui/AdminLoading";

type Filter = "all" | OrderStatus;

export function PedidosClient() {
    const { orders, loading } = useOrdersRealtime();
    const [filter, setFilter] = useState<Filter>("all");
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [createOpen, setCreateOpen] = useState(false);

    // Cuando reset borra el seleccionado, cerramos modal
    useEffect(() => {
        if (selectedId && !orders.some((o) => o.id === selectedId)) {
            setSelectedId(null);
        }
    }, [orders, selectedId]);

    const countsByStatus = useMemo(() => {
        const c: Record<OrderStatus, number> = {
            new: 0,
            in_production: 0,
            delivered: 0,
            paid: 0,
            cancelled: 0,
        };
        for (const o of orders) c[o.status]++;
        return c;
    }, [orders]);

    const filtered = useMemo(() => {
        let arr = orders;
        if (filter !== "all") arr = arr.filter((o) => o.status === filter);
        const q = search.trim().toLowerCase();
        if (!q) return arr;
        return arr.filter(
            (o) =>
                o.contact?.name?.toLowerCase().includes(q) ||
                o.contact?.phone?.includes(q) ||
                o.notes?.toLowerCase().includes(q) ||
                o.items?.some((it) => it.name?.toLowerCase().includes(q)),
        );
    }, [orders, filter, search]);

    const selected = useMemo(
        () => orders.find((o) => o.id === selectedId) ?? null,
        [orders, selectedId],
    );

    if (loading) return <AdminLoading />;

    async function handleChangeStatus(status: OrderStatus): Promise<ActionResult> {
        if (!selected) return { error: "Sin selección." };
        // El hook realtime aplica el cambio cuando llega el UPDATE de Supabase
        return await updateOrderStatus(selected.id, status);
    }

    async function handleSaveDetails(input: {
        total: number | null;
        notes: string;
    }): Promise<ActionResult> {
        if (!selected) return { error: "Sin selección." };
        return await updateOrderDetails(selected.id, input);
    }

    async function handleDelete(): Promise<ActionResult> {
        if (!selected) return { error: "Sin selección." };
        const res = await deleteOrder(selected.id);
        if ("success" in res) setSelectedId(null);
        return res;
    }

    return (
        <>
            <div className="min-h-full px-6 py-8 lg:px-12 lg:py-10">
                {/* Header */}
                <header className="mb-8 flex items-start justify-between gap-6">
                    <div>
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
                                <ShoppingBag className="h-5 w-5" style={{ color: "#22d3ee" }} />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-white font-[family-name:var(--font-jost)]">
                                Pedidos
                            </h1>
                        </div>
                        <p className="max-w-2xl text-sm leading-relaxed text-gray-400">
                            Trabajos del estudio. La IA los crea automáticamente al cerrar con un cliente por WhatsApp; también los puedes crear manualmente.
                        </p>
                    </div>
                    <button
                        onClick={() => setCreateOpen(true)}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest text-black transition active:scale-95"
                        style={{ background: "linear-gradient(135deg, #22d3ee, #ffffff, #22d3ee)" }}
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo pedido
                    </button>
                </header>

                {/* Filtros + búsqueda */}
                <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="flex flex-wrap items-center gap-2">
                        <FilterPill
                            active={filter === "all"}
                            onClick={() => setFilter("all")}
                            count={orders.length}
                        >
                            Todos
                        </FilterPill>
                        {STATUS_ORDER.map((s) => {
                            const meta = STATUS_META[s];
                            return (
                                <FilterPill
                                    key={s}
                                    active={filter === s}
                                    onClick={() => setFilter(s)}
                                    count={countsByStatus[s]}
                                    color={meta.color}
                                >
                                    <meta.Icon className="h-3 w-3" />
                                    {meta.label}
                                </FilterPill>
                            );
                        })}
                    </div>

                    <div className="flex-1 lg:ml-auto lg:max-w-md">
                        <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 focus-within:border-[#22d3ee]/40">
                            <Search className="h-4 w-4 text-gray-600" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar cliente, ítem, teléfono…"
                                className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {orders.length === 0 && <EmptyState />}

                {orders.length > 0 && filtered.length === 0 && (
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
                        <p className="text-sm text-gray-500">
                            No hay pedidos con este filtro.
                        </p>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((order) => (
                            <motion.div
                                key={order.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <PedidoCard
                                    order={order}
                                    onClick={() => setSelectedId(order.id)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <PedidoDetailModal
                open={selected !== null}
                order={selected}
                onClose={() => setSelectedId(null)}
                onChangeStatus={handleChangeStatus}
                onSaveDetails={handleSaveDetails}
                onDelete={handleDelete}
            />

            <CreateOrderModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={() => {
                    // Realtime trae el INSERT y refresca la lista; no necesitamos hacer nada acá
                }}
            />
        </>
    );
}

function FilterPill({
    active,
    onClick,
    count,
    color,
    children,
}: {
    active: boolean;
    onClick: () => void;
    count: number;
    color?: string;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition ${
                active
                    ? "border-[#22d3ee]/30 bg-[#22d3ee]/[0.08] text-[#22d3ee]"
                    : "border-white/[0.06] bg-white/[0.02] text-gray-500 hover:border-white/[0.12] hover:text-gray-300"
            }`}
            style={active && color ? { color, borderColor: `${color}4d`, backgroundColor: `${color}1a` } : undefined}
        >
            {children}
            {count > 0 && (
                <span className="rounded-full bg-black/30 px-1.5 py-0.5 text-[10px] font-black">
                    {count}
                </span>
            )}
        </button>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
                <ShoppingBag className="h-7 w-7 text-gray-500" />
            </div>
            <h2 className="mb-2 text-lg font-bold text-white">Sin pedidos todavía</h2>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-gray-500">
                Cuando la IA cierre un pedido por WhatsApp con la tool <span className="font-mono text-gray-400">create_order</span>, aparecerá aquí. También puedes crear manualmente desde la DB por ahora.
            </p>
        </div>
    );
}
