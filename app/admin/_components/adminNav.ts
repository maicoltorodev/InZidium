import { LayoutDashboard, Users, FolderKanban, ShieldCheck } from 'lucide-react';

export type AdminNavItem = {
    icon: typeof LayoutDashboard;
    label: string;
    href: string;
    match: (pathname: string) => boolean;
};

export const adminNavItems: AdminNavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard', match: (p) => p.startsWith('/admin/dashboard') },
    { icon: Users, label: 'Clientes', href: '/admin/clientes', match: (p) => p.startsWith('/admin/clientes') },
    { icon: FolderKanban, label: 'Proyectos', href: '/admin/proyectos', match: (p) => p.startsWith('/admin/proyectos') },
    { icon: ShieldCheck, label: 'Administradores', href: '/admin/administradores', match: (p) => p.startsWith('/admin/administradores') },
];
