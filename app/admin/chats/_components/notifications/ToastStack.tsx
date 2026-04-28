"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { NotificationToast, type ToastData } from "./NotificationToast";

type Props = {
    toasts: ToastData[];
    onDismiss: (id: string) => void;
    onClick: (toast: ToastData) => void;
};

export function ToastStack({ toasts, onDismiss, onClick }: Props) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return createPortal(
        <div className="pointer-events-none fixed bottom-6 right-6 z-[9000] flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((t) => (
                    <NotificationToast
                        key={t.id}
                        toast={t}
                        onDismiss={() => onDismiss(t.id)}
                        onClick={() => {
                            onClick(t);
                            onDismiss(t.id);
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>,
        document.body,
    );
}
