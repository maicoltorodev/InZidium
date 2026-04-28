import {
    Bot,
    BotOff,
    UserCheck,
    Send,
    FileCode2,
    ShoppingBag,
    Trash2,
    RefreshCw,
    type LucideIcon,
} from "lucide-react";
import type { Event, EventType } from "@/lib/crm/types";

type Descriptor = {
    icon: LucideIcon;
    color: string;
    label: string;
    /** Devuelve un texto legible del evento, p.ej. "envió un mensaje · 'Hola...'" */
    describe: (e: Event) => string;
};

export const EVENT_DESCRIPTORS: Record<EventType, Descriptor> = {
    "message.human_sent": {
        icon: Send,
        color: "#ffffff",
        label: "Mensaje humano",
        describe: (e) => {
            const t = (e.payload as any)?.wa_type ?? "text";
            const preview = (e.payload as any)?.preview as string | undefined;
            const caption = (e.payload as any)?.caption as string | undefined;
            const filename = (e.payload as any)?.filename as string | undefined;
            if (t === "text" && preview) return `escribió: "${truncate(preview, 80)}"`;
            if (t !== "text") {
                const parts = [`envió ${typeLabel(t)}`];
                if (filename) parts.push(filename);
                if (caption) parts.push(`con caption "${truncate(caption, 40)}"`);
                return parts.join(" · ");
            }
            return "envió un mensaje";
        },
    },
    "message.template_sent": {
        icon: FileCode2,
        color: "#FFD700",
        label: "Plantilla",
        describe: (e) => {
            const name = (e.payload as any)?.template_name ?? "(sin nombre)";
            const lang = (e.payload as any)?.language ?? "";
            return `envió la plantilla ${name}${lang ? ` (${lang})` : ""}`;
        },
    },
    "ai.toggled": {
        icon: Bot,
        color: "#FFD700",
        label: "IA",
        describe: (e) => {
            const enabled = (e.payload as any)?.enabled;
            return enabled ? "activó la IA" : "pausó la IA";
        },
    },
    "conversation.assigned": {
        icon: UserCheck,
        color: "#a78bfa",
        label: "Asignación",
        describe: (e) => {
            const assignee = (e.payload as any)?.assignee ?? "(nadie)";
            return `tomó la conversación · asignada a ${assignee}`;
        },
    },
    "conversation.status_changed": {
        icon: RefreshCw,
        color: "#34d399",
        label: "Estado conv.",
        describe: (e) => {
            const status = (e.payload as any)?.status ?? "?";
            return `cambió el estado de la conversación a ${status}`;
        },
    },
    "order.created": {
        icon: ShoppingBag,
        color: "#FFD700",
        label: "Pedido creado",
        describe: (e) => {
            const items = (e.payload as any)?.items_count ?? "?";
            const total = (e.payload as any)?.total;
            const totalText = total ? `· $${Number(total).toLocaleString("es-CO")}` : "";
            return `creó pedido · ${items} ítems ${totalText}`;
        },
    },
    "order.status_changed": {
        icon: RefreshCw,
        color: "#34d399",
        label: "Pedido",
        describe: (e) => {
            const status = (e.payload as any)?.status ?? "?";
            return `cambió el estado del pedido a ${status}`;
        },
    },
    "order.deleted": {
        icon: Trash2,
        color: "#f87171",
        label: "Pedido borrado",
        describe: () => "eliminó un pedido",
    },
    "contact.note_updated": {
        icon: BotOff,
        color: "#fbbf24",
        label: "Nota",
        describe: () => "actualizó las notas del contacto",
    },
};

function typeLabel(t: string): string {
    if (t === "image") return "una imagen";
    if (t === "video") return "un video";
    if (t === "audio") return "un audio";
    if (t === "document") return "un documento";
    if (t === "sticker") return "un sticker";
    if (t === "template") return "una plantilla";
    return `un ${t}`;
}

function truncate(s: string, n: number): string {
    if (s.length <= n) return s;
    return s.slice(0, n - 1) + "…";
}
