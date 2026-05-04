import { createClient } from "@supabase/supabase-js";

// Cliente con service role del CRM de InZidium, schema `public`.
// Mismo proyecto Supabase que los admins (STUDIO_SUPABASE_*) — InZidium Platform.
export const supabaseCrmAdmin = createClient(
    process.env.STUDIO_SUPABASE_URL!,
    process.env.STUDIO_SUPABASE_SERVICE_ROLE_KEY!,
);
