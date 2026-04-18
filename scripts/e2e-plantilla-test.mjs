// E2E headless test del flujo de auto-deploy:
//   1. Crea cliente+proyecto de prueba en Supabase (fase=onboarding)
//   2. Fetch URL preview → debería decir "En construcción"
//   3. Llena onboardingData + revalidate
//   4. Fetch URL → verificar que aparecen los datos del cliente
//   5. fase=construccion → revalidate → fetch → banner "Vista previa"
//   6. fase=publicado → revalidate → fetch → sin banner + robots/sitemap allow
//   7. Cleanup: borra el proyecto de prueba
//
// Setup fail-safe: si algo rompe, el finally() limpia igual.

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

const TOKEN = env.TOKEN_SUPABASE;
const SUPABASE_URL = env.SUPABASE_URL;
const projectRef = SUPABASE_URL.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)[1];
const ESTUDIO_ID = env.ESTUDIO_ID;

const PLANTILLA_BASE = "https://www.maicoltoro.site";
const WILDCARD = "maicoltoro.site";
const REVALIDATE_SECRET =
    "ccda2289262df7058d3febd1d613e84cb9eb299c7c417af4cdf681cb88c819b0";

const TEST_NAME = `E2E Test ${Date.now().toString().slice(-6)}`;
const TEST_SLUG = TEST_NAME.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
const TEST_HOST = `${TEST_SLUG}.${WILDCARD}`;
const TEST_URL = `https://${TEST_HOST}`;
const TEST_CEDULA = `E2E${Date.now()}`;

async function sql(query) {
    const r = await fetch(
        `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        },
    );
    if (!r.ok) throw new Error(`SQL failed: [${r.status}] ${await r.text()}`);
    return r.json();
}

async function revalidate(hostname) {
    const r = await fetch(`${PLANTILLA_BASE}/api/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: REVALIDATE_SECRET, hostname }),
    });
    if (!r.ok) throw new Error(`revalidate failed: ${r.status}`);
    return r.json();
}

async function fetchHtml(url) {
    // Add cache-busting query to bypass any edge cache durante tests
    const cb = `?_t=${Date.now()}`;
    const r = await fetch(url + cb, {
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    });
    const text = await r.text();
    return { status: r.status, html: text };
}

function check(label, pass, detail = "") {
    const icon = pass ? "✔" : "✗";
    console.log(`  ${icon} ${label}${detail ? ` — ${detail}` : ""}`);
    return pass;
}

let testClienteId = null;
let testProyectoId = null;
let allPassed = true;

console.log(`→ E2E test: ${TEST_NAME}`);
console.log(`  hostname: ${TEST_HOST}`);
console.log(`  estudio:  ${ESTUDIO_ID}\n`);

