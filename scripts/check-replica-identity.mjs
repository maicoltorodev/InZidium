// Verifica y setea REPLICA IDENTITY FULL en las tablas que alimentan los hooks
// de Realtime (session eviction + onboarding sync). Sin REPLICA FULL, los
// payloads UPDATE no incluyen la fila vieja (`payload.old`), rompiendo las
// comparaciones tipo `payload.new?.active_session_id !== payload.old?.active_session_id`.
//
// Usa la Management API de Supabase con TOKEN_SUPABASE.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");

const raw = readFileSync(envPath, "utf8");
const env = Object.fromEntries(
    raw
        .split("\n")
        .filter((l) => l && !l.startsWith("#") && l.includes("="))
        .map((l) => {
            const idx = l.indexOf("=");
            return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^"|"$/g, "")];
        }),
);

const token = env.TOKEN_SUPABASE;
const url = env.SUPABASE_URL;
if (!token || !url) {
    console.error("Falta TOKEN_SUPABASE o SUPABASE_URL en .env.local");
    process.exit(1);
}

const projectRef = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
if (!projectRef) {
    console.error("No se pudo extraer project_ref de SUPABASE_URL");
    process.exit(1);
}

async function runQuery(query) {
    const res = await fetch(
        `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        },
    );
    const text = await res.text();
    if (!res.ok) {
        throw new Error(`[${res.status}] ${text}`);
    }
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

const TABLES = ["administradores", "clientes", "proyectos", "archivos", "chat"];

// pg_class.relreplident: 'd' = default, 'n' = nothing, 'f' = full, 'i' = index
const LABEL = { d: "DEFAULT", n: "NOTHING", f: "FULL", i: "INDEX" };

console.log(`→ project ${projectRef}\n`);
console.log("— Estado actual —");
const check = await runQuery(`
  SELECT relname AS table, relreplident AS ident
  FROM pg_class
  WHERE relkind = 'r'
    AND relname IN (${TABLES.map((t) => `'${t}'`).join(",")})
  ORDER BY relname;
`);

const missing = [];
for (const row of check) {
    const label = LABEL[row.ident] || row.ident;
    const ok = row.ident === "f";
    console.log(`  ${ok ? "✔" : "✗"} ${row.table.padEnd(16)} ${label}`);
    if (!ok) missing.push(row.table);
}

if (missing.length === 0) {
    console.log("\n✅ Todas las tablas ya tienen REPLICA IDENTITY FULL. Nada que hacer.");
    process.exit(0);
}

console.log(`\n→ Seteando REPLICA IDENTITY FULL en: ${missing.join(", ")}`);
for (const table of missing) {
    await runQuery(`ALTER TABLE public.${table} REPLICA IDENTITY FULL;`);
    console.log(`  ✔ ${table}`);
}

console.log("\n✅ Listo.");
