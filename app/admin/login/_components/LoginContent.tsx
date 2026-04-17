'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, User, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionBackground } from "@/lib/ui/SectionBackground";

export default function LoginContent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Acceso denegado. Credenciales incorrectas.');
            } else {
                router.push('/admin/dashboard');
                router.refresh();
            }
        } catch (err) {
            setError('Ocurrió un error al intentar iniciar sesión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SectionBackground className="flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-20"
            >
                <div className="bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8AA14] blur-[100px] opacity-10" />
                    <div className="absolute inset-0 rounded-[3rem] border border-white/[0.05] group-hover:border-[#E8AA14]/20 transition-colors duration-500 pointer-events-none" />

                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
                            ADMIN
                        </h1>
                        <p className="text-[#E8AA14] text-[10px] font-black uppercase tracking-[0.4em] opacity-80">
                            Acceso Restringido
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 text-left relative z-10">
                        {reason === 'concurrent' && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 text-sm flex items-start gap-3"
                            >
                                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-black text-[11px] uppercase tracking-widest mb-1">Sesión cerrada</p>
                                    <p className="text-[12px] leading-relaxed opacity-80">
                                        Se inició sesión desde otro dispositivo. Por seguridad, esta sesión fue cerrada automáticamente.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Usuario</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-[#E8AA14]/50 text-white placeholder:text-white/10 transition-all"
                                    placeholder="Nombre de usuario"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-[#E8AA14]/50 text-white placeholder:text-white/10 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-gold w-full h-16 rounded-2xl flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar al Panel'}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-xs text-gray-600">
                            ¿Olvidaste tus credenciales? Contacta al administrador del sistema.
                        </p>
                    </div>
                </div>
            </motion.div>
        </SectionBackground>
    );
}
