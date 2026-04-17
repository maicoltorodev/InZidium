"use client";

import React from "react";
import {
  AtSign,
  BriefcaseBusiness,
  Clock,
  ExternalLink,
  Image as ImageIcon,
  Link,
  Lock,
  Mail,
  MapPin,
  Palette,
  Phone,
  ShoppingBag,
  Tag,
  UtensilsCrossed,
  Users,
  Zap,
} from "lucide-react";

import { motion } from "framer-motion";

interface TabBriefingProps {
  project: any;
}

function Empty({ label = "Sin definir" }: { label?: string }) {
  return <span className="text-gray-600 italic font-normal">{label}</span>;
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-1">
        {label}
      </span>
      <p className="text-sm text-gray-200 leading-relaxed">
        {value || <Empty />}
      </p>
    </div>
  );
}

function ImagePreview({ url, label }: { url?: string; label?: string }) {
  if (!url) {
    return (
      <div className="flex h-36 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.01] text-[9px] font-black uppercase tracking-widest text-gray-600">
        <ImageIcon className="h-5 w-5 opacity-30" />
        {label || "Sin imagen"}
      </div>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-2xl border border-white/10"
    >
      <img src={url} alt="" className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
        <ExternalLink className="h-5 w-5 text-white" />
      </div>
    </a>
  );
}

function Card({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-[2rem] border border-white/5 bg-[#0a0a0a]/50 p-6 hover:border-${color}-500/20 transition-colors`}>
      <div className="mb-5 flex items-center gap-3 border-b border-white/5 pb-5">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${color}-500/10 text-${color}-400`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-tight text-white">
          {title}
        </h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

const tipoLabels: Record<string, { label: string; icon: React.ElementType }> = {
  servicios: { label: "Servicios", icon: BriefcaseBusiness },
  productos: { label: "Productos", icon: ShoppingBag },
  menu: { label: "Menú", icon: UtensilsCrossed },
};

export function TabBriefing({ project }: TabBriefingProps) {
  const d: any = project.onboardingData || {};
  const hasData = Object.keys(d).length > 0;
  const catalogo: any[] = d.catalogo || [];
  const categorias: string[] = d.categorias || [];
  const tipo = d.tipoCatalogo || "servicios";
  const { label: tipoLabel, icon: TipoIcon } = tipoLabels[tipo] ?? tipoLabels.servicios;

  return (
    <motion.div
      key="briefing"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
          Información del cliente
        </h2>
        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-500">
          Datos proporcionados desde el portal — se actualizan en tiempo real
        </p>
      </div>

      {!hasData ? (
        <div className="rounded-3xl border border-white/5 p-12 text-center text-gray-500">
          <p className="text-xs font-black uppercase tracking-widest">
            El cliente aún no ha completado ningún campo
          </p>
        </div>
      ) : (
        <div className="space-y-5">

          {/* ── FILA 1: Identidad + Colores ──────────────────────────────── */}
          <div className="grid grid-cols-2 gap-5">

            {/* Identidad */}
            <Card icon={Zap} title="Identidad" color="purple">
              <div className="flex gap-5">
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-1">
                      Nombre del negocio
                    </span>
                    <p className="text-2xl font-black text-white">
                      {d.nombreComercial || <Empty />}
                    </p>
                  </div>
                  <Field label="Slogan" value={d.slogan ? `"${d.slogan}"` : undefined} />
                  <Field label="Descripción" value={d.descripcion} />
                  <Field label="Dominio deseado" value={d.dominioUno ? `www.${d.dominioUno}.com` : undefined} />
                </div>
                {/* Logo */}
                <div className="w-32 shrink-0">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-2">
                    Logo
                  </span>
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-3">
                    {d.logo ? (
                      <img src={d.logo} alt="Logo" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-[9px] font-black uppercase text-gray-700">Sin logo</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Colores */}
            <Card icon={Palette} title="Colores" color="pink">
              {[
                { val: d.colorFondo,                         label: "Fondo" },
                { val: d.colorPrimario ?? d.colorAcento,     label: "Primario" },
                { val: d.colorAcento2,                       label: "Acento" },
              ].map(({ val, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                  <div
                    className="h-8 w-8 shrink-0 rounded-lg border border-white/10"
                    style={{ backgroundColor: val || "transparent" }}
                  />
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block">
                      {label}
                    </span>
                    <span className="font-mono text-xs text-gray-300">
                      {val || <Empty label="Sin elegir" />}
                    </span>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* ── FILA 2: Nosotros ─────────────────────────────────────────── */}
          <Card icon={Users} title="Nosotros" color="blue">
            <div className="grid grid-cols-3 gap-5">
              <div className="col-span-2 space-y-4">
                <Field label="Descripción" value={d.descripcion} />
                <Field label="Misión" value={d.mision} />
                <Field label="Diferencial" value={d.diferencial} />
                <div className="grid grid-cols-4 gap-3 pt-2">
                  {(d.stats || []).map((stat: { value: string; label: string }, i: number) => (
                    <div key={i} className="rounded-xl bg-white/5 p-3 text-center">
                      <p className="text-xl font-black text-white">{stat.value || <Empty label="—" />}</p>
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mt-1">{stat.label || "—"}</span>
                    </div>
                  ))}
                  {(!d.stats || d.stats.length === 0) && <p className="col-span-4 text-xs italic text-gray-600">Sin estadísticas</p>}
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-2">
                  Foto del negocio
                </span>
                <ImagePreview url={d.imagenNosotros} label="Sin foto" />
              </div>
            </div>
          </Card>

          {/* ── FILA 3: Catálogo ─────────────────────────────────────────── */}
          <div className="rounded-[2rem] border border-white/5 bg-[#0a0a0a]/50 p-6">
            <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <TipoIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-white">
                    {tipoLabel}
                  </h3>
                  <p className="text-[9px] text-gray-500">
                    {catalogo.length} {catalogo.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              {categorias.length > 0 && (
                <div className="flex flex-wrap justify-end gap-1.5">
                  {categorias.map((cat) => (
                    <span
                      key={cat}
                      className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-bold text-gray-400"
                    >
                      <Tag className="h-2.5 w-2.5" />
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {catalogo.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/5 py-10 text-[9px] font-black uppercase tracking-widest text-gray-600">
                <ShoppingBag className="h-5 w-5 opacity-30" />
                Sin items aún
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {catalogo.map((item: any, i: number) => (
                  <div
                    key={item.id || i}
                    className="overflow-hidden rounded-2xl border border-white/5 bg-black/30"
                  >
                    {item.imagen ? (
                      <img src={item.imagen} alt={item.titulo} className="h-28 w-full object-cover" />
                    ) : (
                      <div className="flex h-28 items-center justify-center border-b border-white/5 bg-white/[0.02] text-gray-700">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                    )}
                    <div className="p-3 space-y-1">
                      <p className="font-black text-sm text-white truncate">
                        {item.titulo || <Empty label="Sin nombre" />}
                      </p>
                      {item.precio && (
                        <p className="text-[10px] font-bold text-emerald-400">
                          {item.precio}
                        </p>
                      )}
                      {item.categoria && (
                        <p className="text-[9px] text-gray-500">{item.categoria}</p>
                      )}
                      {item.descripcion && (
                        <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">
                          {item.descripcion}
                        </p>
                      )}
                      {item.features && item.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.features.map((f: string, fi: number) => (
                            <span key={fi} className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-gray-400">{f}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── FILA 4: Contacto + Footer ────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-5">
            <Card icon={MapPin} title="Contacto" color="amber">
              <Field label="Descripción del local" value={d.descripcionLocal} />
              <Field label="Dirección" value={d.direccion} />
              {/* Horario estructurado */}
              <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                <div className="flex items-center gap-2 bg-white/[0.04] px-3 py-2.5">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Horario de atención</span>
                </div>
                {d.hours && Object.values(d.hours).some((v: any) => v) ? (
                  <div className="divide-y divide-white/[0.04]">
                    {(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const).map((key) => {
                      const labels: Record<string, string> = { monday: "Lunes", tuesday: "Martes", wednesday: "Miércoles", thursday: "Jueves", friday: "Viernes", saturday: "Sábado", sunday: "Domingo" };
                      const val = d.hours?.[key] || "";
                      const isClosed = val.toLowerCase() === "closed" || val.toLowerCase() === "cerrado";
                      return (
                        <div key={key} className="flex items-center justify-between px-3 py-2.5">
                          <span className="text-xs text-gray-400">{labels[key]}</span>
                          <span className={`text-xs font-bold ${isClosed ? "text-red-400/70" : "text-white"}`}>
                            {val || "—"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="px-3 py-2.5 text-xs italic text-gray-600">Sin definir</p>
                )}
              </div>
              {/* Google Maps embed */}
              {d.embedUrl && (
                <a
                  href={d.embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-white/5 p-3 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Link className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Ver en Google Maps</span>
                  <ExternalLink className="h-3 w-3 shrink-0 ml-auto" />
                </a>
              )}
            </Card>

            <Card icon={Mail} title="Footer & Contacto digital" color="cyan">
              <Field label="Texto de cierre" value={d.textoFooter} />
              {[
                { icon: Phone, color: "text-emerald-400", label: "WhatsApp", val: d.whatsapp },
                { icon: Phone, color: "text-sky-400",     label: "Teléfono", val: d.telefono },
                { icon: Mail,  color: "text-blue-400",    label: "Correo",   val: d.email },
              ].map(({ icon: Icon, color, label, val }) => (
                <div key={label} className="flex items-center gap-2 rounded-xl bg-white/5 p-3">
                  <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block">{label}</span>
                    <p className="text-sm font-bold text-white truncate">{val || <Empty />}</p>
                  </div>
                </div>
              ))}
              {/* WhatsApp FAB */}
              {(d.fabPhone || d.fabMessage) && (
                <div className="mt-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 block">Botón flotante WhatsApp</span>
                  <Field label="Número" value={d.fabPhone} />
                  <Field label="Mensaje precargado" value={d.fabMessage} />
                </div>
              )}
            </Card>
          </div>

          {/* ── Redes sociales ───────────────────────────────────────────── */}
          {(d.instagram || d.facebook || d.tiktok || d.twitter || d.youtube || d.whatsappUrl || d.threads || d.telegram) && (
            <Card icon={AtSign} title="Redes sociales" color="violet">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Instagram",   val: d.instagram },
                  { label: "Facebook",    val: d.facebook },
                  { label: "TikTok",      val: d.tiktok },
                  { label: "Twitter / X", val: d.twitter },
                  { label: "YouTube",     val: d.youtube },
                  { label: "WhatsApp",    val: d.whatsappUrl },
                  { label: "Threads",     val: d.threads },
                  { label: "Telegram",    val: d.telegram },
                ].filter(({ val }) => val).map(({ label, val }) => (
                  <a
                    key={label}
                    href={val}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-white/5 p-3 hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block">{label}</span>
                      <span className="text-xs text-blue-400 truncate block max-w-[180px] hover:underline">{val}</span>
                    </div>
                    <ExternalLink className="h-3 w-3 shrink-0 text-gray-600 ml-auto" />
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* ── Legal ────────────────────────────────────────────────────── */}
          {(d.legalTemplate || d.legalLastUpdated) && (
            <Card icon={Lock} title="Legal" color="gray">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Plantilla legal" value={d.legalTemplate ? ({ servicios: "Servicios profesionales", comercio: "Comercio / tienda", gastronomia: "Gastronomía / restaurante" } as Record<string, string>)[d.legalTemplate] || d.legalTemplate : undefined} />
                <Field label="Fecha de vigencia" value={d.legalLastUpdated} />
              </div>
            </Card>
          )}

        </div>
      )}
    </motion.div>
  );
}
