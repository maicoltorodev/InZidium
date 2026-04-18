// Crea triggers AFTER DELETE para clientes y proyectos apuntando a la nueva
// edge function `notify-event`. Los eventos de INSERT siguen manejados por la
// vieja `notify-owner` (no los toca). Los eventos de onboarding/pago los
// dispara directamente el server action, sin trigger.
//
// Idempotente — re-ejecutar el script recrea los triggers.

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
            return [
                l.slice(0, idx).trim(),
                l.slice(idx + 1).trim().replace(/^"|"$/g, ""),
            ];
        }),
);

const token = env.TOKEN_SUPABASE;
const supabaseUrl = env.SUPABASE_URL;
const projectRef = supabaseUrl.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];

async function q(query) {
    const r = await fetch(
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
    if (!r.ok) throw new Error(`[${r.status}] ${await r.text()}`);
    return r.json();
}

const FN_URL = `${supabaseUrl}/functions/v1/notify-event`;

console.log(`→ project ${projectRef}`);
console.log(`→ endpoint ${FN_URL}\n`);

// ─── Triggers AFTER DELETE ───────────────────────────────────────────────────

const targets = [
    { table: "clientes", triggerName: "notify_event_clientes_deleted" },
    { table: "proyectos", triggerName: "notify_event_proyectos_deleted" },
];

for (const t of targets) {
    console.log(`— ${t.table} · ${t.triggerName}`);
    await q(`DROP TRIGGER IF EXISTS ${t.triggerName} ON public.${t.table};`);
    await q(`
        CREATE TRIGGER ${t.triggerName}
        AFTER DELETE ON public.${t.table}
        FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request(
            '${FN_URL}',
            'POST',
            '{"Content-Type":"application/json"}',
            '{}',
            '5000'
        );
    `);
    console.log(`  ✔`);
}

console.log("\n— Verificación —");
const check = await q(`
    SELECT trigger_name, event_object_table AS tbl, event_manipulation AS op
    FROM information_schema.triggers
    WHERE event_object_schema = 'public'
      AND trigger_name LIKE 'notify_event_%'
    ORDER BY trigger_name;
`);
check.forEach((r) => console.log(`  ${r.trigger_name} (${r.op} on ${r.tbl})`));

console.log(`\n✅ Listo.`);
