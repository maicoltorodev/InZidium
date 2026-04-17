'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Users,
    LayoutDashboard,
    FolderKanban,
    ShieldCheck,
    LogOut,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import useBranding from '@/hooks/useBranding';

export default function AdminSidebar() {
    const pathname = usePathname();
    const { estudio, assets, partner } = useBranding();
    const [isAdminHover, setIsAdminHover] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <aside className="relative z-50 flex h-screen w-80 shrink-0 flex-col border-r border-white/5 bg-[#0a0a0a]/40 backdrop-blur-3xl shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
                <div
                    className={`sidebar-flow-line absolute inset-y-0 right-0 z-20 transition-all duration-700 ${isAdminHover ? 'w-[5px] brightness-150' : 'w-[2px]'}`}
                    style={{
                        animationDuration: isAdminHover ? '1.5s' : '8s',
                    }}
                />

                <div className="relative z-10 p-8">
                    <Link
                        href="/admin/dashboard"
                        className="group relative mb-12 block"
                        onMouseEnter={() => setIsAdminHover(true)}
                        onMouseLeave={() => setIsAdminHover(false)}
                    >
                        <div className="relative mb-6">
                            <h2
                                className="relative z-10 text-center text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-[length:200%_auto] transition-transform duration-500 group-hover:scale-105 font-[family-name:var(--font-orbitron)]"
                                style={{
                                    backgroundImage: 'linear-gradient(90deg, #FFD700, #a855f7, #22d3ee, #a855f7, #FFD700)',
                                    animation: 'gradient 3s linear infinite',
                                }}
                            >
                                ADMIN
                            </h2>

                            <div
                                className="pointer-events-none absolute inset-0 animate-pulse opacity-20 blur-2xl"
                                style={{
                                    background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
                                }}
                            />
                        </div>

                        {partner.mostrarAlianza && (
                            <div className="group/badge relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#a855f7] opacity-0 blur-xl transition-opacity duration-500 group-hover/badge:opacity-10" />

                                <div className="relative flex items-center justify-between gap-2 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5 shadow-2xl backdrop-blur-sm transition-all duration-500 group-hover/badge:border-[#FFD700]/30">
                                    <div className="flex flex-1 flex-col items-center gap-3">
                                        <div className="relative h-8 w-8 transition-transform duration-500 group-hover/badge:scale-110 group-hover/badge:rotate-12">
                                            <Image
                                                src={assets.logoPath}
                                                alt={estudio.nombre}
                                                fill
                                                className="object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]"
                                            />
                                        </div>
                                        <div className="whitespace-nowrap text-[8px] font-medium uppercase tracking-[0.2em] text-white">
                                            {estudio.nombre.split(' ')[0]}
                                        </div>
                                    </div>

                                    {assets.logoPartnerPath && (
                                        <>
                                            <span className="mb-6 text-xl font-light text-white/10 font-[family-name:var(--font-orbitron)]">×</span>

                                            <div className="flex flex-1 flex-col items-center gap-3">
                                                <div className="relative h-8 w-8 transition-transform duration-500 group-hover/badge:scale-110 group-hover/badge:-rotate-12">
                                                    <Image
                                                        src={assets.logoPartnerPath}
                                                        alt={partner.nombre}
                                                        fill
                                                        className="object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                                                    />
                                                </div>
                                                <div className="whitespace-nowrap bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-[8px] font-bold tracking-[0.1em] text-transparent font-[family-name:var(--font-orbitron)]">
                                                    {partner.nombre}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </Link>

                    <nav className="mt-12 space-y-2">
                        {[
                            { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard', match: (p: string) => p.startsWith('/admin/dashboard') },
                            { icon: Users, label: 'Clientes', href: '/admin/clientes', match: (p: string) => p.startsWith('/admin/clientes') },
                            { icon: FolderKanban, label: 'Proyectos', href: '/admin/proyectos', match: (p: string) => p.startsWith('/admin/proyectos') },
                            { icon: ShieldCheck, label: 'Administradores', href: '/admin/administradores', match: (p: string) => p.startsWith('/admin/administradores') },
                        ].map((item, idx) => (
                            <SidebarLink
                                key={item.href}
                                {...item}
                                active={item.match(pathname)}
                                index={idx}
                            />
                        ))}
                    </nav>
                </div>

                <div className="mt-auto border-t border-white/5 p-8">
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="group flex w-full items-center gap-4 rounded-2xl border border-transparent px-6 py-4 text-gray-400 transition-all duration-300 hover:border-red-500/10 hover:bg-red-500/5 hover:text-red-400"
                    >
                        <div className="rounded-xl bg-white/5 p-2 transition-all group-hover:rotate-12 group-hover:bg-red-500/10">
                            <LogOut className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-bold tracking-wide">Cerrar Sesión</span>
                    </button>
                </div>

                {mounted &&
                    createPortal(
                        <AnimatePresence>
                            {showLogoutConfirm && (
                                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setShowLogoutConfirm(false)}
                                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        className="relative z-10 w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl"
                                    >
                                        <div className="absolute top-0 right-0 -z-10 h-32 w-32 bg-red-500/10 blur-[50px]" />

                                        <div className="text-center">
                                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500">
                                                <LogOut className="ml-1 h-8 w-8" />
                                            </div>
                                            <h3 className="mb-2 text-xl font-black uppercase tracking-tighter text-white">
                                                ¿Cerrar Sesión?
                                            </h3>
                                            <p className="mb-8 text-xs font-medium leading-relaxed text-gray-400">
                                                Tendrás que volver a autenticarte para acceder al panel de control.
                                            </p>

                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => setShowLogoutConfirm(false)}
                                                    className="rounded-xl border border-white/10 bg-white/5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 transition-all hover:bg-white/10 hover:text-white"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={() => signOut({ callbackUrl: '/' })}
                                                    className="rounded-xl bg-red-600 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700"
                                                >
                                                    Confirmar
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>,
                        document.body
                    )}
            </aside>
        </>
    );
}

function SidebarLink({ icon: Icon, label, href, active, index }: any) {
    const isEven = index % 2 === 0;
    const activeColor = isEven ? '#FFD700' : '#a855f7';
    const indicatorColor = isEven ? '#FFD700' : '#22d3ee';
    const activeGradient = isEven ? 'from-[#FFD700]/10 to-transparent' : 'from-[#a855f7]/10 to-transparent';
    const activeBorder = isEven ? 'border-[#FFD700]' : 'border-[#a855f7]';

    return (
        <Link
            href={href}
            className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl px-6 py-4 transition-all duration-500 ${active ? 'text-white' : 'text-gray-500 hover:text-gray-200'}`}
        >
            <AnimatePresence>
                {active && (
                    <motion.div
                        layoutId="sidebar-active"
                        className={`absolute inset-0 z-0 border-l-2 bg-gradient-to-r ${activeGradient} ${activeBorder}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                )}
            </AnimatePresence>

            {!active && <div className="absolute inset-0 bg-white/0 transition-colors duration-500 group-hover:bg-white/[0.03]" />}

            {active && (
                <div
                    className="absolute left-[-10px] top-1/2 h-12 w-4 -translate-y-1/2 px-4 opacity-20 blur-xl"
                    style={{ backgroundColor: activeColor }}
                />
            )}

            <Icon
                className={`relative z-10 h-5 w-5 transition-all duration-500 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]' : 'group-hover:scale-110 group-hover:text-gray-300'}`}
                style={{ color: active ? activeColor : undefined }}
            />

            <span className={`relative z-10 text-[13px] font-bold tracking-wide transition-colors duration-500 ${active ? 'text-white' : 'group-hover:text-white'}`}>
                {label}
            </span>

            {active && (
                <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto h-1.5 w-1.5 rounded-full"
                    style={{
                        backgroundColor: indicatorColor,
                        boxShadow: `0 0 10px ${indicatorColor}80`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                />
            )}
        </Link>
    );
}
