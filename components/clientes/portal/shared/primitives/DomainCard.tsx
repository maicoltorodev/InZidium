"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, Lock, ExternalLink, AlertTriangle, Info, X } from "lucide-react";
import { DomainField } from "../../fields";
import { MOTION } from "./motion";
import { BRAND_ICON_STYLE } from "./BrandDefs";

type Mode = "edit" | "locked" | "live";

/** Quita `http://` / `https://` del display y trimea. Devuelve null si vacío. */
function stripProtocol(raw?: string | null): string | null {
  const v = raw?.trim();
  if (!v) return null;
  return v.replace(/^https?:\/\//i, "");
}

/**
 * Card de dominio en el hub. Tres variantes:
 *  - edit: onboarding, DomainField inline
 *  - locked: fase construccion, tap abre modal "estamos trabajando"
 *  - live: fase publicado, link funcional al sitio
 *
 * El layout en mobile separa el dominio a su propia fila con `break-all`
 * para que `www.lo-que-sea.com` nunca se corte; en sm+ vuelve inline.
 *
 * `displayUrl` (override admin): si el admin seteó `proyectos.link`, ese valor
 * se usa tal cual en locked/live sin envolver en `www.X.com`. Permite que el
 * admin mantenga control sobre el dominio publicado aunque el cliente haya
 * tipeado otra cosa en el onboarding.
 */
export function DomainCard({
  value,
  onSave,
  mode = "edit",
  onLockedTap,
  displayUrl,
  linkLocked,
}: {
  value: string;
  onSave?: (v: string) => void;
  mode?: Mode;
  onLockedTap?: () => void;
  displayUrl?: string | null;
  /** Si true, el modo `edit` se renderiza sin input (solo display). Decisión
   *  del admin via TabSettings.toggleProyectoLinkLock. No se le dice al cliente
   *  que está bloqueado — solo cambia el diseño a read-only. */
  linkLocked?: boolean;
}) {
  if (mode === "live") return <LiveCard domain={value} displayUrl={displayUrl} />;
  if (mode === "locked") return <LockedCard domain={value} onTap={onLockedTap} displayUrl={displayUrl} />;
  if (linkLocked) return <EditCardReadOnly value={value} displayUrl={displayUrl} />;
  return <EditCard value={value} onSave={onSave ?? (() => {})} />;
}

// ─── Edit (onboarding) ───────────────────────────────────────────────────────

function EditCard({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const hasValue = !!value;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...MOTION.reveal, delay: 0.04 }}
      className="relative mb-5 overflow-hidden rounded-[2rem] border border-[#a855f7]/25 bg-[linear-gradient(135deg,rgba(232,121,249,0.06)_0%,rgba(168,85,247,0.05)_50%,rgba(34,211,238,0.06)_100%)] p-5 shadow-[0_0_32px_-12px_rgba(168,85,247,0.4)]"
    >
      {/* Header centrado: ícono → eyebrow → heading → descripción */}
      <div className="flex flex-col items-center text-center">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${
            hasValue
              ? "bg-emerald-500/10 ring-1 ring-emerald-500/20"
              : "bg-[linear-gradient(135deg,rgba(232,121,249,0.15)_0%,rgba(168,85,247,0.15)_50%,rgba(34,211,238,0.15)_100%)] ring-1 ring-[#a855f7]/30"
          }`}
        >
          {hasValue ? (
            <Check className="h-5 w-5 text-emerald-400" strokeWidth={3} />
          ) : (
            <Globe className="h-5 w-5" style={BRAND_ICON_STYLE} />
          )}
        </div>
        <p className="mt-3 inline-block bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] bg-clip-text text-[9px] font-black uppercase tracking-[0.28em] text-transparent">
          Paso 1
        </p>
        <h3 className="mt-1 text-[16px] font-black leading-tight text-white">
          Elige tu dominio
        </h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">
          Es la dirección de tu sitio web.
        </p>
      </div>

      <div className="mt-4">
        <DomainField value={value} onSave={onSave} />
      </div>

      <DomainWarning />
    </motion.div>
  );
}

// Variante read-only del EditCard: mismo frame y eyebrow pero sin DomainField
// (no permite tipear) y sin warning. Se usa cuando el admin activó lock del
// dominio. Visualmente sutil — no decimos al cliente que está bloqueado.
function EditCardReadOnly({ value, displayUrl }: { value: string; displayUrl?: string | null }) {
  const url = stripProtocol(displayUrl) || (value ? `www.${value}.com` : "");
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...MOTION.reveal, delay: 0.04 }}
      className="relative mb-5 overflow-hidden rounded-[2rem] border border-[#a855f7]/25 bg-[linear-gradient(135deg,rgba(232,121,249,0.06)_0%,rgba(168,85,247,0.05)_50%,rgba(34,211,238,0.06)_100%)] p-5 shadow-[0_0_32px_-12px_rgba(168,85,247,0.4)]"
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
          <Check className="h-5 w-5 text-emerald-400" strokeWidth={3} />
        </div>
        <p className="mt-3 inline-block bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] bg-clip-text text-[9px] font-black uppercase tracking-[0.28em] text-transparent">
          Tu dominio
        </p>
        <p className="mt-2 break-all text-[16px] font-black leading-tight text-white">
          {url || "Sin definir"}
        </p>
      </div>
    </motion.div>
  );
}

// Warning box — en sm+ se muestra el mensaje completo centrado; en mobile
// solo el highlight "Elígelo con calma" con un botón ℹ︎ que al tocar expande
// el texto completo debajo.
function DomainWarning() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-amber-500/20 bg-amber-500/[0.04]">
      {/* Mobile: highlight + botón info */}
      <div className="flex items-center justify-center gap-2 px-3 py-2.5 sm:hidden">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
        <p className="text-[11px] font-bold text-amber-300">
          Elígelo con calma.
        </p>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Ocultar detalle" : "Ver más información"}
          className="flex h-5 w-5 items-center justify-center rounded-full text-amber-300/60 transition-colors hover:bg-amber-500/10 hover:text-amber-300"
        >
          {open ? <X className="h-3 w-3" /> : <Info className="h-3 w-3" />}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="warning-expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={MOTION.reveal}
            className="overflow-hidden sm:hidden"
          >
            <p className="px-4 pb-3 pt-1 text-center text-[11px] leading-relaxed text-white/65">
              Cuando empiece la construcción compramos este dominio y queda
              ligado a tu sitio. Si más adelante quieres cambiarlo, el nuevo
              dominio corre por tu cuenta.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop / tablet: mensaje completo siempre visible, centrado. */}
      <div className="hidden flex-col items-center gap-2 px-4 py-3 text-center sm:flex">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          <p className="text-[11px] font-bold text-amber-300">
            Elígelo con calma.
          </p>
        </div>
        <p className="text-[11px] leading-relaxed text-white/65">
          Cuando empiece la construcción compramos este dominio y queda ligado
          a tu sitio. Si más adelante quieres cambiarlo, el nuevo dominio
          corre por tu cuenta.
        </p>
      </div>
    </div>
  );
}

// ─── Locked (construccion) ───────────────────────────────────────────────────

function LockedCard({
  domain,
  onTap,
  displayUrl,
}: {
  domain: string;
  onTap?: () => void;
  displayUrl?: string | null;
}) {
  const fullDomain = stripProtocol(displayUrl) || `www.${domain || "tudominio"}.com`;
  const [showInfo, setShowInfo] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-5 overflow-hidden rounded-[1.75rem] border border-[#a855f7]/25 bg-[linear-gradient(135deg,rgba(232,121,249,0.05)_0%,rgba(168,85,247,0.04)_50%,rgba(34,211,238,0.05)_100%)] p-5"
    >
      <motion.button
        type="button"
        onClick={onTap}
        whileTap={{ scale: 0.985 }}
        transition={MOTION.tap}
        className="group block w-full text-center"
      >
        {/* Ícono centrado arriba + eyebrow + dominio */}
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(232,121,249,0.12)_0%,rgba(168,85,247,0.12)_50%,rgba(34,211,238,0.12)_100%)] ring-1 ring-[#a855f7]/25">
            <Lock className="h-5 w-5" style={BRAND_ICON_STYLE} />
          </div>
          <p className="mt-3 text-[9px] font-black uppercase tracking-[0.28em] text-white/35">
            Dominio
          </p>
          <p className="mt-1 break-all text-[16px] font-black leading-tight">
            <span className="bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] bg-clip-text text-transparent underline decoration-[#a855f7]/40 decoration-1 underline-offset-2 group-active:decoration-[#a855f7]">
              {fullDomain}
            </span>
          </p>
        </div>
      </motion.button>

      {/* Botón info — abre/cierra el mensaje explicativo */}
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={() => setShowInfo((v) => !v)}
          aria-label={showInfo ? "Ocultar información" : "Ver información"}
          className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white/80"
        >
          <Info className="h-3 w-3" />
          {showInfo ? "Ocultar" : "Info"}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {showInfo && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={MOTION.reveal}
            className="overflow-hidden text-center text-[11px] leading-relaxed text-white/55"
          >
            <span className="mt-3 block px-2">
              Compraremos este dominio para ti. Si lo quieres cambiar, tendrás
              que pagar otro.
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Live (publicado) ────────────────────────────────────────────────────────

function LiveCard({
  domain,
  displayUrl,
}: {
  domain: string;
  displayUrl?: string | null;
}) {
  const adminUrl = displayUrl?.trim();
  const fullDomain = stripProtocol(adminUrl) || `www.${domain || "tudominio"}.com`;
  const href = adminUrl
    ? (/^https?:\/\//i.test(adminUrl) ? adminUrl : `https://${adminUrl}`)
    : domain
      ? `https://www.${domain}.com`
      : "#";
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...MOTION.reveal, delay: 0.04 }}
      whileTap={{ scale: 0.985 }}
      className="group relative mb-5 block overflow-hidden rounded-[2rem] border border-emerald-500/25 bg-[linear-gradient(135deg,rgba(16,185,129,0.08)_0%,rgba(168,85,247,0.04)_50%,rgba(34,211,238,0.06)_100%)] p-6 shadow-[0_0_32px_-12px_rgba(16,185,129,0.4)]"
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/25">
          <Check className="h-5 w-5 text-emerald-400" strokeWidth={3} />
        </div>
        <p className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-emerald-400/80">
          En vivo
          <ExternalLink className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100" />
        </p>
        <p className="mt-2 break-all text-[17px] font-black leading-tight text-white">
          {fullDomain}
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-white/45">
          Toca para visitar tu sitio.
        </p>
      </div>
    </motion.a>
  );
}
