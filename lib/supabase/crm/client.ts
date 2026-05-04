import { createClient } from "@supabase/supabase-js";

// Cliente con anon key del CRM de InZidium, schema `public` — browser.
// Uso típico: suscripciones Realtime a messages/conversations/contacts.
export const supabaseCrmClient = createClient(
    process.env.NEXT_PUBLIC_STUDIO_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_STUDIO_SUPABASE_ANON_KEY!,
);
