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
import { revalidateProyecto, revalidateAdmin } from "./revalidate";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { auth as getSession } from "@/auth";
import { db } from "./db";
import { clientes as clientesTable } from "./db/schema";
import { eq } from "drizzle-orm";
import { isOnboardingComplete } from "./completion";
import type { Pago, PagoTipo } from "./finance";
import { supabaseUrl } from "@/lib/env";
import { rateLimit, getClientIp } from "./rate-limit";
import {
  validateName,
  validateCedula,
  validateEmail,
  validatePhoneCO,
  validateUsername,
  validatePassword,
  formatPhoneDigitsCO,
} from "./input-formatters";
import { notifyPlantillaRevalidate } from "./plantilla-deploy";
import { sanitizeOnboardingPatch } from "./onboarding-patch-schema";

/**
 * Dispara push a la app InZidium vía edge function `notify-event`. Fire-and-forget:
 * cualquier error se loguea pero no rompe el flujo del server action.
 */
async function notifyEvent(
  event: string,
  record: Record<string, any>,
  extra?: Record<string, any>,
) {
  try {
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anon) return;
    await fetch(`${supabaseUrl}/functions/v1/notify-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anon}`,
      },
      body: JSON.stringify({ event, record, extra }),
    });
  } catch (e) {
    console.error("[notify-event] fire failed:", (e as Error).message);
  }
}

async function requireAuthenticatedAdmin() {
  const session = await getSession();
  return Boolean(session?.user);
}


/**
 * 🛠️ SERVER ACTIONS REFACTORIZADAS
 * Ahora utilizan el DataService para ser independientes de la base de datos.
 */

// 👥 CLIENTES
export async function createCliente(formData: FormData) {
  const adminSession = await validateAdminSession();
  if (!adminSession.valid) return { error: "NO AUTORIZADO." };

  const nombre = (formData.get("nombre") as string ?? "").trim();
  const cedula = (formData.get("cedula") as string ?? "").trim();
  const email = (formData.get("email") as string ?? "").trim();
  const telefono = (formData.get("telefono") as string ?? "").trim();

  // Validación estructural — fallback si el cliente envía datos saltando la UI.
  const nameErr = validateName(nombre);
  if (nameErr) return { error: nameErr.toUpperCase() };
  const cedulaErr = validateCedula(cedula);
  if (cedulaErr) return { error: cedulaErr.toUpperCase() };
  const emailErr = validateEmail(email);
  if (emailErr) return { error: emailErr.toUpperCase() };
  const phoneErr = validatePhoneCO(formatPhoneDigitsCO(telefono));
  if (phoneErr) return { error: phoneErr.toUpperCase() };

  const existing = await clientes.getByCedula(cedula);
  if (existing)
    return { error: "ESTE DOCUMENTO YA PERTENECE A UN CLIENTE REGISTRADO." };

  const res = await clientes.create({ nombre, cedula, email, telefono });
  if (res.success) revalidateAdmin();
  return res;
}

export async function getClientes() {
  return await clientes.getAll();
}

export async function getClienteById(id: string) {
  return await clientes.getById(id);
}

export async function updateCliente(id: string, data: any) {
  const adminSession = await validateAdminSession();
  if (!adminSession.valid) return { success: false, error: "NO AUTORIZADO." };

  // Validación estructural — mismo fallback que createCliente.
  if (data.nombre !== undefined) {
    const err = validateName(String(data.nombre).trim());
    if (err) return { success: false, error: err.toUpperCase() };
  }
  if (data.cedula !== undefined) {
    const err = validateCedula(String(data.cedula).trim());
    if (err) return { success: false, error: err.toUpperCase() };
  }
  if (data.email !== undefined) {
    const err = validateEmail(String(data.email).trim());
    if (err) return { success: false, error: err.toUpperCase() };
  }
  if (data.telefono !== undefined) {
    const err = validatePhoneCO(formatPhoneDigitsCO(String(data.telefono)));
    if (err) return { success: false, error: err.toUpperCase() };
  }

  const res = await clientes.update(id, data);
  if (res.success) {
    revalidateAdmin();
    // Push al owner: cliente editado + lista de campos modificados.
    try {
      const updated = await clientes.getById(id);
      if (updated) {
        notifyEvent("cliente.updated", updated, {
          fields: Object.keys(data).filter((k) => data[k] !== undefined),
        });
      }
    } catch {
      // notify es fire-and-forget, no bloqueamos el save por un error de push.
    }
  }
  return res;
}

