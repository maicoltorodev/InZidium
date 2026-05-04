import { createClient } from "@supabase/supabase-js";

// Cliente raíz con anon key (browser) para la DB del estudio actual.
// Uso típico: realtime sobre la tabla `administradores` o features
// CRM-propias del estudio.
//
// Para realtime de la Alianza (proyectos web), usar
// `allianceSupabaseClient` en `@/lib/alliance/supabase/client`.
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_STUDIO_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_STUDIO_SUPABASE_ANON_KEY!,
);
