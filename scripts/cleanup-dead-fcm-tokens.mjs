// Limpia tokens FCM muertos de public.owner_devices.
// Lee las últimas respuestas de net._http_response de pg_net, extrae los
// prefijos de tokens que dieron 404 UNREGISTERED, y elimina los matches en DB.
// Funciona porque la edge function `notify-owner` logea cada error como:
//     "Error: FCM send failed (d6Zf-ksaSkiF…): 404 ..."
// donde entre paréntesis van los primeros 12 chars del token.

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

// 1. Últimas 20 respuestas de pg_net (las más recientes son las más fiables)
console.log("— Leyendo últimas respuestas de notify-owner —");
const responses = await q(`
  SELECT content, created
  FROM net._http_response
  WHERE status_code = 200
    AND content::text LIKE '%FCM send failed%'
  ORDER BY created DESC
  LIMIT 20;
`);
console.log(`  ${responses.length} respuestas con errores FCM\n`);

// 2. Extraer prefijos de tokens fallados
const badPrefixes = new Set();
const prefixRe = /FCM send failed \(([A-Za-z0-9_-]+)…?\)/g;

for (const r of responses) {
    const body = typeof r.content === "string" ? r.content : JSON.stringify(r.content);
    let m;
    while ((m = prefixRe.exec(body)) !== null) {
        badPrefixes.add(m[1]);
    }
}

console.log(`— Prefijos únicos detectados con 404 —`);
if (badPrefixes.size === 0) {
    console.log("  (ninguno) — nada que limpiar.");
    process.exit(0);
}
[...badPrefixes].forEach((p) => console.log(`  ${p}…`));

// 3. Match cada prefijo contra owner_devices
console.log(`\n— Buscando matches en owner_devices —`);
const prefixList = [...badPrefixes].map((p) => `'${p}%'`).join(",");
const matches = await q(`
  SELECT id, fcm_token, platform, label, created_at
  FROM public.owner_devices
  WHERE ${[...badPrefixes]
      .map((_p, i) => `fcm_token LIKE $PREFIX${i}$`)
      .join(" OR ")};
`.replace(/\$PREFIX(\d+)\$/g, (_, i) => `'${[...badPrefixes][+i]}%'`));

console.log(`  ${matches.length} tokens para eliminar`);
matches.forEach((m) =>
    console.log(
        `  ${m.id}  ...${m.fcm_token.slice(-12)}  platform=${m.platform ?? "?"}  label=${m.label ?? "?"}`,
    ),
);

if (matches.length === 0) {
    console.log("\n(nada que borrar)");
    process.exit(0);
}

// 4. DELETE
const ids = matches.map((m) => `'${m.id}'`).join(",");
await q(`DELETE FROM public.owner_devices WHERE id IN (${ids});`);
console.log(`\n✅ Eliminados ${matches.length} tokens muertos.`);

// 5. Estado final
const remaining = await q(`SELECT COUNT(*)::int AS n FROM public.owner_devices;`);
console.log(`→ Tokens activos restantes: ${remaining[0].n}`);