// Vacía la carpeta `{estudioId}/{proyectoId}/` del bucket `archivos`.
// El cascade DB solo borra filas — los objetos en Storage quedan huérfanos
// si no los limpiamos explícitamente antes de borrar el proyecto/cliente.
async function purgeProyectoStorage(proyectoId: string) {
  try {
    const prefix = `${estudioId}/${proyectoId}`;
    const { data, error } = await supabaseAdmin.storage
      .from("archivos")
      .list(prefix, { limit: 1000 });
    if (error) {
      console.error("[Storage] list falló:", error.message);
      return;
    }
    if (!data?.length) return;
    const paths = data.map((f) => `${prefix}/${f.name}`);
    const { error: rmErr } = await supabaseAdmin.storage
      .from("archivos")
      .remove(paths);
    if (rmErr) console.error("[Storage] remove falló:", rmErr.message);
  } catch (e) {
    console.error("[Storage] purgeProyectoStorage:", (e as Error).message);
  }
}

export async function deleteCliente(id: string) {
  const adminSession = await validateAdminSession();
  if (!adminSession.valid) return { success: false, error: "NO AUTORIZADO." };

  // Noti FCM de "cliente.deleted" sale del trigger SQL `notify_event_clientes_deleted`
  // (ver memory notifications_fcm.md). Acá no replicamos para evitar doble push.
  const projs = await proyectos.getByClienteId(id);
  const res = await clientes.delete(id);
  if (res.success) {
    await Promise.all(projs.map((p) => purgeProyectoStorage(p.id)));
    revalidateAdmin();
  }
  return res;
}

// 🚀 PROYECTOS
export async function getProyectos() {
  return await proyectos.getAll();
}

