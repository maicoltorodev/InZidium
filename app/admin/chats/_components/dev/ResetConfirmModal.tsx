"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Bomb, Loader2, X } from "lucide-react";
import { resetAllCrmData } from "@/lib/crm/actions/reset";
import { useRealtime } from "@/app/admin/_components/realtime/RealtimeProvider";

const CONFIRM_TOKEN = "RESET";

type Props = {
    onClose: () => void;
};

export function ResetConfirmModal({ onClose }: Props) {
    const { emitReset } = useRealtime();
    const [confirm, setConfirm] = useState("");
    const [running, setRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<Array<[string, number]> | null>(null);

    async function handleRun() {
        if (running) return;

        setError(null);
        setResult(null);
        setRunning(true);

        const res = await resetAllCrmData(confirm);
        setRunning(false);

        if ("error" in res) {
            setError(res.error);
            return;
        }

        setResult(Object.entries(res.data ?? {}) as Array<[string, number]>);
        await emitReset();
        window.setTimeout(onClose, 1500);
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={running ? undefined : onClose}
                    className="absolute inset-0 bg-black/85 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-red-500/30 bg-[#0a0a0a]/95 shadow-2xl"
                    style={{ boxShadow: "0 0 60px rgba(239,68,68,0.25)" }}
                >
                    <Header onClose={onClose} disabled={running} />

                    <div className="space-y-4 px-6 py-5">
                        {!result && (
                            <>
                                <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/[0.06] px-3 py-3">
                                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                                    <div>
                                        <p className="text-sm font-bold text-red-300">
                                            Esto borra TODO el CRM
                                        </p>
                                        <p className="mt-1 text-xs leading-relaxed text-red-200/70">
                                            Mensajes, conversaciones, contactos, solicitudes y archivos del bucket. No hay vuelta atras. Solo para testing.
                                        </p>
                                    </div>
                                </div>

                                <label className="block">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        Escribe <span className="font-mono text-red-400">{CONFIRM_TOKEN}</span> para confirmar
                                    </span>
                                    <input
                                        autoFocus
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        placeholder={CONFIRM_TOKEN}
                                        disabled={running}
                                        className="mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 font-mono text-sm uppercase tracking-widest text-white placeholder:text-gray-700 focus:border-red-500/40 focus:outline-none disabled:opacity-40"
                                    />
                                </label>

                                {error && (
                                    <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                                        {error}
                                    </p>
                                )}
                            </>
                        )}

                        {result && (
                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] px-3 py-3">
                                <p className="text-sm font-bold text-emerald-300">
                                    CRM reseteado
                                </p>
                                <ul className="mt-2 space-y-1 font-mono text-[11px] text-emerald-200/70">
                                    {result.map(([key, value]) => (
                                        <li key={key}>
                                            <span className="text-emerald-400">{value}</span> {key}
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-2 text-[10px] uppercase tracking-widest text-emerald-200/50">
                                    Sincronizando...
                                </p>
                            </div>
                        )}
                    </div>

                    {!result && (
                        <Footer
                            running={running}
                            canRun={confirm === CONFIRM_TOKEN}
                            onRun={handleRun}
                            onCancel={onClose}
                        />
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Header({
    onClose,
    disabled,
}: {
    onClose: () => void;
    disabled: boolean;
}) {
    return (
        <div className="flex items-center justify-between border-b border-red-500/20 px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20">
                    <Bomb className="h-4 w-4 text-red-400" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">
                    Resetear CRM
                </h2>
            </div>
            <button
                onClick={onClose}
                disabled={disabled}
                aria-label="Cerrar"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition hover:text-gray-300 disabled:opacity-40"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

function Footer({
    running,
    canRun,
    onRun,
    onCancel,
}: {
    running: boolean;
    canRun: boolean;
    onRun: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="flex gap-2 border-t border-red-500/20 px-6 py-4">
            <button
                onClick={onCancel}
                disabled={running}
                className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-300 transition hover:border-white/[0.12] hover:bg-white/[0.05] disabled:opacity-40"
            >
                Cancelar
            </button>
            <button
                onClick={onRun}
                disabled={running || !canRun}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-red-500/50 bg-red-500/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-300 transition hover:border-red-500/80 hover:bg-red-500/30 disabled:opacity-40"
            >
                {running && <Loader2 className="h-3 w-3 animate-spin" />}
                {running ? "Borrando..." : "Resetear"}
            </button>
        </div>
    );
}
