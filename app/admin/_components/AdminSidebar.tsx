'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { adminNavSections, type AdminNavItem, type AdminNavLeaf } from './adminNav';
import { AdminSessionBadge } from './AdminSessionBadge';
import { clearSessionGuard } from './session/useSessionGuard';

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isAdminHover, setIsAdminHover] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <aside
                className="relative z-50 hidden h-screen w-80 shrink-0 flex-col bg-[#0a0a0a]/80 lg:flex"
                onMouseEnter={() => setIsAdminHover(true)}
                onMouseLeave={() => setIsAdminHover(false)}
            >
                <div
                    className={`absolute inset-y-0 right-0 overflow-hidden opacity-90 transition-all duration-500 pointer-events-none ${isAdminHover ? 'w-[4px]' : 'w-[2px]'}`}
                >
                    <div
                        className={`absolute inset-0 w-full h-full bg-[length:100%_100%] ${isAdminHover ? 'energy-flow-css-vertical-fast' : 'energy-flow-css-vertical'}`}
                        style={{
                            backgroundImage: 'linear-gradient(to bottom, #22d3ee, #a855f7, #22d3ee, #a855f7, #22d3ee)',
                            backgroundSize: '100% 200%',
                        }}
                    />
                    <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${isAdminHover ? 'shadow-[0_0_20px_rgba(34,211,238,0.8)]' : 'shadow-[0_0_10px_rgba(34,211,238,0.4)]'}`} />
                </div>

                <div className="relative z-10 flex-1 overflow-y-auto px-8 pb-6 pt-8 flex flex-col">
                    <Link
                        href="/admin/chats"
                        className="group relative mb-10 flex justify-center"
                    >
                        <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <Image
                                src="/logo.webp"
                                alt="InZidium"
                                width={1080}
                                height={220}
                                className="w-28 h-auto relative z-10"
                                priority
                            />
                        </motion.div>
                    </Link>

                    {adminNavSections.map((section, idx) => (
                        <div key={section.label} className={idx === 0 ? '' : 'mt-7'}>
                            <SectionHeader label={section.label} />
                            <nav className="mt-3 space-y-1.5">
                                {section.items.map((item) => (
                                    <SidebarItem key={item.href} item={item} pathname={pathname} />
                                ))}
                            </nav>
                        </div>
                    ))}

                    <div className="flex-1" />
                </div>

                <div className="relative z-10 border-t border-white/5 px-6 py-5 space-y-3">
                    <AdminSessionBadge />
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="group relative flex w-full items-center justify-center rounded-2xl border border-transparent px-5 py-3.5 text-gray-400 transition-all duration-300 hover:border-red-500/10 hover:bg-red-500/5 hover:text-red-400"
                    >
                        <div className="absolute left-5 rounded-xl bg-white/5 p-2 transition-all group-hover:rotate-12 group-hover:bg-red-500/10">
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
                                        className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]/95 p-8 shadow-2xl"
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
                                                    className="rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold uppercase tracking-widest text-gray-400 transition-all hover:bg-white/10 hover:text-white"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        clearSessionGuard();
                                                        signOut({ callbackUrl: '/' });
                                                    }}
                                                    className="rounded-xl bg-red-600 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700"
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

function SectionHeader({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3 px-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-600">{label}</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );
}

function SidebarItem({ item, pathname }: { item: AdminNavItem; pathname: string }) {
    const active = item.match(pathname);
    return (
        <>
            <SidebarLink icon={item.icon} label={item.label} href={item.href} active={active} />
            <AnimatePresence initial={false}>
                {item.children && active && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="mt-1.5 space-y-1 pl-4">
                            {item.children.map((child) => (
                                <SidebarSubLink
                                    key={child.href}
                                    icon={child.icon}
                                    label={child.label}
                                    href={child.href}
                                    active={child.match(pathname)}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

type LinkProps = Pick<AdminNavLeaf, 'icon' | 'label' | 'href'> & { active: boolean };

function SidebarLink({ icon: Icon, label, href, active }: LinkProps) {
    return (
        <Link
            href={href}
            className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl px-5 py-3 transition-all duration-500 ${active ? 'text-white' : 'text-gray-500 hover:text-gray-200'}`}
        >
            <AnimatePresence>
                {active && (
                    <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 z-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#22d3ee]/10 via-[#a855f7]/5 to-transparent" />
                        <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-[#22d3ee] to-[#a855f7]" />
                    </motion.div>
                )}
            </AnimatePresence>

            {!active && <div className="absolute inset-0 bg-white/0 transition-colors duration-500 group-hover:bg-white/[0.03]" />}

            {active && (
                <div
                    className="absolute left-[-10px] top-1/2 h-10 w-4 -translate-y-1/2 px-4 opacity-20 blur-xl"
                    style={{ background: 'linear-gradient(to bottom, #22d3ee, #a855f7)' }}
                />
            )}

            <Icon
                className={`relative z-10 h-5 w-5 transition-all duration-500 ${active ? 'scale-110' : 'group-hover:scale-110 group-hover:text-gray-300'}`}
                style={{
                    color: active ? '#22d3ee' : undefined,
                    filter: active ? 'drop-shadow(0 0 6px rgba(34,211,238,0.5)) drop-shadow(0 0 4px rgba(168,85,247,0.3))' : undefined,
                }}
            />

            <span className={`relative z-10 text-[13px] font-bold tracking-wide transition-colors duration-500 ${active ? 'text-white' : 'group-hover:text-white'}`}>
                {label}
            </span>

            {active && (
                <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto h-1.5 w-1.5 rounded-full"
                    style={{
                        background: 'linear-gradient(to bottom, #22d3ee, #a855f7)',
                        boxShadow: '0 0 8px rgba(34,211,238,0.6), 0 0 6px rgba(168,85,247,0.4)',
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                />
            )}
        </Link>
    );
}

function SidebarSubLink({ icon: Icon, label, href, active }: LinkProps) {
    return (
        <Link
            href={href}
            className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-2 transition-all duration-300 ${
                active
                    ? 'bg-white/[0.04] text-white'
                    : 'text-gray-500 hover:bg-white/[0.02] hover:text-gray-300'
            }`}
        >
            {active && (
                <div className="absolute inset-y-1 left-0 w-[2px] rounded-full bg-gradient-to-b from-[#22d3ee] to-[#a855f7]" />
            )}
            <Icon
                className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                style={{
                    color: active ? '#22d3ee' : undefined,
                    filter: active ? 'drop-shadow(0 0 4px rgba(34,211,238,0.4))' : undefined,
                }}
            />
            <span className="text-xs font-semibold tracking-wide">{label}</span>
        </Link>
    );
}
