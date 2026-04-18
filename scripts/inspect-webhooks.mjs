// Inspecciona webhooks/triggers de Supabase que podrían estar emitiendo notis.
// Busca triggers en las tablas relevantes y cualquier extensión activa
// relacionada (pg_net, pg_cron, supabase_functions).

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
const projectRef = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];

async function q(query) {
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
    if (!res.ok) throw new Error(`[${res.status}] ${await res.text()}`);
    return res.json();
}

console.log(`→ project ${projectRef}\n`);

console.log("— Extensiones activas (buscando pg_net, pg_cron, http) —");
const exts = await q(`
  SELECT extname, extversion
  FROM pg_extension
  WHERE extname IN ('pg_net','pg_cron','http','supabase_functions')
  ORDER BY extname;
`);
if (exts.length === 0) {
    console.log("  (ninguna)");
} else {
    exts.forEach((e) => console.log(`  ✔ ${e.extname} v${e.extversion}`));
}

console.log("\n— Triggers en tablas del tenant —");
const triggers = await q(`
  SELECT
    event_object_schema AS schema,
    event_object_table AS table,
    trigger_name,
    event_manipulation AS event,
    action_timing AS timing,
    action_statement AS action
  FROM information_schema.triggers
  WHERE event_object_schema = 'public'
    AND event_object_table IN ('clientes','proyectos','archivos','chat','administradores','estudios')
  ORDER BY event_object_table, trigger_name;
`);
if (triggers.length === 0) {
    console.log("  (ningún trigger definido)");
} else {
    triggers.forEach((t) => {
        console.log(`  ${t.table}.${t.trigger_name} (${t.timing} ${t.event})`);
        console.log(`    → ${t.action}`);
    });
}

console.log("\n— Funciones que invocan pg_net/http_request —");
const fns = await q(`
  SELECT n.nspname AS schema, p.proname AS name, pg_get_function_result(p.oid) AS returns
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname NOT IN ('pg_catalog','information_schema','pg_net','net','supabase_functions','extensions','graphql','graphql_public','realtime','storage','vault')
    AND (pg_get_functiondef(p.oid) ILIKE '%pg_net%'
         OR pg_get_functiondef(p.oid) ILIKE '%http_request%'
         OR pg_get_functiondef(p.oid) ILIKE '%webhook%'
         OR pg_get_functiondef(p.oid) ILIKE '%supabase_functions%')
  ORDER BY name;
`);
if (fns.length === 0) {
    console.log("  (ninguna función que invoque webhooks)");
} else {
    fns.forEach((f) => console.log(`  ✔ ${f.schema}.${f.name} → ${f.returns}`));
}

console.log("\n— Webhooks de supabase_functions (tabla hooks) —");
try {
    const hooks = await q(`
      SELECT hook_table_id::regclass AS target, hook_name, created_at
      FROM supabase_functions.hooks
      ORDER BY created_at DESC
      LIMIT 50;
    `);
    if (hooks.length === 0) {
        console.log("  (sin hooks registrados)");
    } else {
        hooks.forEach((h) => console.log(`  ${h.target} → ${h.hook_name} (${h.created_at})`));
    }
} catch (e) {
    console.log(`  (tabla supabase_functions.hooks no existe o sin permisos: ${e.message})`);
}

console.log("\n— net.http_request_queue (últimos pedidos si existe) —");
try {
    const httpQ = await q(`
      SELECT id, method, url, created
      FROM net.http_request_queue
      ORDER BY created DESC
      LIMIT 10;
    `);
    if (httpQ.length === 0) {
        console.log("  (queue vacía)");
    } else {
        httpQ.forEach((r) => console.log(`  [${r.created}] ${r.method} ${r.url}`));
    }
} catch (e) {
    console.log(`  (sin acceso o tabla no existe)`);
}

console.log("\n— net._http_response (últimas respuestas si existe) —");
try {
    const httpR = await q(`
      SELECT id, status_code, content_type, created
      FROM net._http_response
      ORDER BY created DESC
      LIMIT 10;
    `);
    if (httpR.length === 0) {
        console.log("  (sin respuestas)");
    } else {
        httpR.forEach((r) =>
            console.log(`  [${r.created}] ${r.status_code} ${r.content_type ?? ""}`),
        );
    }
} catch (e) {
    console.log(`  (sin acceso o tabla no existe)`);
}
