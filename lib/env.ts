export const authSecret =
  process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

export const supabaseUrl = process.env.SUPABASE_URL!;
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
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
  return process.env.DATABASE_URL ? "drizzle" : "mock";
}
