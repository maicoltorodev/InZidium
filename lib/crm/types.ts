// Tipos de entidades del mundo Nexus CRM+IA (Supabase `nexus-crm`).
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

export type ServiceHighlight = {
    icon: string;       // lucide icon name (ej. 'Palette', 'Sparkles', 'Truck')
    title: string;
    body: string;
};

export type ServiceProcessStep = {
    number: string;     // '01', '02', etc.
    title: string;
    body: string;
};

export type ServiceStat = {
    value: string;      // '24-72h', '+100', etc.
    label: string;
};

export type ServiceGalleryImage = {
    id: string;
    service_id: string;
    image_url: string;
    alt: string | null;
    sort_order: number;
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
    highlights: ServiceHighlight[];
    process: ServiceProcessStep[];
    stats: ServiceStat[];
    service_variants?: ServiceVariant[];
    service_faqs?: ServiceFaq[];
    service_gallery?: ServiceGalleryImage[];
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
    unread_count: number;
    created_at: string;
    updated_at: string;
};

export type ConversationWithContact = Conversation & {
    contact: Contact;
    last_message_preview: string | null;
    last_message_role: "user" | "ai" | "human" | null;
};

export type MessageRole = "user" | "ai" | "human";

export type WaMessageType =
    | "text"
    | "image"
    | "audio"
    | "video"
    | "document"
    | "sticker"
    | "location"
    | "contacts"
    | "interactive"
    | "reaction"
    | "system"
    | "template"
    | "unknown";

export type MessageStatus =
    | "received"
    | "sent"
    | "delivered"
    | "read"
    | "failed"
    | "pending";

export type MediaType =
    | "image"
    | "audio"
    | "video"
    | "document"
    | "sticker"
    | "voice";

export type MessageReaction = {
    emoji: string;
    /**
     * Lado de la reacción:
     *  - phone E.164 del cliente cuando reaccionó él
     *  - "business" cuando reaccionó cualquier admin o la IA del CRM
     */
    from: string;
    /** Username del admin que disparó la reacción (solo cuando from='business'). */
    by?: string;
    at: string;
};

export type MessageMetadata = {
    media_status?: "downloading" | "ready" | "failed";
    media_error?: string;
    original_filename?: string;
    voice?: boolean;
    location?: { latitude: number; longitude: number; name?: string; address?: string };
    contacts?: Array<Record<string, unknown>>;
    interactive?: { kind: "button_reply" | "list_reply"; id: string; title: string };
    ai_summary?: string;
    silent?: boolean;
    [key: string]: unknown;
};

export type ContactMedia = {
    id: string;
    contact_id: string;
    phone: string;
    wa_message_id: string | null;
    wa_media_id: string | null;
    media_type: MediaType;
    mime: string;
    storage_path: string;
    size_bytes: number | null;
    original_filename: string | null;
    width: number | null;
    height: number | null;
    duration_seconds: number | null;
    caption: string | null;
    created_at: string;
    /** Signed URL inyectado por el server action (no es columna). */
    signed_url?: string | null;
};

export type Message = {
    id: string;
    conversation_id: string;
    role: MessageRole;
    content: string | null;
    media_url: string | null; // legacy
    meta_wa_id: string | null; // legacy
    wa_message_id: string | null;
    wa_type: WaMessageType;
    status: MessageStatus;
    media_id: string | null;
    reactions: MessageReaction[];
    reply_to_wa_id: string | null;
    metadata: MessageMetadata;
    sent_at: string;
    seq: number;
    /** Username del admin que envió este mensaje (solo aplica para role='human'). */
    created_by: string | null;
    /** Adjuntado en el server action — datos del media + signed URL. */
    media?: ContactMedia | null;
    /** Adjuntado en el server action — preview del mensaje al que responde. */
    reply_preview?: { role: MessageRole; content: string | null; wa_type: WaMessageType } | null;
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

export type EventType =
    | "message.human_sent"
    | "message.template_sent"
    | "ai.toggled"
    | "conversation.assigned"
    | "conversation.status_changed"
    | "order.created"
    | "order.status_changed"
    | "order.deleted"
    | "contact.note_updated";

export type Event = {
    id: string;
    type: EventType;
    actor: string;
    contact_id: string | null;
    conversation_id: string | null;
    target_id: string | null;
    payload: Record<string, unknown>;
    created_at: string;
};

export type EventWithContact = Event & {
    contact?: Pick<Contact, "id" | "name" | "phone"> | null;
};

export type ActionResult<T = unknown> =
    | { success: true; data?: T }
    | { error: string };
