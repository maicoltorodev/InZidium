"use client";

import { useEffect, useRef } from "react";

export function ParticleAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let running = true;
    let lastTs = 0;
    const targetFrameMs = 1000 / 30;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      opacitySpeed: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || 0);
        this.y = Math.random() * (canvas?.height || 0);
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.15 - 0.075;
        this.speedY = Math.random() * 0.15 - 0.075;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.opacitySpeed = Math.random() * 0.005 + 0.001;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (canvas) {
          if (this.x > canvas.width) this.x = 0;
          if (this.x < 0) this.x = canvas.width;
          if (this.y > canvas.height) this.y = 0;
          if (this.y < 0) this.y = canvas.height;
        }

        this.opacity += this.opacitySpeed;
        if (this.opacity > 0.8 || this.opacity < 0.2) {
          this.opacitySpeed = -this.opacitySpeed;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(100, 220, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let lastWidth = window.innerWidth;

    const init = (preserveParticles = false) => {
      if (!canvas) return;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      if (!preserveParticles) {
        particles = [];
        const area = window.innerWidth * window.innerHeight;
        const particleCount = Math.floor(area / 14000);
        const cap = 160;
        for (let i = 0; i < Math.min(particleCount, cap); i++) {
          particles.push(new Particle());
        }
      }
    };

    const animate = (ts: number) => {
      if (!ctx || !canvas) return;

      if (!running) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      if (ts - lastTs < targetFrameMs) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      lastTs = ts;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (currentWidth !== lastWidth) {
        lastWidth = currentWidth;
        init(false);
      } else {
        init(true);
      }
    };

    window.addEventListener("resize", handleResize);

    const handleVisibility = () => {
      running = !document.hidden;
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-60 z-[1]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
