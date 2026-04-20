"use server";

import { revalidatePath } from "next/cache";

/**
 * Helpers de revalidación con intent explícito.
 *
 * **Importante:** `revalidatePath` es invalidación de cache de Next.js para la
 * PRÓXIMA request que pida esa ruta. **No** notifica a clientes ya conectados
 * — eso lo hace el realtime de Supabase (ver `hooks/use-realtime-refresh.ts`).
 *
 * O sea: estos helpers sirven para que un usuario que abre la app minutos
 * después vea estado fresco de entrada, no para sync en vivo.
 *
 * Si agregás una server action que modifica proyectos/chat/archivos/clientes,
 * llamá uno de estos al final según a quién afecta.
 */

const CLIENT_PORTAL_PATHS = [
  "/clientes/proyectos",
  "/mobile/clientes/proyectos",
  "/tablet/clientes/proyectos",
] as const;

/** Un cambio afecta tanto al admin como al portal del cliente (caso más común). */
export async function revalidateProyecto() {
  revalidatePath("/admin");
  for (const p of CLIENT_PORTAL_PATHS) revalidatePath(p);
}

/** Sólo afecta pantallas de admin (ej: crear/borrar cliente, admin del estudio). */
export async function revalidateAdmin() {
  revalidatePath("/admin");
}

/** Sólo afecta el portal del cliente (raro — casi nunca aplica solo). */
export async function revalidateCliente() {
  for (const p of CLIENT_PORTAL_PATHS) revalidatePath(p);
}
