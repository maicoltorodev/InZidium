"use server";

import {
  clientes,
  proyectos,
  archivos,
  auth,
  chat,
  getSystemStatus as dataGetStatus,
} from "./data/service";
import { supabaseAdmin } from "@/lib/supabase/server";
import { estudioId } from "@/lib/env";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { db } from "./db";
import { clientes as clientesTable } from "./db/schema";
import { eq } from "drizzle-orm";
import { authOptions } from "./auth-options";
import { isOnboardingComplete } from "./completion";
import type { ProjectFase } from "./data/types";

async function requireAuthenticatedAdmin() {
  const session = await getServerSession(authOptions);
  return Boolean(session?.user);
}

function revalidateClientProjects() {
  revalidatePath("/clientes/proyectos");
  revalidatePath("/mobile/clientes/proyectos");
  revalidatePath("/tablet/clientes/proyectos");
}

/**
 * 🛠️ SERVER ACTIONS REFACTORIZADAS
 * Ahora utilizan el DataService para ser independientes de la base de datos.
 */

// 👥 CLIENTES
export async function createCliente(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const cedula = formData.get("cedula") as string;
  const email = formData.get("email") as string;
  const telefono = formData.get("telefono") as string;

  const existing = await clientes.getByCedula(cedula);
  if (existing)
    return { error: "ESTE DOCUMENTO YA PERTENECE A UN CLIENTE REGISTRADO." };

  const res = await clientes.create({ nombre, cedula, email, telefono });
  if (res.success) revalidatePath("/admin");
  return res;
}

export async function getClientes() {
  return await clientes.getAll();
}

export async function getClienteById(id: string) {
  return await clientes.getById(id);
}

export async function updateCliente(id: string, data: any) {
  const res = await clientes.update(id, data);
  if (res.success) revalidatePath("/admin");
  return res;
}

export async function deleteCliente(id: string) {
  const res = await clientes.delete(id);
  if (res.success) revalidatePath("/admin");
  return res;
}

// 🚀 PROYECTOS
export async function getProyectos() {
  return await proyectos.getAll();
}

export async function getProyectoByCedula(cedula: string) {
  const cliente = await clientes.getByCedula(cedula.trim());
  if (!cliente) return { status: "not_found" } as const;

  const projs = await proyectos.getByClienteId(cliente.id);
  if (projs.length === 0) return { status: "no_projects" } as const;

  const visibles = projs.filter((p: any) => p.visibilidad !== false);
  if (visibles.length === 0) return { status: "all_hidden" } as const;

  return { status: "ok", cliente, proyectos: visibles } as const;
}

export async function createProyecto(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const plan = formData.get("plan") as string;
  const clienteId = formData.get("clienteId") as string;
  const fechaEntregaStr = formData.get("fechaEntrega") as string;

  const res = await proyectos.create({
    nombre,
    plan,
    clienteId,
    fechaEntrega: fechaEntregaStr ? new Date(fechaEntregaStr) : null,
  } as any);

  if (res.success) revalidatePath("/admin");
  return res;
}

export async function updateProyectoProgreso(
  id: string,
  progreso: number,
  estado: any,
) {
  const res = await proyectos.update(id, { progreso, estado });
  if (res.success) {
    revalidatePath("/admin");
    revalidateClientProjects();
  }
  return res;
}

export async function updateProyectoVisibilidad(
  id: string,
  visibilidad: boolean,
) {
  const res = await proyectos.update(id, { visibilidad });
  if (res.success) {
    revalidatePath("/admin");
    revalidateClientProjects();
  }
  return res;
}

export async function updateProyectoPlan(id: string, plan: string) {
  const res = await proyectos.update(id, { plan });
  if (res.success) {
    revalidatePath("/admin");
    revalidateClientProjects();
  }
  return res;
}

export async function updateProyectoFecha(id: string, fechaEntrega: Date) {
  const res = await proyectos.update(id, { fechaEntrega });
  if (res.success) revalidatePath("/admin");
  return res;
}

export async function updateProyectoLink(id: string, link: string) {
  const res = await proyectos.update(id, { link });
  if (res.success) {
    revalidatePath("/admin");
    revalidateClientProjects();
  }
  return res;
}

