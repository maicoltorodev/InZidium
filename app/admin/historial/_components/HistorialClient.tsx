"use client";

import { useMemo, useState } from "react";
import { History, Loader2 } from "lucide-react";
import type { EventType } from "@/lib/crm/types";
import { EventRow } from "./EventRow";
import { HistorialFilters } from "./HistorialFilters";
import { useEventsRealtime } from "@/app/admin/_components/realtime/useEventsRealtime";
import { useEventActors } from "@/app/admin/_components/realtime/useEventActors";

export function HistorialClient() {
    const actors = useEventActors();
    const [actor, setActor] = useState<string>("");
    const [type, setType] = useState<EventType | "">("");

    const filter = useMemo(
        () => ({
            actor: actor || undefined,
            type: type || undefined,
            limit: 200,
        }),
        [actor, type],
    );

    const { events } = useEventsRealtime(filter);

    return (
        <div className="min-h-full px-6 py-8 lg:px-12 lg:py-10">
            <Header />

            <div className="mb-6">
                <HistorialFilters
                    actor={actor}
                    type={type}
                    actors={actors}
                    onActorChange={setActor}
                    onTypeChange={setType}
                />
            </div>

            {events === null ? (
                <div className="flex h-32 items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
                </div>
            ) : events.length === 0 ? (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
                    <p className="text-sm text-gray-500">Sin eventos para el filtro actual.</p>
                </div>
            ) : (
                <div className="space-y-1.5 max-w-3xl">
                    {events.map((e) => (
                        <EventRow key={e.id} event={e} showContact />
                    ))}
                </div>
            )}
        </div>
    );
}

function Header() {
    return (
        <header className="mb-8">
            <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
                    <History className="h-5 w-5" style={{ color: "#a78bfa" }} />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white font-[family-name:var(--font-jost)]">
                    Historial
                </h1>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-400">
                Registro de quién hizo qué en el CRM. Mensajes humanos, toggles de IA, asignaciones, pedidos. Filtrable por admin y tipo.
            </p>
        </header>
    );
}
