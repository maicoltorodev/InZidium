import { createClient } from "@supabase/supabase-js";

// Cliente con service role — solo usar en server (actions, API routes)
export const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);