export async function updateProyectoOnboarding(
  id: string,
  step: number,
  data: any,
) {
  const res = await proyectos.update(id, { onboardingStep: step, onboardingData: data });
  if (!res.success) return res;

  // Auto-transición: si el cliente completó el 100% y sigue en 'onboarding',
  // pasamos a 'construccion' y arrancamos el countdown de 48h.
  try {
    const all = await proyectos.getAll();
    const project = (all as any[]).find((p: any) => p.id === id);
    if (project && project.fase === "onboarding" && isOnboardingComplete(data)) {
      await proyectos.update(id, {
        fase: "construccion",
        buildStartedAt: new Date(),
      } as any);
    }
  } catch {
    // Nunca bloquear el savePatch del cliente por error en transición.
  }

  revalidatePath("/admin");
  revalidateClientProjects();
  return res;
}

// ─── Fases del proyecto ──────────────────────────────────────────────────────

export async function setProyectoFase(id: string, fase: ProjectFase) {
  const patch: Record<string, any> = { fase };
  if (fase === "construccion") {
    // Leer proyecto para no sobrescribir buildStartedAt ya seteado.
    const all = await proyectos.getAll();
    const project = (all as any[]).find((p: any) => p.id === id);
    if (!project?.buildStartedAt) patch.buildStartedAt = new Date();
  } else if (fase === "onboarding") {
    patch.buildStartedAt = null;
  }
  // fase === 'publicado' → mantener buildStartedAt como histórico.

  const res = await proyectos.update(id, patch as any);
  if (res.success) {
    revalidatePath("/admin");
    revalidateClientProjects();
  }
  return res;
}

export async function resetBuildTimer(id: string) {
  const res = await proyectos.update(id, { buildStartedAt: new Date() } as any);
  if (res.success) {
    revalidatePath("/admin");
    revalidateClientProjects();
  }
  return res;
}

async function mergeProyectoOnboardingData(id: string, patch: object) {
  const all = await proyectos.getAll();
  const project = (all as any[]).find((p: any) => p.id === id);
  const currentData = (project?.onboardingData as object) || {};
  const res = await proyectos.update(id, {
    onboardingData: { ...currentData, ...patch },
  });
  if (res.success) revalidatePath("/admin");
  return res;
}

export async function updateProyectoPrecioCustom(id: string, precio: number) {
  return mergeProyectoOnboardingData(id, { precioCustom: precio });
}

export async function updateProyectoPagoRecibido(id: string, recibido: boolean) {
  return mergeProyectoOnboardingData(id, { pagoRecibido: recibido });
}

export async function deleteProyecto(id: string) {
  const res = await proyectos.delete(id);
  if (res.success) revalidatePath("/admin");
  return res;
}

// 🛡️ ADMINS
export async function getAdmins() {
  return await auth.getAllAdmins();
}

export async function createAdmin(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!(await requireAuthenticatedAdmin())) {
    return { error: "NO AUTORIZADO." };
  }

  const existing = await auth.getUserByUsername(username);
  if (existing) return { error: "EL USUARIO YA EXISTE." };

  const hashedPassword = await bcrypt.hash(password, 10);
  const res = await auth.createAdmin({
    nombre,
    username,
    passwordHash: hashedPassword,
  });
  if (res.success) revalidatePath("/admin/administradores");
  return res;
}

export async function deleteAdmin(id: string) {
  if (!(await requireAuthenticatedAdmin())) {
    return { error: "NO AUTORIZADO." };
  }

  const admins = await auth.getAllAdmins();
  if (admins.length <= 1) {
    return { error: "NO PUEDES ELIMINAR EL ULTIMO ADMINISTRADOR." };
  }

  const res = await auth.deleteAdmin(id);
  if (res.success) revalidatePath("/admin/administradores");
  return res;
}

// 🚦 STATUS
export async function getSystemStatus() {
  return await dataGetStatus();
}

// 📁 ARCHIVOS
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "application/pdf",
]);

