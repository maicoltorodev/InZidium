"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mantiene el título de la pestaña con un contador de mensajes nuevos.
 * - bump(): incrementa si la pestaña NO tiene foco
 * - reset(): vuelve al título original (al volver el foco o entrar a un chat)
 *
 * Title resultante: "(3) Nexus Admin" mientras hay mensajes pendientes y la pestaña está blurred.
 */
export function useTitleBadge() {
    const [count, setCount] = useState(0);
    const originalTitleRef = useRef<string>("");
    const focusedRef = useRef<boolean>(true);

    useEffect(() => {
        if (typeof document === "undefined") return;
        if (!originalTitleRef.current) originalTitleRef.current = document.title;
        focusedRef.current = !document.hidden;

        const onVis = () => {
            focusedRef.current = !document.hidden;
            if (!document.hidden) {
                setCount(0);
            }
        };
        const onFocus = () => {
            focusedRef.current = true;
            setCount(0);
        };
        document.addEventListener("visibilitychange", onVis);
        window.addEventListener("focus", onFocus);
        return () => {
            document.removeEventListener("visibilitychange", onVis);
            window.removeEventListener("focus", onFocus);
        };
    }, []);

    useEffect(() => {
        if (typeof document === "undefined") return;
        const base = originalTitleRef.current || document.title;
        document.title = count > 0 ? `(${count}) ${base}` : base;
    }, [count]);

    function bump() {
        if (focusedRef.current) return; // si tenés foco, no contamos — ya lo viste
        setCount((c) => c + 1);
    }
    function reset() {
        setCount(0);
    }

    return { count, bump, reset };
}
