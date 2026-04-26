import { createClient } from "@supabase/supabase-js";

// Cliente con service role del proyecto `bots-crm`, schema `inzidium_crm` — solo server.
// Mundo separado del Supabase de alianza; nunca mezclar tablas entre clients.
export const supabaseCrmAdmin = createClient(
    process.env.SUPABASE_CRM_URL!,
    process.env.SUPABASE_CRM_SERVICE_ROLE_KEY!,
    { db: { schema: "inzidium_crm" } }
);
