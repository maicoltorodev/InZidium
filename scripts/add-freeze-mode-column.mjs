// Agrega la columna `freeze_mode` a public.proyectos.
// Idempotente: usa IF NOT EXISTS.

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
const projectRef = env.SUPABASE_URL.match(
    /https:\/\/([a-z0-9]+)\.supabase\.co/,
)[1];

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

await q(`
    ALTER TABLE public.proyectos
    ADD COLUMN IF NOT EXISTS freeze_mode boolean NOT NULL DEFAULT false;
`);
console.log("  ✔ added freeze_mode column");

const check = await q(`
    SELECT column_name, data_type, column_default, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'proyectos'
      AND column_name = 'freeze_mode';
`);
console.log("\n— verification —");
check.forEach((c) =>
    console.log(`  ${c.column_name} (${c.data_type}, default ${c.column_default})`),
);
