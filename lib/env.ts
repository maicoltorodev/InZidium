export const authSecret =
  process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

export const supabaseUrl = process.env.SUPABASE_URL!;
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const estudioId = process.env.ESTUDIO_ID!;

export function resolveDataProvider(): "drizzle" | "mock" {
  const explicitProvider = process.env.DB_PROVIDER;
  if (explicitProvider === "drizzle" || explicitProvider === "mock") {
    return explicitProvider;
  }
  return process.env.DATABASE_URL ? "drizzle" : "mock";
}
