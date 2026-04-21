/**
 * Test del auth gate de `updateProyectoOnboarding`.
 *
 * Solo testea los REJECTION paths — no muta data. El happy path (cliente
 * editando su propio proyecto) se verifica a ojo en el browser.
 *
 * ───────────────────────────────────────────────────────────────────
 * SETUP (5 min, una sola vez)
 * ───────────────────────────────────────────────────────────────────
 *
 *  1. En una terminal:  npm run dev
 *  2. Abrir browser en http://localhost:3000/portal, login con un cliente
 *     que tenga proyecto (Cliente A).
 *  3. Tocar cualquier input/toggle del onboarding para disparar un save.
 *  4. DevTools → Network → click la request POST a `/portal` → pestaña
 *     Headers → copiar:
 *       a) Header `next-action`  (ej: `40a8f2c3…`)   → NEXT_ACTION
 *       b) Header `cookie` COMPLETO                   → COOKIE_A
 *     Y copiar también el `proyectoId` del request body/URL → PROY_A
 *  5. Desde el admin, agarrar un proyecto de OTRO cliente del mismo estudio
 *     (el gate debe bloquear cross-cliente) → PROY_B
 *
 *  6. Correr:
 *
 *     NEXT_ACTION=... COOKIE_A='...' PROY_A=... PROY_B=... \
 *       node scripts/test-auth-gate.mjs
 *
 * ───────────────────────────────────────────────────────────────────
 * EXIT CODE
 * ───────────────────────────────────────────────────────────────────
 *   0 si los 3 rejection paths bloquean correctamente.
 *   1 si alguno deja pasar (gate con hueco).
 */

const PORTAL_URL = process.env.PORTAL_URL || "http://localhost:3000/portal";
const NEXT_ACTION = process.env.NEXT_ACTION;
const COOKIE_A = process.env.COOKIE_A;
const PROY_A = process.env.PROY_A;
const PROY_B = process.env.PROY_B;

const missing = Object.entries({ NEXT_ACTION, COOKIE_A, PROY_A, PROY_B })
    .filter(([, v]) => !v)
    .map(([k]) => k);

if (missing.length) {
    console.error(`Faltan env vars: ${missing.join(", ")}`);
    console.error("Ver instrucciones en el header de este archivo.");
    process.exit(2);
}

// Patch inocuo: si por error se aplicara (gate con hueco), no rompe nada.
const PATCH = { __authGateTest: Date.now() };

// Origin matcheando el host del portal para pasar el CSRF check de Next.js
// server actions. Sin esto, el fetch recibe 403 antes de llegar al gate.
const ORIGIN = new URL(PORTAL_URL).origin;

async function callAction({ cookie, proyId }) {
    const res = await fetch(PORTAL_URL, {
        method: "POST",
        headers: {
            "Next-Action": NEXT_ACTION,
            "Content-Type": "text/plain;charset=UTF-8",
            Origin: ORIGIN,
            ...(cookie ? { Cookie: cookie } : {}),
        },
        body: JSON.stringify([proyId, PATCH]),
    });
    const text = await res.text();
    return { status: res.status, text };
}

const cases = [
    {
        name: "Sin cookie → proyecto A",
        opts: { cookie: null, proyId: PROY_A },
    },
    {
        name: "Cookie forjada → proyecto A",
        opts: { cookie: "alkubo-client-session=not-a-valid-session", proyId: PROY_A },
    },
    {
        name: "Cookie A → proyecto B (cross-cliente)",
        opts: { cookie: COOKIE_A, proyId: PROY_B },
    },
];

let passed = 0;
let failed = 0;

console.log(`Testing gate en: ${PORTAL_URL}\n`);

for (const c of cases) {
    const { status, text } = await callAction(c.opts);
    const blocked = text.includes("No autorizado");
    const symbol = blocked ? "✓" : "✗";
    console.log(`${symbol} ${c.name}  [status=${status}]`);
    if (!blocked) {
        console.log(`   response (primeros 300 chars):`);
        console.log(`   ${text.slice(0, 300).replace(/\n/g, "\n   ")}`);
        failed++;
    } else {
        passed++;
    }
}

console.log(`\n${passed}/${cases.length} rejection paths bloqueados correctamente`);
process.exit(failed === 0 ? 0 : 1);
