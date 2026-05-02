"use client";

import { useEffect, useState } from "react";
import { Search, User, Loader2, Check } from "lucide-react";
import type { Contact } from "@/lib/crm/types";
import { searchContacts } from "@/lib/crm/actions/contacts";

type Props = {
    selected: Contact | null;
    onSelect: (c: Contact | null) => void;
};

export function ContactPicker({ selected, onSelect }: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const t = setTimeout(() => {
            setLoading(true);
            searchContacts(query).then((res) => {
                if (!cancelled) {
                    setResults(res);
                    setLoading(false);
                }
            });
        }, 250);
        return () => {
            cancelled = true;
            clearTimeout(t);
        };
    }, [query]);

    if (selected) {
        return (
            <div className="flex items-center gap-3 rounded-xl border border-[#22d3ee]/30 bg-[#22d3ee]/[0.06] px-3 py-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#22d3ee]/10">
                    <User className="h-4 w-4 text-[#22d3ee]" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">
                        {selected.name?.trim() || selected.phone}
                    </p>
                    <p className="font-mono text-[10px] text-gray-500">{selected.phone}</p>
                </div>
                <button
                    onClick={() => onSelect(null)}
                    className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white"
                >
                    Cambiar
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 focus-within:border-[#22d3ee]/40">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    placeholder="Buscar contacto por nombre o teléfono…"
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none"
                />
                {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
            </div>

            {open && (
                <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border border-white/[0.08] bg-[#0a0a0a]/95 shadow-2xl backdrop-blur-md">
                    {results.length === 0 && !loading && (
                        <p className="p-4 text-center text-xs text-gray-600">Sin resultados</p>
                    )}
                    {results.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => {
                                onSelect(c);
                                setOpen(false);
                                setQuery("");
                            }}
                            className="flex w-full items-center gap-3 border-b border-white/[0.04] px-3 py-2 text-left transition hover:bg-white/[0.04] last:border-b-0"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
                                <User className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm text-white">
                                    {c.name?.trim() || c.phone}
                                </p>
                                <p className="font-mono text-[10px] text-gray-500">{c.phone}</p>
                            </div>
                            <Check className="h-4 w-4 opacity-0" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
