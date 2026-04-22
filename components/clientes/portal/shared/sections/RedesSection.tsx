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
  // Waze usa link completo — el prefix "https://" es solo para que el usuario
  // pegue cualquier URL (waze.com/ul?..., ul.waze.com/..., etc.) sin tipearlo.
  { key: "waze",        label: "Waze",        icon: WazeIcon,      prefix: "https://",                placeholder: "waze.com/ul?ll=4.63,-74.09" },
];

function stripPrefix(url: string | undefined, prefix: string): string {
  if (!url) return "";
  const lower = url.toLowerCase();
  const prefixLower = prefix.toLowerCase();
  if (lower.startsWith(prefixLower)) return url.slice(prefix.length);
  // Accept bare handle "@tunegocio" or "tunegocio" stored directly
  return url.replace(/^@/, "");
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
    const clean = handle.trim();
    if (!clean) savePatch({ [n.key]: "" });
    else savePatch({ [n.key]: `${n.prefix}${clean.replace(/^@/, "")}` });
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