export async function getProyectoByCedula(cedula: string) {
  // Rate limit por IP: 10 intentos / 60s. Mitiga enumeración de cédulas.
  const ip = await getClientIp();
  const rl = await rateLimit(`cedula-lookup:${ip}`, { max: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return {
      status: "rate_limited",
      resetInSec: rl.resetInSec,
    } as const;
  }

  const cliente = await clientes.getByCedula(cedula.trim());
  if (!cliente) return { status: "not_found" } as const;

  const projs = await proyectos.getByClienteId(cliente.id);
  if (projs.length === 0) return { status: "no_projects" } as const;

  return { status: "ok", cliente, proyectos: projs } as const;
}

export async function createProyecto(formData: FormData) {
  const adminSession = await validateAdminSession();
  if (!adminSession.valid) return { success: false, error: "NO AUTORIZADO." };

  const nombre = ((formData.get("nombre") as string) ?? "").trim();
  const plan = (formData.get("plan") as string) ?? "";
  const clienteId = (formData.get("clienteId") as string) ?? "";

  if (!nombre) return { success: false, error: "EL NOMBRE NO PUEDE ESTAR VACIO." };
  if (!plan) return { success: false, error: "EL PLAN ES REQUERIDO." };
  if (!clienteId) return { success: false, error: "EL CLIENTE ES REQUERIDO." };

  // fechaEntrega se setea cuando el proyecto pasa a construcción (auto para
  // Estándar vía `updateProyectoOnboarding`, manual para A la medida vía
  // `iniciarConstruccion`). Durante onboarding siempre null — evita
  // redundancia con el countdown visual.
  // Uniqueness (nombre dentro del estudio) y cross-cliente validation las
  // cubre la UNIQUE constraint `proyectos_estudio_id_nombre_key` de la DB:
  // si colisiona, `proyectos.create` throw → `friendlyDbError` traduce
  // a "YA EXISTE UN PROYECTO CON ESTE NOMBRE EN TU ESTUDIO".
  const res = await proyectos.create({
    nombre,
    plan,
    clienteId,
    fechaEntrega: null,
  } as any);

  if (res.success) revalidateAdmin();
  return res;
}

export async function updateProyectoPlan(id: string, plan: string) {
  const adminSession = await validateAdminSession();
  if (!adminSession.valid) return { success: false, error: "NO AUTORIZADO." };

  // Capturamos plan previo ANTES del update para poder reportar "X → Y" en la noti.
  const prev = await proyectos.getById(id);
  if (!prev) return { success: false, error: "PROYECTO NO ENCONTRADO." };
  const fromPlan = prev?.plan ?? "?";
  const res = await proyectos.update(id, { plan });
  if (res.success) {
    revalidateProyecto();
    notifyPlantillaRevalidate(id);
    if (fromPlan !== plan) {
      try {
        const updated = await proyectos.getById(id);
        if (updated) {
          notifyEvent("plan.changed", updated, { from: fromPlan, to: plan });
        }
      } catch {}
    }
  }
  return res;
}

export async function updateProyectoLink(id: string, link: string) {
  // Auth gate: solo admins autenticados.
  const adminSession = await validateAdminSession();
  if (!adminSession.valid) return { success: false, error: "NO AUTORIZADO." };

  // Cross-tenant gate: getById filtra por estudio_id del env del admin.
  // Si el proyecto no existe en MI estudio, retorna null → error opaco.
  const proj = await proyectos.getById(id);
  if (!proj) return { success: false, error: "PROYECTO NO ENCONTRADO." };

  const clean = (link || "").trim();

  // Permitir borrar el link (cliente aún no tiene dominio propio).
  if (!clean) {
    const res = await proyectos.update(id, { link: null });
    if (res.success) {
      revalidateProyecto();
      notifyPlantillaRevalidate(id);
    }
    return res;
  }

  // Validar formato: el link debe parsearse como URL o como hostname.
  let host = "";
  try {
    const asUrl = /^https?:\/\//i.test(clean) ? clean : `https://${clean}`;
    host = new URL(asUrl).hostname.toLowerCase();
  } catch {
    return { success: false, error: "EL LINK NO ES UNA URL VALIDA." };
  }
  if (!host || !/\./.test(host)) {
    return { success: false, error: "EL LINK DEBE SER UN DOMINIO VALIDO." };
  }

  // Rechazar hosts del wildcard (preview). El cliente no puede setear su
  // `link` a `algo.maicoltoro.com` porque eso es el preview interno, ya
  // asignado por UUID. Permitirlo causaría colisión y confusión.
  const wildcard = (process.env.PLANTILLA_WILDCARD_DOMAIN ?? "maicoltoro.com")
    .toLowerCase()
    .replace(/^https?:\/\//, "");
  if (host === wildcard || host.endsWith(`.${wildcard}`)) {
    return {
      success: false,
      error: `NO SE PUEDE USAR UN SUBDOMINIO DE ${wildcard.toUpperCase()} — ESE ES EL PREVIEW INTERNO.`,
    };
  }

  // Validar unicidad WITHIN current estudio (pilla 99% de casos).
  // Para colisiones cross-estudio, la UNIQUE constraint de la DB (partial
  // lower(link)) rechaza el insert y `proyectos.update` retorna success:false
  // con error genérico — mensaje menos amigable pero protección hard.
  const allInEstudio = await proyectos.getAll();
  const normalizedInput = host.replace(/^www\./, "");
  const conflict = (allInEstudio as any[]).find((p: any) => {
    if (p.id === id || !p.link) return false;
    try {
      const pHost = new URL(
        /^https?:\/\//i.test(p.link) ? p.link : `https://${p.link}`,
      ).hostname.toLowerCase().replace(/^www\./, "");
      return pHost === normalizedInput;
    } catch {
      return false;
    }
  });
  if (conflict) {
    return {
      success: false,
      error: "ESTE DOMINIO YA ESTA ASIGNADO A OTRO PROYECTO.",
    };
  }

  const res = await proyectos.update(id, { link: clean });
  if (res.success) {
    revalidateProyecto();
    notifyPlantillaRevalidate(id);
  }
  return res;
}

/**
 * Bloquea/desbloquea el dominio para edición del cliente. Solo el admin puede
 * togglear. Cuando `linkLocked = true` el cliente no puede patchear
 * `dominioUno`/`seoCanonicalUrl` desde su portal — el sanitizer dropea esos
 * keys silenciosamente. Side effect: si se activa el lock y `proyectos.link`
 * está vacío, copiamos el `dominioUno` del onboarding como link inicial para
 * que el lock tenga un valor concreto.
 */
export async function toggleProyectoLinkLock(id: string, locked: boolean) {
  const adminSession = await validateAdminSession();
  if (!adminSession.valid) return { success: false, error: "No autorizado" };

  const proj = await proyectos.getById(id);
  if (!proj) return { success: false, error: "No autorizado" };

  const patch: Record<string, any> = { linkLocked: locked };
  // Convenience: al activar lock sin link explícito, sembrarlo desde dominioUno.
  if (locked && !proj.link?.trim()) {
    const dominioUno = (proj.onboardingData as any)?.dominioUno?.trim();
    if (dominioUno) patch.link = `www.${dominioUno}.com`;
  }

  const res = await proyectos.update(id, patch);
  if (res.success) {
    revalidateProyecto();
    notifyPlantillaRevalidate(id);
  }
  return res;
}

export async function updateProyectoNombre(id: string, nombre: string) {
  const adminSession = await validateAdminSession();
  if (!adminSession.valid) return { success: false, error: "NO AUTORIZADO." };

  const proj = await proyectos.getById(id);
  if (!proj) return { success: false, error: "PROYECTO NO ENCONTRADO." };

  const clean = (nombre || "").trim();
  if (!clean) return { success: false, error: "EL NOMBRE NO PUEDE ESTAR VACIO." };

  // Uniqueness (estudio_id, nombre) la cubre la UNIQUE constraint de la DB.
  // Si colisiona, el update throw → friendlyDbError traduce el mensaje.
  const res = await proyectos.update(id, { nombre: clean });
  if (res.success) {
    revalidateProyecto();
    notifyPlantillaRevalidate(id);
  }
  return res;
}

/**
 * Modo mantenimiento: activo significa que la Plantilla le sirve al público el
 * banner "en mantenimiento" en vez del sitio. El `fase` sigue siendo `publicado`
 * (para conservar historial), pero la Plantilla respeta `freezeMode` primero.
 */
export async function toggleProyectoFreezeMode(id: string, freezeMode: boolean) {
  const adminSession = await validateAdminSession();
  if (!adminSession.valid) return { success: false, error: "NO AUTORIZADO." };

  const proj = await proyectos.getById(id);
  if (!proj) return { success: false, error: "PROYECTO NO ENCONTRADO." };

  const res = await proyectos.update(id, { freezeMode } as any);
  if (res.success) {
    revalidateProyecto();
    notifyPlantillaRevalidate(id);
  }
  return res;
}

/**
 * Publica el proyecto: fase → publicado + freezeMode → false. Único camino
 * autorizado para salir de construcción o de mantenimiento.
 */
export async function publicarProyecto(id: string) {
  const adminSession = await validateAdminSession();
  if (!adminSession.valid) return { success: false, error: "NO AUTORIZADO." };

  const proj = await proyectos.getById(id);
  if (!proj) return { success: false, error: "PROYECTO NO ENCONTRADO." };

  const res = await proyectos.update(id, {
    fase: "publicado",
    freezeMode: false,
  } as any);
  if (res.success) {
    revalidateProyecto();
    notifyPlantillaRevalidate(id);
  }
  return res;
}

/**
 * Inicia construcción para plan Estándar — disparado por el cliente desde el
 * modal "felicidades" tras completar el 100% del onboarding. Countdown fijo
 * 48h. Auth: cliente dueño del proyecto O admin del estudio. Requiere
 * `isOnboardingComplete(onboardingData)` y `fase === "onboarding"`.
 */
export async function iniciarConstruccionEstandar(id: string) {
  const proj = await proyectos.getById(id);
  if (!proj) return { success: false, error: "No autorizado" };

  // Auth: admin del estudio O cliente dueño.
  const adminSession = await validateAdminSession();
  if (!adminSession.valid) {
    const clienteSession = await validateClienteSession();
    if (!clienteSession.valid || clienteSession.clienteId !== proj.clienteId) {
      return { success: false, error: "No autorizado" };
    }
  }

  if (proj.fase !== "onboarding") {
    return { success: false, error: "El proyecto ya no está en onboarding" };
  }
  if (!isOnboardingComplete(proj.onboardingData)) {
    return { success: false, error: "Onboarding incompleto" };
  }

  const now = new Date();
  const fechaEntrega = new Date(now.getTime() + 48 * 3600 * 1000);
  const res = await proyectos.update(id, {
    fase: "construccion",
    buildStartedAt: now,
    fechaEntrega,
    // Auto-lock del dominio al pasar a construccion: a partir de acá solo el
    // admin tiene control. Persiste en publicado. Idempotente si ya estaba locked.
    linkLocked: true,
  } as any);
  if (res.success) {
    revalidateProyecto();
    notifyPlantillaRevalidate(id);
    notifyEvent("onboarding.completed", proj);
  }
  return res;
}

/**
 * Inicia la fase de construcción manualmente, con una duración personalizada.
 * Usado principalmente para plan "A la medida" donde no hay auto-transición.
 * `durationDays` define el countdown visible al cliente — acota fechaEntrega
 * para mantener una sola fuente de verdad (countdown = fechaEntrega - now).
 */
export async function iniciarConstruccion(id: string, durationDays: number) {
  const adminSession = await validateAdminSession();
  if (!adminSession.valid) return { success: false, error: "NO AUTORIZADO." };

  if (!Number.isFinite(durationDays) || durationDays < 1 || durationDays > 365) {
    return { success: false, error: "Duración fuera de rango (1–365 días)" };
  }
  const now = new Date();
  const fechaEntrega = new Date(now.getTime() + durationDays * 24 * 3600 * 1000);

  const all = await proyectos.getAll();
  const prev = (all as any[]).find((p: any) => p.id === id);
  if (!prev) return { success: false, error: "Proyecto no encontrado" };
  if (prev.fase !== "onboarding") {
    return { success: false, error: "Solo se puede iniciar desde onboarding" };
  }

  const res = await proyectos.update(id, {
    fase: "construccion",
    buildStartedAt: now,
    fechaEntrega,
    // Auto-lock del dominio al pasar a construccion: a partir de acá solo el
    // admin tiene control. Persiste en publicado. Idempotente si ya estaba locked.
    linkLocked: true,
  } as any);
  if (res.success) {
    revalidateProyecto();
    notifyPlantillaRevalidate(id);
    notifyEvent("onboarding.completed", prev);
  }
  return res;
}

/**
 * Aplica un patch parcial al `onboardingData` del proyecto.
 *
 * El read + merge + write ocurre atómicamente en Postgres vía
 * `atomicPatchOnboarding` (transacción con `SELECT FOR UPDATE`). Cualquier
 * escritura concurrente sobre el mismo proyecto se serializa — imposible
 * que dos patches se pisen, incluso si cliente y admin editan el mismo
 * campo al mismo tiempo, o si un user dispara clicks rápidos.
 *
 * Efectos colaterales (fuera de la transacción, idempotentes):
 *  - Dispara `onboarding.started` la primera vez que se llena data.
 *  - Auto-transición a fase `construccion` al completar el 100% (plan Estándar).
 *  - Revalida admin + cliente y notifica a la Plantilla Web para refrescar cache.
 */
export async function updateProyectoOnboarding(
  id: string,
  patch: Record<string, any>,
) {
  // Auth gate: admin del estudio O cliente dueño del proyecto. `getById` ya
  // scope'a por estudioId del env → cross-tenant retorna null sin leak.
  const proj = await proyectos.getById(id);
  if (!proj) return { success: false, error: "No autorizado" };
  const adminSession = await validateAdminSession();
  const clienteSession = adminSession.valid ? null : await validateClienteSession();
  if (!adminSession.valid) {
    if (!clienteSession?.valid || clienteSession.clienteId !== proj.clienteId) {
      return { success: false, error: "No autorizado" };
    }
  }

  // Rate limit por identidad (admin o cliente). 60 patches / 10s cubre bursts
  // legítimos (toggles rápidos, drags) y corta abuso sostenido. In-memory por
  // lambda — upgrade a Upstash Redis cuando escalemos (ver lib/rate-limit.ts).
  const rateKey = adminSession.valid
    ? `patch:admin:${adminSession.adminId}`
    : `patch:cliente:${clienteSession!.clienteId}`;
  const rl = await rateLimit(rateKey, { max: 60, windowMs: 10_000 });
  if (!rl.ok) {
    return {
      success: false,
      error: `Demasiadas escrituras. Intentá en ${rl.resetInSec}s.`,
    };
  }

  // Allowlist + type/size/URL caps. Keys fuera del schema o types inválidos
  // se dropean silenciosamente; excesos de tamaño se truncan. Si no sobrevive
  // nada, skip el write (típicamente significa patch malicioso o con bug).
  const sanitized = sanitizeOnboardingPatch(patch);

  // Lock del dominio: si está activo y el caller es cliente (no admin),
  // dropeamos los keys de dominio del patch. El admin sigue pudiendo editarlos
  // libremente (uno de los caminos para overridear es justamente el admin).
  if ((proj as any).linkLocked && !adminSession.valid) {
    delete sanitized.dominioUno;
    delete sanitized.seoCanonicalUrl;
  }

  if (Object.keys(sanitized).length === 0) {
    return { success: true };
  }

  const atomic = await proyectos.atomicPatchOnboarding(id, sanitized);
  if (!atomic.success) {
    return { success: false, error: atomic.error };
  }
  const { prev, merged } = atomic;
  const prevData = (prev.onboardingData as any) ?? {};

  // Noti: primer campo llenado del onboarding. Recargamos el proyecto con
  // la relación `cliente` porque el edge function de notify-event la usa.
  const prevHadData = Object.keys(prevData).some(
    (k) => prevData[k] != null && prevData[k] !== "",
  );
  const nextHasData = Object.keys(merged).some(
    (k) => merged[k] != null && merged[k] !== "",
  );
  if (!prevHadData && nextHasData) {
    const full = await proyectos.getById(id);
    if (full) notifyEvent("onboarding.started", full);
  }

  // La transición onboarding → construccion ya NO es automática al 100%.
  // Ahora la dispara el cliente desde el hub vía `iniciarConstruccionEstandar`
  // tras confirmar el modal "felicidades + tu dominio". Esto refuerza la
  // importancia del dominio antes de que el countdown arranque.

  revalidateProyecto();
  notifyPlantillaRevalidate(id);
  return { success: true };
}

/**
 * Devuelve las URLs donde el proyecto del cliente está disponible:
 *   - preview: subdomain auto en el wildcard (ej: pizzeria.maicoltoro.com)
 *   - custom:  dominio propio si lo configuró en `link`
 */
export async function getProyectoUrls(projectId: string) {
  const all = await proyectos.getAll();
  const project = (all as any[]).find((p: any) => p.id === projectId);
  if (!project) return null;

  const wildcardDomain = process.env.PLANTILLA_WILDCARD_DOMAIN ?? "maicoltoro.com";
  // Preview subdomain = UUID del proyecto. Antes usábamos slug(nombre) pero
  // dos proyectos con el mismo nombre colisionaban en el mismo preview URL.
  // El UUID garantiza unicidad total. Es un preview interno que solo el admin
  // comparte temporal hasta que el cliente configure dominio propio → la
  // "fealdad" del UUID no afecta UX del cliente final.

  return {
    preview: `https://${project.id}.${wildcardDomain}`,
    custom: project.link ? `https://${project.link.replace(/^https?:\/\//, "")}` : null,
  };
}

async function mergeProyectoOnboardingData(id: string, patch: object) {
  const all = await proyectos.getAll();
  const project = (all as any[]).find((p: any) => p.id === id);
  const currentData = (project?.onboardingData as object) || {};
  const res = await proyectos.update(id, {
    onboardingData: { ...currentData, ...patch },
  });
  if (res.success) revalidateAdmin();
  return res;
}

export async function updateProyectoPrecioCustom(id: string, precio: number) {
  const adminSession = await validateAdminSession();
  if (!adminSession.valid) return { success: false, error: "NO AUTORIZADO." };

  return mergeProyectoOnboardingData(id, { precioCustom: precio });
}

/**
 * Mergea un parche parcial en la cuota correspondiente (o la crea si no existe)
 * dentro de `onboardingData.pagos`.
 */
async function mergePagoPatch(
  projectId: string,
  tipo: PagoTipo,
  patch: Partial<Pago>,
) {
  const all = await proyectos.getAll();
  const project = (all as any[]).find((p: any) => p.id === projectId);
  if (!project) return { success: false, error: "Proyecto no encontrado" };

  const currentData = (project.onboardingData as any) ?? {};
  const existing: Pago[] = Array.isArray(currentData.pagos)
    ? currentData.pagos
    : [];
  const next = [...existing];
  const idx = next.findIndex((p) => p.tipo === tipo);
  if (idx >= 0) {
    next[idx] = { ...next[idx], ...patch };
  } else {
    next.push({ tipo, monto: 0, ...patch } as Pago);
  }

  const res = await proyectos.update(projectId, {
    onboardingData: { ...currentData, pagos: next },
  });
  return res;
}

export async function uploadComprobantePago(
  projectId: string,
  tipo: PagoTipo,
  comprobanteUrl: string,
) {
  const res = await mergePagoPatch(projectId, tipo, {
    comprobanteUrl,
    uploadedAt: new Date().toISOString(),
    approvedAt: undefined,
    rejectedAt: undefined,
    rejectionReason: undefined,
  });
  if (res.success) {
    // Push a InZidium para revisar y aprobar el comprobante.
    try {
      const all = await proyectos.getAll();
      const project = (all as any[]).find((p: any) => p.id === projectId);
      if (project) notifyEvent("pago.comprobante_subido", project, { tipo });
    } catch {
      // No bloquear si la noti falla.
    }
    revalidateProyecto();
  }
  return res;
}

export async function approveComprobantePago(
  projectId: string,
  tipo: PagoTipo,
) {
  const session = await getSession();
  if ((session?.user as any)?.username !== "InZidium") {
    return { success: false, error: "Solo InZidium puede aprobar." };
  }
  const res = await mergePagoPatch(projectId, tipo, {
    approvedAt: new Date().toISOString(),
    rejectedAt: undefined,
    rejectionReason: undefined,
  });
  if (res.success) revalidateAdmin();
  return res;
}

export async function rejectComprobantePago(
  projectId: string,
  tipo: PagoTipo,
  reason: string,
) {
  const session = await getSession();
  if ((session?.user as any)?.username !== "InZidium") {
    return { success: false, error: "Solo InZidium puede rechazar." };
  }
  const res = await mergePagoPatch(projectId, tipo, {
    rejectedAt: new Date().toISOString(),
    rejectionReason: reason,
    approvedAt: undefined,
  });
  if (res.success) revalidateAdmin();
  return res;
}

export async function deleteProyecto(id: string) {
  const adminSession = await validateAdminSession();
  if (!adminSession.valid) return { success: false, error: "NO AUTORIZADO." };

  // Cross-tenant gate: getById filtra por estudio_id. Sin esto, el delete
  // silenciosamente no hace nada (data layer filter) pero retorna success.
  // Validar explícito evita UX confuso si se pasa un id ajeno.
  const proj = await proyectos.getById(id);
  if (!proj) return { success: false, error: "PROYECTO NO ENCONTRADO." };

  const res = await proyectos.delete(id);
  if (res.success) {
    await purgeProyectoStorage(id);
    revalidateAdmin();
  }
  return res;
}

// 🛡️ ADMINS
export async function getAdmins() {
  return await auth.getAllAdmins();
}

export async function createAdmin(formData: FormData) {
  const nombre = (formData.get("nombre") as string ?? "").trim();
  const username = (formData.get("username") as string ?? "").trim();
  const password = (formData.get("password") as string ?? "");

  if (!(await requireAuthenticatedAdmin())) {
    return { error: "NO AUTORIZADO." };
  }

  // Validación estructural — fallback si el cliente envía datos saltando la UI.
  const nameErr = validateName(nombre);
  if (nameErr) return { error: nameErr.toUpperCase() };
  const userErr = validateUsername(username);
  if (userErr) return { error: userErr.toUpperCase() };
  const pwErr = validatePassword(password);
  if (pwErr) return { error: pwErr.toUpperCase() };

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
      // Borra el archivo viejo de Storage y la fila correspondiente en la tabla
      // `archivos` para que no quede metadata huérfana apuntando a un blob borrado.
      await supabaseAdmin.storage.from("archivos").remove([oldPath]);
      await archivos.deleteByStoragePath(oldPath);
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
      revalidateProyecto();
      return { success: true, url: publicUrl };
    }
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { error: message };
  }
}

