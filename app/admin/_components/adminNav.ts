import {
    MessageSquare,
    ShoppingBag,
    Package,
    Bot,
    Globe,
    LayoutDashboard,
    Users,
    FolderKanban,
    ShieldCheck,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export type AdminNavLeaf = {
    icon: Icon;
    label: string;
    href: string;
    match: (pathname: string) => boolean;
};

export type AdminNavItem = AdminNavLeaf & {
    children?: AdminNavLeaf[];
};

export type AdminNavSection = {
    label: string;
    items: AdminNavItem[];
};

const webs: AdminNavLeaf[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard', match: (p) => p.startsWith('/admin/dashboard') },
    { icon: Users, label: 'Clientes', href: '/admin/clientes', match: (p) => p.startsWith('/admin/clientes') },
    { icon: FolderKanban, label: 'Proyectos', href: '/admin/proyectos', match: (p) => p.startsWith('/admin/proyectos') },
];

export const adminNavSections: AdminNavSection[] = [
    {
        label: 'Studio',
        items: [
            { icon: MessageSquare, label: 'Chats', href: '/admin/chats', match: (p) => p.startsWith('/admin/chats') },
            { icon: ShoppingBag, label: 'Pedidos', href: '/admin/pedidos', match: (p) => p.startsWith('/admin/pedidos') },
        ],
    },
    {
        label: 'Settings',
        items: [
            { icon: Package, label: 'Servicios', href: '/admin/servicios', match: (p) => p.startsWith('/admin/servicios') },
            { icon: Bot, label: 'Config IA', href: '/admin/config-ia', match: (p) => p.startsWith('/admin/config-ia') },
            { icon: ShieldCheck, label: 'Administradores', href: '/admin/administradores', match: (p) => p.startsWith('/admin/administradores') },
        ],
    },
    {
        label: 'Alliance',
        items: [
            {
                icon: Globe,
                label: 'Webs',
                href: '/admin/dashboard',
                match: (p) => webs.some((w) => w.match(p)),
                children: webs,
            },
        ],
    },
];

export const adminNavItems: AdminNavLeaf[] = adminNavSections.flatMap((s) =>
    s.items.flatMap((i) => (i.children ? [i, ...i.children] : [i])),
);
