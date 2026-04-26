// Tipos de entidades del mundo InZidium CRM+IA (Supabase `bots-crm`, schema `inzidium_crm`).
// Separados del mundo alianza para que nunca se mezclen.
// InZidium NO usa servicios/AIConfig — solo chats. Tipos relacionados eliminados.

export type Contact = {
    id: string;
    phone: string;
    name: string | null;
    tags: string[];
    ai_enabled: boolean;
    preferences: Record<string, any>;
    notes: string | null;
    created_at: string;
    updated_at: string;
};

export type Conversation = {
    id: string;
    contact_id: string;
    status: "open" | "closed" | "archived";
    assigned_to: string | null;
    last_message_at: string | null;
    created_at: string;
    updated_at: string;
};

export type ConversationWithContact = Conversation & {
    contact: Contact;
    last_message_preview: string | null;
    last_message_role: "user" | "ai" | "human" | null;
};

export type MessageRole = "user" | "ai" | "human";

export type Message = {
    id: string;
    conversation_id: string;
    role: MessageRole;
    content: string | null;
    media_url: string | null;
    meta_wa_id: string | null;
    sent_at: string;
};

export type OrderStatus = "new" | "in_production" | "delivered" | "paid" | "cancelled";

export type OrderItem = {
    name: string;
    quantity?: number;
    price?: number;
    notes?: string;
};

export type Order = {
    id: string;
    contact_id: string;
    items: OrderItem[];
    status: OrderStatus;
    total: number | null;
    notes: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
};

export type OrderWithContact = Order & {
    contact: Pick<Contact, "id" | "name" | "phone">;
};

export type ActionResult<T = unknown> =
    | { success: true; data?: T }
    | { error: string };
