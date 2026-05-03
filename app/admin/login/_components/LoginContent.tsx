'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ChevronRight, Lock, Loader2, ShieldAlert, User } from 'lucide-react';
import { motion } from 'framer-motion';

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
    } catch {
      setError('Ocurrió un error al intentar iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-white flex flex-col items-center justify-center p-4 pt-8 pb-12 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Badge */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-md">
            <ShieldAlert className="w-3 h-3 text-neon-purple" />
            <span className="text-[10px] font-black tracking-[0.25em] uppercase bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] energy-flow-css">
              Acceso Restringido
            </span>
          </div>
        </motion.div>

        {/* Glass card */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel glass-card rounded-3xl p-8 sm:p-10 border border-white/10"
          style={{
            '--active-border': 'rgba(168,85,247,0.5)',
            '--active-glow': 'rgba(168,85,247,0.2)',
            '--neon-glow': 'rgba(168,85,247,0.15)',
          } as React.CSSProperties}
        >
          {/* Logo + title */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-6 inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple to-neon-cyan blur-xl opacity-25" />
              <motion.img
                src="/logo.webp"
                alt="InZidium"
                className="relative w-14 h-14 object-contain"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <h1 className="font-orbitron text-2xl sm:text-3xl font-medium tracking-[0.08em] text-white mb-3 leading-snug">
              Panel de{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] energy-flow-css">
                Administración
              </span>
            </h1>
            <p className="text-white/40 text-sm">Solo personal autorizado.</p>
          </div>

          {/* Concurrent session warning */}
          {reason === 'concurrent' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-amber-500/8 border border-amber-500/20 rounded-2xl flex items-start gap-3"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-400 mb-0.5 uppercase tracking-wider">Sesión cerrada</p>
                <p className="text-xs text-amber-300/70 leading-relaxed">
                  Se inició sesión desde otro dispositivo. Por seguridad, esta sesión fue cerrada automáticamente.
                </p>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="relative group">
              <div className="absolute -inset-px bg-gradient-to-r from-[#a855f7]/40 to-[#22d3ee]/40 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white/[0.04] border border-white/10 rounded-2xl p-2 flex items-center gap-2 transition-all duration-200 focus-within:border-[#a855f7]/40">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-white/25" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Usuario"
                  required
                  autoComplete="username"
                  className="w-full bg-transparent border-none outline-none text-white font-medium h-11 text-base placeholder:text-white/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative group">
              <div className="absolute -inset-px bg-gradient-to-r from-[#a855f7]/40 to-[#22d3ee]/40 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white/[0.04] border border-white/10 rounded-2xl p-2 flex items-center gap-2 transition-all duration-200 focus-within:border-[#a855f7]/40">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-white/25" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                  autoComplete="current-password"
                  className="w-full bg-transparent border-none outline-none text-white font-medium h-11 text-base placeholder:text-white/20"
                />
                <button
                  type="submit"
                  disabled={loading || !username || !password}
                  className="w-11 h-11 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-[length:200%_auto] energy-flow-css rounded-xl flex items-center justify-center text-white hover:scale-95 active:scale-90 transition-all duration-150 disabled:opacity-30 disabled:scale-100 shrink-0"
                >
                  {loading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <ChevronRight className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>
          </form>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500/8 border border-red-500/20 rounded-2xl flex items-start gap-3"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-400 mb-0.5">Acceso Denegado</p>
                <p className="text-xs text-red-300/70">{error}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </main>
  );
}
