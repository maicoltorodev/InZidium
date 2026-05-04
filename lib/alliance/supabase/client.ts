import { createClient } from "@supabase/supabase-js";

// Cliente con anon key (browser) para realtime sobre la DB de la Alianza.
// Usado para suscripciones a `clientes`, `proyectos`, `archivos`, `chat`
// del módulo Webs (filtradas por `estudio_id` del estudio actual).
export const allianceSupabaseClient = createClient(
  process.env.NEXT_PUBLIC_ALLIANCE_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_ALLIANCE_SUPABASE_ANON_KEY!,
);
