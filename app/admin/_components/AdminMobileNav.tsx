'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, LogOut } from 'lucide-react';
import { Drawer } from 'vaul';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminNavSections, type AdminNavItem, type AdminNavLeaf } from './adminNav';

export default function AdminMobileNav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogoutClick = () => {
        setOpen(false);
        setTimeout(() => setShowLogoutConfirm(true), 260);
    };

    const closeDrawer = () => setOpen(false);

    return (
        <>
            <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/5 bg-[#060214]/90 px-4 backdrop-blur-xl lg:hidden">
                <button
                    onClick={() => setOpen(true)}
                    aria-label="Abrir menú"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                >
                    <Menu className="h-5 w-5" />
                </button>

                <Link href="/admin/chats" className="flex items-center gap-2">
                    <Image
                        src="/logo.webp"
                        alt="InZidium"
                        width={28}
                        height={28}
                        className="object-contain"
                        style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.35))' }}
                    />
                    <span
                        className="text-lg font-black tracking-tighter text-transparent bg-clip-text font-[family-name:var(--font-orbitron)]"
                        style={{
                            backgroundImage: 'linear-gradient(90deg, #e879f9, #a855f7, #22d3ee)',
                        }}
                    >
                        ADMIN
                    </span>
                </Link>

                <div className="w-10" />
            </header>

            <Drawer.Root open={open} onOpenChange={setOpen} direction="left">
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm" />
                    <Drawer.Content className="fixed inset-y-0 left-0 z-[70] flex h-full w-[85%] max-w-sm flex-col bg-[#060214]/95 outline-none backdrop-blur-xl">
                        <Drawer.Title className="sr-only">Menú de administración</Drawer.Title>
                        <Drawer.Description className="sr-only">Navegación del panel de administración</Drawer.Description>

                        <div className="flex items-center justify-between p-6">
                            <Link href="/admin/chats" onClick={closeDrawer} className="flex items-center gap-3">
                                <Image
                                    src="/logo.webp"
                                    alt="InZidium"
                                    width={36}
                                    height={36}
                                    className="object-contain"
                                    style={{ filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.35))' }}
                                />
                                <span
                                    className="text-2xl font-black tracking-tighter text-transparent bg-clip-text font-[family-name:var(--font-orbitron)]"
                                    style={{
                                        backgroundImage: 'linear-gradient(90deg, #e879f9, #a855f7, #22d3ee)',
                                    }}
                                >
                                    ADMIN
                                </span>
                            </Link>
                            <button
                                onClick={closeDrawer}
                                aria-label="Cerrar menú"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 pb-4">
                            {adminNavSections.map((section, idx) => (
                                <div key={section.label} className={idx === 0 ? '' : 'mt-6'}>
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-600">{section.label}</span>
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    </div>
                                    <nav className="mt-3 space-y-1">
                                        {section.items.map((item) => (
                                            <MobileNavItem
                                                key={item.href}
                                                item={item}
                                                pathname={pathname}
                                                onNavigate={closeDrawer}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-white/5 p-6">
                            <button
                                onClick={handleLogoutClick}
                                className="group flex w-full items-center gap-4 rounded-2xl border border-transparent px-5 py-4 text-gray-400 transition hover:border-red-500/10 hover:bg-red-500/5 hover:text-red-400"
                            >
                                <div className="rounded-xl bg-white/5 p-2 transition group-hover:bg-red-500/10">
                                    <LogOut className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-bold tracking-wide">Cerrar Sesión</span>
                            </button>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>

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
                                    className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#060214]/95 p-8 shadow-2xl"
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
                                                className="rounded-xl border border-white/10 bg-white/5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 transition hover:bg-white/10 hover:text-white"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={() => signOut({ callbackUrl: '/' })}
                                                className="rounded-xl bg-red-600 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
                                            >
                                                Confirmar
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </>
    );
}

function MobileNavItem({
    item,
    pathname,
    onNavigate,
}: {
    item: AdminNavItem;
    pathname: string;
    onNavigate: () => void;
}) {
    const active = item.match(pathname);
    return (
        <>
            <MobileLink
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={active}
                onNavigate={onNavigate}
            />
            <AnimatePresence initial={false}>
                {item.children && active && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="mt-1 space-y-1 pl-4">
                            {item.children.map((child) => (
                                <MobileSubLink
                                    key={child.href}
                                    icon={child.icon}
                                    label={child.label}
                                    href={child.href}
                                    active={child.match(pathname)}
                                    onNavigate={onNavigate}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

type MobileLinkProps = Pick<AdminNavLeaf, 'icon' | 'label' | 'href'> & {
    active: boolean;
    onNavigate: () => void;
};

function MobileLink({ icon: Icon, label, href, active, onNavigate }: MobileLinkProps) {
    return (
        <Link
            href={href}
            onClick={onNavigate}
            className={`relative flex items-center gap-4 overflow-hidden rounded-2xl px-5 py-3.5 transition ${
                active
                    ? 'bg-gradient-to-r from-[#22d3ee]/10 via-[#a855f7]/5 to-transparent text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
        >
            {active && (
                <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-[#22d3ee] to-[#a855f7]" />
            )}
            <Icon
                className="h-5 w-5"
                style={{
                    color: active ? '#22d3ee' : undefined,
                    filter: active ? 'drop-shadow(0 0 6px rgba(34,211,238,0.5))' : undefined,
                }}
            />
            <span className="text-sm font-bold tracking-wide">{label}</span>
        </Link>
    );
}

function MobileSubLink({ icon: Icon, label, href, active, onNavigate }: MobileLinkProps) {
    return (
        <Link
            href={href}
            onClick={onNavigate}
            className={`relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-2.5 transition ${
                active
                    ? 'bg-white/[0.04] text-white'
                    : 'text-gray-500 hover:bg-white/[0.02] hover:text-gray-300'
            }`}
        >
            {active && (
                <div className="absolute inset-y-1.5 left-0 w-[2px] rounded-full bg-gradient-to-b from-[#22d3ee] to-[#a855f7]" />
            )}
            <Icon
                className="h-4 w-4"
                style={{ color: active ? '#22d3ee' : undefined }}
            />
            <span className="text-xs font-semibold tracking-wide">{label}</span>
        </Link>
    );
}