export async function uploadArchivo(formData: FormData) {
  const file = formData.get("file") as File;
  const proyectoId = formData.get("proyectoId") as string;
  const subidoPor = formData.get("subidoPor") as "admin" | "cliente";

  const oldUrl = formData.get("oldUrl") as string | null;

  if (!file) return { error: "NO SE HA SELECCIONADO NINGÚN ARCHIVO." };
  if (!ALLOWED_MIME_TYPES.has(file.type))
    return { error: "TIPO DE ARCHIVO NO PERMITIDO." };

  if (oldUrl) {
    const marker = "/object/public/archivos/";
    const idx = oldUrl.indexOf(marker);
    if (idx !== -1) {
      const oldPath = oldUrl.slice(idx + marker.length).split("?")[0];
      await supabaseAdmin.storage.from("archivos").remove([oldPath]);
    }
  }

  try {
    const uniqueFilename = `${Date.now()}-${file.name}`;
    const storagePath = `${estudioId}/${proyectoId}/${uniqueFilename}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("archivos")
      .upload(storagePath, file);

    if (uploadError) return { error: uploadError.message };

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("archivos")
      .getPublicUrl(storagePath);

    const res = await archivos.add({
      url: publicUrl,
      storagePath,
      nombre: file.name,
      tipo: file.type.split("/")[0],
      tamano: file.size,
      subidoPor,
      proyectoId,
    });

    if (res.success) {
      revalidatePath("/admin");
      revalidateClientProjects();
      return { success: true, url: publicUrl };
    }
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { error: message };
  }
}

export async function deleteArchivo(id: string) {
  const res = await archivos.delete(id);
  if (res.success) {
    if (res.storagePath) {
      const { error: storageError } = await supabaseAdmin.storage
        .from("archivos")
        .remove([res.storagePath]);
      if (storageError) {
        console.error("[Storage] Error al eliminar archivo:", storageError.message);
      }
    }
    revalidatePath("/admin");
    revalidateClientProjects();
  }
  return res;
}

const CHAT_MAX_MESSAGES = 200;
const CHAT_STORAGE_MARKER = "/object/public/archivos/";

export async function addChatMessage(
  proyectoId: string,
  contenido: string,
  autor: "cliente" | "admin",
  imagenes: string[] = [],
) {
  const res = await chat.addMessage({
    proyectoId,
    contenido,
    autor,
    imagenes,
    leido: false,
  });
  if (res.success) {
    const { deletedImageUrls } = await chat.pruneMessages(proyectoId, CHAT_MAX_MESSAGES);
    if (deletedImageUrls.length > 0) {
      const paths = deletedImageUrls
        .map((url) => {
          const idx = url.indexOf(CHAT_STORAGE_MARKER);
          return idx !== -1 ? url.slice(idx + CHAT_STORAGE_MARKER.length).split("?")[0] : null;
        })
        .filter(Boolean) as string[];
      if (paths.length > 0) {
        await supabaseAdmin.storage.from("archivos").remove(paths);
      }
    }
    revalidatePath("/admin");
    revalidateClientProjects();
  }
  return res;
}

export async function getArchivos() {
  return await archivos.getAll();
}

// 🔐 SESIÓN DE CLIENTE (persistencia + dispositivo único)

const CLIENTE_COOKIE = "alkubo-client-session";
const CLIENTE_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 días

export async function loginCliente(cedula: string) {
  const result = await getProyectoByCedula(cedula.trim());
  if (result.status !== "ok") return result;

  const sessionId = crypto.randomUUID();

  await db
    .update(clientesTable)
    .set({ activeSessionId: sessionId })
    .where(eq(clientesTable.id, result.cliente.id));

  const cookieStore = await cookies();
  cookieStore.set(
    CLIENTE_COOKIE,
    JSON.stringify({ clienteId: result.cliente.id, sessionId, cedula: cedula.trim() }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: CLIENTE_COOKIE_MAX_AGE,
    }
  );

  return result;
}

export async function resumeClienteSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CLIENTE_COOKIE)?.value;
  if (!raw) return null;

  try {
    const { clienteId, sessionId, cedula } = JSON.parse(raw);

    const cliente = await db.query.clientes.findFirst({
      where: eq(clientesTable.id, clienteId),
      columns: { activeSessionId: true },
    });

    if (!cliente || cliente.activeSessionId !== sessionId) {
      cookieStore.delete(CLIENTE_COOKIE);
      return null;
    }

    const result = await getProyectoByCedula(cedula);
    if (result.status !== "ok") {
      cookieStore.delete(CLIENTE_COOKIE);
      return null;
    }

    return { ...result, cedula };
  } catch {
    cookieStore.delete(CLIENTE_COOKIE);
    return null;
  }
}

export async function logoutCliente() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CLIENTE_COOKIE)?.value;
  if (raw) {
    try {
      const { clienteId } = JSON.parse(raw);
      await db
        .update(clientesTable)
        .set({ activeSessionId: null })
        .where(eq(clientesTable.id, clienteId));
    } catch {}
  }
  cookieStore.delete(CLIENTE_COOKIE);
}

export async function validateClienteSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CLIENTE_COOKIE)?.value;
  if (!raw) return { valid: false };

  try {
    const { clienteId, sessionId } = JSON.parse(raw);
    const cliente = await db.query.clientes.findFirst({
      where: eq(clientesTable.id, clienteId),
      columns: { activeSessionId: true },
    });
    return { valid: cliente?.activeSessionId === sessionId };
  } catch {
    return { valid: false };
  }
}
