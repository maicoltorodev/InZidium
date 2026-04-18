import { IDataProvider } from "../interface";
import { db } from "../../db";
import { clientes, proyectos, administradores, chat, archivos } from "../../db/schema";
import { eq, and, desc, inArray, sql } from "drizzle-orm";
import { Cliente, Proyecto, AdminUser, ChatMessage, Archivo } from "../types";
import { authSecret, estudioId, supabaseUrl } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Multitenancy: toda operación scopea por `estudioId` (aislamiento a nivel código).
 * Cada WHERE combina `id` + `estudioId` para bloquear acceso cross-tenant por UUID
 * conocido. Cada INSERT setea `estudioId` implícito desde el env var.
 */

export const DrizzleProvider: IDataProvider = {
  clientes: {
    getAll: async () => {
      return await db
        .select()
        .from(clientes)
        .where(eq(clientes.estudioId, estudioId))
        .orderBy(clientes.createdAt);
    },
    getById: async (id) => {
      return (
        (await db.query.clientes.findFirst({
          where: and(eq(clientes.id, id), eq(clientes.estudioId, estudioId)),
        })) || null
      );
    },
    getByCedula: async (cedula) => {
      return (
        (await db.query.clientes.findFirst({
          where: and(
            eq(clientes.estudioId, estudioId),
            eq(clientes.cedula, cedula),
          ),
        })) || null
      );
    },
    create: async (data) => {
      try {
        await db.insert(clientes).values({ ...data, estudioId });
        return { success: true };
      } catch (e) {
        return { success: false, error: "Error al crear cliente" };
      }
    },
    update: async (id, data) => {
      try {
        await db
          .update(clientes)
          .set(data)
          .where(and(eq(clientes.id, id), eq(clientes.estudioId, estudioId)));
        return { success: true };
      } catch (e) {
        return { success: false, error: "Error al actualizar cliente" };
      }
    },
    delete: async (id) => {
      try {
        await db
          .delete(clientes)
          .where(and(eq(clientes.id, id), eq(clientes.estudioId, estudioId)));
        return { success: true };
      } catch (e) {
        return { success: false, error: "Error al eliminar cliente" };
      }
    },
  },

  proyectos: {
    getAll: async () => {
      return (await db.query.proyectos.findMany({
        where: eq(proyectos.estudioId, estudioId),
        with: {
          cliente: true,
          archivos: true,
          chat: { orderBy: (c, { asc }) => [asc(c.createdAt)] },
        },
        orderBy: (p, { desc }) => [desc(p.createdAt)],
      })) as any;
    },
    getById: async (id) => {
      return (
        ((await db.query.proyectos.findFirst({
          where: and(eq(proyectos.id, id), eq(proyectos.estudioId, estudioId)),
          with: { cliente: true, archivos: true, chat: true },
        })) as any) || null
      );
    },
    getByClienteId: async (clienteId) => {
      return (await db.query.proyectos.findMany({
        where: and(
          eq(proyectos.clienteId, clienteId),
          eq(proyectos.estudioId, estudioId),
        ),
        with: {
          cliente: true,
          archivos: true,
          chat: { orderBy: (c, { asc }) => [asc(c.createdAt)] },
        },
      })) as any;
    },
    create: async (data: any) => {
      try {
        await db.insert(proyectos).values({ ...data, estudioId });
        return { success: true };
      } catch (e) {
        return { success: false, error: "Error al crear proyecto" };
      }
    },
    update: async (id, data: any) => {
      try {
        await db
          .update(proyectos)
          .set(data)
          .where(and(eq(proyectos.id, id), eq(proyectos.estudioId, estudioId)));
        return { success: true };
      } catch (e) {
        return { success: false, error: "Error al actualizar proyecto" };
      }
    },
    delete: async (id) => {
      try {
        await db
          .delete(proyectos)
          .where(and(eq(proyectos.id, id), eq(proyectos.estudioId, estudioId)));
        return { success: true };
      } catch (e) {
        return { success: false, error: "Error al eliminar proyecto" };
      }
    },
  },

  auth: {
    getUserByUsername: async (username) => {
      return (
        (await db.query.administradores.findFirst({
          where: (a, { and, eq }) =>
            and(eq(a.estudioId, estudioId), eq(a.username, username)),
        })) || null
      );
    },
    getUserById: async (id) => {
      return (
        (await db.query.administradores.findFirst({
          where: and(
            eq(administradores.id, id),
            eq(administradores.estudioId, estudioId),
          ),
        })) || null
      );
    },
    updateSessionId: async (id, sessionId) => {
      await db
        .update(administradores)
        .set({ activeSessionId: sessionId })
        .where(
          and(
            eq(administradores.id, id),
            eq(administradores.estudioId, estudioId),
          ),
        );
    },
    getAllAdmins: async () => {
      return await db
        .select()
        .from(administradores)
        .where(eq(administradores.estudioId, estudioId))
        .orderBy(desc(administradores.createdAt));
    },
    createAdmin: async (data: any) => {
      try {
        await db.insert(administradores).values({ ...data, estudioId });
        return { success: true };
      } catch (e) {
        return { success: false, error: "Error al crear admin" };
      }
    },
    deleteAdmin: async (id) => {
      try {
        await db
          .delete(administradores)
          .where(
            and(
              eq(administradores.id, id),
              eq(administradores.estudioId, estudioId),
            ),
          );
        return { success: true };
      } catch (e) {
        return { success: false, error: "Error al eliminar admin" };
      }
    },
  },

  chat: {
    addMessage: async (data: any) => {
      try {
        await db.insert(chat).values({ ...data, estudioId });
        return { success: true };
      } catch (e) {
        return { success: false, error: "Error al guardar mensaje" };
      }
    },
    getMessagesByProyectoId: async (proyectoId) => {
      const data = await db.query.chat.findMany({
        where: and(
          eq(chat.proyectoId, proyectoId),
          eq(chat.estudioId, estudioId),
        ),
        orderBy: (c, { asc }) => [asc(c.createdAt)],
      });
      return data.map((m) => ({
        ...m,
        imagenes: (m.imagenes as string[]) || [],
        autor: m.autor as "admin" | "cliente",
      }));
    },
    pruneMessages: async (proyectoId, keepCount) => {
      const all = await db.query.chat.findMany({
        where: and(
          eq(chat.proyectoId, proyectoId),
          eq(chat.estudioId, estudioId),
        ),
        orderBy: (c, { asc }) => [asc(c.createdAt)],
      });
      if (all.length <= keepCount) return { deletedImageUrls: [] };
      const toDelete = all.slice(0, all.length - keepCount);
      const ids = toDelete.map((m) => m.id);
      const imageUrls = toDelete.flatMap((m) => (m.imagenes as string[]) || []);
      // inArray por id es seguro: los ids vienen del query ya filtrado por estudio.
      await db.delete(chat).where(inArray(chat.id, ids));
      return { deletedImageUrls: imageUrls };
    },
  },

  archivos: {
    add: async (data: any) => {
      try {
        await db.insert(archivos).values({ ...data, estudioId });
        return { success: true };
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return { success: false, error: message };
      }
    },
    delete: async (id) => {
      try {
        const [archivo] = await db
          .select({ storagePath: archivos.storagePath })
          .from(archivos)
          .where(and(eq(archivos.id, id), eq(archivos.estudioId, estudioId)))
          .limit(1);
        if (!archivo) {
          return { success: false, error: "Archivo no encontrado" };
        }
        await db
          .delete(archivos)
          .where(and(eq(archivos.id, id), eq(archivos.estudioId, estudioId)));
        return { success: true, storagePath: archivo.storagePath ?? null };
      } catch (e) {
        return { success: false, error: "Error al eliminar archivo" };
      }
    },
    getAll: async () => {
      const data = await db
        .select()
        .from(archivos)
        .where(eq(archivos.estudioId, estudioId));
      return data.map((a) => ({
        ...a,
        subidoPor: a.subidoPor as "admin" | "cliente",
        storagePath: a.storagePath ?? null,
      }));
    },
  },

  getSystemStatus: async () => {
    let database = "error";
    let blob = "error";
    const auth = authSecret ? "ok" : "missing secret";

    try {
      await db.execute(sql`SELECT 1`);
      database = "ok";
    } catch (e) {
      database = "error";
    }

    try {
      const { data, error } = await supabaseAdmin.storage.getBucket("archivos");
      blob = error ? "error" : "ok";
    } catch (e) {
      blob = "error";
    }

    return { database, blob, auth };
  },
};
