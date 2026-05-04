import { IDataProvider } from "./interface";
import { DrizzleProvider } from "./providers/drizzle";
import { MockProvider } from "./providers/mock";
import { resolveDataProvider } from "@/lib/env";

/**
 * 🛠️ DATA SERVICE: El selector de fuente de datos.
 * Decide qué proveedor usar basándose en la variable de entorno DB_PROVIDER.
 * Esto permite cambiar de Neon (.env) a modo prueba (Mock) instantáneamente.
 */

const providerKey = resolveDataProvider();

export const DataService: IDataProvider =
  providerKey === "drizzle" ? DrizzleProvider : MockProvider;

// Exportación amigable para usar en componentes y acciones
export const { clientes, proyectos, chat, archivos, getSystemStatus } =
  DataService;
