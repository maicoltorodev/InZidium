'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] flex flex-col items-center gap-4 pointer-events-none w-full max-w-md">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <div className="relative group">
                                {/* Glow de fondo dinámico */}
                                <div className={`absolute -inset-1 blur-lg opacity-40 rounded-2xl transition-all duration-500 ${toast.type === 'success' ? 'bg-emerald-500' :
                                    toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                    }`} />

                                <div className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 min-w-[320px] shadow-2xl overflow-hidden">
                                    {/* Barra de energía inferior (Timer visual) */}
                                    <motion.div
                                        initial={{ width: '100%' }}
                                        animate={{ width: '0%' }}
                                        transition={{ duration: 5, ease: 'linear' }}
                                        className={`absolute bottom-0 left-0 h-[3px] ${toast.type === 'success' ? 'bg-emerald-500' :
                                            toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                            }`}
                                    />

                                    <div className={`p-2 rounded-xl ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                                        toast.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                                        {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                                        {toast.type === 'info' && <Info className="w-5 h-5" />}
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-0.5">Notificación de Sistema</p>
                                        <p className="text-sm font-bold text-white leading-tight">{toast.message}</p>
                                    </div>

                                    <button
                                        onClick={() => removeToast(toast.id)}
                                        className="text-gray-600 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
}
