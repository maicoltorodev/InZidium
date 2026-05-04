export const authSecret =
  process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

// DB del estudio actual — donde viven admins (NextAuth), CRM propio del
// estudio y cualquier dato que NO sea de proyectos web. Cliente raíz
// `supabaseAdmin/Client` en `lib/supabase/{server,client}.ts`.
export const studioSupabaseUrl = process.env.STUDIO_SUPABASE_URL!;
export const studioSupabaseServiceRoleKey = process.env.STUDIO_SUPABASE_SERVICE_ROLE_KEY!;

// Alianza Estudios — DB multitenancy del módulo Webs (clientes/proyectos/
// archivos/chat de proyectos web del servicio Alliance). Cliente
// `allianceSupabaseAdmin/Client` en `lib/alliance/supabase/{server,client}.ts`.
export const allianceSupabaseUrl = process.env.ALLIANCE_SUPABASE_URL!;
export const allianceSupabaseServiceRoleKey =
  process.env.ALLIANCE_SUPABASE_SERVICE_ROLE_KEY!;

export const estudioId = process.env.ESTUDIO_ID!;

// Expuesto al cliente para filtrar suscripciones Realtime por tenant.
// Debe coincidir con ESTUDIO_ID; se define separado para respetar la convención
// NEXT_PUBLIC_ de Next.js (sólo variables con ese prefijo se bundlean al client).
export const publicEstudioId = process.env.NEXT_PUBLIC_ESTUDIO_ID!;

// Marca el deploy actual como el "dueño de la alianza" (InZidium madre).
// True solo en el proyecto InZidium — habilita aprobar comprobantes de cualquier
// estudio + dashboard cross-estudio. False/ausente en Nexus, Alkubo y futuros.
// Server-side y client-side se setean en pareja (deben coincidir).
export const isAllianceOwner = process.env.IS_ALLIANCE_OWNER === "true";
export const publicIsAllianceOwner =
  process.env.NEXT_PUBLIC_IS_ALLIANCE_OWNER === "true";

export function resolveDataProvider(): "drizzle" | "mock" {
  const explicitProvider = process.env.DB_PROVIDER;
  if (explicitProvider === "drizzle" || explicitProvider === "mock") {
    return explicitProvider;
  }
  return process.env.ALLIANCE_DATABASE_URL ? "drizzle" : "mock";
}
