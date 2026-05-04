import { createClient } from "@supabase/supabase-js";

// Cliente raíz con service role para la DB del estudio actual.
// Es el cliente "default" del estudio — donde viven los administradores
// (auth NextAuth) y cualquier feature CRM-propia del estudio.
//
// Para acceder a la DB de la Alianza (proyectos web multitenancy), usar
// `allianceSupabaseAdmin` en `@/lib/alliance/supabase/server`.
export const supabaseAdmin = createClient(
  process.env.STUDIO_SUPABASE_URL!,
  process.env.STUDIO_SUPABASE_SERVICE_ROLE_KEY!,
);
