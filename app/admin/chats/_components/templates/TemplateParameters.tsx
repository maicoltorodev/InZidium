"use client";

import type { WhatsAppTemplate } from "@/lib/crm/actions/templates";
import { countTemplateParams } from "./renderTemplate";

type Props = {
    template: WhatsAppTemplate;
    params: string[];
    onChange: (params: string[]) => void;
};

export function TemplateParameters({ template, params, onChange }: Props) {
    const total = countTemplateParams(template);
    if (total === 0) {
        return (
            <p className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs text-gray-500">
                Esta plantilla no requiere parámetros.
            </p>
        );
    }

    function update(idx: number, val: string) {
        const next = [...params];
        next[idx] = val;
        onChange(next);
    }

    return (
        <div className="space-y-2">
            {Array.from({ length: total }, (_, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 w-12">
                        {`{{${i + 1}}}`}
                    </span>
                    <input
                        value={params[i] ?? ""}
                        onChange={(e) => update(i, e.target.value)}
                        placeholder={`Parámetro ${i + 1}`}
                        className="flex-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-sm text-white placeholder:text-gray-600 focus:border-[#22d3ee]/40 focus:outline-none"
                    />
                </div>
            ))}
        </div>
    );
}
