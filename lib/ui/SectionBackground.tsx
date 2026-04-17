"use client";

import { useEffect, useRef, useState } from "react";
import { ParticleAtmosphere } from "@/lib/ui/ParticleAtmosphere";

export function SectionBackground({ 
  children, 
  className = "", 
  innerClassName = "", 
  enableMouseFollow = true, 
  id 
}: { 
  children: React.ReactNode; 
  className?: string; 
  innerClassName?: string;
  enableMouseFollow?: boolean; 
  id?: string 
}) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isPartyMode, setIsPartyMode] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const mouseRafRef = useRef<number | null>(null);
  const mouseLatestRef = useRef<{ x: number; y: number }>({ x: 50, y: 50 });
  const shouldReduceVisualLoad = reduceMotion;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enableMouseFollow || shouldReduceVisualLoad) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseLatestRef.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };

      if (mouseRafRef.current != null) return;
      mouseRafRef.current = window.requestAnimationFrame(() => {
        mouseRafRef.current = null;
        setMousePos(mouseLatestRef.current);
      });
    };

    const handlePartyStart = () => setIsPartyMode(true);
    const handlePartyEnd = () => setIsPartyMode(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("logo-hover-start", handlePartyStart);
    window.addEventListener("logo-hover-end", handlePartyEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("logo-hover-start", handlePartyStart);
      window.removeEventListener("logo-hover-end", handlePartyEnd);

      if (mouseRafRef.current != null) {
        window.cancelAnimationFrame(mouseRafRef.current);
        mouseRafRef.current = null;
      }
    };
  }, [enableMouseFollow, shouldReduceVisualLoad]);

  return (
    <div id={id} className={`relative min-h-[100dvh] w-full overflow-hidden ${className}`}>
      <div className="fixed inset-0 bg-[#020608] -z-10" /> 
      
      {!shouldReduceVisualLoad && <ParticleAtmosphere />}

      {!shouldReduceVisualLoad && (
        <div className="rocket-orbit" aria-hidden="true">
          <div className="rocket-orbit__rotator">
            <div className="rocket-orbit__rocket" />
          </div>
        </div>
      )}
      
      {enableMouseFollow && !shouldReduceVisualLoad && (
        <div
          className={`mouse-follow-glow fixed inset-0 transition-opacity duration-700 pointer-events-none ${isPartyMode ? 'animate-party' : ''}`}
          style={{
            background: `radial-gradient(circle 35vw at ${mousePos.x}% ${mousePos.y}%, rgba(100, 220, 255, 0.15) 0%, transparent 80%)`,
            zIndex: 1
          }}
        />
      )}
      
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 40% 60% at 90% 10%, rgba(100, 220, 255, ${shouldReduceVisualLoad ? "0.025" : "0.05"}) 0%, transparent 50%),
            radial-gradient(ellipse 80% 80% at 50% 140%, rgba(5,15,20,${shouldReduceVisualLoad ? "0.08" : "0.15"}) 0%, transparent 60%)
          `,
          zIndex: 0
        }}
      />

      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      <div className={`relative z-10 ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}
