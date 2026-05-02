"use client";

import { Plus, Trash2 } from "lucide-react";
import type { OrderItem } from "@/lib/crm/types";

type Props = {
    items: OrderItem[];
    onChange: (items: OrderItem[]) => void;
};

export function ItemEditor({ items, onChange }: Props) {
    function update(idx: number, patch: Partial<OrderItem>) {
        onChange(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
    }
    function remove(idx: number) {
        onChange(items.filter((_, i) => i !== idx));
    }
    function add() {
        onChange([...items, { name: "", quantity: 1, price: 0 }]);
    }

    return (
        <div className="space-y-2">
            {items.map((it, idx) => (
                <div
                    key={idx}
                    className="grid grid-cols-[1fr_70px_100px_32px] gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2"
                >
                    <input
                        value={it.name ?? ""}
                        onChange={(e) => update(idx, { name: e.target.value })}
                        placeholder="Ítem (ej. Tarjetas Mate UV x100)"
                        className="rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-sm text-white placeholder:text-gray-600 focus:bg-white/[0.06] focus:outline-none"
                    />
                    <input
                        type="number"
                        min={1}
                        value={it.quantity ?? 1}
                        onChange={(e) => update(idx, { quantity: Math.max(1, Number(e.target.value)) })}
                        className="rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-center text-sm text-white focus:bg-white/[0.06] focus:outline-none"
                    />
                    <input
                        type="number"
                        min={0}
                        step={1000}
                        value={it.price ?? 0}
                        onChange={(e) => update(idx, { price: Math.max(0, Number(e.target.value)) })}
                        placeholder="Precio"
                        className="rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-right text-sm text-white focus:bg-white/[0.06] focus:outline-none"
                    />
                    <button
                        onClick={() => remove(idx)}
                        aria-label="Eliminar ítem"
                        className="flex items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-gray-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            ))}
            <button
                onClick={add}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.1] bg-white/[0.01] py-2 text-xs font-bold uppercase tracking-widest text-gray-500 transition hover:border-[#22d3ee]/40 hover:text-[#22d3ee]"
            >
                <Plus className="h-3.5 w-3.5" />
                Agregar ítem
            </button>
        </div>
    );
}
