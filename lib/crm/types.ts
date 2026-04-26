// Tipos de entidades del mundo InZidium CRM+IA (Supabase `bots-crm`, schema `inzidium_crm`).
// Separados del mundo alianza para que nunca se mezclen.

export type ServiceVariant = {
    id: string;
    service_id: string;
    name: string;
    price: number | null;
    description: string | null;
    sort_order: number;
    active: boolean;
    created_at: string;
};

export type Servicio = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    details: string | null;
    seo_title: string | null;
    seo_description: string | null;
    price: number | null;
    category: string | null;
    service_type: 'normal' | 'general';
    active: boolean;
    image_url: string | null;
    sort_order: number;
    created_at: string;
    updated_at: string;
    service_variants?: ServiceVariant[];
    service_faqs?: ServiceFaq[];
};

export type ServiceFaq = {
    id: string;
    service_id: string;
    question: string;
    answer: string;
    sort_order: number;
    active: boolean;
    created_at: string;
    updated_at: string;
};

export type ServiceSlugRedirect = {
    id: string;
    old_slug: string;
    service_id: string;
    created_at: string;
};

export type ServicioInput = {
    name: string;
    description?: string | null;
    price?: number | null;
    category?: string | null;
    service_type?: 'normal' | 'general';
    active?: boolean;
};

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

export type AIConfig = {
    id: number;
    prompt: string;
    persona: string;
    horarios: string;
    updated_by: string | null;
    updated_at: string;
};

export type AIConfigInput = {
    prompt: string;
    persona: string;
    horarios: string;
};

export type ActionResult<T = unknown> =
    | { success: true; data?: T }
    | { error: string };
