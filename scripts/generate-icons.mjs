// Genera dos variantes de favicon por proyecto:
//
//   1. TAB variant — app/icon.png + app/apple-icon.png + app/favicon.ico
//      Versión "bonita" con más padding. La que se ve en la pestaña del browser.
//
//   2. GOOGLE variant — public/favicon-google.png (192x192) + public/favicon-google-512.png
//      Padding más tight (logo más grande) para que renderice nítido cuando
//      Google lo muestra a 48×48 en los resultados de búsqueda.
//      Debe ser múltiplo de 48 y estar declarada en metadata.icons con sizes.
//
// Regenerable: correr `node scripts/generate-icons.mjs`.

import sharp from "sharp";
import pngToIco from "png-to-ico";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const BG = "#060214";
const TAB_PADDING = 0.16;
const GOOGLE_PADDING = 0.06;

function gradientBackgroundSvg(size) {
    return Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
            <defs>
                <radialGradient id="g" cx="50%" cy="35%" r="70%">
                    <stop offset="0%" stop-color="#a855f7" stop-opacity="0.22"/>
                    <stop offset="60%" stop-color="#22d3ee" stop-opacity="0.06"/>
                    <stop offset="100%" stop-color="${BG}" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="${BG}"/>
            <rect width="100%" height="100%" fill="url(#g)"/>
        </svg>`,
    );
}

async function composeBuffer(logoPath, size, paddingRatio) {
    const padding = Math.round(size * paddingRatio);
    const logoSize = size - padding * 2;

    const logo = await sharp(readFileSync(logoPath))
        .resize(logoSize, logoSize, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

    return sharp(gradientBackgroundSvg(size))
        .composite([{ input: logo, top: padding, left: padding }])
        .png()
        .toBuffer();
}

async function writeIcon(logoPath, size, outPath, paddingRatio) {
    const buf = await composeBuffer(logoPath, size, paddingRatio);
    writeFileSync(outPath, buf);
    console.log(`  wrote ${outPath.split(/[\\/]/).slice(-2).join("/")} (${size}×${size})`);
}

const sourceLogo = resolve(root, "scripts/inzidium-logo-transparent.webp");

console.log("→ TAB variant (app/ + favicon.ico)");
await writeIcon(sourceLogo, 192, resolve(root, "app/icon.png"), TAB_PADDING);
await writeIcon(sourceLogo, 180, resolve(root, "app/apple-icon.png"), TAB_PADDING);

const icoBuffers = await Promise.all(
    [16, 32, 48, 64].map((s) => composeBuffer(sourceLogo, s, TAB_PADDING)),
);
const icoData = await pngToIco(icoBuffers);
writeFileSync(resolve(root, "app/favicon.ico"), icoData);
console.log("  wrote app/favicon.ico (16/32/48/64)");

console.log("\n→ GOOGLE variant (public/favicon-google*)");
await writeIcon(sourceLogo, 192, resolve(root, "public/favicon-google.png"), GOOGLE_PADDING);
await writeIcon(sourceLogo, 512, resolve(root, "public/favicon-google-512.png"), GOOGLE_PADDING);

console.log("\n✅ Listo. Verificar que layout.tsx declara ambos en metadata.icons.");
