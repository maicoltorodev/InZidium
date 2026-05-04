import { createClient } from "@supabase/supabase-js";

// Cliente con service role para la DB de la Alianza (multitenancy).
// Apunta a `clientes`, `proyectos`, `archivos`, `chat`, `pagos` del módulo
// Webs — datos compartidos entre todos los estudios que enchufan el módulo.
//
// El módulo Alliance es opt-in: solo se accede cuando el admin del estudio
// entra al tab "Webs". Para datos del estudio mismo (admins, CRM propio),
// usar `supabaseAdmin` en `@/lib/supabase/server`.
export const allianceSupabaseAdmin = createClient(
  process.env.ALLIANCE_SUPABASE_URL!,
  process.env.ALLIANCE_SUPABASE_SERVICE_ROLE_KEY!,
);
