"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import type { Completion } from "../types";
import { MOTION, STAGGER, usePrefersReducedMotion } from "../shared/primitives/motion";
import { BRAND_ICON_STYLE } from "../shared/primitives/BrandDefs";

type SubnavItem = { id: string; label: string };

/**
 * Layout section para desktop con subnav sticky derecha.
 * - Grid 3-col cuando hay subnav, full-width cuando no.
 * - Anchors con IntersectionObserver para marcar activo al hacer scroll.
 */
export function DesktopSection({
  icon: Icon,
  title,
  subtitle,
  completion,
  onBack,
  children,
  hideBody = false,
  headerContent,
  subnav,
  scrollRootId,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  completion: Completion;
  onBack: () => void;
  children: React.ReactNode;
  hideBody?: boolean;
  headerContent?: React.ReactNode;
  subnav?: SubnavItem[];
  /** ID del contenedor scrollable (para scroll suave a anchors). */
  scrollRootId?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(subnav?.[0]?.id ?? null);
  // Si el contenido cabe entero en el viewport no tiene sentido mostrar el
  // subnav — queda como un indicador estático. Solo se muestra si hay scroll.
  const [canScroll, setCanScroll] = useState(false);

  const heroUsesGradient = completion !== "complete";
  const iconRing =
    completion === "complete"
      ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
      : completion === "partial"
      ? "bg-[linear-gradient(135deg,rgba(232,121,249,0.14)_0%,rgba(168,85,247,0.14)_50%,rgba(34,211,238,0.14)_100%)] ring-1 ring-[#a855f7]/30 shadow-[0_0_50px_-14px_rgba(168,85,247,0.6)]"
      : "bg-[linear-gradient(135deg,rgba(232,121,249,0.06)_0%,rgba(168,85,247,0.06)_50%,rgba(34,211,238,0.06)_100%)] ring-1 ring-white/[0.08]";

  const ctaStyle =
    completion === "complete"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      : "border-white/[0.08] bg-white/[0.04] text-white/70 hover:bg-white/[0.06]";

  // Detectar si el contenido tiene scroll real. Si todo entra en pantalla,
  // el subnav no aporta nada y lo escondemos. Usamos ResizeObserver para
  // cubrir cambios dinámicos de altura (ej. expandir un colapsable).
  useEffect(() => {
    if (hideBody) return;
    const root = scrollRef.current;
    const body = bodyRef.current;
    if (!root || !body) return;
    const check = () => {
      setCanScroll(root.scrollHeight > root.clientHeight + 4);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(root);
    ro.observe(body);
    window.addEventListener("resize", check);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, [hideBody, subnav]);

  // IntersectionObserver: marca activo el anchor más cercano al top (40% viewport).
  // Cuando el scroll llega al fondo, forzamos el último item como activo — el
  // active-band del IO (10-40% del viewport) puede no alcanzar los últimos
  // items si el contenido es corto.
  useEffect(() => {
    if (!subnav || subnav.length === 0 || hideBody || !canScroll) return;
    const root = scrollRef.current;
    if (!root) return;

    const observed: HTMLElement[] = [];
    for (const item of subnav) {
      const el = root.querySelector<HTMLElement>(`[data-field-item="${item.id}"]`);
      if (el) observed.push(el);
    }
    if (observed.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // El primer elemento intersectando con ratio > threshold gana.
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.getAttribute("data-field-item"));
      },
      {
        root,
        rootMargin: "-10% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );
    for (const el of observed) observer.observe(el);

    // Fallback: al llegar al fondo del scroll, activar el último item.
    const onScroll = () => {
      const nearBottom = root.scrollTop + root.clientHeight >= root.scrollHeight - 24;
      if (nearBottom) setActiveId(subnav[subnav.length - 1].id);
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      root.removeEventListener("scroll", onScroll);
    };
  }, [subnav, hideBody, canScroll]);

  const highlightAnchor = (id: string) => {
    const root = scrollRef.current;
    if (!root) return;
    const el = root.querySelector<HTMLElement>(`[data-field-item="${id}"]`);
    if (!el) return;

    // Si el field está fuera del viewport del scroll root, hacer scroll suave.
    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const outOfView =
      elRect.top < rootRect.top + 40 || elRect.bottom > rootRect.bottom - 40;
    if (outOfView) {
      root.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
    }

    // Pulse visual sobre el field — agregamos/removemos una clase temporal.
    el.classList.remove("field-highlight");
    // Reflow para reiniciar la animación si se hace click rápido dos veces.
    void el.offsetWidth;
    el.classList.add("field-highlight");
    window.setTimeout(() => el.classList.remove("field-highlight"), 1400);

    setActiveId(id);
  };

  // Solo renderizamos el subnav si hay scroll. Sin scroll, todo el contenido
  // ya está a la vista y el indicador es ruido visual.
  const hasSubnav = !hideBody && subnav && subnav.length > 0 && canScroll;

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { x: "100%", opacity: 0.6 }}
      animate={reduced ? { opacity: 1 } : { x: 0, opacity: 1 }}
      exit={reduced ? { opacity: 0 } : { x: "100%", opacity: 0.6 }}
      transition={MOTION.page}
      className="fixed inset-0 z-30 flex flex-col bg-[#060214] text-white"
    >
      {/* Header */}
      <header className="relative flex h-16 shrink-0 items-center border-b border-white/[0.04] bg-[#060214]/85 px-6 backdrop-blur-md">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver al inicio"
          className="flex h-11 w-11 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5">
          {headerContent ?? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">
                Guardado
              </span>
            </>
          )}
        </div>
      </header>

      {/* Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {hideBody ? (
          children
        ) : (
          <div ref={bodyRef} className={`mx-auto w-full max-w-[1080px] px-10 pt-12 pb-32 ${hasSubnav ? "grid grid-cols-[1fr_240px] gap-10" : ""}`}>
            {/* Columna principal */}
            <div className={hasSubnav ? "min-w-0" : ""}>
              <motion.div
                initial={reduced ? { opacity: 0 } : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={MOTION.reveal}
                className="mb-10 flex items-start gap-6"
              >
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-colors ${iconRing}`}>
                  <Icon className="h-7 w-7" style={heroUsesGradient ? BRAND_ICON_STYLE : undefined} />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <h1 className="text-3xl font-black leading-tight tracking-tight text-white">{title}</h1>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-white/45">{subtitle}</p>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: reduced ? 0 : STAGGER.fields,
                      delayChildren: reduced ? 0 : 0.05,
                    },
                  },
                }}
                className="space-y-7"
              >
                {children}
              </motion.div>
            </div>

            {/* Subnav sticky */}
            {hasSubnav && (
              <aside className="sticky top-8 self-start">
                <p className="mb-3 text-[9px] font-black uppercase tracking-[0.26em] text-white/30">
                  En esta sección
                </p>
                <nav className="space-y-1">
                  {subnav!.map((item) => {
                    const active = item.id === activeId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => highlightAnchor(item.id)}
                        className={`block w-full rounded-lg border-l-2 px-3 py-2 text-left text-[12px] transition-colors ${
                          active
                            ? "border-l-[#a855f7] bg-[linear-gradient(90deg,rgba(168,85,247,0.08)_0%,transparent_100%)] font-semibold text-white"
                            : "border-l-white/[0.06] font-medium text-white/45 hover:border-l-white/25 hover:text-white/80"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </aside>
            )}
          </div>
        )}
      </div>

      {/* CTA */}
      {!hideBody && (
        <div className="shrink-0 border-t border-white/[0.04] bg-[#060214]/95 px-10 py-4 backdrop-blur-md">
          <div className="mx-auto w-full max-w-[1080px]">
            <button
              type="button"
              onClick={onBack}
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl border text-[12px] font-black uppercase tracking-[0.24em] transition-colors ${ctaStyle}`}
            >
              {completion === "complete" && <Check className="h-4 w-4" strokeWidth={3} />}
              {completion === "complete" ? "¡Listo! Volver al inicio" : "Volver al inicio"}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