export async function deleteArchivo(id: string) {
  // Archivos pueden borrarlo tanto admin como cliente (el cliente desde su
  // portal en proyectos custom via SharedVault). Gate dual: al menos uno
  // de los dos debe estar autenticado. La data layer (archivos.delete)
  // internamente valida ownership por proyecto_id/estudio_id.
  const adminSession = await validateAdminSession();
  const clienteSession = adminSession.valid ? null : await validateClienteSession();
  if (!adminSession.valid && !clienteSession?.valid) {
    return { success: false, error: "NO AUTORIZADO." };
  }

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
    revalidateProyecto();
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
    revalidateProyecto();
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

/**
 * Refetch de proyectos para un cliente YA autenticado (cookie + sessionId válidos).
 * Sin rate limit: el rate limit de `getProyectoByCedula` es anti-enumeración para
 * logins anónimos; un cliente logueado refrescando su propia data no debe caer ahí.
 *
 * Borra la cookie SOLO cuando la sesión es genuinamente inválida (no por errores
 * transitorios). Devuelve shape compatible con getProyectoByCedula + `cedula` extra.
 */
export async function refetchClienteProyectos() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CLIENTE_COOKIE)?.value;
  if (!raw) return { status: "not_authenticated" } as const;

  let parsed: { clienteId: string; sessionId: string; cedula: string };
  try {
    parsed = JSON.parse(raw);
  } catch {
    cookieStore.delete(CLIENTE_COOKIE);
    return { status: "not_authenticated" } as const;
  }

  const cliente = await db.query.clientes.findFirst({
    where: eq(clientesTable.id, parsed.clienteId),
  });
  if (!cliente || cliente.activeSessionId !== parsed.sessionId) {
    cookieStore.delete(CLIENTE_COOKIE);
    return { status: "not_authenticated" } as const;
  }

  const projs = await proyectos.getByClienteId(cliente.id);
  if (projs.length === 0) return { status: "no_projects" } as const;

  return {
    status: "ok",
    cliente,
    proyectos: projs,
    cedula: parsed.cedula,
  } as const;
}

