"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth as getSession } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import {
  validateName,
  validateUsername,
  validatePassword,
} from "@/lib/input-formatters";

/**
 * Server actions de gestión de administradores del estudio.
 *
 * Los admins viven en la DB del estudio (cliente raíz `supabaseAdmin`),
 * no en la Alianza. Cada estudio gestiona los suyos. La validación de
 * sesión usa NextAuth (cookie/JWT firmado) — los admins no se consultan
 * en cada request.
 */

async function requireAuthenticatedAdmin() {
  const session = await getSession();
  return Boolean(session?.user);
}

export type AdminRow = {
  id: string;
  nombre: string;
  username: string;
  createdAt: Date;
};

function mapAdminRow(d: any): AdminRow {
  return {
    id: d.id,
    nombre: d.nombre,
    username: d.username,
    createdAt: d.created_at ? new Date(d.created_at) : new Date(),
  };
}

export async function getAdmins(): Promise<AdminRow[]> {
  const { data } = await supabaseAdmin
    .from("administradores")
    .select("id, nombre, username, created_at")
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapAdminRow);
}

export async function createAdmin(formData: FormData) {
  if (!(await requireAuthenticatedAdmin())) {
    return { error: "NO AUTORIZADO." };
  }

  const nombre = (formData.get("nombre") as string ?? "").trim();
  const username = (formData.get("username") as string ?? "").trim();
  const password = (formData.get("password") as string ?? "");

  // Validación estructural — fallback si el cliente envía datos saltando la UI.
  const nameErr = validateName(nombre);
  if (nameErr) return { error: nameErr.toUpperCase() };
  const userErr = validateUsername(username);
  if (userErr) return { error: userErr.toUpperCase() };
  const pwErr = validatePassword(password);
  if (pwErr) return { error: pwErr.toUpperCase() };

  const { data: existing } = await supabaseAdmin
    .from("administradores")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (existing) return { error: "EL USUARIO YA EXISTE." };

  const passwordHash = await bcrypt.hash(password, 10);
  const { error } = await supabaseAdmin.from("administradores").insert({
    nombre,
    username,
    password_hash: passwordHash,
  });
  if (error) {
    if (error.code === "23505") return { error: "EL USUARIO YA EXISTE." };
    return { error: "ERROR AL CREAR ADMINISTRADOR." };
  }

  revalidatePath("/admin/administradores");
  return { success: true };
}

export async function deleteAdmin(id: string) {
  if (!(await requireAuthenticatedAdmin())) {
    return { error: "NO AUTORIZADO." };
  }

  const { count } = await supabaseAdmin
    .from("administradores")
    .select("id", { count: "exact", head: true });

  if ((count ?? 0) <= 1) {
    return { error: "NO PUEDES ELIMINAR EL ULTIMO ADMINISTRADOR." };
  }

  const { error } = await supabaseAdmin
    .from("administradores")
    .delete()
    .eq("id", id);
  if (error) return { error: "ERROR AL ELIMINAR ADMINISTRADOR." };

  revalidatePath("/admin/administradores");
  return { success: true };
}
