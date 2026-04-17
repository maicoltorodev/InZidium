"use client";

import { useEffect, useState } from "react";
import CompactProjectsPortal from "@/components/clientes/CompactProjectsPortal";

type Device = "desktop" | "tablet" | "mobile";

function detectDevice(): Device {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    if (w < 768) return "mobile";
    if (w < 1280) return "tablet";
    return "desktop";
}

export default function SeguimientoPage() {
    const [device, setDevice] = useState<Device>("desktop");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setDevice(detectDevice());
        setMounted(true);
        const onResize = () => setDevice(detectDevice());
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    if (!mounted) return null;

    return <CompactProjectsPortal device={device} useDesktopLandingBackground={false} />;
}