export async function resumeClienteSession() {
  const result = await refetchClienteProyectos();
  if (result.status !== "ok") return null;
  return result;
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

export async function validateClienteSession(): Promise<
  { valid: true; clienteId: string } | { valid: false; clienteId?: undefined }
> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CLIENTE_COOKIE)?.value;
  if (!raw) return { valid: false };

  try {
    const { clienteId, sessionId } = JSON.parse(raw);
    const cliente = await db.query.clientes.findFirst({
      where: eq(clientesTable.id, clienteId),
      columns: { activeSessionId: true },
    });
    if (cliente?.activeSessionId === sessionId) {
      return { valid: true, clienteId };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}

export async function validateAdminSession(): Promise<
  { valid: true; adminId: string } | { valid: false; adminId?: undefined }
> {
  const session = await getSession();
  if (!session?.user) return { valid: false };

  const adminId = (session.user as any).id as string | undefined;
  const sessionId = (session.user as any).sessionId as string | undefined;
  if (!adminId || !sessionId) return { valid: false };

  try {
    const admin = await auth.getUserById(adminId);
    if (!admin) return { valid: false };

    // Sólo comparamos si el activeSessionId pertenece al mismo entorno
    // (prefijo `prod:` o `dev:`). Así el server local no invalida a Vercel.
    const currentEnv = process.env.NODE_ENV === "production" ? "prod" : "dev";
    const dbSessionEnv = admin.activeSessionId?.split(":")[0];
    if (!admin.activeSessionId || dbSessionEnv !== currentEnv) {
      return { valid: true, adminId };
    }
    if (admin.activeSessionId === sessionId) {
      return { valid: true, adminId };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}
