import { IDataProvider } from "../interface";
import { db } from "../../db";
import { clientes, proyectos, administradores, chat, archivos } from "../../db/schema";
import { eq, inArray, desc, sql } from "drizzle-orm";
import { Cliente, Proyecto, AdminUser, ChatMessage, Archivo } from "../types";
import { authSecret, estudioId, supabaseUrl } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/server";

// Devuelve los IDs de todos los clientes de este estudio.
// Usado para filtrar proyectos (que no tienen estudio_id directo).
async function getClienteIds(): Promise<string[]> {
  const rows = await db
    .select({ id: clientes.id })
    .from(clientes)
    .where(eq(clientes.estudioId, estudioId));
  return rows.map((r) => r.id);
}

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
          where: eq(clientes.id, id),
        })) || null
      );
    },
    getByCedula: async (cedula) => {
      return (
        (await db.query.clientes.findFirst({
          where: (c, { and, eq }) =>
            and(eq(c.estudioId, estudioId), eq(c.cedula, cedula)),
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
        await db.update(clientes).set(data).where(eq(clientes.id, id));
        return { success: true };
      } catch (e) {
        return { success: false, error: "Error al actualizar cliente" };
      }
    },
    delete: async (id) => {
      try {
        await db.delete(clientes).where(eq(clientes.id, id));
        return { success: true };
      } catch (e) {
        return { success: false, error: "Error al eliminar cliente" };
      }
    },
  },

  proyectos: {
    getAll: async () => {
      const clienteIds = await getClienteIds();
      if (clienteIds.length === 0) return [];
      return (await db.query.proyectos.findMany({
        where: inArray(proyectos.clienteId, clienteIds),
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
          where: eq(proyectos.id, id),
          with: { cliente: true, archivos: true, chat: true },
        })) as any) || null
      );
    },
    getByClienteId: async (clienteId) => {
      return (await db.query.proyectos.findMany({
        where: eq(proyectos.clienteId, clienteId),
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
        await db.update(proyectos).set(data).where(eq(proyectos.id, id));
        return { success: true };
      } catch (e) {
        return { success: false, error: "Error al actualizar proyecto" };
      }
    },
    delete: async (id) => {
      try {
        await db.delete(proyectos).where(eq(proyectos.id, id));
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
          where: eq(administradores.id, id),
        })) || null
      );
    },
    updateSessionId: async (id, sessionId) => {
      await db
        .update(administradores)
        .set({ activeSessionId: sessionId })
        .where(eq(administradores.id, id));
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
        await db.delete(administradores).where(eq(administradores.id, id));
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
        where: eq(chat.proyectoId, proyectoId),
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
        where: eq(chat.proyectoId, proyectoId),
        orderBy: (c, { asc }) => [asc(c.createdAt)],
      });
      if (all.length <= keepCount) return { deletedImageUrls: [] };
      const toDelete = all.slice(0, all.length - keepCount);
      const ids = toDelete.map((m) => m.id);
      const imageUrls = toDelete.flatMap((m) => (m.imagenes as string[]) || []);
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
          .where(eq(archivos.id, id))
          .limit(1);
        await db.delete(archivos).where(eq(archivos.id, id));
        return { success: true, storagePath: archivo?.storagePath ?? null };
      } catch (e) {
        return { success: false, error: "Error al eliminar archivo" };
      }
    },
    getAll: async () => {
      const data = await db.select().from(archivos);
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