try {
    // ─── SETUP ───────────────────────────────────────────────────────────────
    console.log("--- SETUP ---");
    const cliRes = await sql(`
        INSERT INTO public.clientes (estudio_id, nombre, cedula, email, telefono)
        VALUES (
            '${ESTUDIO_ID}',
            'Cliente E2E ${TEST_NAME}',
            '${TEST_CEDULA}',
            'e2e@test.local',
            '+57 300 0000000'
        )
        RETURNING id;
    `);
    testClienteId = cliRes[0].id;
    check("cliente creado", !!testClienteId, testClienteId);

    const proyRes = await sql(`
        INSERT INTO public.proyectos (
            estudio_id, cliente_id, nombre, plan, fase, visibilidad
        ) VALUES (
            '${ESTUDIO_ID}',
            '${testClienteId}',
            '${TEST_NAME}',
            'Plan Estándar',
            'onboarding',
            true
        )
        RETURNING id;
    `);
    testProyectoId = proyRes[0].id;
    check("proyecto creado", !!testProyectoId, testProyectoId);

    // Esperamos un momento para que la DB y cualquier cache se estabilicen
    await new Promise((r) => setTimeout(r, 1000));

    // ─── TEST 1: fase onboarding → ComingSoon ───────────────────────────────
    console.log("\n--- TEST 1: fase=onboarding ---");
    await revalidate(TEST_HOST);
    await new Promise((r) => setTimeout(r, 1500));
    const t1 = await fetchHtml(TEST_URL);
    allPassed &= check("status 200", t1.status === 200, String(t1.status));
    allPassed &= check(
        "muestra 'En construcción'",
        /en construcci/i.test(t1.html),
    );
    allPassed &= check(
        "NO muestra contenido del negocio",
        !/nuestros servicios|contáctanos/i.test(t1.html),
    );

    // ─── TEST 2: llenar onboardingData + revalidate ─────────────────────────
    console.log("\n--- TEST 2: llenar data ---");
    await sql(`
        UPDATE public.proyectos
        SET onboarding_data = jsonb_build_object(
            'nombreComercial', '${TEST_NAME}',
            'slogan', 'E2E test slogan',
            'descripcion', 'Descripción del negocio E2E.',
            'direccion', 'Calle Falsa 123, Bogotá',
            'telefono', '+57 300 1234567',
            'email', 'hola@e2e.test',
            'whatsapp', '+573001234567',
            'colorFondo', '#111111',
            'colorPrimario', '#f59e0b',
            'colorAcento2', '#dc2626'
        )
        WHERE id = '${testProyectoId}';
    `);
    check("onboardingData escrito en DB", true);

    await revalidate(TEST_HOST);
    await new Promise((r) => setTimeout(r, 1500));
    const t2 = await fetchHtml(TEST_URL);
    allPassed &= check("status 200", t2.status === 200, String(t2.status));
    allPassed &= check(
        "todavía muestra 'En construcción' (porque fase sigue onboarding)",
        /en construcci/i.test(t2.html),
    );

    // ─── TEST 3: fase construccion → sitio + banner preview ─────────────────
    console.log("\n--- TEST 3: fase=construccion ---");
    await sql(`
        UPDATE public.proyectos
        SET fase = 'construccion', build_started_at = now()
        WHERE id = '${testProyectoId}';
    `);
    await revalidate(TEST_HOST);
    await new Promise((r) => setTimeout(r, 1500));
    const t3 = await fetchHtml(TEST_URL);
    allPassed &= check("status 200", t3.status === 200);
    allPassed &= check(
        "aparece el banner 'Vista previa'",
        /vista previa/i.test(t3.html),
    );
    allPassed &= check(
        "NO muestra 'En construcción' del ComingSoon",
        !/<h1[^>]*>[\s\S]*en construcci[\s\S]*<\/h1>/i.test(t3.html),
    );
    allPassed &= check(
        "muestra el nombre del negocio en el sitio",
        t3.html.includes(TEST_NAME),
    );
    allPassed &= check(
        "meta robots contiene 'noindex'",
        /noindex/i.test(t3.html),
    );

    // ─── TEST 4: fase publicado → sitio limpio ──────────────────────────────
    console.log("\n--- TEST 4: fase=publicado ---");
    await sql(`
        UPDATE public.proyectos
        SET fase = 'publicado'
        WHERE id = '${testProyectoId}';
    `);
    await revalidate(TEST_HOST);
    await new Promise((r) => setTimeout(r, 1500));
    const t4 = await fetchHtml(TEST_URL);
    allPassed &= check("status 200", t4.status === 200);
    allPassed &= check(
        "NO muestra banner 'Vista previa'",
        !/vista previa/i.test(t4.html),
    );
    allPassed &= check(
        "meta robots permite indexar",
        !/noindex/i.test(t4.html),
    );
    allPassed &= check(
        "muestra el nombre del negocio",
        t4.html.includes(TEST_NAME),
    );

    // ─── TEST 5: freeze mode → banner 'Modo revisión' ───────────────────────
    console.log("\n--- TEST 5: freeze_mode=true ---");
    await sql(`
        UPDATE public.proyectos
        SET freeze_mode = true
        WHERE id = '${testProyectoId}';
    `);
    await revalidate(TEST_HOST);
    await new Promise((r) => setTimeout(r, 1500));
    const t5 = await fetchHtml(TEST_URL);
    allPassed &= check(
        "aparece banner 'modo revisión'",
        /modo revisi/i.test(t5.html),
    );
    allPassed &= check(
        "vuelve a tener 'noindex' mientras revisa",
        /noindex/i.test(t5.html),
    );

    // ─── TEST 6: hostname custom (proyectos.link) ──────────────────────────
    console.log("\n--- TEST 6: dominio custom via proyectos.link ---");
    const CUSTOM_HOST = `custom-${TEST_SLUG}.${WILDCARD}`;
    await sql(`
        UPDATE public.proyectos
        SET freeze_mode = false,
            link = '${CUSTOM_HOST}'
        WHERE id = '${testProyectoId}';
    `);
    await revalidate(CUSTOM_HOST);
    await new Promise((r) => setTimeout(r, 1500));
    const t6 = await fetchHtml(`https://${CUSTOM_HOST}`);
    allPassed &= check("status 200 en dominio custom", t6.status === 200);
    allPassed &= check(
        "sirve el mismo tenant en ambos hostnames",
        t6.html.includes(TEST_NAME),
    );
} catch (e) {
    console.error(`\n❌ FAIL: ${e.message}`);
    allPassed = false;
} finally {
    // ─── CLEANUP ─────────────────────────────────────────────────────────────
    console.log("\n--- CLEANUP ---");
    if (testProyectoId) {
        try {
            await sql(
                `DELETE FROM public.proyectos WHERE id = '${testProyectoId}';`,
            );
            console.log("  ✔ proyecto borrado");
        } catch (e) {
            console.log(`  ✗ error borrando proyecto: ${e.message}`);
        }
    }
    if (testClienteId) {
        try {
            await sql(
                `DELETE FROM public.clientes WHERE id = '${testClienteId}';`,
            );
            console.log("  ✔ cliente borrado");
        } catch (e) {
            console.log(`  ✗ error borrando cliente: ${e.message}`);
        }
    }
}

console.log(
    `\n${allPassed ? "✅ TODOS LOS TESTS PASARON" : "❌ ALGUNOS TESTS FALLARON"}`,
);
process.exit(allPassed ? 0 : 1);
