/**
 * Test del rate limit de `updateProyectoOnboarding`.
 *
 * Fires N requests en paralelo con cookie válida + patch garbage (la allowlist
 * lo dropea → no muta DB). Espera: primeras ~60 pasan, resto bloqueadas con
 * "Demasiadas escrituras".
 *
 * Setup: mismas env vars que `test-auth-gate.mjs` — NEXT_ACTION, COOKIE_A,
 * PROY_A. PROY_B no se usa.
 *
 * Nota: el bucket es in-memory. Si el dev server se reinicia antes de correr
 * esto, empieza limpio. Si corrés el script 2 veces seguidas sin esperar 10s,
 * la segunda va a ver el bucket medio lleno.
 */

const PORTAL_URL = process.env.PORTAL_URL || "http://localhost:3000/portal";
const NEXT_ACTION = process.env.NEXT_ACTION;
const COOKIE_A = process.env.COOKIE_A;
const PROY_A = process.env.PROY_A;

const missing = Object.entries({ NEXT_ACTION, COOKIE_A, PROY_A })
    .filter(([, v]) => !v)
    .map(([k]) => k);
if (missing.length) {
    console.error(`Faltan env vars: ${missing.join(", ")}`);
    process.exit(2);
}

const ORIGIN = new URL(PORTAL_URL).origin;
// Key desconocida → sanitizer devuelve {} → action skipea el write pero el
// rate-limit counter sí incrementa. No muta DB, testea el gate puro.
const PATCH = { __rateLimitPing: Date.now() };

async function callAction() {
    const res = await fetch(PORTAL_URL, {
        method: "POST",
        headers: {
            "Next-Action": NEXT_ACTION,
            "Content-Type": "text/plain;charset=UTF-8",
            Origin: ORIGIN,
            Cookie: COOKIE_A,
        },
        body: JSON.stringify([PROY_A, PATCH]),
    });
    const text = await res.text();
    return {
        status: res.status,
        blocked: text.includes("Demasiadas escrituras"),
        text,
    };
}

const N = 70;
console.log(`Firing ${N} patches en paralelo contra ${PORTAL_URL}\n`);
const t0 = Date.now();
const results = await Promise.all(Array.from({ length: N }, () => callAction()));
const elapsed = ((Date.now() - t0) / 1000).toFixed(2);

const viz = results.map((r) => (r.blocked ? "✗" : "·")).join("");
console.log(viz);

const passed = results.filter((r) => !r.blocked).length;
const blocked = results.filter((r) => r.blocked).length;
console.log(`\n${passed} passed, ${blocked} blocked  (${elapsed}s total)`);

const firstBlock = results.findIndex((r) => r.blocked);
if (firstBlock >= 0) console.log(`Primer block en request #${firstBlock + 1}`);

// Verificación: esperamos ~60 passed y ~10 blocked. Damos tolerancia porque
// requests pueden procesarse out-of-order y el bucket es racy sin lock.
const ok = passed >= 55 && passed <= 65 && blocked >= 5;
if (ok) {
    console.log(`\n✓ Rate limit funciona (cap esperado: 60/10s)`);
    process.exit(0);
} else {
    console.log(`\n✗ Rate limit fuera de rango esperado (60/10s → ~60 passed, ~10 blocked)`);
    if (results[0]?.text && !results[0].blocked) {
        console.log(`\nResponse del primer request (primeros 200 chars):`);
        console.log(results[0].text.slice(0, 200));
    }
    process.exit(1);
}
