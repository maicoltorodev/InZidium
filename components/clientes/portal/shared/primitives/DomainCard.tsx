"use client";

import { motion } from "framer-motion";
import { Globe, Check, Lock, ExternalLink } from "lucide-react";
import { DomainField } from "../../fields";
import { MOTION } from "./motion";
import { BRAND_ICON_STYLE } from "./BrandDefs";

type Mode = "edit" | "locked" | "live";

/**
 * Card de dominio en el hub. Tres variantes:
 *  - edit: onboarding, DomainField inline
 *  - locked: fase construccion, tap abre modal "estamos trabajando"
 *  - live: fase publicado, link funcional al sitio
 */
export function DomainCard({
  value,
  onSave,
  mode = "edit",
  onLockedTap,
}: {
  value: string;
  onSave?: (v: string) => void;
  mode?: Mode;
  onLockedTap?: () => void;
}) {
  if (mode === "live") return <LiveCard domain={value} />;
  if (mode === "locked") return <LockedCard domain={value} onTap={onLockedTap} />;
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
      className="relative mb-5 overflow-hidden rounded-[2rem] border border-[#a855f7]/25 bg-[linear-gradient(135deg,rgba(232,121,249,0.06)_0%,rgba(168,85,247,0.05)_50%,rgba(96,165,250,0.06)_100%)] p-5 shadow-[0_0_32px_-12px_rgba(168,85,247,0.4)]"
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-colors ${
            hasValue
              ? "bg-emerald-500/10 ring-1 ring-emerald-500/20"
              : "bg-[linear-gradient(135deg,rgba(232,121,249,0.15)_0%,rgba(168,85,247,0.15)_50%,rgba(96,165,250,0.15)_100%)] ring-1 ring-[#a855f7]/30"
          }`}
        >
          {hasValue ? (
            <Check className="h-4 w-4 text-emerald-400" strokeWidth={3} />
          ) : (
            <Globe className="h-4 w-4" style={BRAND_ICON_STYLE} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.28em]">
            <span className="bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] bg-clip-text text-transparent">
              Paso 1
            </span>
          </p>
          <h3 className="mt-0.5 text-[15px] font-black leading-tight text-white">
            Elige tu dominio
          </h3>
        </div>
      </div>
      <p className="mb-3 text-[11px] leading-relaxed text-white/45">
        Es la dirección de tu sitio web. Verificamos disponibilidad en tiempo real.
      </p>
      <DomainField value={value} onSave={onSave} />
    </motion.div>
  );
}

// ─── Locked (construccion) ───────────────────────────────────────────────────

function LockedCard({ domain, onTap }: { domain: string; onTap?: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onTap}
      whileTap={{ scale: 0.985 }}
      transition={MOTION.tap}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative mb-5 block w-full overflow-hidden rounded-[1.75rem] border border-[#a855f7]/25 bg-[linear-gradient(135deg,rgba(232,121,249,0.05)_0%,rgba(168,85,247,0.04)_50%,rgba(96,165,250,0.05)_100%)] p-4 text-left"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(232,121,249,0.12)_0%,rgba(168,85,247,0.12)_50%,rgba(96,165,250,0.12)_100%)] ring-1 ring-[#a855f7]/25">
          <Lock className="h-4 w-4" style={BRAND_ICON_STYLE} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.28em] text-white/35">
            Dominio
          </p>
          <p className="mt-0.5 truncate text-[14px] font-bold">
            <span className="bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] bg-clip-text text-transparent underline decoration-[#a855f7]/40 decoration-1 underline-offset-2 group-active:decoration-[#a855f7]">
              www.{domain || "tudominio"}.com
            </span>
          </p>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Live (publicado) ────────────────────────────────────────────────────────

function LiveCard({ domain }: { domain: string }) {
  const href = domain ? `https://www.${domain}.com` : "#";
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...MOTION.reveal, delay: 0.04 }}
      whileTap={{ scale: 0.985 }}
      className="relative mb-5 block overflow-hidden rounded-[2rem] border border-emerald-500/25 bg-[linear-gradient(135deg,rgba(16,185,129,0.08)_0%,rgba(168,85,247,0.04)_50%,rgba(96,165,250,0.06)_100%)] p-5 shadow-[0_0_32px_-12px_rgba(16,185,129,0.4)]"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/25">
          <Check className="h-4 w-4 text-emerald-400" strokeWidth={3} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.28em] text-emerald-400/80">
            Tu sitio está en vivo
          </p>
          <h3 className="mt-0.5 text-[15px] font-black leading-tight text-white truncate">
            www.{domain || "tudominio"}.com
          </h3>
        </div>
        <ExternalLink className="h-4 w-4 shrink-0 text-white/40" />
      </div>
      <p className="text-[11px] leading-relaxed text-white/45">
        Toca la tarjeta para visitar tu sitio en una pestaña nueva.
      </p>
    </motion.a>
  );
}
