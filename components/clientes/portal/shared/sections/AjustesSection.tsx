"use client";

import { Lock, SlidersHorizontal } from "lucide-react";
import { getSectionCompletion } from "../../types";
import { SectionCard } from "../primitives/SectionCard";
import { FieldItem } from "../primitives/FieldItem";

export function AjustesSection({
  d,
  onSelect,
}: {
  d: any;
  onSelect: (key: "legal" | "avanzado") => void;
}) {
  const legalCompletion = getSectionCompletion("legal", d);
  const legalSub =
    legalCompletion === "complete"
      ? "Completa"
      : legalCompletion === "partial"
      ? "En progreso"
      : "Por iniciar";

  return (
    <FieldItem>
      <p className="mb-3 text-[11px] text-white/35">
        Configuraciones secundarias que no necesitas tocar a diario.
      </p>
      <div className="space-y-2.5">
        <SectionCard
          icon={Lock}
          title="Legal"
          description="Términos, privacidad y rubro del negocio"
          status={{ kind: "progress", completion: legalCompletion, subtitle: legalSub }}
          onPress={() => onSelect("legal")}
        />
        <SectionCard
          icon={SlidersHorizontal}
          title="Fuente y analíticas"
          description="Tipografía, Google Analytics y más"
          status={{ kind: "progress", completion: "empty", subtitle: "Opcional" }}
          onPress={() => onSelect("avanzado")}
        />
      </div>
    </FieldItem>
  );
}
