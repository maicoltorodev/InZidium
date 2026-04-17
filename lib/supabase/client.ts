import { createClient } from "@supabase/supabase-js";

// Cliente con anon key — seguro para el browser, usado para Realtime
export const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
