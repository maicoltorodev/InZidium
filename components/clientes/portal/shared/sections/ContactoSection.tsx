"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { AutoField, AutoTextarea } from "../../fields";
import { labelCls } from "../../styles";
import { FieldItem } from "../primitives/FieldItem";
import { ToggleRow } from "../primitives/ToggleRow";
import { MOTION } from "../primitives/motion";
import { WhatsAppIcon } from "../primitives/BrandIcons";
import {
  formatEmail,
  formatPhoneDigitsCO,
  fullPhoneCO,
} from "@/lib/input-formatters";

// Formatter para mostrar teléfonos en formato CO completo mientras el user
// escribe: "+57 300 123 45 67". Guarda el string formateado — es lo que se
// publica en el sitio del cliente.
const formatPhoneDisplayCO = (raw: string) =>
  fullPhoneCO(formatPhoneDigitsCO(raw));

// Formatter para fabPhone (número para wa.me URLs): solo dígitos con código
// de país, ej: "573001234567". Sin espacios ni `+`.
const formatWaPhone = (raw: string) => raw.replace(/\D/g, "").slice(0, 15);

export function ContactoSection({
  d,
  savePatch,
}: {
  d: any;
  savePatch: (patch: any) => void;
}) {
  // `fabEnabled` es un flag explícito — se puede apagar sin perder los datos
  // del número y el mensaje, así el cliente puede deshabilitarlo temporal
  // sin tener que volver a escribir todo al prenderlo.
  // Backfill: proyectos viejos sin el flag se consideran activos si tienen
  // número guardado.
  //
  // Derivamos el estado de `d` directamente (sin useState local) para que el
  // realtime del admin lo refleje en vivo. Antes teníamos un state local que
  // se inicializaba una sola vez y quedaba desincronizado si el admin tocaba
  // el flag desde otro lado.
  const hasFabData = !!(d.fabPhone || d.fabMessage);
  const fabOpen = d.fabEnabled ?? hasFabData;

  const toggleFab = (next: boolean) => {
    savePatch({ fabEnabled: next });
  };

  const iconFieldCls =
    "w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] pl-11 pr-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#a855f7]/50 transition-colors";

  return (
    <>
      <FieldItem id="contacto-whatsapp">
        <label className={labelCls}>WhatsApp</label>
        <div className="relative">
          <MessageCircle className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <AutoField
            value={d.whatsapp}
            onSave={(v) => savePatch({ whatsapp: v })}
            format={formatPhoneDisplayCO}
            placeholder="+57 300 000 0000"
            type="tel"
            inputMode="tel"
            className={iconFieldCls}
          />
        </div>
      </FieldItem>

      <FieldItem id="contacto-telefono">
        <label className={labelCls}>Teléfono</label>
        <div className="relative">
          <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <AutoField
            value={d.telefono}
            onSave={(v) => savePatch({ telefono: v })}
            format={formatPhoneDisplayCO}
            placeholder="+57 300 000 0000"
            type="tel"
            inputMode="tel"
            className={iconFieldCls}
          />
        </div>
      </FieldItem>

      <FieldItem id="contacto-email">
        <label className={labelCls}>Correo electrónico</label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <AutoField
            value={d.email}
            onSave={(v) => savePatch({ email: v })}
            format={formatEmail}
            placeholder="hola@tuempresa.com"
            type="email"
            inputMode="email"
            className={iconFieldCls}
          />
        </div>
      </FieldItem>

      <FieldItem id="contacto-footer">
        <label className={labelCls}>Texto de cierre</label>
        <AutoTextarea
          value={d.textoFooter}
          onSave={(v) => savePatch({ textoFooter: v })}
          placeholder="Un texto corto sobre el negocio para el pie de página."
          rows={3}
        />
      </FieldItem>

      {/* FAB WhatsApp */}
      <FieldItem id="contacto-fab">
        <ToggleRow
          icon={MessageCircle}
          title="Botón flotante de WhatsApp"
          description="Fijo en la esquina inferior derecha de tu sitio."
          checked={fabOpen}
          onChange={toggleFab}
        />
        <AnimatePresence initial={false}>
          {fabOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={MOTION.reveal}
              className="overflow-hidden"
            >
              <div className="relative mt-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4 space-y-3">
                <div>
                  <label className="mb-1 block text-[9px] font-black uppercase tracking-[0.22em] text-white/30">
                    Número (sin +)
                  </label>
                  <AutoField
                    value={d.fabPhone}
                    onSave={(v) => savePatch({ fabPhone: v })}
                    format={formatWaPhone}
                    placeholder="573001234567"
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[9px] font-black uppercase tracking-[0.22em] text-white/30">
                    Mensaje precargado
                  </label>
                  <AutoField
                    value={d.fabMessage}
                    onSave={(v) => savePatch({ fabMessage: v })}
                    placeholder="Hola, me interesa conocer más sobre tus servicios."
                  />
                </div>

                {/* Live preview */}
                <div className="relative mt-4 h-24 overflow-hidden rounded-xl border border-white/[0.05] bg-[#020608]">
                  <p className="absolute left-3 top-3 text-[9px] font-bold uppercase tracking-[0.22em] text-white/20">
                    Vista previa
                  </p>
                  <motion.span
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={MOTION.reveal}
                    className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] shadow-[0_4px_14px_-2px_rgba(37,211,102,0.6)]"
                  >
                    <WhatsAppIcon size={22} className="text-white" />
                  </motion.span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </FieldItem>
    </>
  );
}
