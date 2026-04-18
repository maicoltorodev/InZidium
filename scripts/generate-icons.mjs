// Genera favicons con el patrón correcto (ver memoria: favicon_pattern.md):
//
//   TAB variants — se renderizan sobre el fondo de la pestaña del browser,
//   deben ser TRANSPARENTES para integrarse (como hace Claude, GitHub, etc.):
//     - app/favicon.ico (16/32/48/64) → transparente, 0 padding
//     - app/icon.png (192)            → transparente, 0 padding
//
//   APPLE-ICON — iOS exige opaco + safe zone para rounded corners:
//     - app/apple-icon.png (180) → fondo branded, 10% padding
//
//   GOOGLE variant — search results, círculo a 48×48 con fondo identificable:
//     - public/favicon-google.png (192) + 512 → fondo branded, 6% padding

import sharp from "sharp";
import pngToIco from "png-to-ico";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const BG = "#060214";

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

/**
 * @param {boolean} transparent — si true, fondo transparente; si false, usa gradiente branded
 */
async function composeBuffer(logoPath, size, paddingRatio, transparent) {
    const padding = Math.round(size * paddingRatio);
    const logoSize = size - padding * 2;

    const logo = await sharp(readFileSync(logoPath))
        .resize(logoSize, logoSize, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

    const base = transparent
        ? sharp({
            create: {
                width: size,
                height: size,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
        })
        : sharp(gradientBackgroundSvg(size));

    return base.composite([{ input: logo, top: padding, left: padding }]).png().toBuffer();
}

async function writeIcon(logoPath, size, outPath, paddingRatio, transparent) {
    const buf = await composeBuffer(logoPath, size, paddingRatio, transparent);
    writeFileSync(outPath, buf);
    const bgLabel = transparent ? "transp" : "branded";
    console.log(`  ${outPath.split(/[\\/]/).slice(-2).join("/")} (${size}×${size}, pad ${Math.round(paddingRatio * 100)}%, ${bgLabel})`);
}

const sourceLogo = resolve(root, "scripts/inzidium-logo-transparent.webp");

console.log("→ TAB variant (transparente, integra con el browser)");
await writeIcon(sourceLogo, 192, resolve(root, "app/icon.png"), 0, true);

const icoBuffers = await Promise.all(
    [16, 32, 48, 64].map((s) => composeBuffer(sourceLogo, s, 0, true)),
);
const icoData = await pngToIco(icoBuffers);
writeFileSync(resolve(root, "app/favicon.ico"), icoData);
console.log(`  app/favicon.ico (16/32/48/64, pad 0%, transp)`);

console.log("\n→ APPLE-ICON (iOS exige fondo opaco)");
await writeIcon(sourceLogo, 180, resolve(root, "app/apple-icon.png"), 0.10, false);

console.log("\n→ GOOGLE variant (search results, fondo branded)");
await writeIcon(sourceLogo, 192, resolve(root, "public/favicon-google.png"), 0.06, false);
await writeIcon(sourceLogo, 512, resolve(root, "public/favicon-google-512.png"), 0.06, false);

console.log("\n✅ Listo.");
