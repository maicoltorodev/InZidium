// Instala un pg_cron semanal que limpia tokens FCM muertos.
//
// Lee net._http_response (logs de pg_net) buscando errores 404 de FCM,
// extrae los prefijos de tokens fallidos y elimina los matches en
// public.owner_devices. La edge function `notify-owner` logea cada error como:
//     "Error: FCM send failed (d6Zf-ksaSkiF…): 404 ..."
// donde los primeros 12 chars entre paréntesis son el prefijo del token.
//
// Corre cada domingo 03:00 UTC. Idempotente — re-ejecutar este script
// reemplaza el schedule existente.

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
const url = env.SUPABASE_URL;
const projectRef = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];

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

console.log(`→ project ${projectRef}\n`);

// 1. Asegurar extensión pg_cron
console.log("— Habilitando pg_cron (si no lo está) —");
await q(`CREATE EXTENSION IF NOT EXISTS pg_cron;`);
console.log("  ✔\n");

// 2. Crear/reemplazar función de cleanup
console.log("— Creando función public.cleanup_dead_fcm_tokens() —");
await q(`
CREATE OR REPLACE FUNCTION public.cleanup_dead_fcm_tokens()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, net, extensions
AS $$
DECLARE
    v_prefixes text[];
    v_deleted integer := 0;
BEGIN
    -- Extraer prefijos únicos (primeros 12 chars) de los errores 404 de FCM
    -- en respuestas recientes de pg_net. Los errores tienen la forma:
    --   "Error: FCM send failed (d6Zf-ksaSkiF…): 404 ..."
    SELECT array_agg(DISTINCT m[1])
    INTO v_prefixes
    FROM (
        SELECT regexp_matches(
            r.content::text,
            'FCM send failed \\(([A-Za-z0-9_-]+)',
            'g'
        ) AS m
        FROM net._http_response r
        WHERE r.status_code = 200
          AND r.content::text LIKE '%FCM send failed%'
          AND r.content::text LIKE '%404%'
    ) sub;

    IF v_prefixes IS NULL OR array_length(v_prefixes, 1) IS NULL THEN
        RETURN 0;
    END IF;

    -- Borrar tokens que matchean con algún prefijo fallido
    WITH deleted AS (
        DELETE FROM public.owner_devices d
        WHERE EXISTS (
            SELECT 1
            FROM unnest(v_prefixes) p
            WHERE d.fcm_token LIKE p || '%'
        )
        RETURNING 1
    )
    SELECT count(*)::int INTO v_deleted FROM deleted;

    RETURN v_deleted;
END;
$$;
`);
console.log("  ✔\n");

// 3. Reemplazar el schedule si ya existía
console.log("— Registrando schedule (domingo 03:00 UTC) —");
await q(`
DO $$
BEGIN
    PERFORM cron.unschedule('cleanup-dead-fcm-tokens');
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
`);

await q(`
SELECT cron.schedule(
    'cleanup-dead-fcm-tokens',
    '0 3 * * 0',
    $schedule$ SELECT public.cleanup_dead_fcm_tokens() $schedule$
);
`);
console.log("  ✔\n");

// 4. Verificar
console.log("— Verificación —");
const jobs = await q(`
    SELECT jobid, schedule, command, active
    FROM cron.job
    WHERE jobname = 'cleanup-dead-fcm-tokens';
`);
jobs.forEach((j) =>
    console.log(
        `  job ${j.jobid}: ${j.schedule}  active=${j.active}\n    ${j.command}`,
    ),
);

console.log("\n— Test: correr la función ahora —");
const result = await q(`SELECT public.cleanup_dead_fcm_tokens() AS deleted;`);
console.log(`  tokens eliminados: ${result[0].deleted}\n`);

const remaining = await q(
    `SELECT COUNT(*)::int AS n FROM public.owner_devices;`,
);
console.log(`✅ Listo. Tokens activos restantes: ${remaining[0].n}`);
console.log(`   Próxima ejecución: domingo 03:00 UTC`);
