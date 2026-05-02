"use client";

import { Check } from "lucide-react";
import type { WhatsAppTemplate } from "@/lib/crm/actions/templates";
import { renderTemplateBody } from "./renderTemplate";

type Props = {
    templates: WhatsAppTemplate[];
    selected: WhatsAppTemplate | null;
    onSelect: (t: WhatsAppTemplate) => void;
};

export function TemplatePicker({ templates, selected, onSelect }: Props) {
    if (templates.length === 0) {
        return (
            <p className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center text-xs text-gray-500">
                No hay plantillas aprobadas en la WABA. Crealas desde Meta Business Manager.
            </p>
        );
    }
    return (
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {templates.map((t) => {
                const isSelected =
                    selected?.name === t.name && selected?.language === t.language;
                return (
                    <button
                        key={`${t.name}-${t.language}`}
                        onClick={() => onSelect(t)}
                        className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2 text-left transition ${
                            isSelected
                                ? "border-[#22d3ee]/40 bg-[#22d3ee]/[0.06]"
                                : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                        }`}
                    >
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-white">
                                    {t.name}
                                </span>
                                <span className="text-[9px] uppercase tracking-widest text-gray-500">
                                    {t.language}
                                </span>
                                <span className="text-[9px] uppercase tracking-widest text-emerald-400/70">
                                    {t.category}
                                </span>
                            </div>
                            <p className="mt-1 line-clamp-2 text-[11px] text-gray-400">
                                {renderTemplateBody(t, [])}
                            </p>
                        </div>
                        {isSelected && (
                            <Check className="h-4 w-4 shrink-0 text-[#22d3ee]" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
