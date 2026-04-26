import { createClient } from "@supabase/supabase-js";

// Cliente con anon key del proyecto `bots-crm`, schema `inzidium_crm` — browser.
// Uso típico: suscripciones Realtime a messages/conversations/contacts.
export const supabaseCrmClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_CRM_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_CRM_ANON_KEY!,
    { db: { schema: "inzidium_crm" } }
);
