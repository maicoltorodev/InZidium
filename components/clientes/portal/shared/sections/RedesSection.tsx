"use client";

import { motion } from "framer-motion";
import {
  Instagram, Facebook, Youtube, Music, MessageCircle,
  AtSign, Send, X,
} from "lucide-react";
import { AutoField } from "../../fields";
import { FieldItem } from "../primitives/FieldItem";
import { MOTION } from "../primitives/motion";
import { XIcon, WazeIcon } from "../primitives/BrandIcons";

type Network = {
  key: string;
  label: string;
  icon: React.ElementType;
  prefix: string;
  placeholder: string;
};

const NETWORKS: Network[] = [
  { key: "instagram",   label: "Instagram",   icon: Instagram,     prefix: "https://instagram.com/",  placeholder: "tunegocio" },
  { key: "facebook",    label: "Facebook",    icon: Facebook,      prefix: "https://facebook.com/",   placeholder: "tunegocio" },
  { key: "tiktok",      label: "TikTok",      icon: Music,         prefix: "https://tiktok.com/@",    placeholder: "tunegocio" },
  { key: "twitter",     label: "X",           icon: XIcon,         prefix: "https://x.com/",          placeholder: "tunegocio" },
  { key: "youtube",     label: "YouTube",     icon: Youtube,       prefix: "https://youtube.com/@",   placeholder: "tunegocio" },
  { key: "whatsappUrl", label: "WhatsApp",    icon: MessageCircle, prefix: "https://wa.me/",          placeholder: "573001234567" },
  { key: "threads",     label: "Threads",     icon: AtSign,        prefix: "https://threads.net/@",   placeholder: "tunegocio" },
  { key: "telegram",    label: "Telegram",    icon: Send,          prefix: "https://t.me/",           placeholder: "tunegocio" },
  { key: "waze",        label: "Waze",        icon: WazeIcon,      prefix: "https://waze.com/",       placeholder: "ul?ll=4.63,-74.09" },
];

function stripPrefix(url: string | undefined, prefix: string): string {
  if (!url) return "";
  const lower = url.toLowerCase();
  const prefixLower = prefix.toLowerCase();
  if (lower.startsWith(prefixLower)) return url.slice(prefix.length);
  // Accept bare handle "@tunegocio" o "tunegocio" stored directly
  return url.replace(/^@/, "");
}

/**
 * Normaliza lo que el cliente tipea/pega para que no se duplique el prefix.
 * Casos que maneja:
 *   - Pega URL completa matcheando el prefix: "https://waze.com/ul?..."
 *       → strippea prefix → guarda como relativo.
 *   - Pega URL completa con scheme pero diferente host/subdominio:
 *       "https://ul.waze.com/ul/abc" → respeta como absoluto, guarda tal cual.
 *   - Pega handle con el dominio sin scheme: "waze.com/ul?..."
 *       → detecta el host del prefix, lo strippea.
 *   - Tipea solo el handle relativo: "ul?ll=..." → concatena con prefix.
 *   - Tipea con @: "@mangiare" → quita el @ antes de concatenar.
 *
 * Sin esto el cliente que copia la URL completa de la app de Waze (o de la
 * barra de direcciones del browser para Instagram, Facebook, etc.) pegaba
 * y el resultado guardado era "https://waze.com/https://waze.com/ul?...".
 */
function normalizeHandleForSave(handle: string, prefix: string): string {
  const trimmed = handle.trim();
  if (!trimmed) return "";

  // 1) Input absoluto matcheando el prefix completo → strippea prefix.
  const prefixLower = prefix.toLowerCase();
  if (trimmed.toLowerCase().startsWith(prefixLower)) {
    const rest = trimmed.slice(prefix.length).replace(/^@/, "");
    return `${prefix}${rest}`;
  }

  // 2) Input absoluto con scheme pero NO matchea prefix
  //    (ej: subdominio distinto de Waze). Lo guardamos tal cual sin prepend.
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // 3) Input sin scheme pero empieza con el host del prefix
  //    ("waze.com/ul?..." con prefix "https://waze.com/") → strippea host.
  try {
    const host = new URL(prefix.endsWith("/") ? prefix : `${prefix}/`).hostname;
    const hostPatterns = [`${host}/`, `www.${host}/`];
    const lower = trimmed.toLowerCase();
    for (const pat of hostPatterns) {
      if (lower.startsWith(pat.toLowerCase())) {
        const rest = trimmed.slice(pat.length).replace(/^@/, "");
        return `${prefix}${rest}`;
      }
    }
  } catch {
    // Prefix no parseable como URL (raro) → fallthrough al caso simple.
  }

  // 4) Input es handle relativo normal → prepend prefix.
  return `${prefix}${trimmed.replace(/^@/, "")}`;
}

export function RedesSection({
  d,
  savePatch,
}: {
  d: any;
  savePatch: (patch: any) => void;
}) {
  const activeNetworks = NETWORKS.filter((n) => !!d[n.key]);
  const inactiveNetworks = NETWORKS.filter((n) => !d[n.key]);

  const addNetwork = (n: Network) => {
    // Save with prefix so Plantilla Web recibe URL completa.
    savePatch({ [n.key]: n.prefix });
  };

  const updateNetwork = (n: Network, handle: string) => {
    const trimmed = handle.trim();
    if (!trimmed) {
      savePatch({ [n.key]: "" });
      return;
    }
    savePatch({ [n.key]: normalizeHandleForSave(trimmed, n.prefix) });
  };

  const removeNetwork = (n: Network) => savePatch({ [n.key]: "" });

  return (
    <>
      {activeNetworks.length > 0 && (
        <FieldItem>
          <div className="space-y-2.5">
            {activeNetworks.map((n) => (
              <div
                key={n.key}
                className="flex items-center gap-2 rounded-2xl border border-[#a855f7]/20 bg-[#a855f7]/[0.04] p-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#a855f7]/[0.1] text-[#a855f7]">
                  <n.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/40">
                    {n.label}
                  </p>
                  <div className="mt-0.5 flex items-center gap-0.5">
                    <span className="text-[11px] text-white/30 truncate max-w-[55%]">
                      {n.prefix.replace(/^https:\/\//, "")}
                    </span>
                    <AutoField
                      value={stripPrefix(d[n.key], n.prefix)}
                      onSave={(v) => updateNetwork(n, v)}
                      placeholder={n.placeholder}
                      className="flex-1 min-w-0 bg-transparent border-0 px-1 py-0 text-[13px] font-bold text-white outline-none placeholder:text-white/20"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeNetwork(n)}
                  aria-label={`Quitar ${n.label}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </FieldItem>
      )}

      {inactiveNetworks.length > 0 && (
        <FieldItem>
          <p className="mb-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
            {activeNetworks.length === 0 ? "Elige tus redes" : "Agregar más"}
          </p>
          <div className="flex flex-wrap gap-2">
            {inactiveNetworks.map((n) => (
              <motion.button
                key={n.key}
                type="button"
                onClick={() => addNetwork(n)}
                whileTap={{ scale: 0.94 }}
                transition={MOTION.tap}
                className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-[11px] font-bold text-white/50 transition-colors hover:border-[#a855f7]/30 hover:text-white/80"
              >
                <n.icon className="h-3.5 w-3.5" />
                {n.label}
              </motion.button>
            ))}
          </div>
        </FieldItem>
      )}

      {activeNetworks.length === 0 && inactiveNetworks.length === 0 && (
        <p className="text-center text-[11px] text-white/25">Sin redes disponibles.</p>
      )}
    </>
  );
}
